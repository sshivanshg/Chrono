import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { AnimatedScreen } from '../components/AnimatedScreen';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useAuth } from '../contexts/AuthContext';

export default function SignInScreen() {
  const { loading } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <AnimatedScreen>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          </View>
        </AnimatedScreen>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="default" />
      <AnimatedScreen>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Welcome to Chrono</ThemedText>
            <ThemedText style={styles.subtitle}>Sign in to manage your events</ThemedText>
          </View>

          <View style={styles.signInContainer}>
            <GoogleSignInButton />
          </View>
        </View>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  signInContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
