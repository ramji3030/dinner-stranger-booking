# Required Packages for Dinner Stranger Booking Application

This document lists all the packages you need to install for your dinner stranger booking application, including both existing packages and additional ones needed for the new features we implemented.

## 📦 Current Packages (Already Installed)

### Root Package.json Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",        // Web server framework
    "mongoose": "^7.5.0",       // MongoDB ODM
    "bcryptjs": "^2.4.3",       // Password hashing
    "jsonwebtoken": "^9.0.2",   // JWT authentication
    "cors": "^2.8.5",           // Cross-origin requests
    "dotenv": "^16.3.1",        // Environment variables
    "stripe": "^13.5.0",        // Payment processing
    "axios": "^1.5.0",          // HTTP client
    "validator": "^13.11.0",    // Data validation
    "express-validator": "^7.0.1", // Express validation middleware
    "helmet": "^7.0.0",         // Security headers
    "morgan": "^1.10.0"         // Request logging
  },
  "devDependencies": {
    "nodemon": "^3.0.1",        // Development server
    "concurrently": "^8.2.1",   // Run multiple commands
    "jest": "^29.6.4",          // Testing framework
    "@types/node": "^20.5.9"    // Node.js TypeScript types
  }
}
```

### Client Package.json Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",                    // React framework
    "react-dom": "^18.2.0",               // React DOM rendering
    "react-router-dom": "^6.20.0",        // Client-side routing
    "axios": "^1.6.2",                    // HTTP client
    "@stripe/stripe-js": "^2.2.0",        // Stripe JavaScript SDK
    "@stripe/react-stripe-js": "^2.4.0",  // Stripe React components
    "react-query": "^3.39.3",             // Data fetching library
    "zustand": "^4.4.7",                  // State management
    "date-fns": "^2.30.0",                // Date utilities
    "react-icons": "^4.12.0"              // Icon library
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/node": "^20.10.4",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.7",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

## 🆕 Additional Packages Needed for New Features

### Root Server - Additional Dependencies

```bash
# Security features
npm install express-rate-limit@^7.1.5    # Rate limiting
npm install express-mongo-sanitize@^2.2.0 # MongoDB injection prevention
npm install xss@^1.0.14                  # XSS protection
npm install speakeasy@^2.0.0              # 2FA (TOTP)
npm install qrcode@^1.5.3                 # QR code generation for 2FA
npm install crypto@^1.0.1                 # Encryption utilities (Node.js built-in)
npm install winston@^3.11.0               # Logging
npm install @sentry/node@^7.86.0          # Error monitoring

# Image upload and processing
npm install multer@^1.4.5-lts.1           # File upload handling
npm install sharp@^0.33.1                 # Image processing/optimization
npm install cloudinary@^1.41.0            # Cloud image storage (optional)

# Email services
npm install nodemailer@^6.9.7             # Email sending
npm install @sendgrid/mail@^8.1.0          # SendGrid email service (optional)

# Additional utilities
npm install cron@^3.1.6                   # Scheduled tasks
npm install socket.io@^4.7.4              # Real-time features (optional)
npm install redis@^4.6.10                 # Caching and sessions
```

### Client Frontend - Additional Dependencies

```bash
# UI/UX enhancements
npm install @tailwindcss/forms@^0.5.7     # Tailwind CSS form styles
npm install @headlessui/react@^1.7.17     # Accessible UI components
npm install framer-motion@^10.16.16       # Animations
npm install react-hot-toast@^2.4.1        # Toast notifications
npm install react-confetti@^6.1.0         # Celebration effects

# Image handling
npm install react-dropzone@^14.2.3        # Drag & drop file upload
npm install react-image-crop@^10.1.8      # Image cropping
npm install react-webcam@^7.2.0           # Camera access

# Form handling
npm install react-hook-form@^7.48.2       # Form management
npm install @hookform/resolvers@^3.3.2    # Form validation resolvers
npm install yup@^1.4.0                    # Schema validation

# Maps and location (optional)
npm install @react-google-maps/api@^2.19.2 # Google Maps integration

# PWA features
npm install workbox-webpack-plugin@^7.0.0  # Service worker
npm install @vite-pwa/vite-plugin@^0.17.4  # PWA plugin for Vite

# Development tools
npm install @tailwindcss/typography@^0.5.10 # Tailwind typography
npm install autoprefixer@^10.4.16         # CSS autoprefixer
npm install tailwindcss@^3.3.6            # Tailwind CSS
```

## 📋 Installation Commands

### Quick Install All Packages

```bash
# Navigate to project root
cd dinner-stranger-booking

# Install root dependencies
npm install

# Install additional server packages
npm install express-rate-limit express-mongo-sanitize xss speakeasy qrcode winston @sentry/node multer sharp nodemailer cron redis

# Navigate to client and install
cd client
npm install

