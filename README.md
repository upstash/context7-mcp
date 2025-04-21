# Context7 MCP - Up-to-date Docs For Any Prompt
[![Website](https://img.shields.io/badge/Website-context7.com-blue)](https://context7.com) [![smithery badge](https://smithery.ai/badge/@upstash/context7-mcp)](https://smithery.ai/server/@upstash/context7-mcp)

## ❌ Without Context7

LLMs rely on outdated or generic information about the libraries you use. You get:

- ❌ Code examples are outdated and based on year-old training data
- ❌ Hallucinated APIs don't even exist
- ❌ Generic answers for old package versions

## ✅ With Context7

Context7 MCP pulls up-to-date, version-specific documentation and code examples straight from the source — and places them directly into your prompt.

Add `use context7` to your question in Cursor:

```txt
How do I use the new Next.js `after` function? use context7
```

```txt
How do I invalidate a query in React Query? use context7
```

```txt
How do I protect a route with NextAuth? use context7
```

Context7 fetches up-to-date documentation and working code examples right into your LLM's context.

- 1️⃣ Ask your question naturally
- 2️⃣ Tell the LLM to `use context7`
- 3️⃣ Get working code answers

No tab-switching, no hallucinated APIs that don't exist, no outdated code generations.

## 🛠️ Getting Started

### Requirements

- Node.js >= v18.0.0
- Cursor, Windsurf, Claude Desktop or another MCP Client

### Installing via Smithery

To install Context7 MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@upstash/context7-mcp):

```bash
npx -y @smithery/cli install @upstash/context7-mcp --client claude
```

### Install in Cursor

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Pasting the following configuration into your Cursor `~/.cursor/mcp.json` file is the recommended approach. See [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

```json
{
  "mcpServers": {
    "context_7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

<details>
<summary>Alternative: Use Bun</summary>

```json
{
  "mcpServers": {
    "context_7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

</details>

<details>
<summary>Alternative: Use Deno</summary>

```json
{
  "mcpServers": {
    "context_7": {
      "command": "deno",
      "args": ["run", "--allow-net", "npm:@upstash/context7-mcp"]
    }
  }
}
```

</details>

### Install in Windsurf

Add this to your Windsurf MCP config file. See [Windsurf MCP docs](https://docs.windsurf.com/windsurf/mcp) for more info.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Install in VSCode

Add this to your VSCode MCP config file. See [VSCode MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

```json
{
  "servers": {
    "Context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Install in Claude Code

Run this command. See [Claude Code MCP docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/tutorials#set-up-model-context-protocol-mcp) for more info.

```sh
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### Install in Claude Desktop

Add this to your Claude Desktop `claude_desktop_config.json` file. See [Claude Desktop MCP docs](https://modelcontextprotocol.io/quickstart/user) for more info.

```json
{
  "mcpServers": {
    "Context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Available Tools

- `resolve-library-id`: Resolves a general library name into a Context7-compatible library ID.
  - `libraryName` (optional): Search and rerank results
- `get-library-docs`: Fetches documentation for a library using a Context7-compatible library ID.
  - `context7CompatibleLibraryID` (required)
  - `topic` (optional): Focus the docs on a specific topic (e.g., "routing", "hooks")
  - `tokens` (optional, default 5000): Max number of tokens to return

## Development

Clone the project and install dependencies:

```bash
bun i
```

Build:

```bash
bun run build
```

### Local Configuration Example

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["tsx", "/path/to/folder/context7-mcp/src/index.ts"]
    }
  }
}
```

### Testing with MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector npx @upstash/context7-mcp@latest
```

## Troubleshooting

### ERR_MODULE_NOT_FOUND

If you see this error, try using `bunx` instead of `npx`.

```json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

This often resolves module resolution issues, especially in environments where `npx` does not properly install or resolve packages.

## Context7 in media

+ [Better Stack: "Free Tool Makes Cursor 10x Smarter"](https://youtu.be/52FC3qObp9E)

## License

MIT
