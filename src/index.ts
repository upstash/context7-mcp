#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchLibraries, fetchLibraryDocumentation } from "./lib/api.js";
import { formatSearchResults } from "./lib/utils.js";
import { VERSION } from "./lib/version.js";

const DEFAULT_MINIMUM_TOKENS = 5000;

// Create server instance
const server = new McpServer({
  name: "Context7",
  description: "Retrieves up-to-date documentation and code examples for any library.",
  version: VERSION,
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register Context7 tools
server.tool(
  "resolve-library-id",
  "Required first step: Resolves a general package name into a Context7-compatible library ID. Must be called before using 'get-library-docs' to retrieve a valid Context7-compatible library ID.",
  {
    libraryName: z
      .string()
      .describe("Library name to search for and retrieve a Context7-compatible library ID."),
  },
  async ({ libraryName }) => {
    const searchResponse = await searchLibraries(libraryName);

    if (!searchResponse || !searchResponse.results) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve library documentation data from Context7",
          },
        ],
      };
    }

    if (searchResponse.results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No documentation libraries available",
          },
        ],
      };
    }

    const resultsText = formatSearchResults(searchResponse);

    return {
      content: [
        {
          type: "text",
          text: "Available libraries and their Context7-compatible library IDs:\n\n" + resultsText,
        },
      ],
    };
  }
);

server.tool(
  "get-library-docs",
  "Fetches up-to-date documentation for a library. You must call 'resolve-library-id' first to obtain the exact Context7-compatible library ID required to use this tool.",
  {
    context7CompatibleLibraryID: z
      .string()
      .describe(
        "Exact Context7-compatible library ID (e.g., 'mongodb/docs', 'vercel/nextjs') retrieved from 'resolve-library-id'."
      ),
    topic: z
      .string()
      .optional()
      .describe("Topic to focus documentation on (e.g., 'hooks', 'routing')."),
    tokens: z
      .preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number())
      .transform((val) => (val < DEFAULT_MINIMUM_TOKENS ? DEFAULT_MINIMUM_TOKENS : val))
      .optional()
      .describe(
        `Maximum number of tokens of documentation to retrieve (default: ${DEFAULT_MINIMUM_TOKENS}). Higher values provide more context but consume more tokens.`
      ),
  },
  async ({ context7CompatibleLibraryID, tokens = DEFAULT_MINIMUM_TOKENS, topic = "" }) => {
    // Extract folders parameter if present in the ID
    let folders = "";
    let libraryId = context7CompatibleLibraryID;

    if (context7CompatibleLibraryID.includes("?folders=")) {
      const [id, foldersParam] = context7CompatibleLibraryID.split("?folders=");
      libraryId = id;
      folders = foldersParam;
    }

    const documentationText = await fetchLibraryDocumentation(libraryId, {
      tokens,
      topic,
      folders,
    });

    if (!documentationText) {
      return {
        content: [
          {
            type: "text",
            text: "Documentation not found or not finalized for this library. This might have happened because you used an invalid Context7-compatible library ID. To get a valid Context7-compatible library ID, use the 'resolve-library-id' with the package name you wish to retrieve documentation for.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: documentationText,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Context7 Documentation MCP Server v${VERSION} running on stdio`);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
