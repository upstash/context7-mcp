import { SearchResponse } from "./types.js";
import { generateHeaders } from "./encryption.js";
import { ProxyAgent, setGlobalDispatcher } from "undici";

const CONTEXT7_API_BASE_URL = "https://context7.com/api";
const DEFAULT_TYPE = "txt";
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Pick up proxy configuration in a variety of common env var names.
const PROXY_URL: string | null =
  process.env.HTTPS_PROXY ??
  process.env.https_proxy ??
  process.env.HTTP_PROXY ??
  process.env.http_proxy ??
  null;

if (PROXY_URL && !PROXY_URL.startsWith("$") && /^(http|https):\/\//i.test(PROXY_URL)) {
  try {
    // Configure a global proxy agent once at startup. Subsequent fetch calls will
    // automatically use this dispatcher.
    // Using `any` cast because ProxyAgent implements the Dispatcher interface but
    // TS may not infer it correctly in some versions.
    setGlobalDispatcher(new ProxyAgent(PROXY_URL));
  } catch (error) {
    // Don't crash the app if proxy initialisation fails – just log a warning.
    console.error(
      `[Context7] Failed to configure proxy agent for provided proxy URL: ${PROXY_URL}:`,
      error
    );
  }
}

/**
 * Creates a fetch request with timeout
 */
async function fetchWithTimeout(url: string | URL, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`);
    }
    throw error;
  }
}

/**
 * Searches for libraries matching the given query
 * @param query The search query
 * @param clientIp Optional client IP address to include in headers
 * @param apiKey Optional API key for authentication
 * @returns Search results or null if the request fails
 */
export async function searchLibraries(
  query: string,
  clientIp?: string,
  apiKey?: string
): Promise<SearchResponse> {
  try {
    const url = new URL(`${CONTEXT7_API_BASE_URL}/v1/search`);
    url.searchParams.set("query", query);

    const headers = generateHeaders(clientIp, apiKey);

    const response = await fetchWithTimeout(url, { headers });
    if (!response.ok) {
      const errorCode = response.status;
      let errorMessage: string;
      
      switch (errorCode) {
        case 429:
          errorMessage = "Rate limited due to too many requests. Please try again later.";
          break;
        case 401:
          errorMessage = "Unauthorized. Please check your API key.";
          break;
        case 403:
          errorMessage = "Access forbidden. Please check your API key permissions.";
          break;
        case 500:
          errorMessage = "Context7 server error. Please try again later.";
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = "Context7 service temporarily unavailable. Please try again later.";
          break;
        default:
          errorMessage = `Failed to search libraries. Error code: ${errorCode}`;
      }
      
      console.error(errorMessage);
      return {
        results: [],
        error: errorMessage,
      } as SearchResponse;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? `Error searching libraries: ${error.message}` 
      : `Error searching libraries: ${String(error)}`;
    console.error(errorMessage);
    return { results: [], error: errorMessage } as SearchResponse;
  }
}

/**
 * Fetches documentation context for a specific library
 * @param libraryId The library ID to fetch documentation for
 * @param options Options for the request
 * @param clientIp Optional client IP address to include in headers
 * @param apiKey Optional API key for authentication
 * @returns The documentation text or null if the request fails
 */
export async function fetchLibraryDocumentation(
  libraryId: string,
  options: {
    tokens?: number;
    topic?: string;
  } = {},
  clientIp?: string,
  apiKey?: string
): Promise<string | null> {
  try {
    if (libraryId.startsWith("/")) {
      libraryId = libraryId.slice(1);
    }
    const url = new URL(`${CONTEXT7_API_BASE_URL}/v1/${libraryId}`);
    if (options.tokens) url.searchParams.set("tokens", options.tokens.toString());
    if (options.topic) url.searchParams.set("topic", options.topic);
    url.searchParams.set("type", DEFAULT_TYPE);

    const headers = generateHeaders(clientIp, apiKey, { "X-Context7-Source": "mcp-server" });

    const response = await fetchWithTimeout(url, { headers });
    if (!response.ok) {
      const errorCode = response.status;
      let errorMessage: string;
      
      switch (errorCode) {
        case 429:
          errorMessage = "Rate limited due to too many requests. Please try again later.";
          break;
        case 404:
          errorMessage = "The library you are trying to access does not exist. Please try with a different library ID.";
          break;
        case 401:
          errorMessage = "Unauthorized. Please check your API key.";
          break;
        case 403:
          errorMessage = "Access forbidden. Please check your API key permissions.";
          break;
        case 413:
          errorMessage = "Library is too large to process. Try requesting fewer tokens or a specific topic.";
          break;
        case 500:
          errorMessage = "Context7 server error. Please try again later.";
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = "Context7 service temporarily unavailable. Please try again later.";
          break;
        default:
          errorMessage = `Failed to fetch documentation. Error code: ${errorCode}`;
      }
      
      console.error(errorMessage);
      return errorMessage;
    }
    
    const text = await response.text();
    if (!text || text === "No content available" || text === "No context data available") {
      return null;
    }
    return text;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? `Error fetching library documentation: ${error.message}` 
      : `Error fetching library documentation: ${String(error)}`;
    console.error(errorMessage);
    return errorMessage;
  }
}