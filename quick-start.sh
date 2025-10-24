#!/bin/bash

# 🚀 Quick Start Script for Dinner Stranger Booking
# This script automates the setup process

set -e  # Exit on any error

echo "====================================="
echo "🚀 Dinner Stranger Booking Setup"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"
echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"
echo ""

# Step 1: Install dependencies
echo "====================================="
echo "📦 Step 1: Installing Dependencies"
echo "====================================="
echo ""

echo "Installing server dependencies..."
npm install

echo ""
echo "Installing client dependencies..."
cd client
npm install

echo ""
echo "Initializing Tailwind CSS..."
npx tailwindcss init -p

cd ..

echo ""
echo -e "${GREEN}✅ All dependencies installed successfully!${NC}"
echo ""

# Step 2: Generate secrets
echo "====================================="
echo "🔑 Step 2: Generating Security Keys"
echo "====================================="
echo ""

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo -e "${GREEN}✅ Security keys generated${NC}"
echo ""

# Step 3: Create .env files
echo "====================================="
echo "⚙️  Step 3: Creating Environment Files"
echo "====================================="
echo ""

# Create root .env if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB (Get from MongoDB Atlas)
# Sign up: https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/dinner-booking?retryWrites=true&w=majority

# JWT Secrets (Auto-generated)
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe (Get from https://dashboard.stripe.com/)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Redis (Optional - use Upstash for production)
REDIS_URL=redis://localhost:6379

# Encryption Key (Auto-generated)
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# Frontend URL
FRONTEND_URL=http://localhost:5173
EOF
    echo -e "${GREEN}✅ Created .env file in root directory${NC}"
    echo -e "${YELLOW}⚠️  Please update MongoDB URI and Stripe keys in .env${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi

echo ""

# Create client .env if it doesn't exist
if [ ! -f client/.env ]; then
    cat > client/.env << EOF
# API Base URL
VITE_API_URL=http://localhost:5000

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App Configuration
VITE_APP_NAME=TableTalk
VITE_APP_URL=http://localhost:5173
EOF
    echo -e "${GREEN}✅ Created .env file in client directory${NC}"
    echo -e "${YELLOW}⚠️  Please update Stripe publishable key in client/.env${NC}"
else
    echo -e "${YELLOW}⚠️  client/.env file already exists, skipping...${NC}"
fi

echo ""

# Step 4: Summary
echo "====================================="
echo "🎉 Setup Complete!"
echo "====================================="
echo ""
echo -e "${GREEN}✅ All dependencies installed${NC}"
echo -e "${GREEN}✅ Environment files created${NC}"
echo -e "${GREEN}✅ Security keys generated${NC}"
echo ""
echo "====================================="
echo "📝 Next Steps:"
echo "====================================="
echo ""
echo "1. ⚙️  Configure your .env files:"
echo "   - Add MongoDB connection string (get from MongoDB Atlas)"
echo "   - Add Stripe API keys (get from Stripe Dashboard)"
echo "   - Update email settings (optional)"
echo ""
echo "2. 🗄️  Set up MongoDB Atlas (FREE):"
echo "   - Visit: https://www.mongodb.com/cloud/atlas"
echo "   - Create free M0 cluster"
echo "   - Get connection string"
echo "   - Update MONGODB_URI in .env"
echo ""
echo "3. 💳 Set up Stripe (FREE test mode):"
echo "   - Visit: https://dashboard.stripe.com/"
echo "   - Get test API keys (pk_test_... and sk_test_...)"
echo "   - Update STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY"
echo ""
echo "4. 🚀 Run the application:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "5. 🌐 Open your browser:"
echo "   ${GREEN}http://localhost:5173${NC}"
echo ""
echo "====================================="
echo "📚 Documentation:"
echo "====================================="
echo ""
echo "- Setup Guide:        SETUP.md"
echo "- Package Info:       REQUIRED_PACKAGES.md"
echo "- Security Guide:     SECURITY_IMPLEMENTATION.md"
echo "- Free Deployment:    FREE_TIER_GUIDE.md"
echo "- Marketing:          CUSTOMER_ATTRACTION_IMPLEMENTATION.md"
echo ""
echo "====================================="
echo "🆘 Need Help?"
echo "====================================="
echo ""
echo "Common issues:"
echo "1. Port 5000 in use? Change PORT in .env"
echo "2. MongoDB connection failed? Check connection string"
echo "3. Dependencies failed? Delete node_modules and retry"
echo ""
echo "For more help, see: SETUP.md"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
echo ""
