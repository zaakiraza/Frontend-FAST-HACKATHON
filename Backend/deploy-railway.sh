#!/bin/bash

# 🚀 Quick Deploy Script for Railway
# Usage: ./deploy-railway.sh

echo "🚀 Deploying Smart Campus Backend to Railway..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "⚠️  Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Link to project (or create new)
echo "🔗 Linking to Railway project..."
railway link

# Set environment variables
echo "⚙️  Setting environment variables..."
echo "Please enter your database password:"
read -s DB_PASSWORD

railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set DB_HOST=caboose.proxy.rlwy.net
railway variables set DB_PORT=41462
railway variables set DB_USER=root
railway variables set DB_PASSWORD=$DB_PASSWORD
railway variables set DB_NAME=railway
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Deploy
echo "📦 Deploying application..."
railway up

# Setup database tables
echo "🗄️  Setting up database tables..."
railway run npm run simulator:setup

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your API will be available at the URL shown above"
echo ""
echo "Next steps:"
echo "1. Copy the deployment URL"
echo "2. Update your frontend VITE_API_URL"
echo "3. Test: curl https://your-url.railway.app/health"
