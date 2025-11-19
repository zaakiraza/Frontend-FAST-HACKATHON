# 🚀 Quick Deploy - Choose Your Platform

## Fastest: Railway (1 Command)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy (interactive)
railway login
railway init
railway up

# Setup database
railway run npm run simulator:setup
```

**Done!** Your API is live at `https://your-app.railway.app`

---

## Alternative: Render.com

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect this GitHub repo
4. Set environment variables (see `.env.example`)
5. Click "Deploy"

---

## Test Your Deployment

```bash
# Health check
curl https://your-url.com/health

# Get simulator stats
curl https://your-url.com/api/simulator/stats

# Get energy readings
curl https://your-url.com/api/simulator/energy/latest
```

---

## Update Frontend

In your Frontend folder, update `.env`:

```bash
VITE_API_URL=https://your-backend-url.com/api
```

---

## Need Help?

See detailed instructions: [DEPLOYMENT.md](./DEPLOYMENT.md)
