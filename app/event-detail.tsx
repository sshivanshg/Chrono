import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedScreen } from '../components/AnimatedScreen';
import { useEvents } from '../contexts/EventContext';

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { events, deleteEvent } = useEvents();

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


    };
    return mockEvents[id as keyof typeof mockEvents];
  };

  const event = eventId.startsWith('mock-') ? getMockEvent(eventId) : events.find(e => e.id === eventId);

  const initialConfirm = useMemo(
    () => params.confirmDelete === 'true' && !eventId.startsWith('mock-'),
    [params.confirmDelete, eventId]
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(initialConfirm);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)')}>
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

  const handleConfirmDelete = async () => {
    if (!event || isDeleting || eventId.startsWith('mock-')) return;
    try {
      setIsDeleting(true);
      await deleteEvent(event.id);
      setShowDeleteConfirm(false);
      router.replace('/(tabs)');
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Image */}
      <Image
        source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Dark overlay for better text readability */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <AnimatedScreen>
          {/* Top Navigation */}
          <View style={styles.topNavigation}>
            <TouchableOpacity style={styles.topButton} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.topButtonText}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() =>
                router.push({
                  pathname: '/event-actions',
                  params: {
                    eventId,
                    eventTitle: event.title,
                    selectedDate: event.date.toISOString(),
                    isAllDay: String((event as any).isAllDay ?? true),
                    repeats: String(!!(event as any).recurrence),
                    selectedImage: event.imageUrl || '',
                  },
                })
              }
            >
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

        </AnimatedScreen>
      </SafeAreaView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <Text style={styles.bottomIcon}>⌃</Text>
          <Text style={styles.bottomText}>SNIPPETS</Text>
        </View>
      </View>

      {showDeleteConfirm && (
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteCard}>
            <View style={styles.deleteIconCircle}>
              <Ionicons name="trash-outline" size={28} color="#ff3b30" />
            </View>
            <Text style={styles.deleteTitle}>
              Are you sure you want to delete &quot;{event.title}&quot;?
            </Text>
            <Text style={styles.deleteSubtitle}>This action cannot be undone.</Text>

            <View style={styles.deleteButtonsRow}>
              <TouchableOpacity
                style={styles.deleteCancelButton}
                onPress={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
              >
                <Text style={styles.deleteConfirmText}>
                  {isDeleting ? 'Deleting…' : 'Delete event'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000', // Fallback color
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
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
  deleteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    zIndex: 50,
  },
  deleteCard: {
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
  deleteIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,59,48,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  deleteButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  deleteCancelButton: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  deleteConfirmButton: {
    flex: 1.2,
    borderRadius: 24,
    backgroundColor: '#000',
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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