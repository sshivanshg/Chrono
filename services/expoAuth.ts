import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';

// Complete the auth session loop
WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class ExpoAuthService {
  // Sign in with Google using Expo AuthSession
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      // Google OAuth configuration
      const redirectUri = AuthSession.makeRedirectUri({ 
        useProxy: true,
        scheme: 'chrono'
      });

      const clientId = '941489768691-la2n0nd4d4g676i7sdrjdnucn0bao9t8.apps.googleusercontent.com';

      const request = new AuthSession.AuthRequest({
        clientId: clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.IdToken,
        extraParams: {},
      });

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        const { id_token } = result.params;
        
        if (!id_token) {
          throw new Error('No ID token received');
        }

        // Create Firebase credential with the Google ID token
        const credential = GoogleAuthProvider.credential(id_token);
        
        // Sign in to Firebase with the credential
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
      } else {
        throw new Error('Authentication was cancelled or failed');
      }
    } catch (error: any) {
      console.error('Error signing in with Google (Expo AuthSession):', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
}

export default new ExpoAuthService();