# Install additional client packages
npm install @tailwindcss/forms @headlessui/react framer-motion react-hot-toast react-confetti react-dropzone react-image-crop react-hook-form @hookform/resolvers yup @vite-pwa/vite-plugin tailwindcss autoprefixer @tailwindcss/typography

# Setup Tailwind CSS (run from client directory)
npx tailwindcss init -p
```

### Alternative: Install with Specific Versions

```bash
# Root server packages
npm install express-rate-limit@^7.1.5 express-mongo-sanitize@^2.2.0 xss@^1.0.14 speakeasy@^2.0.0 qrcode@^1.5.3 winston@^3.11.0 @sentry/node@^7.86.0 multer@^1.4.5-lts.1 sharp@^0.33.1 nodemailer@^6.9.7 cron@^3.1.6 redis@^4.6.10

# Client packages
cd client
npm install @tailwindcss/forms@^0.5.7 @headlessui/react@^1.7.17 framer-motion@^10.16.16 react-hot-toast@^2.4.1 react-confetti@^6.1.0 react-dropzone@^14.2.3 react-image-crop@^10.1.8 react-hook-form@^7.48.2 @hookform/resolvers@^3.3.2 yup@^1.4.0 @vite-pwa/vite-plugin@^0.17.4 tailwindcss@^3.3.6 autoprefixer@^10.4.16 @tailwindcss/typography@^0.5.10
```

## 🎯 Package Categories by Feature

### Authentication & Security
- `bcryptjs` - Password hashing ✅ Already installed
- `jsonwebtoken` - JWT tokens ✅ Already installed  
- `speakeasy` - 2FA TOTP ⚠️ Need to install
- `qrcode` - QR codes for 2FA setup ⚠️ Need to install
- `express-rate-limit` - Rate limiting ⚠️ Need to install
- `helmet` - Security headers ✅ Already installed
- `express-mongo-sanitize` - MongoDB injection prevention ⚠️ Need to install
- `xss` - XSS protection ⚠️ Need to install

### Payment Processing
- `stripe` - Payment processing ✅ Already installed
- `@stripe/stripe-js` - Stripe frontend ✅ Already installed
- `@stripe/react-stripe-js` - Stripe React components ✅ Already installed

### Database & Caching
- `mongoose` - MongoDB ODM ✅ Already installed
- `redis` - Caching and sessions ⚠️ Need to install

### File Upload & Image Processing
- `multer` - File upload handling ⚠️ Need to install
- `sharp` - Image processing ⚠️ Need to install
- `react-dropzone` - Drag & drop uploads ⚠️ Need to install
- `react-image-crop` - Image cropping ⚠️ Need to install

### Email & Notifications
- `nodemailer` - Email sending ⚠️ Need to install
- `react-hot-toast` - Toast notifications ⚠️ Need to install

### UI/UX Enhancements
- `react` - React framework ✅ Already installed
- `react-router-dom` - Routing ✅ Already installed
- `react-icons` - Icons ✅ Already installed
- `@headlessui/react` - Accessible components ⚠️ Need to install
- `framer-motion` - Animations ⚠️ Need to install
- `react-confetti` - Celebration effects ⚠️ Need to install
- `tailwindcss` - Utility-first CSS ⚠️ Need to install

### Form Handling & Validation
- `validator` - Data validation ✅ Already installed
- `express-validator` - Express validation ✅ Already installed
- `react-hook-form` - Form management ⚠️ Need to install
- `yup` - Schema validation ⚠️ Need to install

### Monitoring & Logging
- `morgan` - Request logging ✅ Already installed
- `winston` - Application logging ⚠️ Need to install
- `@sentry/node` - Error monitoring ⚠️ Need to install

### PWA & Offline Features
- `@vite-pwa/vite-plugin` - PWA support ⚠️ Need to install
- `workbox-webpack-plugin` - Service workers ⚠️ Optional

### Development Tools
- `nodemon` - Development server ✅ Already installed
- `concurrently` - Run multiple commands ✅ Already installed
- `vite` - Build tool ✅ Already installed
- `typescript` - TypeScript support ✅ Already installed
- `jest` - Testing framework ✅ Already installed

## 🚀 Next Steps

1. **Install missing packages** using the commands above
2. **Configure Tailwind CSS** in your client application
3. **Set up environment variables** for new services (Redis, email, etc.)
4. **Update your implementation files** to use these new packages
5. **Test all features** to ensure packages work correctly

## 💡 Optional Packages for Future Enhancements

```bash
# Advanced features (install later if needed)
npm install socket.io@^4.7.4              # Real-time chat/notifications
npm install @react-google-maps/api@^2.19.2 # Google Maps integration
npm install cloudinary@^1.41.0            # Cloud image storage
npm install @sendgrid/mail@^8.1.0          # SendGrid email service
npm install react-webcam@^7.2.0           # Camera/photo capture
```

---

**Status:** ✅ Package list complete - Ready for installation!

**Total additional packages to install:** ~20 packages

**Estimated installation time:** 2-3 minutes

**Next file to check:** Update package.json files with these dependencies
