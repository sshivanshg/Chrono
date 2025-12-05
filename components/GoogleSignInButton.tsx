import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

      // Don't show alert if user cancelled or dismissed the sign in
      if (errorMessage.toLowerCase().includes('cancelled') ||
        errorMessage.toLowerCase().includes('dismissed')) {
        console.log('User cancelled sign in - suppressing alert');
        return;
      }

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
    <TouchableOpacity
      style={styles.button}
      onPress={handleSignIn}
      disabled={loading}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="logo-google" size={20} color="white" />
      </View>
      <Text style={styles.buttonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
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
