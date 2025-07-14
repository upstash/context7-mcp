#!/bin/bash

# Context7 End-to-End Container Test Script
# This script tests the Docker container build, run, and health check

set -e  # Exit on any error

echo "🚀 Starting Context7 Container Test"
echo "=================================="

# Cleanup function to remove container if it exists
cleanup() {
    echo "🧹 Cleaning up..."
    if docker ps -a --format '{{.Names}}' | grep -q "^c7$"; then
        echo "   Stopping and removing container 'c7'..."
        docker stop c7 >/dev/null 2>&1 || true
        docker rm c7 >/dev/null 2>&1 || true
    fi
}

# Run cleanup on script exit
trap cleanup EXIT

# Step 1: Build the Docker image
echo "📦 Step 1: Building Docker image..."
docker build -t context7-test .

# Step 2: Run the container
echo "🏃 Step 2: Starting container..."
docker run -d -p 3000:3000 --name c7 context7-test

# Wait a moment for the container to start
echo "⏳ Waiting for container to start..."
sleep 3

# Step 3: Test the ping endpoint
echo "🔍 Step 3: Testing ping endpoint..."
response=$(curl --retry 6 --retry-connrefused --retry-delay 2 -s http://localhost:3000/ping)

if [ "$response" = "pong" ]; then
    echo "✅ SUCCESS: Ping endpoint returned 'pong'"
else
    echo "❌ FAILURE: Ping endpoint returned '$response', expected 'pong'"
    exit 1
fi

# Optional: Check Docker health status
echo "🏥 Step 4: Checking Docker health status..."
health_status=$(docker inspect --format='{{.State.Health.Status}}' c7 2>/dev/null || echo "none")
echo "   Health status: $health_status"

# Show container logs for debugging
echo "📋 Container logs:"
docker logs c7

echo ""
echo "🎉 All tests passed! Container is working correctly."
