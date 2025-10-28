import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api/client';
import { environment } from '../config/environment';

// Complete the auth session loop - this is crucial for handling redirects
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
      // Google OAuth configuration
      const redirectUri = AuthSession.makeRedirectUri();
      const clientId = environment.googleSignIn.webClientId;

      const request = new AuthSession.AuthRequest({
        clientId: clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
          include_granted_scopes: 'true',
        },
        usePKCE: true, // Enable PKCE for security
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      const result = await request.promptAsync(discovery);
      
      if (result.type === 'dismiss') {
        throw new Error('Authentication was cancelled by user');
      }

      if (result.type === 'success') {
        const { code } = result.params;
        
        if (!code) throw new Error('No authorization code received');

        // Exchange authorization code for tokens via proxy (no client secret on device)
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            code,
            clientId,
            redirectUri,
            extraParams: { code_verifier: request.codeVerifier as string },
          },
          discovery
        );

        if (!tokenResponse.idToken) throw new Error('No ID token received from Google');

        // Send the ID token to backend for verification and user creation
        const backendUrl = `${environment.apiBaseUrl}/auth/google`;
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: tokenResponse.idToken }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Backend error: ${response.status} - ${errorText}`);
        }

        const authResponse: AuthResponse = await response.json();
        if (!authResponse.success || !authResponse.user || !authResponse.token) {
          throw new Error(authResponse.message || 'Authentication failed');
        }

        await AsyncStorage.setItem(this.TOKEN_KEY, authResponse.token);
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));

        return authResponse.user;
      } else if (result.type === 'cancel') {
        throw new Error('Authentication was cancelled');
      } else if (result.type === 'error') {
        throw new Error(`OAuth error: ${result.error?.message || 'Unknown error'}`);
      } else {
        throw new Error('Authentication was cancelled or failed');
      }
    } catch (error: any) {
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
          await fetch(`${environment.apiBaseUrl}/auth/signout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          // non-blocking
        }
      }

      // Clear local storage
      await AsyncStorage.removeItem(this.TOKEN_KEY);
      await AsyncStorage.removeItem(this.USER_KEY);
    } catch (error) {
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
