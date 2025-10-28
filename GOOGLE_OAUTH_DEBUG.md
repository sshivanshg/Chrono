# 🔐 Google OAuth Debug Guide

## ❌ Error: `400: invalid_request`

This error typically occurs due to OAuth configuration issues. Here are the solutions:

### **🔧 Quick Fixes:**

#### **1. Check Google Console Configuration**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 Client ID
4. Check "Authorized redirect URIs":
   - Add: `https://auth.expo.io/@your-username/chrono`
   - Add: `exp://192.168.1.100:8081` (your local IP)
   - Add: `chrono://` (your custom scheme)

#### **2. Update OAuth Client Configuration**
In your Google Console, make sure:
- **Application type**: Web application
- **Authorized JavaScript origins**: 
  - `https://auth.expo.io`
  - `exp://192.168.1.100:8081`
- **Authorized redirect URIs**:
  - `https://auth.expo.io/@your-username/chrono`
  - `exp://192.168.1.100:8081`
  - `chrono://`

#### **3. Test with Development Mode**
Temporarily use development mode in your `app.json`:
```json
{
  "expo": {
    "scheme": "chrono",
    "web": {
      "bundler": "metro"
    }
  }
}
```

### **🧪 Alternative Solutions:**

#### **Option 1: Use Simple Auth (Temporary)**
Replace the OAuth service temporarily:
```typescript
// In AuthContext.tsx, replace:
import ExpoAuthService from '../services/expoAuth';
// With:
import SimpleAuthService from '../services/simpleAuth';
```

#### **Option 2: Use Firebase Auth Directly**
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'your-web-client-id',
  offlineAccess: true,
});
```

#### **Option 3: Use Expo Google Auth**
```bash
npx expo install expo-auth-session expo-crypto
```

### **🔍 Debug Steps:**

1. **Check Console Logs:**
   ```bash
   # Look for these logs:
   🚀 Starting Google OAuth flow...
   🔗 Redirect URI: [should show proper URI]
   ❌ Error details: [specific error]
   ```

2. **Test Redirect URI:**
   - The redirect URI should match exactly what's in Google Console
   - Format: `https://auth.expo.io/@username/appname`

3. **Check Network Tab:**
   - Look for failed requests to Google OAuth
   - Check if redirect URI is being rejected

### **🚀 Quick Test:**

1. **Use Simple Auth temporarily:**
   ```typescript
   // In AuthContext.tsx
   import SimpleAuthService from '../services/simpleAuth';
   
   // Replace signInWithGoogle call:
   const authUser = await SimpleAuthService.signInWithGoogle();
   ```

2. **Test the app:**
   - Should bypass OAuth issues
   - Will use mock authentication
   - Backend integration will still work

### **📱 Production Fix:**

For production, you'll need to:
1. Set up proper Google OAuth credentials
2. Configure redirect URIs correctly
3. Use the proper OAuth flow

The simple auth is just for testing the backend integration!
