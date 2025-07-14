.PHONY: test-container test-container-ci build-container clean-container

# Build and test the container
test-container:
	@echo "Running full container test..."
	@./test-container.sh

# Run CI-friendly container test
test-container-ci:
	@echo "Running CI container test..."
	@./test-container-ci.sh

# Just build the container
build-container:
	@echo "Building Docker container..."
	@docker build -t context7-test .

# Clean up containers and images
clean-container:
	@echo "Cleaning up containers and images..."
	@docker stop c7 2>/dev/null || true
	@docker rm c7 2>/dev/null || true
	@docker rmi context7-test 2>/dev/null || true

# Manual test commands
manual-test:
	@echo "Manual test steps:"
	@echo "1. docker build -t context7-test ."
	@echo "2. docker run -d -p 3000:3000 --name c7 context7-test"
	@echo "3. curl --retry 6 --retry-connrefused http://localhost:3000/ping"
	@echo "4. docker stop c7 && docker rm c7"
