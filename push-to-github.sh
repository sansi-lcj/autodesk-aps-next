#!/bin/bash

# Push to GitHub script
# Run this command to push your code to GitHub

cd "$(dirname "$0")"

echo "🚀 Pushing to GitHub..."

# Rename branch to main
git branch -M main

# Push to GitHub (will use gh auth)
git push -u origin main

echo "✅ Done! Your code is now on GitHub."
echo ""
echo "📋 Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Import your repository: sansi-lcj/autodesk-aps-next"
echo "3. Add environment variables in Vercel:"
echo "   - APS_CLIENT_ID"
echo "   - APS_CLIENT_SECRET"
echo "4. Deploy!"
