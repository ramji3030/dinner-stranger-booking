# 💰 Free Tier Deployment Guide

## Deploy Your Dinner Stranger Booking App for $0/Month

This guide shows you how to deploy the entire application using only free tiers of various services. Perfect for MVPs, demos, or learning purposes.

---

## 📊 Cost Comparison

| Component | Enterprise Setup | Free Tier Setup |
|-----------|-----------------|-----------------|
| **Monthly Cost** | $27,300 | **$0** |
| **Concurrent Users** | 1,000,000+ | 100-500 |
| **Response Time** | <200ms | <1s |
| **RAM** | 50GB+ | ~1GB |
| **Database** | 3-node replica set | Single instance or Atlas M0 |
| **Caching** | 3-node Redis cluster | Single Redis or Upstash |
| **Search** | 3-node Elasticsearch | Basic MongoDB queries |
| **Load Balancer** | Multi-layer | None (single server) |

---

## 🚀 Quick Start (3 Options)

### Option 1: Full Free Hosting (Recommended for Production MVP)

**Stack:**
- Backend: Render.com (Free tier)
- Frontend: Vercel (Free tier)
- Database: MongoDB Atlas (M0 Free tier)
- Cache: Upstash Redis (Free tier)
- Storage: Cloudinary (Free tier)

**Total Cost:** $0/month

### Option 2: Railway.app (Easiest Setup)

**Stack:**
- Full stack on Railway.app ($5 credit/month free)
- MongoDB Atlas (M0 Free tier)
- Frontend on Vercel (Free tier)

**Total Cost:** $0/month (stays within $5 credit)

### Option 3: Local Development

**Stack:**
- Docker Compose (free-tier config)
- Run everything locally

**Total Cost:** $0

---

## 📝 Step-by-Step Deployment

### Phase 1: Set Up Free Services (15 minutes)

#### 1. MongoDB Atlas (Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Create an account
4. Create a new cluster:
   - Choose **M0 (Free tier)**
   - Select a region close to you
   - Cluster Name: `dinner-booking`
5. Wait 3-5 minutes for provisioning
6. Set up security:
   - Click "Database Access" → Add user
   - Username: `dinnerapp`
   - Password: Generate secure password
   - Click "Network Access" → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for now)
7. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://dinnerapp:YOUR_PASSWORD@dinner-booking.xxxxx.mongodb.net/dinnerapp`

**Limits:**
- 512MB storage
- Shared CPU
- Perfect for 100-500 users

#### 2. Upstash Redis (Caching)

