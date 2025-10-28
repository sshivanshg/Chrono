import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = () => {
    console.log('🚪 Logout button clicked');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚪 Starting sign out process...');
              await signOut();
              console.log('🚪 Sign out successful, redirecting to signin...');
              router.replace('/signin');
            } catch (error) {
              console.error('🚪 Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
     

      {/* Secondary Header */}
      <View style={styles.secondaryHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Chrono Pro Section */}
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
          <View style={styles.proIcon}>
            <View style={styles.proIconInner} />
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {/* Logout Button */}
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingIconText}>🚪</Text>
            </View>
            <Text style={styles.settingText}>Logout</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* Night Mode */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingIconText}>🌙</Text>
            </View>
            <Text style={styles.settingText}>Night mode</Text>
            <View style={styles.proTag}>
              <Text style={styles.proTagText}>PRO</Text>
            </View>
          </TouchableOpacity>

          {/* Referrals */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingIconText}>✈️</Text>
            </View>
            <Text style={styles.settingText}>Referrals</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* Connect Calendar */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingIconText}>📅</Text>
            </View>
            <Text style={styles.settingText}>Connect your calendar</Text>
            <View style={styles.connectedIndicator}>
              <View style={styles.connectedDot} />
              <Text style={styles.settingArrow}>›</Text>
            </View>
          </TouchableOpacity>

          {/* User Info */}
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userInfoText}>Signed in as: {user.email}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  windowControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  controlDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  secondaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  proCard: {
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proContent: {
    flex: 1,
  },
  proTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  proDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
    lineHeight: 22,
  },
  proButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  proButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  proIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proIconInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666',
  },
  settingsList: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 8,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIconText: {
    fontSize: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  proTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  proTagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
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
  userInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
