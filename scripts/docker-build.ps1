# Docker build script for blastify-fe-revamp (PowerShell version)
# This script builds and optionally pushes the Docker image

param(
    [string]$Version = "latest",
    [string]$Push = "false",
    [string]$Run = "false"
)

# Set variables
$IMAGE_NAME = "ibobdb/blastify-fe-revamp"
$FULL_IMAGE_NAME = "${IMAGE_NAME}:${Version}"

Write-Host "🚀 Building Docker image: $FULL_IMAGE_NAME" -ForegroundColor Green

# Build the Docker image
$buildArgs = @(
    "--build-arg", "GIT_TAG=$Version",
    "--build-arg", "NEXT_PUBLIC_API_URL=$(if ($env:NEXT_PUBLIC_API_URL) { $env:NEXT_PUBLIC_API_URL } else { 'https://api.blastify.com' })",
    "--build-arg", "NEXT_PUBLIC_APP_NAME=$(if ($env:NEXT_PUBLIC_APP_NAME) { $env:NEXT_PUBLIC_APP_NAME } else { 'Blastify' })",
    "--build-arg", "NEXT_PUBLIC_IS_PRODUCTION=$(if ($env:NEXT_PUBLIC_IS_PRODUCTION) { $env:NEXT_PUBLIC_IS_PRODUCTION } else { 'true' })",
    "-t", $FULL_IMAGE_NAME,
    "."
)

& docker build @buildArgs

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully: $FULL_IMAGE_NAME" -ForegroundColor Green
    
    # Push if requested
    if ($Push -eq "true") {
        Write-Host "📤 Pushing image to Docker Hub..." -ForegroundColor Yellow
        & docker push $FULL_IMAGE_NAME
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Image pushed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to push image" -ForegroundColor Red
            exit 1
        }
    }
    
    # Run if requested
    if ($Run -eq "true") {
        Write-Host "🏃 Starting container..." -ForegroundColor Yellow
        & docker run -d --name blastify-fe-revamp-test -p 3000:5000 $FULL_IMAGE_NAME
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Container started! Access at http://localhost:3000" -ForegroundColor Green
            Write-Host "💡 To stop: docker stop blastify-fe-revamp-test" -ForegroundColor Cyan
            Write-Host "💡 To remove: docker rm blastify-fe-revamp-test" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📖 Usage examples:" -ForegroundColor Cyan
Write-Host "  .\scripts\docker-build.ps1                           # Build with 'latest' tag"
Write-Host "  .\scripts\docker-build.ps1 -Version 'v1.0.0'        # Build with specific version"
Write-Host "  .\scripts\docker-build.ps1 -Version 'v1.0.0' -Push 'true'  # Build and push"
Write-Host "  .\scripts\docker-build.ps1 -Version 'v1.0.0' -Run 'true'   # Build and run locally"
