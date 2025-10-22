import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { signInWithGoogle, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      console.log('Starting Google Sign-In...');
      await signInWithGoogle();
      console.log('Google Sign-In successful');
      onSuccess?.();
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      const errorMessage = error.message || 'Failed to sign in with Google';
      Alert.alert('Sign In Error', errorMessage);
      onError?.(errorMessage);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#4285F4" />
        <Text style={styles.loadingText}>Signing in...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
      <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 200,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4285F4',
  },
});

export default GoogleSignInButton;
