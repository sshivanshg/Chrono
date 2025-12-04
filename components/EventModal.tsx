import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEvents } from '../contexts/EventContext';
import { Event } from '../types';
import { ThemedText } from './themed-text';
import { DateSection, InputSection, ToggleSection } from './ui/FormComponents';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  event?: Event | null;
}

export default function EventModal({ visible, onClose, selectedDate, event }: EventModalProps) {
  const { addEvent, updateEvent, deleteEvent } = useEvents();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setIsAllDay(event.isAllDay);
      setStartTime(event.startTime || '09:00');
      setEndTime(event.endTime || '10:00');
      setLocation(event.location || '');
      setIsEditing(true);
    } else {
      setTitle('');
      setDescription('');
      setIsAllDay(true);
      setStartTime('09:00');
      setEndTime('10:00');
      setLocation('');
      setIsEditing(false);
    }
  }, [event, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for the event');
      return;
    }

    const eventData = {
      userId: 'user1', // In a real app, this would come from auth context
      title: title.trim(),
      description: description.trim() || undefined,
      date: selectedDate,
      isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      location: location.trim() || undefined,
    };

    if (isEditing && event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (event) {
      Alert.alert(
        'Delete Event',
        'Are you sure you want to delete this event?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteEvent(event.id);
              onClose();
            },
          },
        ]
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <ThemedText style={{ color: tintColor, fontSize: 16 }}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText type="subtitle">{isEditing ? 'Edit Event' : 'New Event'}</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <ThemedText style={{ color: tintColor, fontSize: 16, fontWeight: '600' }}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <DateSection date={selectedDate} />

          <InputSection
            label="Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="Event title"
          />

          <InputSection
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Event description"
            multiline
          />

          <ToggleSection
            label="All Day"
            value={isAllDay}
            onValueChange={setIsAllDay}
          />

          {!isAllDay && (
            <View style={[styles.timeSection, { borderBottomColor: borderColor }]}>
              <View style={styles.timeRow}>
                <View style={styles.timeInputContainer}>
                  <InputSection
                    label="Start Time"
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="09:00"
                    style={styles.timeInput}
                  />
                </View>
                <View style={styles.timeInputContainer}>
                  <InputSection
                    label="End Time"
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="10:00"
                    style={styles.timeInput}
                  />
                </View>
              </View>
            </View>
          )}

          <InputSection
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Event location"
          />

          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <ThemedText style={styles.deleteText}>Delete Event</ThemedText>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeSection: {
    paddingVertical: 0,
    borderBottomWidth: 1,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  timeInputContainer: {
    flex: 1,
  },
  timeInput: {
    borderBottomWidth: 0,
    paddingVertical: 20,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 30,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
