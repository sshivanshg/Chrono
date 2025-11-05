import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { EventProvider } from '../contexts/EventContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const colorScheme = useColorScheme();
  const { isSignedIn, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="add-event" />
            <Stack.Screen name="add-date" />
            <Stack.Screen name="add-photo" />
            <Stack.Screen name="event-preview" />
            <Stack.Screen name="event-detail" />
            <Stack.Screen name="calendar" />
          </>
        ) : (
          <Stack.Screen name="signin" />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </AuthProvider>
  );
}
