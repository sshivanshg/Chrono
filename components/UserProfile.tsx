import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { authUser, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  if (!authUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      {authUser.photoURL && (
        <Image source={{ uri: authUser.photoURL }} style={styles.avatar} />
      )}
      <View style={styles.userInfo}>
        <Text style={styles.displayName}>{authUser.displayName}</Text>
        <Text style={styles.email}>{authUser.email}</Text>
      </View>
      <TouchableOpacity 
        style={styles.signOutButton} 
        onPress={handleSignOut}
        disabled={loading}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  signOutText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default UserProfile;


