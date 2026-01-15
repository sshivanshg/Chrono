import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Register Android widget (only on Android)
if (Platform.OS === 'android') {
  require('../widget.setup');
}

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { EventProvider } from '../contexts/EventContext';
import { ThemeProvider as ThemeContextProvider } from '../contexts/ThemeContext';

// import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const colorScheme = useColorScheme();
  const { isSignedIn, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inSignInGroup = segments[0] === 'signin';

    if (!isSignedIn && !inSignInGroup) {
      router.replace('/signin');
    } else if (isSignedIn && inSignInGroup) {
      router.replace('/(tabs)');
    }
  }, [isSignedIn, segments, loading]);

  // useEffect(() => {
  //   if (!loading) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            paddingTop: insets.top,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="add-event" />
        <Stack.Screen name="add-date" />
        <Stack.Screen name="add-photo" />
        <Stack.Screen name="event-preview" />
        <Stack.Screen name="event-detail" />
        <Stack.Screen name="event-actions" options={{ presentation: 'transparentModal', headerShown: false }} />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="widget-preview" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}
