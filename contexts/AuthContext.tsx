import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AuthService, { AuthUser } from '../services/authService';

// Temporary bypass flag: set to true to skip auth screen
const BYPASS_AUTH = true;

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporary bypass: immediately set a mock user and skip real auth
    if (BYPASS_AUTH) {
      const mockUser: AuthUser = {
        uid: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
      };
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Check if user is already authenticated
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        
        // Normal authentication check
        
        const isAuthenticated = await AuthService.isAuthenticated();
        
        if (isAuthenticated) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const user = await AuthService.signInWithGoogle();
      setUser(user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isSignedIn: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
