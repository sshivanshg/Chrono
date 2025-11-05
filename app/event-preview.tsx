import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEvents } from '../contexts/EventContext';

const { width } = Dimensions.get('window');

export default function EventPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addEvent, loadEvents } = useEvents();
  const [isCreating, setIsCreating] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  
  const eventName = params.eventName as string || '';
  const selectedDate = params.selectedDate as string || '';
  const selectedImage = params.selectedImage as string || '';
  const isAllDay = params.isAllDay === 'true';
  const repeats = params.repeats === 'true';

  const [eventTitle, setEventTitle] = useState(eventName);
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDone = async () => {
    if (isCreating) return; // Prevent multiple submissions
    
    try {
      setIsCreating(true);
      
      // Create the event using the context
      await addEvent({
        userId: 'user1', // In a real app, this would come from auth context
        title: eventTitle,
        description: `Event created on ${new Date().toLocaleDateString()}`,
        date: new Date(selectedDate),
        isAllDay,
        startTime: isAllDay ? undefined : '09:00',
        endTime: isAllDay ? undefined : '10:00',
        location: undefined,
        imageUrl: selectedImage,
      });
      
      // Refresh events list to get the latest data
      await loadEvents();
      
      // Auto-redirect to home screen after a short delay
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1500);
      
      setEventCreated(true);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating event:', error);
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Event Title Section */}
        <View style={styles.titleSection}>
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholder="Event title"
              autoFocus
            />
          ) : (
            <Text style={styles.eventTitle}>{eventTitle}</Text>
          )}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Image Card */}
        <View style={styles.imageCard}>
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.eventImage} 
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <Text style={styles.timeText}>
              {isAllDay ? 'All Day' : '9:00 AM - 10:00 AM'}
            </Text>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(selectedDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>
              {isAllDay ? 'All Day' : '9:00 AM - 10:00 AM'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Repeats:</Text>
            <Text style={styles.detailValue}>{repeats ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        {/* Action Icons */}
        <View style={styles.actionIcons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Edit Date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>Change Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⏰</Text>
            <Text style={styles.actionText}>Set Time</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Done Button */}
      <View style={styles.bottomSection}>
        {eventCreated ? (
          <View style={styles.successContainer}>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.doneButton, isCreating && styles.doneButtonDisabled]} 
            onPress={handleDone}
            disabled={isCreating}
          >
            <Text style={styles.doneButtonText}>
              {isCreating ? 'Creating...' : 'Done'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    paddingVertical: 4,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  imageCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 300,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    minWidth: 80,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  doneButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: '#666',
  },
});
