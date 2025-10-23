# 🎨 Dinner Stranger Booking - Frontend

React TypeScript frontend for the Dinner Stranger Booking platform.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Query** - Server state management
- **Zustand** - Client state management
- **Stripe Elements** - Payment processing
- **date-fns** - Date utilities
- **React Icons** - Icon library

## 📁 Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loader.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── features/
│   │       ├── EventCard.tsx
│   │       ├── PersonalityQuiz.tsx
│   │       └── StripeCheckout.tsx
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Events.tsx
│   │   ├── EventDetails.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── Bookings.tsx
│   │   └── PersonalityQuiz.tsx
│   ├── services/          # API service layer
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── events.service.ts
│   │   ├── bookings.service.ts
│   │   └── personality.service.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   ├── useBookings.ts
│   │   └── usePersonality.ts
│   ├── store/             # Zustand stores
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── types/             # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── event.types.ts
│   │   ├── booking.types.ts
│   │   └── personality.types.ts
│   ├── utils/             # Utility functions
│   │   ├── formatDate.ts
│   │   ├── formatCurrency.ts
│   │   └── validators.ts
│   ├── styles/            # Global styles
│   │   └── index.css
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── vite-env.d.ts      # Vite types
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Setup & Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### API Endpoints Used:

**Auth**
- POST /auth/register
- POST /auth/login
- GET /auth/me
- PUT /auth/updateprofile

**Events**
- GET /events (with filters)
- GET /events/:id
- POST /events (host only)

**Bookings**
- GET /bookings
- POST /bookings/create-payment-intent
- POST /bookings
- PUT /bookings/:id/cancel

**Personality**
- POST /personality/quiz
- GET /personality/matches/:eventId

## 🎯 Key Features to Implement

### 1. Authentication Flow
- Login/Register forms with validation
- Protected routes using React Router
- JWT token management
- Auto-refresh tokens

### 2. Event Browsing
- Event list with filters (city, date, status)
- Event cards with details
- Pagination
- Search functionality

### 3. Event Details & Booking
- Event information display
- Attendee list with compatibility scores
- Stripe payment integration
- Booking confirmation

### 4. Personality Quiz
- Multi-step form
- Trait selection UI
- Progress indicator
- Results display

### 5. User Dashboard
- Upcoming bookings
- Past events
- Profile management
- Booking cancellations

### 6. Stripe Integration
- Payment form using Stripe Elements
- Card validation
- Payment processing
- Success/Error handling

## 🎨 Styling Approach

Use Tailwind CSS or styled-components for styling:

```tsx
// Example with Tailwind
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Book Event
</button>
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Responsive navigation
- Touch-friendly UI elements

## 🔐 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## 🚧 Development Status

**Frontend Structure: INITIALIZED**
- ✅ Package.json created
- ✅ Dependencies configured
- ⏳ Component structure defined
- ⏳ Pages to be implemented
- ⏳ Services to be implemented
- ⏳ Routing to be configured

**Next Steps:**
1. Create Vite configuration
2. Set up TypeScript config
3. Create main.tsx entry point
4. Build App.tsx with routing
5. Implement authentication pages
6. Build event browsing UI
7. Integrate Stripe checkout
8. Add personality quiz
9. Create user dashboard

## 📚 Resources

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Stripe React](https://stripe.com/docs/stripe-js/react)

## 🤝 Contributing

The frontend is ready for development! Follow the structure above to implement each feature.
