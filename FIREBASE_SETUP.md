# Firebase Google Authentication Setup Guide

## 🚨 Important: Complete These Steps Before Testing

### 1. Firebase Console Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `chrono-d649f`
3. **Enable Google Authentication**:
   - Go to "Authentication" > "Sign-in method"
   - Enable "Google" provider
   - Add your package name: `com.shivansh.chrono`
   - Save the configuration

4. **Get Web Client ID**:
   - In the Google sign-in configuration, copy the "Web client ID"
   - Update `Chrono/services/auth.ts` line 9 and 27:
   ```typescript
   webClientId: '941489768691-YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com'
   ```

### 2. Update Configuration Files

Update the web client ID in these files:
- `Chrono/services/auth.ts` (lines 9 and 27)

### 3. Run the Project

```bash
cd Chrono
npm start
```

## What's Been Set Up

✅ **Dependencies Installed**:
- `@react-native-google-signin/google-signin`
- `expo-auth-session`
- `expo-crypto`
- `@react-native-async-storage/async-storage`
- Firebase packages (already in package.json)

✅ **Files Created/Modified**:
- `config/firebase.ts` - Firebase configuration
- `services/auth.ts` - Authentication service
- `contexts/AuthContext.tsx` - React context for auth state
- `components/GoogleSignInButton.tsx` - Sign-in button component
- `components/UserProfile.tsx` - User profile display component
- `app/_layout.tsx` - Added AuthProvider wrapper
- `app/(tabs)/index.tsx` - Added auth UI
- `app.json` - Added Firebase plugins

## How to Use

### In Components:
```typescript
import { useAuth } from '../contexts/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

function MyComponent() {
  const { isSignedIn, user, signOut } = useAuth();
  
  return (
    <View>
      {isSignedIn ? (
        <Text>Welcome, {user?.displayName}!</Text>
      ) : (
        <GoogleSignInButton />
      )}
    </View>
  );
}
```

### Sign In/Sign Out:
```typescript
const { signInWithGoogle, signOut } = useAuth();

// Sign in
await signInWithGoogle();

// Sign out
await signOut();
```

## Troubleshooting

1. **"Web client ID not found"**: Make sure you've updated the webClientId in `services/auth.ts`
2. **"Play Services not available"**: Make sure you're testing on a physical Android device or emulator with Google Play Services
3. **"Sign in cancelled"**: User cancelled the sign-in flow - this is normal behavior

## Project Structure
```
Chrono/
├── config/
│   └── firebase.ts          # Firebase initialization
├── services/
│   └── auth.ts              # Authentication service
├── contexts/
│   └── AuthContext.tsx      # Auth React context
├── components/
│   ├── GoogleSignInButton.tsx
│   └── UserProfile.tsx
└── app/
    ├── _layout.tsx          # Root layout with AuthProvider
    └── (tabs)/index.tsx     # Main screen with auth UI
```


