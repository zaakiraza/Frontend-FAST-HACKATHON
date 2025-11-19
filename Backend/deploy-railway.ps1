# 🚀 Quick Deploy Script for Railway (Windows PowerShell)
# Usage: .\deploy-railway.ps1

Write-Host "🚀 Deploying Smart Campus Backend to Railway..." -ForegroundColor Green
Write-Host ""

# Check if Railway CLI is installed
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "🔐 Logging into Railway..." -ForegroundColor Cyan
railway login

# Link to project (or create new)
Write-Host "🔗 Linking to Railway project..." -ForegroundColor Cyan
railway link

# Set environment variables
Write-Host "⚙️  Setting environment variables..." -ForegroundColor Cyan
$DB_PASSWORD = Read-Host "Please enter your database password" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))

# Generate random JWT secret
$JWT_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set DB_HOST=caboose.proxy.rlwy.net
railway variables set DB_PORT=41462
railway variables set DB_USER=root
railway variables set "DB_PASSWORD=$DB_PASSWORD_PLAIN"
railway variables set DB_NAME=railway
railway variables set "JWT_SECRET=$JWT_SECRET"

# Deploy
Write-Host "📦 Deploying application..." -ForegroundColor Cyan
railway up

# Setup database tables
Write-Host "🗄️  Setting up database tables..." -ForegroundColor Cyan
railway run npm run simulator:setup

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your API will be available at the URL shown above" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the deployment URL"
Write-Host "2. Update your frontend VITE_API_URL"
Write-Host "3. Test: curl https://your-url.railway.app/health"
