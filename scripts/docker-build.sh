#!/bin/bash

# Docker build script for blastify-fe-revamp
# This script builds and optionally pushes the Docker image

# Set variables
IMAGE_NAME="ibobdb/blastify-fe-revamp"
VERSION=${1:-"latest"}
FULL_IMAGE_NAME="${IMAGE_NAME}:${VERSION}"

echo "🚀 Building Docker image: ${FULL_IMAGE_NAME}"

# Build the Docker image
docker build \
  --build-arg GIT_TAG=${VERSION} \
  --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-"https://api.blastify.com"} \
  --build-arg NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME:-"Blastify"} \
  --build-arg NEXT_PUBLIC_IS_PRODUCTION=${NEXT_PUBLIC_IS_PRODUCTION:-"true"} \
  -t ${FULL_IMAGE_NAME} \
  .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully: ${FULL_IMAGE_NAME}"
    
    # Ask if user wants to push
    read -p "🔄 Do you want to push the image to Docker Hub? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 Pushing image to Docker Hub..."
        docker push ${FULL_IMAGE_NAME}
        if [ $? -eq 0 ]; then
            echo "✅ Image pushed successfully!"
        else
            echo "❌ Failed to push image"
            exit 1
        fi
    fi
    
    # Ask if user wants to run the container
    read -p "🏃 Do you want to run the container locally? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🏃 Starting container..."
        docker run -d \
          --name blastify-fe-revamp-test \
          -p 3000:5000 \
          ${FULL_IMAGE_NAME}
        echo "✅ Container started! Access at http://localhost:3000"
        echo "💡 To stop: docker stop blastify-fe-revamp-test"
        echo "💡 To remove: docker rm blastify-fe-revamp-test"
    fi
else
    echo "❌ Docker build failed!"
    exit 1
fi
