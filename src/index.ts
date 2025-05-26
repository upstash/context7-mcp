#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchLibraries, fetchLibraryDocumentation } from "./lib/api.js";
import { formatSearchResults } from "./lib/utils.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { parse } from "url";

// Load environment variables from .env file if present
dotenv.config();

// Get DEFAULT_MINIMUM_TOKENS from environment variable or use default
let DEFAULT_MINIMUM_TOKENS = 10000;
if (process.env.DEFAULT_MINIMUM_TOKENS) {
  const parsedValue = parseInt(process.env.DEFAULT_MINIMUM_TOKENS, 10);
  if (!isNaN(parsedValue) && parsedValue > 0) {
    DEFAULT_MINIMUM_TOKENS = parsedValue;
  } else {
    console.warn(
      `Warning: Invalid DEFAULT_MINIMUM_TOKENS value provided in environment variable. Using default value of 10000`
    );
  }
}

// Create server instance
const server = new McpServer({
  name: "Context7",
  description: "Retrieves up-to-date documentation and code examples for any library.",
  version: "1.0.6",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register Context7 tools
server.tool(
  "resolve-library-id",
  `Resolves a package/product name to a Context7-compatible library ID and returns a list of matching libraries.

You MUST call this function before 'get-library-docs' to obtain a valid Context7-compatible library ID.

Selection Process:
1. Analyze the query to understand what library/package the user is looking for
2. Return the most relevant match based on:
- Name similarity to the query (exact matches prioritized)
- Description relevance to the query's intent
- Documentation coverage (prioritize libraries with higher Code Snippet counts)
- Trust score (consider libraries with scores of 7-10 more authoritative)

Response Format:
- Return the selected library ID in a clearly marked section
- Provide a brief explanation for why this library was chosen
- If multiple good matches exist, acknowledge this but proceed with the most relevant one
- If no good matches exist, clearly state this and suggest query refinements

For ambiguous queries, request clarification before proceeding with a best-guess match.`,
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
          text: `Available Libraries (top matches):

Each result includes:
- Library ID: Context7-compatible identifier (format: /org/repo)
- Name: Library or package name
- Description: Short summary
- Code Snippets: Number of available code examples
- Trust Score: Authority indicator

For best results, select libraries based on name match, trust score, snippet coverage, and relevance to your use case.

----------

${resultsText}`,
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
  const transportType = process.env.MCP_TRANSPORT || "stdio";

  if (transportType === "http" || transportType === "sse") {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);

    // In-memory store for legacy SSE transports
    const legacySseTransports: { [sessionId: string]: SSEServerTransport } = {};

    const httpServer = createServer(async (req, res) => {
      const url = parse(req.url || "").pathname;
      if (url === "/mcp") {
        await transport.handleRequest(req, res);
      } else if (url === "/sse" && req.method === "GET") {
        // Legacy SSE endpoint for older clients
        const sseTransport = new SSEServerTransport("/messages", res);
        legacySseTransports[sseTransport.sessionId] = sseTransport;
        res.on("close", () => {
          delete legacySseTransports[sseTransport.sessionId];
        });
        await server.connect(sseTransport);
      } else if (url === "/messages" && req.method === "POST") {
        // Legacy SSE POST endpoint for older clients
        let sessionId = req.headers["x-session-id"] || (req.url?.split("?sessionId=")[1]);
        if (Array.isArray(sessionId)) sessionId = sessionId[0];
        if (sessionId && legacySseTransports[sessionId]) {
          await legacySseTransports[sessionId].handlePostMessage(req, res);
        } else {
          res.writeHead(404);
          res.end("Not found");
        }
      } else if (url === "/ping") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('pong');
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    httpServer.listen(port, () => {
      console.error(`Context7 Documentation MCP Server running on ${transportType.toUpperCase()} at http://localhost:${port}/mcp and legacy SSE at /sse`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Context7 Documentation MCP Server running on stdio");
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
