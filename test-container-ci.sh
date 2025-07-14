#!/bin/bash
# Simple CI-friendly container test script
# Usage: ./test-container-ci.sh

set -e

echo "Building Docker image..."
docker build -t context7-test .

echo "Starting container..."
docker run -d -p 3000:3000 --name c7 context7-test

echo "Testing ping endpoint..."
curl --retry 6 --retry-connrefused http://localhost:3000/ping

echo "Cleaning up..."
docker stop c7
docker rm c7

echo "Test completed successfully!"
