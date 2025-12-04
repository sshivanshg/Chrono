import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AnimatedScreen } from '../../components/AnimatedScreen';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Event } from '../../types';

const { width } = Dimensions.get('window');


export default function HomeScreen() {
  const router = useRouter();
  const { isSignedIn, loading: authLoading } = useAuth();
  const { events, loading: eventsLoading, loadEvents } = useEvents();
  const [filter, setFilter] = useState<'upcoming' | 'previous'>('upcoming');
  const [currentDate] = useState(new Date());

  // The event context will automatically handle loading events when they change

  // Load events when component mounts
  useEffect(() => {
    loadEvents();
  }, []);

  // Show loading state
  if (eventsLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <AnimatedScreen>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        </AnimatedScreen>
      </SafeAreaView>
    );
  }

  const getTimeframe = (date: Date): string => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} DAYS AGO`;
    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'TOMORROW';
    if (diffDays < 7) return `IN ${diffDays} DAYS`;
    if (diffDays < 30) return `IN ${Math.ceil(diffDays / 7)} WEEKS`;
    if (diffDays < 365) return `IN ${Math.ceil(diffDays / 30)} MONTHS`;
    return `IN ${Math.ceil(diffDays / 365)} YEARS`;
  };

  // Filter events based on current date and selected filter
  const getFilteredEvents = () => {
    if (!events || events.length === 0) return [];
    
    return events.filter(event => {
      if (!event || !event.date) return false;
      
      const eventDate = new Date(event.date);
      const now = new Date();
      const isUpcoming = eventDate > now;
      const isPrevious = eventDate <= now;
      
      if (filter === 'upcoming') return isUpcoming;
      if (filter === 'previous') return isPrevious;
      
      return true;
    });
  };

  const EventCard = ({ event }: { event: Event }) => {
    if (!event) {
      return null; // Don't render if event is undefined
    }

    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={styles.eventCard}
        onPress={() => router.push(`/event-detail?eventId=${event.id}`)}
      >
        <Image
          source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop' }} 
          style={styles.eventImage} 
        />
        <View style={styles.eventOverlay}>
          <Text style={styles.timeframeText}>
            {getTimeframe(event.date).toUpperCase()}
          </Text>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AnimatedScreen>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.roundButton}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.hamburgerIcon}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>

          <View style={styles.allEventsPill}>
            <Text style={styles.allEventsPillText}>All events</Text>
          </View>

          <TouchableOpacity 
            style={styles.roundButton}
            onPress={() => router.push('/add-event')}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {(() => {
          const filteredEvents = getFilteredEvents();
          
          // If user has ANY real events (not just filtered ones)
           if (events.length > 0) {
             if (filteredEvents.length > 0) {
               // Show user's real events (filtered by Previous/Upcoming)
               return (
                 <View style={styles.eventsList}>
                   {filteredEvents.map((event) => (
                     <EventCard key={event.id} event={event} />
                   ))}
                 </View>
               );
            } else {
              // User has events but none match the current filter
              return (
                <View style={styles.noEventsContainer}>
                  <Text style={styles.noEventsText}>
                    No {filter === 'upcoming' ? 'upcoming' : 'previous'} events found
                  </Text>
                  <Text style={styles.noEventsSubtext}>
                    Try switching to {filter === 'upcoming' ? 'Previous' : 'Upcoming'} events
                  </Text>
                </View>
              );
            }
          }
          
          // Show mock events ONLY when user has NO real events at all
          return (
            <View>
            {/* Mock Events List - Full Width Cards */}
            <View style={styles.eventsList}>
              {/* Mock Event 1 */}
              <TouchableOpacity 
                style={styles.eventCard}
                onPress={() => router.push('/event-detail?eventId=mock-1')}
              >
                <Image source={{ uri: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop' }} style={styles.eventImage} />
                <View style={styles.eventOverlay}>
                  <Text style={styles.timeframeText}>IN 28 DAYS</Text>
                  <Text style={styles.eventTitle}>Kate's Party</Text>
                </View>
              </TouchableOpacity>

              {/* Mock Event 2 */}
              <TouchableOpacity 
                style={styles.eventCard}
                onPress={() => router.push('/event-detail?eventId=mock-2')}
              >
                <Image source={{ uri: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop' }} style={styles.eventImage} />
                <View style={styles.eventOverlay}>
                  <Text style={styles.timeframeText}>IN 3 DAYS</Text>
                  <Text style={styles.eventTitle}>Basketball</Text>
                </View>
              </TouchableOpacity>

              {/* Mock Event 3 */}
              <TouchableOpacity 
                style={styles.eventCard}
                onPress={() => router.push('/event-detail?eventId=mock-3')}
              >
                <Image source={{ uri: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop' }} style={styles.eventImage} />
                <View style={styles.eventOverlay}>
                  <Text style={styles.timeframeText}>IN 16 WEEKS</Text>
                  <Text style={styles.eventTitle}>Moving House</Text>
                </View>
              </TouchableOpacity>

              {/* Mock Event 4 */}
              <TouchableOpacity 
                style={styles.eventCard}
                onPress={() => router.push('/event-detail?eventId=mock-4')}
              >
                <Image source={{ uri: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=400&fit=crop' }} style={styles.eventImage} />
                <View style={styles.eventOverlay}>
                  <Text style={styles.timeframeText}>TOMORROW</Text>
                  <Text style={styles.eventTitle}>Anniversary</Text>
                </View>
              </TouchableOpacity>

              {/* Mock Event 5 */}
              <TouchableOpacity 
                style={styles.eventCard}
                onPress={() => router.push('/event-detail?eventId=mock-5')}
              >
                <Image source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop' }} style={styles.eventImage} />
                <View style={styles.eventOverlay}>
                  <Text style={styles.timeframeText}>IN 3 HOURS</Text>
                  <Text style={styles.eventTitle}>Workout</Text>
                </View>
              </TouchableOpacity>

              {/* Mock Event 6 */}
              <TouchableOpacity 
                style={styles.eventCard}
                onPress={() => router.push('/event-detail?eventId=mock-6')}
              >
                <Image source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop' }} style={styles.eventImage} />
                <View style={styles.eventOverlay}>
                  <Text style={styles.timeframeText}>IN 1 MONTH</Text>
                  <Text style={styles.eventTitle}>Pool Party</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Add Events Section */}
            <View style={styles.addEventsSection}>
              <Text style={styles.addEventsTitle}>Add your events</Text>
              <Text style={styles.addEventsSubtitle}>Get started by adding your special moments</Text>
              <TouchableOpacity 
                style={styles.createEventButton}
                onPress={() => router.push('/add-event')}
              >
                <Text style={styles.createEventButtonText}>Create new event</Text>
              </TouchableOpacity>
            </View>
          </View>
          );
        })()}
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
      </AnimatedScreen>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
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
  allEventsPill: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  allEventsPillText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  plusIcon: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    paddingTop: 20,
  },
  filterButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  noEventsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noEventsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noEventsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 4,
  },
  mainEventCard: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 400,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainEventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainEventOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  mainEventTimeframe: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  mainEventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventCard: {
    width: '100%',
    height: 260,
    borderRadius: 28,
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
  },
  timeframeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.95,
    letterSpacing: 2,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
    textTransform: 'lowercase',
  },
  addEventsSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  addEventsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  addEventsSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 35,
    textAlign: 'center',
    lineHeight: 24,
  },
  createEventButton: {
    backgroundColor: '#000',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createEventButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomFilter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginHorizontal: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeFilterTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
