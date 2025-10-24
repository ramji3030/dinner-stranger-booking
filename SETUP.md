# 🚀 Quick Setup Guide - Dinner Stranger Booking

**Get your application running in 5 minutes!**

Every week, we bring together groups of six like-minded people.
No profiles, no swiping, no planning. We handle the details. You show up.

---

## ✅ Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- ✅ **npm** (v9.0.0 or higher) - Comes with Node.js
- ✅ **Git** - [Download here](https://git-scm.com/)
- ✅ **MongoDB** - Free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- ✅ **Stripe Account** - [Sign up here](https://stripe.com/)

---

## 📥 Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ramji3030/dinner-stranger-booking.git

# Navigate into the project
cd dinner-stranger-booking
```

---

## 📦 Step 2: Install All Dependencies

### Option A: One Command (Recommended)

```bash
npm run setup
```

This will:
- Install server dependencies
- Navigate to client folder and install client dependencies
- Initialize Tailwind CSS configuration

### Option B: Manual Installation

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install

# Initialize Tailwind CSS
npx tailwindcss init -p

# Go back to root
cd ..
```

**Expected installation time:** 2-3 minutes

---

## 🔐 Step 3: Set Up Environment Variables

### Server Environment (.env in root)

Create a `.env` file in the **root directory**:

```bash
# Navigate to root (if not there)
cd /path/to/dinner-stranger-booking

# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/dinner-booking?retryWrites=true&w=majority

# JWT Secrets (Generate random strings)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-refresh-token-secret-here-also-long-and-random
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Configuration (Choose one)
# Option 1: Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Option 2: SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Redis (For production, use Upstash)
REDIS_URL=redis://localhost:6379
# Or for Upstash: redis://default:xxxxx@global-xxxxx.upstash.io:6379

# Image Upload (Optional - Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Sentry (Optional - Error Monitoring)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Encryption Key (Generate a random 32-byte hex string)
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Client Environment (.env in client/)

Create a `.env` file in the **client directory**:

```bash
cd client
touch .env
```

Add the following:

```env
# API Base URL
VITE_API_URL=http://localhost:5000

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App Configuration
VITE_APP_NAME=TableTalk
VITE_APP_URL=http://localhost:5173
```

---

## 🔑 Step 4: Get Your API Keys

### MongoDB Atlas (Required)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (free M0 tier)
4. Click **Connect** → **Connect your application**
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Paste into `MONGODB_URI` in your `.env` file

### Stripe (Required for Payments)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up and verify your email
3. Go to **Developers** → **API keys**
4. Copy **Publishable key** and **Secret key** (use test keys)
5. Paste into your `.env` files

### Generate JWT Secrets

```bash
# Generate random secrets (run in terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this twice to get two different secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`

### Generate Encryption Key

```bash
# Generate 32-byte encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🏃 Step 5: Run the Application

### Development Mode (Both Server & Client)

From the **root directory**:

```bash
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend client** on `http://localhost:5173`

### Separate Terminals (Alternative)

**Terminal 1 - Server:**
```bash
npm run server
```

**Terminal 2 - Client:**
```bash
npm run client
```

---

## 🌐 Step 6: Open Your Application

Open your browser and go to:

```
http://localhost:5173
```

You should see your dinner stranger booking application! 🎉

---

## 🧪 Step 7: Test the Application

### Test User Registration

1. Go to `/register`
2. Create a new account
3. Fill out the personality quiz
4. Upload a profile photo (optional)

### Test Booking Flow

1. Browse available dinners
2. Click "Book Your Seat"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits
6. Complete booking

---

## 📚 Available Scripts

### Root Package Scripts

```bash
npm run dev          # Run both server and client
npm run server       # Run server only (nodemon)
npm run client       # Run client only
npm run build        # Build client for production
npm run setup        # Install all dependencies + Tailwind
npm run install-all  # Install all dependencies
npm start           # Run server in production mode
npm test            # Run tests
```

### Client Scripts (from client/ directory)

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🛠️ Troubleshooting

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:** Change the port in your `.env` file:
```env
PORT=5001
```

### MongoDB Connection Failed

**Error:** `MongoServerError: bad auth`

**Solution:**
1. Check your MongoDB password
2. Make sure you whitelisted your IP in MongoDB Atlas
3. Go to **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (for development)

### Cannot Find Module

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm -rf client/node_modules
npm run setup
```

### Stripe Payment Not Working

**Solution:**
1. Make sure you're using **test keys** (start with `pk_test_` and `sk_test_`)
2. Use test card: `4242 4242 4242 4242`
3. Check that STRIPE_PUBLISHABLE_KEY is in both server and client .env files

### Redis Connection Error

**For Development:**
```bash
# Start Redis locally (if installed)
redis-server

# Or comment out Redis in server code for now
```

**For Production:** Use [Upstash Redis](https://upstash.com/) (free tier available)

---

## 📁 Project Structure

```
dinner-stranger-booking/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── hooks/                   # Custom hooks
│   │   ├── utils/                   # Utilities
│   │   └── App.tsx                  # Main app component
│   ├── package.json                 # Client dependencies
│   ├── vite.config.ts               # Vite configuration
│   └── .env                         # Client environment variables
├── server/                          # Node.js Backend
│   ├── routes/                      # API routes
│   ├── models/                      # MongoDB models
│   ├── middleware/                  # Express middleware
│   ├── utils/                       # Server utilities
│   └── index.js                     # Server entry point
├── package.json                     # Server dependencies
├── .env                             # Server environment variables
├── SETUP.md                         # This file!
├── REQUIRED_PACKAGES.md             # Package documentation
├── FREE_TIER_GUIDE.md               # Free deployment guide
├── SECURITY_IMPLEMENTATION.md       # Security features
└── CUSTOMER_ATTRACTION_IMPLEMENTATION.md  # Marketing features
```

---

## 🎯 Next Steps

Now that your application is running:

1. ✅ **Customize the branding** - Update colors, logo, and app name
2. ✅ **Configure Tailwind** - Modify `client/tailwind.config.js`
3. ✅ **Set up email templates** - Customize in `server/utils/email/`
4. ✅ **Add restaurant locations** - Seed your database
5. ✅ **Enable 2FA** - Follow `SECURITY_IMPLEMENTATION.md`
6. ✅ **Deploy** - Follow `FREE_TIER_GUIDE.md` for free hosting

---

## 📖 Additional Resources

- **Security Setup:** See `SECURITY_IMPLEMENTATION.md`
- **Free Deployment:** See `FREE_TIER_GUIDE.md`
- **Customer Attraction:** See `CUSTOMER_ATTRACTION_IMPLEMENTATION.md`
- **Package Details:** See `REQUIRED_PACKAGES.md`
- **API Documentation:** See `server/README.md`

---

## 🆘 Need Help?

**Common Issues:**
1. Check that Node.js version is 18+: `node --version`
2. Make sure all dependencies are installed: `npm run setup`
3. Verify environment variables are set correctly
4. Check MongoDB Atlas network access settings
5. Ensure ports 5000 and 5173 are available

**Still stuck?**
- Create an issue on GitHub
- Check the documentation files
- Review error messages carefully

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm run setup`)
- [ ] `.env` file created in root
- [ ] `.env` file created in client/
- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string added
- [ ] Stripe account created
- [ ] Stripe API keys added
- [ ] JWT secrets generated
- [ ] Application running (`npm run dev`)
- [ ] Opened http://localhost:5173 in browser
- [ ] Created test user account
- [ ] Completed test booking

---

**🎉 Congratulations! Your Dinner Stranger Booking application is now ready to use!**

**Next:** Follow the `FREE_TIER_GUIDE.md` to deploy your application for free ($0/month)
