#!/bin/bash

echo "Preparing for deployment..."

# Create build directory structure if needed
mkdir -p server/public

# Copy all files from public to server/public (standard files only)
cp -r public/* server/public/ 2>/dev/null || true

echo "Deployment preparation complete!"
echo "You can now deploy the application using Replit's deploy feature."