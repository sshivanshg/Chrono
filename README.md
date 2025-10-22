# Chrono - Time Management App

A modern time management and productivity tracking application built with React Native and Expo.

## 🏗️ Project Structure

```
Chrono/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screens
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── GoogleSignInButton.tsx
│   └── UserProfile.tsx
├── config/                # Configuration files
│   ├── firebase.ts        # Firebase configuration
│   └── environment.ts      # Environment settings
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── services/              # Business logic and API services
│   ├── api/               # API client and services
│   │   ├── client.ts      # HTTP client
│   │   ├── endpoints.ts   # API endpoints
│   │   ├── tasks.ts       # Task API service
│   │   ├── timeTracking.ts # Time tracking API service
│   │   └── index.ts       # API exports
│   ├── auth.ts            # Authentication service
│   └── expoAuth.ts        # Expo AuthSession service
├── types/                 # TypeScript type definitions
│   └── index.ts           # Core types
├── assets/                # Static assets
└── hooks/                 # Custom React hooks
```

## 🚀 Frontend-Backend Separation

This project is designed for independent deployment:

### Frontend (This Repository)
- **Framework**: React Native with Expo
- **State Management**: React Context + Hooks
- **API Communication**: RESTful API client
- **Authentication**: Firebase Auth + Google Sign-In
- **Deployment**: Expo Application Services (EAS)

### Backend (Separate Repository)
- **Framework**: Node.js/Express or Python/FastAPI
- **Database**: Firebase Firestore or PostgreSQL
- **Authentication**: JWT tokens
- **API**: RESTful endpoints
- **Deployment**: Vercel, Railway, or AWS

## 📱 Features

### Core Functionality
- ✅ **User Authentication** - Google Sign-In integration
- ✅ **Task Management** - Create, update, delete tasks
- ✅ **Time Tracking** - Start/stop time entries
- ✅ **Categories** - Organize tasks by categories
- ✅ **Projects** - Group related tasks
- ✅ **Pomodoro Timer** - Focus sessions with breaks
- ✅ **Analytics** - Productivity insights and reports
- ✅ **Goals** - Set and track productivity goals
- ✅ **Notifications** - Reminders and alerts

### Technical Features
- 🔄 **Offline Support** - Works without internet
- 📊 **Real-time Sync** - Live updates across devices
- 🎨 **Dark/Light Theme** - User preference support
- 📱 **Cross-platform** - iOS, Android, and Web
- 🔒 **Secure** - Firebase authentication and encryption

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd Chrono
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy environment template
   cp config/environment.example.ts config/environment.ts
   # Edit with your API endpoints and Firebase config
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

### Environment Configuration

Update `config/environment.ts` with your settings:

```typescript
export const development: Environment = {
  apiBaseUrl: 'http://localhost:3000/api', // Your backend URL
  firebase: {
    // Your Firebase config
  },
  googleSignIn: {
    webClientId: 'your-web-client-id',
  },
  features: {
    analytics: true,
    notifications: true,
    offlineMode: true,
  },
};
```

## 🔌 API Integration

The frontend communicates with your backend through a well-defined API:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### Tasks
- `GET /tasks` - List tasks with filters
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Time Tracking
- `GET /time-entries` - List time entries
- `POST /time-entries/start` - Start tracking
- `POST /time-entries/stop` - Stop tracking
- `GET /time-entries/stats` - Get statistics

## 📦 Deployment

### Frontend Deployment (EAS Build)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform android
eas build --platform ios

# Submit to app stores
eas submit --platform android
eas submit --platform ios
```

### Backend Deployment
Deploy your backend API to your preferred platform:
- **Vercel** - For serverless functions
- **Railway** - For containerized apps
- **AWS** - For scalable infrastructure
- **Heroku** - For simple deployments

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📚 API Documentation

The API follows RESTful conventions:

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-api-domain.com/api`

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team