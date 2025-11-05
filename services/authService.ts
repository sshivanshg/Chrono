import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
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
      // Google OAuth configuration
      const useProxy = Constants.appOwnership === 'expo'; // Use proxy in Expo Go
      // When using Expo Go proxy, do not pass a custom scheme to avoid mismatches
      const redirectUri = useProxy
        ? AuthSession.makeRedirectUri({ useProxy: true })
        : AuthSession.makeRedirectUri({ scheme: 'chrono' });
      const clientId = environment.googleSignIn.webClientId;

      const request = new AuthSession.AuthRequest({
        clientId: clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        // In Expo Go, request an ID token directly to avoid client_secret/code exchange
        responseType: useProxy ? (AuthSession.ResponseType as any).IdToken : AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
          include_granted_scopes: 'true',
          ...(useProxy ? { response_mode: 'fragment', nonce: String(Date.now()) } : {}),
        },
        usePKCE: !useProxy, // PKCE only needed for code flow
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      console.log('[Auth] redirectUri =>', redirectUri);
      console.log('[Auth] useProxy =>', useProxy);
      console.log('[Auth] clientId (web) =>', clientId?.slice(0, 8) + '...');
      const result = await request.promptAsync(discovery, { useProxy });
      
      if (result.type === 'dismiss') {
        throw new Error('Authentication was cancelled by user');
      }

      if (result.type === 'success') {
        let idToken: string | undefined;
        if (useProxy) {
          idToken = (result.params as any)?.id_token;
          if (!idToken) throw new Error('No ID token returned in proxy flow');
        } else {
          const { code } = result.params;
          if (!code) throw new Error('No authorization code received');
          // Exchange authorization code for tokens
          let tokenResponse;
          try {
            tokenResponse = await AuthSession.exchangeCodeAsync(
              {
                code,
                clientId,
                redirectUri,
                extraParams: { code_verifier: request.codeVerifier as string },
              },
              discovery
            );
          } catch (tokenErr: any) {
            console.error('❌ Token exchange error:', tokenErr);
            throw new Error(tokenErr?.message || 'Failed to exchange authorization code');
          }
          if (!tokenResponse.idToken) throw new Error('No ID token received from Google');
          idToken = tokenResponse.idToken;
        }

        // Decode ID token to get user info (no backend needed)
        const decodedToken: any = jwtDecode(idToken as string);
        
        const user: AuthUser = {
          uid: decodedToken.sub || decodedToken.user_id || `google_${Date.now()}`,
          email: decodedToken.email || null,
          displayName: decodedToken.name || decodedToken.given_name || null,
          photoURL: decodedToken.picture || null,
        };

        // Store user data and ID token locally
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
        await AsyncStorage.setItem(this.ID_TOKEN_KEY, idToken as string);

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
