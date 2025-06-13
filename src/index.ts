#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchLibraries, fetchLibraryDocumentation } from "./lib/api.js";
import { formatSearchResults } from "./lib/utils.js";
import { SearchResponse, SearchResult } from "./lib/types.js";
import { createServer } from "http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Command } from "commander";

const DEFAULT_MINIMUM_TOKENS = 10000;

// Parse CLI arguments using commander with better MCP compatibility
let cliOptions: {
  transport: string;
  port: string;
  acceptList?: string[];
  rejectList?: string[];
} = {
  transport: "stdio",
  port: "3000",
};

// Pre-process arguments to handle single-string format like "--accept-list vercel/next.js"
const preprocessedArgs: string[] = [];
const originalArgs = process.argv.slice(2);

for (let i = 0; i < originalArgs.length; i++) {
  const arg = originalArgs[i];

  // Handle single-string arguments like "--accept-list vercel/next.js"
  if (arg.startsWith("--accept-list ") && arg.length > "--accept-list ".length) {
    const repos = arg.substring("--accept-list ".length).split(/\s+/);
    preprocessedArgs.push("--accept-list");
    preprocessedArgs.push(...repos);
  } else if (arg.startsWith("--reject-list ") && arg.length > "--reject-list ".length) {
    const repos = arg.substring("--reject-list ".length).split(/\s+/);
    preprocessedArgs.push("--reject-list");
    preprocessedArgs.push(...repos);
  } else {
    preprocessedArgs.push(arg);
  }
}

// Update process.argv with preprocessed arguments
const modifiedArgv = [process.argv[0], process.argv[1], ...preprocessedArgs];

const program = new Command()
  .name("context7-mcp")
  .description(
    "Context7 MCP Server - Retrieves up-to-date documentation and code examples for any library"
  )
  .version("1.0.13")
  .option("--transport <stdio|http|sse>", "transport type", "stdio")
  .option("--port <number>", "port for HTTP/SSE transport", "3000")
  .option(
    "--accept-list <repos...>",
    "only include repositories matching these patterns (supports wildcards: * and ?)\n" +
      "                                 Examples: vercel/next.js, facebook/*"
  )
  .option(
    "--reject-list <repos...>",
    "exclude repositories matching these patterns (supports wildcards: * and ?)\n" +
      "                                 Examples: */deprecated/*, */legacy-*"
  )
  .allowUnknownOption() // let MCP Inspector / other wrappers pass through extra flags
  .configureOutput({
    writeErr: () => {}, // Suppress error output to avoid conflicts with MCP
  });

program.parse(modifiedArgv);
cliOptions = program.opts<{
  transport: string;
  port: string;
  acceptList?: string[];
  rejectList?: string[];
}>();

// Validate transport option
const allowedTransports = ["stdio", "http", "sse"];
if (!allowedTransports.includes(cliOptions.transport)) {
  console.error(
    `Invalid --transport value: '${cliOptions.transport}'. Must be one of: stdio, http, sse.`
  );
  process.exit(1);
}

// Transport configuration
const TRANSPORT_TYPE = (cliOptions.transport || "stdio") as "stdio" | "http" | "sse";

// HTTP/SSE port configuration
const CLI_PORT = (() => {
  const parsed = parseInt(cliOptions.port, 10);
  return isNaN(parsed) ? undefined : parsed;
})();

// Store SSE transports by session ID
const sseTransports: Record<string, SSEServerTransport> = {};

// Function to filter search results based on accept/reject lists
function filterSearchResults(
  results: SearchResult[],
  acceptList?: string[],
  rejectList?: string[]
): SearchResult[] {
  if (!acceptList && !rejectList) {
    return results;
  }

  return results.filter((result) => {
    const repoId = result.id || "";

    // If accept list is provided, only include repos that match at least one pattern
    if (acceptList && acceptList.length > 0) {
      const isAccepted = acceptList.some((pattern) => {
        // Convert pattern to regex, escaping special chars except * and ?
        const regexPattern = pattern
          .replace(/[.+^${}()|[\]\\]/g, "\\$&") // escape special chars
          .replace(/\*/g, ".*") // convert * to .*
          .replace(/\?/g, "."); // convert ? to .
        const regex = new RegExp(regexPattern, "i");
        return regex.test(repoId);
      });
      if (!isAccepted) {
        return false;
      }
    }

    // If reject list is provided, exclude repos that match any pattern
    if (rejectList && rejectList.length > 0) {
      const isRejected = rejectList.some((pattern) => {
        // Convert pattern to regex, escaping special chars except * and ?
        const regexPattern = pattern
          .replace(/[.+^${}()|[\]\\]/g, "\\$&") // escape special chars
          .replace(/\*/g, ".*") // convert * to .*
          .replace(/\?/g, "."); // convert ? to .
        const regex = new RegExp(regexPattern, "i");
        return regex.test(repoId);
      });
      if (isRejected) {
        return false;
      }
    }

    return true;
  });
}

