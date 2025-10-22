import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  private isConfigured = false;

  // Initialize Google Sign-In
  async initializeGoogleSignIn() {
    if (this.isConfigured) {
      return;
    }
    
    try {
      await GoogleSignin.configure({
        webClientId: '941489768691-la2n0nd4d4g676i7sdrjdnucn0bao9t8.apps.googleusercontent.com',
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
      this.isConfigured = true;
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      throw error;
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      // Ensure Google Sign-In is configured
      await this.initializeGoogleSignIn();
      
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users ID token
      const userInfo = await GoogleSignin.signIn();
      
      console.log('Google Sign-In response:', JSON.stringify(userInfo, null, 2));
      
      // The response structure from GoogleSignin.signIn()
      // userInfo has the structure: { data: { idToken: string, user: GoogleUser } }
      let idToken: string;
      
      if (userInfo.data && userInfo.data.idToken) {
        // Response format: { data: { idToken: string } }
        idToken = userInfo.data.idToken;
      } else if ((userInfo as any).idToken) {
        // Response format: { idToken: string }
        idToken = (userInfo as any).idToken;
      } else {
        console.error('Unexpected Google Sign-In response structure:', userInfo);
        throw new Error('No ID token received from Google Sign-In');
      }
      
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      const result = await signInWithCredential(auth, googleCredential);
      const user = result.user;
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        throw new Error('Sign in required');
      } else {
        throw new Error(error.message || 'Failed to sign in with Google');
      }
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Check if user is signed in
  isSignedIn(): boolean {
    return auth.currentUser !== null;
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

export default new AuthService();
