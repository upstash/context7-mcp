import { SearchResponse, SearchResult } from "./types.js";

const CONTEXT7_API_BASE_URL = "https://context7.com/api";
const DEFAULT_TYPE = "txt";

/**
 * Parse repository filter lists from environment variables
 * @returns Object containing acceptList and rejectList arrays
 */
function parseRepositoryFilters(): { acceptList: string[]; rejectList: string[] } {
  const acceptList = process.env.REPO_ACCEPT_LIST
    ? process.env.REPO_ACCEPT_LIST.split(",")
        .map((repo) => repo.trim())
        .filter(Boolean)
    : [];

  const rejectList = process.env.REPO_REJECT_LIST
    ? process.env.REPO_REJECT_LIST.split(",")
        .map((repo) => repo.trim())
        .filter(Boolean)
    : [];

  return { acceptList, rejectList };
}

/**
 * Check if a repository matches any pattern in a list
 * @param repoId - The repository ID to test
 * @param patterns - Array of glob-like patterns to match against
 * @returns True if the repository ID matches any pattern
 */
function matchesPattern(repoId: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    let normalizedPattern = pattern;
    if (pattern.includes("github.com/")) {
      normalizedPattern = pattern.replace("github.com/", "");
    }

    const regexPattern = normalizedPattern
      .replace(/\./g, "\\.")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".");

    const regex = new RegExp(`^${regexPattern}$`, "i");
    return regex.test(repoId);
  });
}

/**
 * Filter search results based on repository accept/reject lists
 * @param results - Array of search results to filter
 * @returns Filtered array of search results
 */
function filterRepositories(results: SearchResult[]): SearchResult[] {
  const { acceptList, rejectList } = parseRepositoryFilters();

  if (acceptList.length === 0 && rejectList.length === 0) {
    return results;
  }

  return results.filter((result) => {
    const repoId = result.id.startsWith("/") ? result.id.slice(1) : result.id;

    if (rejectList.length > 0 && matchesPattern(repoId, rejectList)) {
      return false;
    }

    if (acceptList.length > 0) {
      return matchesPattern(repoId, acceptList);
    }

    return true;
  });
}

/**
 * Searches for libraries matching the given query
 * @param query The search query
 * @returns Search results or null if the request fails
 */
export async function searchLibraries(query: string): Promise<SearchResponse> {
  try {
    const url = new URL(`${CONTEXT7_API_BASE_URL}/v1/search`);
    url.searchParams.set("query", query);
    const response = await fetch(url);
    if (!response.ok) {
      const errorCode = response.status;
      if (errorCode === 429) {
        console.error(`Rate limited due to too many requests. Please try again later.`);
        return {
          results: [],
          error: `Rate limited due to too many requests. Please try again later.`,
        } as SearchResponse;
      }
      console.error(`Failed to search libraries. Please try again later. Error code: ${errorCode}`);
      return {
        results: [],
        error: `Failed to search libraries. Please try again later. Error code: ${errorCode}`,
      } as SearchResponse;
    }
    const searchResponse = await response.json();

    if (searchResponse.results) {
      searchResponse.results = filterRepositories(searchResponse.results);
    }

    return searchResponse;
  } catch (error) {
    console.error("Error searching libraries:", error);
    return { results: [], error: `Error searching libraries: ${error}` } as SearchResponse;
  }
}

/**
 * Fetches documentation context for a specific library
 * @param libraryId The library ID to fetch documentation for
 * @param options Options for the request
 * @returns The documentation text or null if the request fails
 */
export async function fetchLibraryDocumentation(
  libraryId: string,
  options: {
    tokens?: number;
    topic?: string;
  } = {}
): Promise<string | null> {
  try {
    if (libraryId.startsWith("/")) {
      libraryId = libraryId.slice(1);
    }
    const url = new URL(`${CONTEXT7_API_BASE_URL}/v1/${libraryId}`);
    if (options.tokens) url.searchParams.set("tokens", options.tokens.toString());
    if (options.topic) url.searchParams.set("topic", options.topic);
    url.searchParams.set("type", DEFAULT_TYPE);
    const response = await fetch(url, {
      headers: {
        "X-Context7-Source": "mcp-server",
      },
    });
    if (!response.ok) {
      const errorCode = response.status;
      if (errorCode === 429) {
        const errorMessage = `Rate limited due to too many requests. Please try again later.`;
        console.error(errorMessage);
        return errorMessage;
      }
      const errorMessage = `Failed to fetch documentation. Please try again later. Error code: ${errorCode}`;
      console.error(errorMessage);
      return errorMessage;
    }
    const text = await response.text();
    if (!text || text === "No content available" || text === "No context data available") {
      return null;
    }
    return text;
  } catch (error) {
    const errorMessage = `Error fetching library documentation. Please try again later. ${error}`;
    console.error(errorMessage);
    return errorMessage;
  }
}
