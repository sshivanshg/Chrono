import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api/client';

// Complete the auth session loop
WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Sign in with Google using backend authentication
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      // Google OAuth configuration - use a fixed redirect URI
      const redirectUri = 'https://auth.expo.io/@anonymous/chrono';
      
      console.log('🔍 Using redirect URI:', redirectUri);

      // Use Web client ID for OAuth flow
      const clientId = '941489768691-la2n0nd4d4g676i7sdrjdnucn0bao9t8.apps.googleusercontent.com';

      const request = new AuthSession.AuthRequest({
        clientId: clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.IdToken,
        extraParams: {
          nonce: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        },
        usePKCE: false, // Disable PKCE for mobile apps
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      console.log('🔍 Starting OAuth request...');
      const result = await request.promptAsync(discovery);
      console.log('🔍 OAuth result:', result.type);
      console.log('🔍 OAuth params:', result.params);

      if (result.type === 'success') {
        const { id_token } = result.params;
        
        if (!id_token) {
          console.error('❌ No ID token received');
          throw new Error('No ID token received');
        }

        console.log('🔍 ID token received, sending to backend...');
        
        // Send the ID token to backend for verification and user creation
        const backendUrl = 'http://localhost:3000/api/auth/google';
        console.log('🔍 Sending request to:', backendUrl);
        
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken: id_token }),
        });

        console.log('🔍 Backend response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Backend error:', errorText);
          throw new Error(`Backend error: ${response.status} - ${errorText}`);
        }

        const authResponse: AuthResponse = await response.json();
        console.log('🔍 Auth response:', authResponse);

        if (!authResponse.success || !authResponse.user || !authResponse.token) {
          console.error('❌ Authentication failed:', authResponse);
          throw new Error(authResponse.message || 'Authentication failed');
        }

        // Store the token and user data locally
        await AsyncStorage.setItem(this.TOKEN_KEY, authResponse.token);
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));

        return authResponse.user;
      } else if (result.type === 'cancel') {
        console.log('🔍 OAuth was cancelled by user');
        throw new Error('Authentication was cancelled');
      } else if (result.type === 'error') {
        console.error('❌ OAuth error:', result.error);
        throw new Error(`OAuth error: ${result.error?.message || 'Unknown error'}`);
      } else {
        console.error('❌ Unexpected OAuth result:', result);
        throw new Error('Authentication was cancelled or failed');
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
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

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      const user = await this.getCurrentUser();
      return !!(token && user);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const token = await this.getToken();
      
      // Notify backend about sign out (optional)
      if (token) {
        try {
          await fetch(`${apiClient.baseURL}/auth/signout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.warn('Failed to notify backend about sign out:', error);
        }
      }

      // Clear local storage
      await AsyncStorage.removeItem(this.TOKEN_KEY);
      await AsyncStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get authorization header for API requests
  async getAuthHeader(): Promise<{ Authorization: string } | {}> {
    try {
      const token = await this.getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
      console.error('Error getting auth header:', error);
      return {};
    }
  }
}

export default new AuthService();
