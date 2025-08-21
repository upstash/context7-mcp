# Windows Setup Guide for Context7 MCP

This guide addresses common Windows-specific issues when setting up Context7 MCP.

## Common Issues and Solutions

### 1. "Program not found" Error

**Problem**: `npx` command not found or not in PATH.

**Solutions**:
```toml
# Option 1: Use full path to npx
[mcp_servers.context7]
command = "C:\\Program Files\\nodejs\\npx.cmd"
args = ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]

# Option 2: Use cmd wrapper
[mcp_servers.context7]
command = "cmd"
args = ["/c", "npx", "-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]

# Option 3: Use PowerShell wrapper
[mcp_servers.context7]
command = "powershell"
args = ["-Command", "npx -y @upstash/context7-mcp --api-key YOUR_API_KEY"]
```

### 2. "Request timed out" Error

**Problem**: MCP server takes too long to initialize on Windows.

**Solutions**:

1. **Pre-install the package globally**:
   ```cmd
   npm install -g @upstash/context7-mcp
   ```

2. **Use direct Node.js execution**:
   ```toml
   [mcp_servers.context7]
   command = "C:\\Program Files\\nodejs\\node.exe"
   args = [
     "C:\\Users\\YourName\\AppData\\Roaming\\npm\\node_modules\\@upstash\\context7-mcp\\dist\\index.js",
     "--api-key", "YOUR_API_KEY"
   ]
   ```

3. **Use Bun instead of npm** (often faster):
   ```toml
   [mcp_servers.context7]
   command = "bun"
   args = ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
   ```

### 3. Environment Variables

Set up proper environment variables for Windows:

```toml
[mcp_servers.context7.env]
LOCALAPPDATA = 'C:\\Users\\YourName\\AppData\\Local'
APPDATA = 'C:\\Users\\YourName\\AppData\\Roaming'
PROGRAMFILES = 'C:\\Program Files'
"PROGRAMFILES(X86)" = 'C:\\Program Files (x86)'
SYSTEMROOT = 'C:\\Windows'
WINDIR = 'C:\\Windows'
HOMEDRIVE = 'C:'
HOMEPATH = '\\Users\\YourName'
HOME = 'C:\\Users\\YourName'
```

### 4. Path Escaping

Windows paths require proper escaping in TOML:

```toml
# Correct - use double backslashes
command = "C:\\\\Program Files\\\\nodejs\\\\node.exe"

# Or use forward slashes
command = "C:/Program Files/nodejs/node.exe"
```

## Recommended Configuration

For most Windows users, this configuration works best:

```toml
[mcp_servers.context7]
command = "cmd"
args = ["/c", "npx", "-y", "@upstash/context7-mcp@latest", "--api-key", "YOUR_API_KEY"]
disabled = false
autoApprove = []
```

## Troubleshooting Steps

1. **Verify Node.js installation**:
   ```cmd
   node --version
   npm --version
   npx --version
   ```

2. **Test package installation**:
   ```cmd
   npx -y @upstash/context7-mcp --help
   ```

3. **Check Windows execution policy** (PowerShell):
   ```powershell
   Get-ExecutionPolicy
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Enable long path support** (Windows 10/11):
   - Open Group Policy Editor (`gpedit.msc`)
   - Navigate to: Computer Configuration > Administrative Templates > System > Filesystem
   - Enable "Enable Win32 long paths"

## Alternative Runtimes

If npm/npx continues to cause issues, try these alternatives:

### Using Bun
```toml
[mcp_servers.context7]
command = "bun"
args = ["x", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
```

### Using Deno
```toml
[mcp_servers.context7]
command = "deno"
args = [
  "run",
  "--allow-env=NO_DEPRECATION,TRACE_DEPRECATION",
  "--allow-net",
  "npm:@upstash/context7-mcp",
  "--api-key", "YOUR_API_KEY"
]
```

## Performance Tips

1. **Use SSD storage** for faster package installation
2. **Disable Windows Defender real-time scanning** for npm cache folder temporarily
3. **Use npm cache** to speed up subsequent installs:
   ```cmd
   npm config set cache C:\npm-cache
   ```

## Getting Help

If you continue to experience issues:

1. Check the [main README](README.md) for general troubleshooting
2. Open an issue on [GitHub](https://github.com/upstash/context7/issues)
3. Include your Windows version, Node.js version, and exact error messages