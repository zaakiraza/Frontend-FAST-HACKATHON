# 🚀 Smart Campus Backend Deployment Guide

## Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

#### Step 1: Prepare Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy to Render
1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `smart-campus-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3: Add Environment Variables
In Render Dashboard → Environment:
```
NODE_ENV=production
PORT=3000
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=41462
DB_USER=root
DB_PASSWORD=your_railway_password
DB_NAME=railway
JWT_SECRET=your_secure_random_string_here
```

#### Step 4: Deploy Simulator (Separate Worker)
1. Click "New +" → "Background Worker"
2. Same repository
3. Configure:
   - **Name**: `smart-campus-simulator`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run simulator`
   - Add same environment variables

#### Step 5: Setup Database Tables
After first deployment, go to Shell tab and run:
```bash
npm run simulator:setup
```

---

### Option 2: Railway.app (Easiest)

#### Step 1: Deploy
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Step 2: Add Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secure_secret
```

#### Step 3: Setup Database
Railway will auto-detect your MySQL database. Run:
```bash
railway run npm run simulator:setup
```

---

### Option 3: Heroku

#### Step 1: Create Heroku App
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create smart-campus-api

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=caboose.proxy.rlwy.net
heroku config:set DB_PORT=41462
heroku config:set DB_USER=root
heroku config:set DB_PASSWORD=your_password
heroku config:set DB_NAME=railway
heroku config:set JWT_SECRET=your_secret_here
```

#### Step 2: Create Procfile
Create `Procfile` in Backend folder:
```
web: npm start
worker: npm run simulator
```

#### Step 3: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Scale worker
heroku ps:scale worker=1
```

#### Step 4: Setup Database
```bash
heroku run npm run simulator:setup
```

---

### Option 4: DigitalOcean App Platform

#### Step 1: Deploy via GitHub
1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub repository
4. Configure:
   - **Type**: Web Service
   - **Run Command**: `npm start`
   - **HTTP Port**: 3000

#### Step 2: Add Components
Add second component:
- **Type**: Worker
- **Run Command**: `npm run simulator`

#### Step 3: Environment Variables
Add in App Settings:
```
NODE_ENV=production
DB_HOST=caboose.proxy.rlwy.net
DB_PORT=41462
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway
JWT_SECRET=your_secret
```

---

## Post-Deployment Steps

### 1. Test API Endpoints
```bash
# Health check
curl https://your-app-url.com/health

# Test database connection
curl https://your-app-url.com/api/test-db

# Get simulator stats
curl https://your-app-url.com/api/simulator/stats
```

### 2. Setup Database Tables
If not done automatically:
```bash
# SSH into your deployment
npm run simulator:setup
```

### 3. Verify Simulators
Check logs to see:
```
⚡ Starting Energy Sensor Simulator...
👥 Starting Occupancy Sensor Simulator...
🟢 [Main Academic Building] 165.23 kWh...
```

### 4. Update Frontend
Update your frontend `.env`:
```
VITE_API_URL=https://your-backend-url.com/api
```

---

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | MySQL host | `caboose.proxy.rlwy.net` |
| `DB_PORT` | MySQL port | `41462` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | Your Railway password |
| `DB_NAME` | Database name | `railway` |
| `JWT_SECRET` | JWT secret key | Random secure string |

---

## Monitoring & Logs

### Render
- Dashboard → Logs tab
- View real-time logs for API and Simulator

### Railway
```bash
railway logs
```

### Heroku
```bash
heroku logs --tail
```

---

## Troubleshooting

### Database Connection Fails
- Verify Railway MySQL is running
- Check DB credentials in environment variables
- Whitelist deployment IP in Railway if needed

### Simulator Not Running
- Check worker/background service is scaled to 1
- Verify environment variables are set
- Check logs for errors

### API Returns 502
- Check if port 3000 is exposed
- Verify `npm start` command works
- Check if database tables exist

---

## Cost Estimates

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| **Render** | 750 hrs/month | $7/month |
| **Railway** | $5 free credit | $0.000463/GB-hour |
| **Heroku** | 550 hrs/month (deprecated) | $5-7/month |
| **DigitalOcean** | $0 (trial) | $5/month |

---

## Quick Deploy Commands

### Render (via CLI)
```bash
npm install -g render
render deploy
```

### Railway (Quickest)
```bash
npm install -g @railway/cli
railway login
railway up
```

### Docker (Self-host)
```bash
docker build -t smart-campus-api .
docker run -p 3000:3000 --env-file .env smart-campus-api
```

---

## Production Checklist

- [ ] Environment variables set
- [ ] Database tables created (`npm run simulator:setup`)
- [ ] API health check working (`/health`)
- [ ] Simulator running and generating data
- [ ] Alerts table receiving anomalies
- [ ] CORS configured for frontend domain
- [ ] JWT secret is secure random string
- [ ] Database credentials secured
- [ ] Logs monitored for errors
- [ ] Frontend updated with production API URL

---

**Recommended:** Use **Railway** for fastest deployment (1 command) or **Render** for most reliable free tier.
