# Context7 MCP - Up-to-date Docs For Any Cursor Prompt

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

Context7 fetches up-to-date documentation and working code examples right into your LLM’s context.

- 1️⃣ Ask your question naturally
- 2️⃣ Tell the LLM to `use context7`
- 3️⃣ Get working code answers

No tab-switching, no hallucinated APIs that don't exist, no outdated code generations.

## 🛠️ Getting Started

### Requirements

- Node.js >= v18.0.0
- Cursor, Windsurf, Claude Desktop or another MCP Client

### Install in Cursor

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Paste this into your Cursor `~/.cursor/mcp.json` file. See [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more info.

#### MacOs

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

#### Windows

```json
{
  "mcpServers": {
    "context7": {
      "command": "C:\\Windows\\System32\\cmd.exe",
      "args": [
        "/c",
        "npx",
        "-y",
        "@upstash/context7-mcp@latest"
      ]
    }
  }
}
```

### Install in Windsurf

Add this to your Windsurf MCP config file. See [Windsurf MCP docs](https://docs.windsurf.com/windsurf/mcp) for more info.

#### MacOs

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

#### Windows

```json
{
  "mcpServers": {
    "context7": {
      "command": "C:\\Windows\\System32\\cmd.exe",
      "args": [
        "/c",
        "npx",
        "-y",
        "@upstash/context7-mcp@latest"
      ]
    }
  }
}
```

### Install in VSCode

Add this to your VSCode MCP config file. See [VSCode MCP docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for more info.

#### MacOs

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

#### Windows

```json
{
  "servers": {
    "context7": {
       "type": "stdio",
      "command": "C:\\Windows\\System32\\cmd.exe",
      "args": [
        "/c",
        "npx",
        "-y",
        "@upstash/context7-mcp@latest"
      ]
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

## License

MIT
