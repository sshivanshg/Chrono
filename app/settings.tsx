import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AnimatedScreen } from '../components/AnimatedScreen';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      setShowLogoutConfirm(false);
      router.replace('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Blurred Background */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop' }}
        style={styles.backgroundImage}
        blurRadius={20}
      />
      <LinearGradient
        colors={['rgba(245, 245, 245, 0.85)', 'rgba(255, 255, 255, 0.95)']}
        style={styles.backgroundOverlay}
      />

      <AnimatedScreen>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Exclusive Offer Card */}
          <View style={styles.offerCard}>
            <View style={styles.offerIconContainer}>
              <View style={styles.offerIconCircle}>
                <Ionicons name="gift" size={24} color="#4A90E2" />
              </View>
            </View>
            <View style={styles.offerContent}>
              <Text style={styles.offerText}>An exclusive offer, just for you</Text>
              <View style={styles.daysBadge}>
                <Text style={styles.daysBadgeText}>3 days remaining</Text>
              </View>
            </View>
          </View>

          {/* Chrono Pro Card */}
          <View style={styles.proCard}>
            <View style={styles.proContent}>
              <Text style={styles.proTitle}>Chrono Pro</Text>
              <Text style={styles.proDescription}>
                Get the full Chrono experience with unlimited events and all Pro features.
              </Text>
              <TouchableOpacity style={styles.proButton}>
                <Text style={styles.proButtonText}>Become a Pro</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.proGraphic}>
              <View style={styles.proGraphicInner} />
            </View>
          </View>

          {/* Settings List */}
          <View style={styles.settingsList}>
            {/* Preferences */}
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="settings-outline" size={20} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>Preferences</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Night Mode */}
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="moon-outline" size={20} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>Night mode</Text>
              <View style={styles.proTag}>
                <Text style={styles.proTagText}>PRO</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" style={styles.settingArrow} />
            </TouchableOpacity>

            {/* Referrals */}
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="paper-plane-outline" size={20} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>Referrals</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Connect your calendar */}
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="calendar-outline" size={20} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>Connect your calendar</Text>
              <View style={styles.connectedIndicator}>
                <View style={styles.connectedDot} />
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            </TouchableOpacity>

            {/* Support */}
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={20} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Suggestions */}
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="chatbubble-outline" size={20} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>Suggestions</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="information-circle-outline" size={20} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Rate app */}
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="star-outline" size={20} color="#000" style={styles.settingIcon} />
              <Text style={styles.settingText}>Rate app</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity style={styles.settingItem} onPress={() => setShowLogoutConfirm(true)}>
              <Ionicons name="log-out-outline" size={20} color="#ff3b30" style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: '#ff3b30' }]}>Log Out</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Credits */}
            <View style={styles.creditsContainer}>
              <Text style={styles.creditsText}>Crafted with ❤️ by Shivansh</Text>
              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </View>
        </ScrollView>
      </AnimatedScreen>

      {showLogoutConfirm && (
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutCard}>
            <View style={styles.logoutIconCircle}>
              <Ionicons name="log-out-outline" size={28} color="#ff3b30" />
            </View>
            <Text style={styles.logoutTitle}>
              Are you sure you want to log out?
            </Text>
            <Text style={styles.logoutSubtitle}>You will need to sign in again to access your events.</Text>

            <View style={styles.logoutButtonsRow}>
              <TouchableOpacity
                style={styles.logoutCancelButton}
                onPress={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
              >
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutConfirmButton}
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                <Text style={styles.logoutConfirmText}>
                  {isLoggingOut ? 'Logging Out...' : 'Log Out'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  offerCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerIconContainer: {
    marginRight: 16,
  },
  offerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerContent: {
    flex: 1,
  },
  offerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  daysBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  daysBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  proCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
  },
  proContent: {
    flex: 1,
    marginRight: 16,
  },
  proTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  proDescription: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.85,
    marginBottom: 20,
    lineHeight: 22,
  },
  proButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  proButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  proGraphic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  proGraphicInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.4)',
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  settingsList: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  settingArrow: {
    marginLeft: 8,
  },
  proTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  proTagText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  connectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  logoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    zIndex: 50,
  },
  logoutCard: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  logoutIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,59,48,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  logoutSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  logoutCancelButton: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  logoutConfirmButton: {
    flex: 1.2,
    borderRadius: 24,
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  creditsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    opacity: 0.6,
  },
  creditsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});