1. Go to [upstash.com](https://upstash.com/)
2. Sign up (free with GitHub/Google)
3. Create database:
   - Click "Create Database"
   - Name: `dinner-cache`
   - Type: Regional
   - Region: Same as your MongoDB
4. Copy connection details:
   - Click on database → "REST API" tab
   - Copy `UPSTASH_REDIS_REST_URL`
   - Copy `UPSTASH_REDIS_REST_TOKEN`

**Limits:**
- 10,000 commands/day
- 256MB storage
- More than enough for caching

#### 3. Cloudinary (Image Storage)

1. Go to [cloudinary.com](https://cloudinary.com/)
2. Sign up for free
3. Get credentials from dashboard:
   - Cloud name
   - API Key
   - API Secret

**Limits:**
- 25GB storage
- 25GB bandwidth/month
- Perfect for user avatars & event images

---

### Phase 2: Deploy Backend (Option 1 - Render.com)

#### Setup Render.com

1. Go to [render.com](https://render.com/)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `dinner-stranger-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: **Free**

6. Add Environment Variables:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://dinnerapp:PASSWORD@cluster.mongodb.net/dinnerapp
REDIS_URL=redis://default:TOKEN@UPSTASH_URL:6379
JWT_SECRET=your_super_secret_jwt_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

7. Click "Create Web Service"

**Note:** Free tier sleeps after 15 mins of inactivity. First request after sleep takes 30-50 seconds.

#### Get Backend URL
- After deployment completes, copy your URL:
- Example: `https://dinner-stranger-api.onrender.com`

---

### Phase 3: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

6. Environment Variables:
```
REACT_APP_API_URL=https://dinner-stranger-api.onrender.com
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

7. Click "Deploy"

**Your app is now live!** 🎉

---

### Phase 2B: Alternative - Railway.app (Simpler)

1. Go to [railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js
6. Add environment variables (same as Render)
7. Deploy completes in ~3 minutes

**Advantage:** Simpler setup, but $5/month credit runs out faster if you have traffic.

---

## 🔧 Local Development Setup

Perfect for development before deploying:

```bash
# Clone repository
git clone https://github.com/yourusername/dinner-stranger-booking.git
cd dinner-stranger-booking

# Create .env file in root
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/dinnerapp
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_local_secret_key
STRIPE_SECRET_KEY=sk_test_your_test_key
EOF

# Start with free-tier docker compose
docker-compose -f docker-compose.free-tier.yml up

# Or start services individually:

# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm start

# Terminal 3 - MongoDB (if not using Docker)
mongod

# Terminal 4 - Redis (if not using Docker)
redis-server
```

Access at: `http://localhost:3000`

---

## 📈 Performance Optimization Tips

### 1. Minimize Cold Starts (Render/Railway)
```javascript
// Add keep-alive endpoint
app.get('/ping', (req, res) => res.send('pong'));

// Use cron-job.org to ping every 14 minutes
// Add job: https://dinner-stranger-api.onrender.com/ping
```

### 2. Efficient Caching
```javascript
// Cache expensive operations
const getCachedEvents = async () => {
  const cached = await redis.get('events:recent');
  if (cached) return JSON.parse(cached);
  
  const events = await Event.find().limit(20);
  await redis.setex('events:recent', 300, JSON.stringify(events)); // 5 min cache
  return events;
};
```

### 3. Database Indexing
```javascript
// Add indexes for common queries
eventSchema.index({ date: 1, 'location.city': 1 });
userSchema.index({ email: 1 });
bookingSchema.index({ userId: 1, eventId: 1 });
```

### 4. Lazy Loading Images
```javascript
// Use Cloudinary transformations
const thumbnailUrl = cloudinary.url(imageId, {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
  fetch_format: 'auto'
});
```

---

## ⚠️ Free Tier Limitations

### MongoDB Atlas M0
- **Storage:** 512MB (roughly 100,000 user records)
- **No backups** (manual export recommended)
- **Shared infrastructure** (occasional slowdowns)

**Workaround:** Export database weekly:
```bash
mongodump --uri="mongodb+srv://..." --out=./backup
```

### Render Free Tier
- **Sleeps after 15 mins** (30-50s first request)
- **750 hours/month** (31 days = 744 hours - barely enough!)
- **Shared CPU** (slower during peak times)

**Workaround:** Use cron-job.org to keep alive (see above)

### Upstash Redis Free
- **10,000 commands/day** (~7 commands/minute)
- **Use wisely:** Cache only expensive operations

**Workaround:** Implement request counting:
```javascript
const cacheWithLimit = async (key, data, ttl) => {
  const count = await redis.incr('daily_count');
  if (count > 9000) return data; // Skip caching if near limit
  await redis.setex(key, ttl, JSON.stringify(data));
};
```

---

## 🚦 When to Upgrade

### Signs you've outgrown free tier:

1. **Render sleeping causes issues** → Upgrade to Render Starter ($7/month)
2. **MongoDB hitting 512MB limit** → Upgrade to M10 ($57/month)
3. **Upstash rate limits** → Upgrade to Pro ($10/month) or self-host Redis
4. **Need faster response times** → Add paid CDN (Cloudflare Pro $20/month)

### Gradual Upgrade Path:
```
Free Tier ($0/month)
   ↓ when you hit limits
Render Starter + Atlas M10 ($64/month)
   ↓ when scaling more
Full free-tier docker + VPS ($5-20/month)
   ↓ for serious traffic
Enterprise Setup ($27,300/month)
```

---

## 🐛 Common Issues & Solutions

### Issue: "Application Error" on Render

**Solution:**
```bash
# Check logs in Render dashboard
# Usually missing environment variable

# Ensure all required vars are set:
MONGODB_URI
REDIS_URL
JWT_SECRET
STRIPE_SECRET_KEY
```

### Issue: MongoDB connection timeout

**Solution:**
```bash
# Add to connection string:
?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000

# Full example:
mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority
```

### Issue: Redis commands limit reached

**Solution:**
```javascript
// Reduce cache writes, increase TTL
await redis.setex(key, 3600, data); // 1 hour instead of 5 mins

// Or skip Redis, use in-memory cache:
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });
```

### Issue: Vercel build fails

**Solution:**
```bash
# Ensure package.json in client/ has correct scripts:
{
  "scripts": {
    "build": "react-scripts build",
    "start": "react-scripts start"
  }
}

# Clear Vercel cache and redeploy
```

---

## 🎯 Production Checklist

Before launching:

- [ ] MongoDB Atlas whitelist set to `0.0.0.0/0` or specific IPs
- [ ] All API keys in environment variables (not hardcoded)
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] CORS configured for frontend domain
- [ ] Error logging set up (use free tier of Sentry)
- [ ] Analytics added (Google Analytics or Mixpanel free tier)
- [ ] Database indexes created
- [ ] Set up cron job to keep Render alive
- [ ] Test all flows (signup, booking, payment)
- [ ] Mobile responsive design tested

---

## 📚 Additional Free Services

Enhance your app with these free tiers:

- **SendGrid:** 100 emails/day free
- **Sentry:** Error tracking (5k events/month free)
- **Mixpanel:** Analytics (100k events/month free)
- **Auth0:** Authentication (7k users free)
- **Cloudflare:** CDN & DDoS protection (free forever)
- **GitHub Actions:** CI/CD (2,000 minutes/month free)

---

## 📞 Need Help?

- Join Discord: [Your Discord Link]
- Open GitHub Issue: [Your GitHub Issues]
- Read full docs: [Your Documentation]

---

## 🎉 Congratulations!

You now have a fully functional dinner booking app running on free infrastructure. As your user base grows, you can gradually upgrade services one at a time.

**Share your deployed app!** Tweet @YourHandle with #DinnerStrangerBooking

---

**Made with ❤️ by the community**
