# Dinner Stranger Booking - Development Guide

## 🎯 Project Overview
A full-stack web application connecting strangers for meaningful dinner experiences using personality-based matching algorithms.

## ✅ Completed Components

### 1. Configuration Files
- ✅ `package.json` - Root dependencies and scripts
- ✅ `.env.example` - Environment variables template
- ✅ `.gitignore` - Git ignore rules
- ✅ `LICENSE` - MIT License
- ✅ `README.md` - Project documentation

### 2. Backend Server
- ✅ `server/index.js` - Express server with middleware, routes, and database connection

## 📋 Remaining Development Tasks

### Backend Structure

#### Database Models (server/models/)
Create MongoDB schemas:
- `User.js` - User authentication and profile
- `PersonalityProfile.js` - Personality assessment results
- `Event.js` - Dinner event details
- `Booking.js` - User bookings and attendance
- `Match.js` - Personality matching records

#### API Routes (server/routes/)
- `auth.js` - Registration, login, JWT authentication
- `users.js` - User profile CRUD operations
- `personality.js` - Personality quiz and results
- `events.js` - Event creation and management
- `bookings.js` - Booking system
- `payments.js` - Stripe payment integration

#### Middleware (server/middleware/)
- `auth.js` - JWT verification middleware
- `validation.js` - Input validation
- `errorHandler.js` - Centralized error handling

#### Controllers (server/controllers/)
- `authController.js`
- `userController.js`
- `personalityController.js`
- `eventController.js`
- `bookingController.js`
- `paymentController.js`

### Frontend Application (client/)

#### Setup
```bash
npx create-react-app client --template typescript
cd client
npm install axios react-router-dom @stripe/react-stripe-js stripe
npm install -D @types/react-router-dom
```

#### Directory Structure
```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── Quiz/
│   │   │   ├── PersonalityQuiz.tsx
│   │   │   └── QuizQuestion.tsx
│   │   ├── Events/
│   │   │   ├── EventList.tsx
│   │   │   ├── EventDetail.tsx
│   │   │   └── EventCard.tsx
│   │   ├── Booking/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── Profile/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── EditProfile.tsx
│   │   │   └── MyBookings.tsx
│   │   └── Common/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── Loading.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── eventService.ts
│   │   └── bookingService.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
└── package.json
```

### Python Matching Service (matching-service/)

#### Setup
```bash
mkdir matching-service
cd matching-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install flask flask-cors pandas scikit-learn numpy
```

#### Files Needed
- `app.py` - Flask API server
- `matcher.py` - Personality matching algorithm using ML
- `requirements.txt` - Python dependencies

### Database Schema Examples

#### User Model
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: String,
  bio: String,
  age: Number,
  location: { city: String, country: String },
  personalityProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'PersonalityProfile' },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

#### Event Model
```javascript
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  restaurant: {
    name: String,
    address: String,
    cuisine: String
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  maxAttendees: { type: Number, default: 6 },
  currentAttendees: { type: Number, default: 0 },
  price: { type: Number, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['upcoming', 'full', 'completed', 'cancelled'], default: 'upcoming' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
```

## 🚀 Quick Start Development

### 1. Clone and Install
```bash
git clone https://github.com/ramji3030/dinner-stranger-booking.git
cd dinner-stranger-booking
npm run install-all
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your credentials:
- MongoDB connection string
- JWT secret
- Stripe API keys
- Other service credentials

### 3. Run Development Servers
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client

# Terminal 3: Python matching service
cd matching-service
python app.py
```

## 🔑 Key Features to Implement

### 1. Authentication System
- User registration with email verification
- JWT-based authentication
- Password reset functionality
- Protected routes

### 2. Personality Quiz
- 20-30 question assessment
- Big Five personality traits or custom model
- Store results in PersonalityProfile model
- Use for matching algorithm

### 3. Matching Algorithm
- Calculate compatibility scores
- Consider personality traits, interests, age range
- Optimize group dynamics (diverse but compatible)
- Python/scikit-learn for ML-based matching

### 4. Booking & Payment
- Stripe payment integration
- Booking confirmation emails
- Cancellation policy
- Refund handling

### 5. Event Management
- Create and manage dinner events
- Location-based event discovery
- Filter by date, cuisine, price
- Real-time availability updates

## 📦 Dependencies Summary

### Backend
- express, mongoose, cors, helmet
- jsonwebtoken, bcryptjs
- stripe, validator, dotenv

### Frontend
- react, typescript
- react-router-dom
- axios
- @stripe/react-stripe-js

### Python Service
- flask, flask-cors
- pandas, scikit-learn, numpy

## 🧪 Testing
- Create test files in `__tests__/` directories
- Use Jest for backend testing
- Use React Testing Library for frontend

## 🚢 Deployment

### Backend
- Deploy to Heroku, Railway, or AWS
- Set environment variables
- Configure MongoDB Atlas

### Frontend
- Deploy to Vercel, Netlify, or AWS S3
- Update API endpoints to production URLs

### Python Service
- Deploy to Heroku or AWS Lambda
- Update matching service URL in backend

## 📚 Additional Resources
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [scikit-learn Documentation](https://scikit-learn.org/)

## 🤝 Contributing
Follow the standard Git workflow:
1. Create a feature branch
2. Make changes
3. Write tests
4. Submit pull request

## ⚠️ Current Status
The application foundation has been established with:
- Project structure defined
- Backend server initialized
- Configuration files in place

**Next immediate steps:**
1. Create database models
2. Implement authentication routes
3. Set up React frontend
4. Build personality quiz
5. Develop matching algorithm

---
**Last Updated:** Today
**Version:** 0.1.0 (In Development)