function createServerInstance() {
  const server = new McpServer(
    {
      name: "Context7",
      version: "1.0.13",
    },
    {
      instructions:
        "Use this server to retrieve up-to-date documentation and code examples for any library.",
    }
  );

  // Register Context7 tools
  server.tool(
    "resolve-library-id",
    `Resolves a package/product name to a Context7-compatible library ID and returns a list of matching libraries.

You MUST call this function before 'get-library-docs' to obtain a valid Context7-compatible library ID UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.

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
      const searchResponse: SearchResponse = await searchLibraries(libraryName);

      if (!searchResponse.results || searchResponse.results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: searchResponse.error
                ? searchResponse.error
                : "Failed to retrieve library documentation data from Context7",
            },
          ],
        };
      }

      // Filter results based on accept/reject lists
      const filteredResults = filterSearchResults(
        searchResponse.results,
        cliOptions.acceptList,
        cliOptions.rejectList
      );

      if (filteredResults.length === 0) {
        const filterInfo = [];
        if (cliOptions.acceptList) {
          filterInfo.push(`Accept list: ${cliOptions.acceptList.join(", ")}`);
        }
        if (cliOptions.rejectList) {
          filterInfo.push(`Reject list: ${cliOptions.rejectList.join(", ")}`);
        }
        const filterMessage =
          filterInfo.length > 0 ? `\n\nApplied filters:\n${filterInfo.join("\n")}` : "";

        return {
          content: [
            {
              type: "text",
              text: `No libraries found matching the search criteria after applying repository filters.${filterMessage}`,
            },
          ],
        };
      }

      const filteredSearchResponse = { ...searchResponse, results: filteredResults };
      const resultsText = formatSearchResults(filteredSearchResponse);

      // Add filter information to the response
      let filterInfo = "";
      if (cliOptions.acceptList || cliOptions.rejectList) {
        const filterDetails = [];
        if (cliOptions.acceptList) {
          filterDetails.push(`Accept list: ${cliOptions.acceptList.join(", ")}`);
        }
        if (cliOptions.rejectList) {
          filterDetails.push(`Reject list: ${cliOptions.rejectList.join(", ")}`);
        }
        filterInfo = `\n\nApplied repository filters:\n${filterDetails.join("\n")}\nShowing ${filteredResults.length} of ${searchResponse.results.length} total results.\n\n----------\n\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: `Available Libraries (top matches):

Each result includes:
- Library ID: Context7-compatible identifier (format: /org/project)
- Name: Library or package name
- Description: Short summary
- Code Snippets: Number of available code examples
- Trust Score: Authority indicator
- Versions: List of versions if available. Use one of those versions if and only if the user explicitly provides a version in their query.

For best results, select libraries based on name match, trust score, snippet coverage, and relevance to your use case.${filterInfo}

----------

${resultsText}`,
          },
        ],
      };
    }
  );

  server.tool(
    "get-library-docs",
    "Fetches up-to-date documentation for a library. You must call 'resolve-library-id' first to obtain the exact Context7-compatible library ID required to use this tool, UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.",
    {
      context7CompatibleLibraryID: z
        .string()
        .describe(
          "Exact Context7-compatible library ID (e.g., '/mongodb/docs', '/vercel/next.js', '/supabase/supabase', '/vercel/next.js/v14.3.0-canary.87') retrieved from 'resolve-library-id' or directly from user query in the format '/org/project' or '/org/project/version'."
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
      const fetchDocsResponse = await fetchLibraryDocumentation(context7CompatibleLibraryID, {
        tokens,
        topic,
      });

      if (!fetchDocsResponse) {
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
            text: fetchDocsResponse,
          },
        ],
      };
    }
  );

  return server;
}

async function main() {
  const transportType = TRANSPORT_TYPE;

  if (transportType === "http" || transportType === "sse") {
    // Get initial port from environment or use default
    const initialPort = CLI_PORT ?? 3000;
    // Keep track of which port we end up using
    let actualPort = initialPort;
    const httpServer = createServer(async (req, res) => {
      const url = new URL(req.url || "", `http://${req.headers.host}`).pathname;

      // Set CORS headers for all responses
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, MCP-Session-Id, mcp-session-id");

      // Handle preflight OPTIONS requests
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      try {
        // Create new server instance for each request
        const requestServer = createServerInstance();

        if (url === "/mcp") {
          const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
          });
          await requestServer.connect(transport);
          await transport.handleRequest(req, res);
        } else if (url === "/sse" && req.method === "GET") {
          // Create new SSE transport for GET request
          const sseTransport = new SSEServerTransport("/messages", res);
          // Store the transport by session ID
          sseTransports[sseTransport.sessionId] = sseTransport;
          // Clean up transport when connection closes
          res.on("close", () => {
            delete sseTransports[sseTransport.sessionId];
          });
          await requestServer.connect(sseTransport);
        } else if (url === "/messages" && req.method === "POST") {
          // Get session ID from query parameters
          const sessionId =
            new URL(req.url || "", `http://${req.headers.host}`).searchParams.get("sessionId") ??
            "";

          if (!sessionId) {
            res.writeHead(400);
            res.end("Missing sessionId parameter");
            return;
          }

          // Get existing transport for this session
          const sseTransport = sseTransports[sessionId];
          if (!sseTransport) {
            res.writeHead(400);
            res.end(`No transport found for sessionId: ${sessionId}`);
            return;
          }

          // Handle the POST message with the existing transport
          await sseTransport.handlePostMessage(req, res);
        } else if (url === "/ping") {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("pong");
        } else {
          res.writeHead(404);
          res.end("Not found");
        }
      } catch (error) {
        console.error("Error handling request:", error);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end("Internal Server Error");
        }
      }
    });

    // Function to attempt server listen with port fallback
    const startServer = (port: number, maxAttempts = 10) => {
      httpServer.once("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE" && port < initialPort + maxAttempts) {
          console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
          startServer(port + 1, maxAttempts);
        } else {
          console.error(`Failed to start server: ${err.message}`);
          process.exit(1);
        }
      });

      httpServer.listen(port, () => {
        actualPort = port;
        console.error(
          `Context7 Documentation MCP Server running on ${transportType.toUpperCase()} at http://localhost:${actualPort}/mcp and legacy SSE at /sse`
        );
      });
    };

    // Start the server with initial port
    startServer(initialPort);
  } else {
    // Stdio transport - this is already stateless by nature
    const server = createServerInstance();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Context7 Documentation MCP Server running on stdio");
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
