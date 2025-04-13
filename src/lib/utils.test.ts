import { describe, it, expect } from "vitest";
import { rerankProjects } from "./utils.js";
import type { Project } from "./types.js";

describe("rerankProjects", () => {
  const mockProjects: Project[] = [
    {
      settings: {
        title: "Next.js Documentation",
        project: "vercel/nextjs",
        folders: [],
        docsRepoUrl: "https://github.com/vercel/nextjs",
      },
      version: {
        lastUpdate: "2024-01-01",
        state: "finalized",
        parseDuration: 100,
        totalTokens: 1000,
        totalSnippets: 50,
        averageTokens: 20,
      },
    },
    {
      settings: {
        title: "React Query",
        project: "tanstack/query",
        folders: [],
        docsRepoUrl: "https://github.com/tanstack/query",
      },
      version: {
        lastUpdate: "2024-01-01",
        state: "finalized",
        parseDuration: 100,
        totalTokens: 1000,
        totalSnippets: 50,
        averageTokens: 20,
      },
    },
    {
      settings: {
        title: "MongoDB",
        project: "mongodb/docs",
        folders: [],
        docsRepoUrl: "https://github.com/mongodb/docs",
      },
      version: {
        lastUpdate: "2024-01-01",
        state: "finalized",
        parseDuration: 100,
        totalTokens: 1000,
        totalSnippets: 50,
        averageTokens: 20,
      },
    },
    {
      settings: {
        title: "GraphQL Query",
        project: "graphql/spec",
        folders: [],
        docsRepoUrl: "https://github.com/graphql/spec",
      },
      version: {
        lastUpdate: "2024-01-01",
        state: "finalized",
        parseDuration: 100,
        totalTokens: 1000,
        totalSnippets: 50,
        averageTokens: 20,
      },
    },
  ];

  it("should return original array if no search term is provided", () => {
    const result = rerankProjects(mockProjects, "");
    expect(result).toEqual(mockProjects);
  });

  it("should rank exact matches highest", () => {
    const result = rerankProjects(mockProjects, "nextjs");
    expect(result[0].settings.project).toBe("vercel/nextjs");
  });

  it("should handle case-insensitive matching", () => {
    const result = rerankProjects(mockProjects, "NEXTJS");
    expect(result[0].settings.project).toBe("vercel/nextjs");
  });

  it("should handle partial matches", () => {
    const result = rerankProjects(mockProjects, "mongo");
    expect(result[0].settings.project).toBe("mongodb/docs");
  });

  it("should handle matches in title", () => {
    const result = rerankProjects(mockProjects, "query");
    expect(result[0].settings.project).toBe("tanstack/query");
    expect(result[1].settings.project).toBe("graphql/spec");
    const topTwoTitlesHaveQuery = result
      .slice(0, 2)
      .every((p) => p.settings.title.toLowerCase().includes("query"));
    expect(topTwoTitlesHaveQuery).toBe(true);
  });

  it("should handle special characters in search term", () => {
    const result = rerankProjects(mockProjects, "next.js");
    expect(result[0].settings.project).toBe("vercel/nextjs");
  });

  it("should handle exact docsRepoUrl matches", () => {
    const result = rerankProjects(mockProjects, "https://github.com/tanstack/query");
    expect(result[0].settings.project).toBe("tanstack/query");
    expect(result[0].settings.docsRepoUrl).toBe("https://github.com/tanstack/query");
  });

  it("should handle docsRepoUrl matches without https:// prefix", () => {
    const result = rerankProjects(mockProjects, "github.com/tanstack/query");
    expect(result[0].settings.project).toBe("tanstack/query");
    expect(result[0].settings.docsRepoUrl).toBe("https://github.com/tanstack/query");
  });
});
