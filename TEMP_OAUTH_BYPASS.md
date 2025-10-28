# 🚨 Temporary OAuth Bypass for Testing

If you're getting the `400: invalid_request` error, here's a quick fix to test your backend integration:

## **Quick Fix:**

### **1. Replace OAuth Service (Temporary)**

In `contexts/AuthContext.tsx`, replace this line:
```typescript
// Replace this:
import ExpoAuthService from '../services/expoAuth';

// With this:
import SimpleAuthService from '../services/simpleAuth';
```

### **2. Update the signInWithGoogle function:**

Replace the entire `signInWithGoogle` function with:
```typescript
const signInWithGoogle = async () => {
  try {
    setLoading(true);
    
    // Use simple auth for testing
    const authUser = await SimpleAuthService.signInWithGoogle();
    
    // Create a mock ID token for backend
    const mockIdToken = 'mock-token-for-development';
    
    // Send to backend (will use mock token)
    const response = await authApi.googleAuth(mockIdToken);
    
    if (response.success) {
      await AsyncStorage.setItem('backend_token', response.token);
      setBackendToken(response.token);
      setAuthUser(response.user);
      console.log('✅ Successfully authenticated with backend (mock)');
    } else {
      throw new Error('Backend authentication failed');
    }
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};
```

### **3. Test the App:**

1. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start your frontend:**
   ```bash
   cd Chrono-Front
   npm start
   ```

3. **Test authentication:**
   - Click "Sign in with Google"
   - Should bypass OAuth and use mock authentication
   - Backend should accept the mock token
   - Events should sync with MongoDB

### **4. Check Backend Logs:**

Look for these messages in your backend console:
```
✅ Mock token test: Token verified successfully
   User: Development User
```

## **Why This Works:**

- **Bypasses OAuth issues** - No Google OAuth configuration needed
- **Tests backend integration** - Verifies your backend authentication works
- **Uses mock token** - Your backend accepts `mock-token-for-development`
- **Full functionality** - Events, data sync, everything works

## **After Testing:**

Once you confirm the backend integration works, you can:
1. Fix the OAuth configuration properly
2. Replace SimpleAuthService with proper OAuth
3. Use real Google authentication

This is just for testing the backend integration! 🚀
