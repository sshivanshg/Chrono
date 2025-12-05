import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

// Complete the auth session loop - this is crucial for handling redirects
WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  // Sign in with Email and Password
  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned');

      return this.mapSupabaseUser(data.user);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  // Sign up with Email and Password
  async signUpWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user returned');

      return this.mapSupabaseUser(data.user);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  }

  // Get stored user data
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;
      return this.mapSupabaseUser(session.user);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

  // Get authorization header
  async getAuthHeader(): Promise<{ Authorization: string } | {}> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token ? { Authorization: `Bearer ${session.access_token} ` } : {};
    } catch (error) {
      console.error('Error getting auth header:', error);
      return {};
    }
  }

  // Helper to map Supabase user to our AuthUser interface
  private mapSupabaseUser(user: any): AuthUser {
    return {
      uid: user.id,
      email: user.email || null,
      displayName: user.user_metadata?.full_name || user.user_metadata?.name || null,
      photoURL: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    };
  }
}

export default new AuthService();
