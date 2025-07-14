# Context7 MCP Server Dockerfile
# ----- Build Stage -----
FROM node:lts-alpine AS builder
WORKDIR /app

# Copy package and configuration files
COPY package*.json tsconfig.json ./

# Copy source code
COPY src ./src

# Install dependencies and build
RUN npm install && npm run build

# ----- Production Stage -----
FROM node:lts-alpine
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Copy package.json for production install
COPY package*.json ./

# Install only production dependencies
RUN npm install --production --ignore-scripts

# Allow overriding the exposed/default port with Docker build args
ARG APP_PORT=3000
ENV PORT=$APP_PORT
EXPOSE $APP_PORT

# Add healthcheck
HEALTHCHECK CMD sh -c "curl -sf http://localhost:${PORT:-3000}/ping || exit 1"
HEALTHCHECK CMD curl -sf http://localhost:$PORT/ping || exit 1

# Default command - uses environment variable PORT first, then CLI flag, then default
CMD ["node", "dist/index.js", "--transport", "http"]
