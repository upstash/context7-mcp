# Container Testing

This document describes how to test the Context7 Docker container.

## Quick Start

### Automated Testing

Run the full test suite:
```bash
./test-container.sh
```

Or run the CI-friendly version:
```bash
./test-container-ci.sh
```

### Using Make

```bash
# Run full container test
make test-container

# Run CI container test
make test-container-ci

# Just build the container
make build-container

# Clean up containers and images
make clean-container

# Show manual test steps
make manual-test
```

## Manual Testing

Follow these steps to manually test the container:

1. **Build the Docker image:**
   ```bash
   docker build -t context7-test .
   ```

2. **Run the container:**
   ```bash
   docker run -d -p 3000:3000 --name c7 context7-test
   ```

3. **Test the ping endpoint:**
   ```bash
   curl --retry 6 --retry-connrefused http://localhost:3000/ping
   ```
   
   This should return `pong`.

4. **Check health status:**
   ```bash
   docker inspect --format='{{.State.Health.Status}}' c7
   ```
   
   This should show `healthy` after the container has started.

5. **Clean up:**
   ```bash
   docker stop c7
   docker rm c7
   ```

## Health Check

The Dockerfile includes a health check that verifies the `/ping` endpoint:

```dockerfile
HEALTHCHECK CMD curl -sf http://localhost:$PORT/ping || exit 1
```

This health check:
- Uses curl to test the `/ping` endpoint
- Runs silently (`-s`) and fails on HTTP errors (`-f`)
- Uses the `$PORT` environment variable (default: 3000)
- Exits with code 1 if the health check fails

## CI/CD Integration

The container test is integrated into the CI/CD pipeline via GitHub Actions. See `.github/workflows/container-test.yml` for the full workflow.

### Key Test Points

1. **Build Success**: The Docker image builds without errors
2. **Container Startup**: The container starts and binds to port 3000
3. **Endpoint Availability**: The `/ping` endpoint is accessible and returns `pong`
4. **Health Check**: The Docker health check passes
5. **Cleanup**: Containers are properly cleaned up after testing

## Troubleshooting

### Container Won't Start
- Check Docker daemon is running
- Verify port 3000 is available
- Check container logs: `docker logs c7`

### Health Check Failing
- Verify curl is installed in the container
- Check if the application is listening on the correct port
- Ensure the `/ping` endpoint is implemented

### Port Conflicts
- Use different port mapping: `docker run -d -p 8080:3000 --name c7 context7-test`
- Update test scripts to use the new port

## Files

- `test-container.sh` - Full interactive test script
- `test-container-ci.sh` - CI-friendly test script
- `Makefile` - Convenience commands for container testing
- `.github/workflows/container-test.yml` - GitHub Actions workflow
- `Dockerfile` - Container definition with health check
