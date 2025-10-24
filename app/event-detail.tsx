import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEvents } from '../contexts/EventContext';

const { width, height } = Dimensions.get('window');

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { events } = useEvents();
  
  const eventId = params.eventId as string;
  
  // Handle mock events
  const getMockEvent = (id: string) => {
    const mockEvents = {
      'mock-1': {
        id: 'mock-1',
        title: "Kate's Party",
        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
        timeframe: 'IN 28 DAYS'
      },
      'mock-2': {
        id: 'mock-2',
        title: 'Basketball',
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        timeframe: 'IN 3 DAYS'
      },
      'mock-3': {
        id: 'mock-3',
        title: 'Moving House',
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
        date: new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000), // 16 weeks from now
        timeframe: 'IN 16 WEEKS'
      },
      'mock-4': {
        id: 'mock-4',
        title: 'Anniversary',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=200&fit=crop',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        timeframe: 'TOMORROW'
      },
      'mock-5': {
        id: 'mock-5',
        title: 'Workout',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        date: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        timeframe: 'IN 3 HOURS'
      },
      'mock-6': {
        id: 'mock-6',
        title: 'Pool Party',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
        timeframe: 'IN 1 MONTH'
      }
    };
    return mockEvents[id as keyof typeof mockEvents];
  };

  const event = eventId.startsWith('mock-') ? getMockEvent(eventId) : events.find(e => e.id === eventId);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getTimeframe = (date: Date) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image */}
      <Image 
        source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop' }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Dark overlay for better text readability */}
      <View style={styles.overlay} />
      
      {/* Top Navigation */}
      <View style={styles.topNavigation}>
        <TouchableOpacity style={styles.topButton} onPress={() => router.back()}>
          <Text style={styles.topButtonText}>✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>⋯</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Timeframe */}
        <Text style={styles.timeframeText}>
          {eventId.startsWith('mock-') ? (event as any).timeframe : getTimeframe(event.date)}
        </Text>
        
        {/* Event Title */}
        <Text style={styles.eventTitle}>{event.title}</Text>
        
        {/* Date Pill */}
        <View style={styles.datePill}>
          <Text style={styles.dateText}>{formatDate(event.date)}</Text>
        </View>
      </View>
      
      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <Text style={styles.bottomIcon}>⌃</Text>
          <Text style={styles.bottomText}>SNIPPETS</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 10,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  shareButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  timeframeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  eventTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  datePill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 10,
  },
  bottomText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
