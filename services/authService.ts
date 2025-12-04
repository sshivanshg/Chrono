import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';
import { environment } from '../config/environment';

// Complete the auth session loop - this is crucial for handling redirects
WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  private readonly USER_KEY = 'auth_user';
  private readonly ID_TOKEN_KEY = 'google_id_token';

  // Sign in with Google (local only, no backend)
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      let redirectUri = AuthSession.makeRedirectUri({
        path: 'signin',
      });

      if (Platform.OS !== 'web') {
        // Force Expo Auth Proxy for Expo Go to avoid 'exp://' which Google rejects
        redirectUri = 'https://auth.expo.io/@shivansh_11/Chrono';
      }

      console.log('------------------------------------------------');
      console.log('PLEASE ADD THIS URI TO GOOGLE CLOUD CONSOLE:');
      console.log(redirectUri);
      console.log('------------------------------------------------');

      const request = new AuthSession.AuthRequest({
        clientId: environment.googleSignIn.webClientId,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.IdToken,
        usePKCE: false, // Google rejects PKCE for Implicit Flow (id_token)
        extraParams: {
          nonce: Math.random().toString(36).substring(7),
        },
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      console.log('[Auth] redirectUri =>', redirectUri);
      const result = await request.promptAsync(discovery);

      if (result.type === 'dismiss') {
        throw new Error('Authentication was cancelled by user');
      }

      if (result.type === 'success') {
        const idToken = result.params.id_token;
        if (!idToken) throw new Error('No ID token returned');

        // Decode ID token to get user info (no backend needed)
        const decodedToken: any = jwtDecode(idToken);

        const user: AuthUser = {
          uid: decodedToken.sub || decodedToken.user_id || `google_${Date.now()}`,
          email: decodedToken.email || null,
          displayName: decodedToken.name || decodedToken.given_name || null,
          photoURL: decodedToken.picture || null,
        };

        // Store user data and ID token locally
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
        await AsyncStorage.setItem(this.ID_TOKEN_KEY, idToken);

        return user;
      } else if (result.type === 'cancel') {
        throw new Error('Authentication was cancelled');
      } else if (result.type === 'error') {
        console.error('❌ OAuth error details:', result);
        throw new Error(`OAuth error: ${result.error?.message || result.params?.error_description || 'Unknown error'}`);
      } else {
        throw new Error('Authentication was cancelled or failed');
      }
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  // Get stored user data
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      // Clear local storage
      await AsyncStorage.removeItem(this.USER_KEY);
      await AsyncStorage.removeItem(this.ID_TOKEN_KEY);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

  // Get authorization header (for future backend integration)
  async getAuthHeader(): Promise<{ Authorization: string } | {}> {
    try {
      const idToken = await AsyncStorage.getItem(this.ID_TOKEN_KEY);
      return idToken ? { Authorization: `Bearer ${idToken}` } : {};
    } catch (error) {
      console.error('Error getting auth header:', error);
      return {};
    }
  }
}

export default new AuthService();
