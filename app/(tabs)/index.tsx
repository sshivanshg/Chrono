import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import UserProfile from '../../components/UserProfile';
import { Event } from '../../types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3; // 3 columns with padding

// Mock data for events
const mockEvents: Event[] = [
  {
    id: '1',
    userId: 'user1',
    title: "Kate's Party",
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
    isAllDay: true,
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    userId: 'user1',
    title: "Basketball",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    isAllDay: true,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    userId: 'user1',
    title: "Moving House",
    date: new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000), // 16 weeks from now
    isAllDay: true,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    userId: 'user1',
    title: "Anniversary",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    isAllDay: true,
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=200&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    userId: 'user1',
    title: "Workout",
    date: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    isAllDay: false,
    startTime: '18:00',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    userId: 'user1',
    title: "Pool Party",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
    isAllDay: true,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function HomeScreen() {
  const { isSignedIn, loading } = useAuth();
  const [filter, setFilter] = useState<'upcoming' | 'previous'>('upcoming');

  const getTimeframe = (date: Date): string => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'PAST';
    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'TOMORROW';
    if (diffDays < 7) return `IN ${diffDays} DAYS`;
    if (diffDays < 30) return `IN ${Math.ceil(diffDays / 7)} WEEKS`;
    if (diffDays < 365) return `IN ${Math.ceil(diffDays / 30)} MONTHS`;
    return `IN ${Math.ceil(diffDays / 365)} YEARS`;
  };

  const EventCard = ({ event }: { event: Event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
      <View style={styles.eventOverlay}>
        <Text style={styles.timeframeText}>{getTimeframe(event.date)}</Text>
        <Text style={styles.eventTitle}>{event.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // Skip authentication for now - show main interface directly
  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <Text style={styles.loadingText}>Loading...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  // if (!isSignedIn) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.authContainer}>
  //         <Text style={styles.authTitle}>Welcome to Days</Text>
  //         <Text style={styles.authSubtitle}>Sign in to manage your events</Text>
  //         <GoogleSignInButton />
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.hamburgerIcon}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.appTitle}>Days</Text>
        
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Button */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>All events</Text>
        </TouchableOpacity>
      </View>

      {/* Events Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.eventsGrid}>
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>

        {/* Add Events Section */}
        <View style={styles.addEventsSection}>
          <Text style={styles.addEventsTitle}>Add your events</Text>
          <Text style={styles.addEventsSubtitle}>Get started by adding your special moments</Text>
          <TouchableOpacity style={styles.createEventButton}>
            <Text style={styles.createEventButtonText}>Create new event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Filter */}
      <View style={styles.bottomFilter}>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'previous' && styles.activeFilterTab]}
          onPress={() => setFilter('previous')}
        >
          <Text style={[styles.filterTabText, filter === 'previous' && styles.activeFilterTabText]}>
            Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filter === 'upcoming' && styles.activeFilterTab]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterTabText, filter === 'upcoming' && styles.activeFilterTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  authSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: {
    width: 16,
    height: 12,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 16,
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  eventCard: {
    width: cardWidth,
    height: cardWidth * 1.2,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
  timeframeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addEventsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  addEventsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  addEventsSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  createEventButton: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  createEventButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomFilter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#fff',
  },
  filterTabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#333',
    fontWeight: '600',
  },
});
