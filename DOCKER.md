# Docker Usage

This document explains how to build and run the Context7 MCP Server using Docker.

## 🔧 Host Binding & Port Configuration

The Context7 MCP Server now binds to **0.0.0.0** by default, making it accessible from outside the container when ports are properly mapped. Port configuration follows this priority:

1. **`PORT` environment variable** (highest priority)
2. **`--port` CLI flag** (if no environment variable)
3. **Default port 3000** (if neither above are set)

## Building the Docker Image

To build the Docker image:

```bash
docker build -t context7-mcp .
```

## Running the Container

### Basic Usage

Run with default settings (port 3000):

```bash
docker run -p 3000:3000 context7-mcp
```

### Custom Port via Environment Variable

Run with a custom port using environment variable (recommended):

```bash
docker run -p 8080:8080 -e PORT=8080 context7-mcp
```

### Background Mode

Run in detached mode:

```bash
docker run -d -p 3000:3000 --name context7-mcp context7-mcp
```

## Using Docker Compose

For easier management, use Docker Compose:

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs

# Stop the service
docker-compose down
```

### Customizing Docker Compose

To change the port in docker-compose.yml:

```yaml
services:
  context7-mcp:
    build: .
    ports:
      - "8080:8080"  # Change both host and container ports
    environment:
      - PORT=8080     # Set environment variable
```

## Port Selection Priority

The server uses the following priority order for port selection:

1. **`PORT` environment variable** (highest priority)
2. **`--port` CLI flag** (if no environment variable)
3. **Default port 3000** (if neither above are set)

## Host Binding

**🔧 The server now binds to `0.0.0.0` by default**, making it accessible from outside the container when ports are properly mapped. This change ensures better container compatibility and enables access from any network interface.

## Health Check

The container includes a health check that verifies the server is responding:

```bash
# Check container health
docker ps

# Manual health check
curl http://localhost:3000/ping
```

## Examples

### Different Port Configurations

```bash
# Default port (3000)
docker run -p 3000:3000 context7-mcp

# Environment variable port (8080)
docker run -p 8080:8080 -e PORT=8080 context7-mcp

# CLI flag port (note: environment variable takes precedence)
docker run -p 9000:9000 -e PORT=9000 context7-mcp --port 8080
```

### Production Deployment

```bash
# Run with restart policy
docker run -d \
  --name context7-mcp \
  --restart unless-stopped \
  -p 3000:3000 \
  -e PORT=3000 \
  context7-mcp
```

## Testing

You can test the server once it's running:

```bash
# Test the ping endpoint
curl http://localhost:3000/ping

# Expected response: pong
```

## Image Details

- **Base Image**: `node:lts-alpine` (lightweight Linux with Node.js LTS)
- **Multi-stage build**: Optimized for production with separate build and runtime stages
- **Security**: Runs as non-root user
- **Size**: Minimized by excluding development dependencies in production image
- **Health Check**: Built-in health monitoring using curl
