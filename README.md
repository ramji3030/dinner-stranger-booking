# dinner-stranger-booking
Book your seat and meet 5 strangers over dinner - all matched by our personality algorithm

## 🎯 Overview

A modern web application that brings strangers together for meaningful dinner experiences. Using advanced personality matching algorithms, we create diverse groups of 6 people who will have engaging conversations and create memorable connections.

## ✨ Features

- **Smart Matching Algorithm**: Our AI-powered personality assessment matches you with 5 compatible strangers
- **Easy Booking**: Simple, intuitive interface to reserve your seat at upcoming dinners
- **Personality Quiz**: Complete a fun questionnaire to help us understand your preferences
- **Diverse Groups**: Meet people from different backgrounds, professions, and interests
- **Safe & Verified**: All participants are verified for a secure dining experience
- **Location-Based**: Find dinners in your city or explore new locations

## 🚀 Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT-based auth
- **Matching Algorithm**: Python-based ML model
- **Payment**: Stripe integration

## 📋 Getting Started

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
mongodb >= 6.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/ramji3030/dinner-stranger-booking.git

# Navigate to project directory
cd dinner-stranger-booking

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_API_KEY=your_stripe_api_key
```

## 📱 Usage

1. Sign up and create your profile
2. Complete the personality assessment (10-15 minutes)
3. Browse available dinner events in your area
4. Book your seat at a dinner
5. Receive match details 24 hours before the event
6. Enjoy your dinner with 5 new friends!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or support, please open an issue or contact us at support@dinnerstrangers.com
