import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Image, Pressable, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEvents } from '../contexts/EventContext';

export default function EventActionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateEvent, deleteEvent } = useEvents();
  const eventId = (params.eventId as string) || '';
  const eventTitle = (params.eventTitle as string) || '';
  const selectedDate = (params.selectedDate as string) || '';
  const isAllDay = params.isAllDay === 'true';
  const repeats = params.repeats === 'true';
  const selectedImage = (params.selectedImage as string) || '';
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(eventTitle);

  // Animations for smooth entrance
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(-24)).current; // slight drop from top

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0.35,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY]);

  const handleEditTitle = async () => {
    if (!eventId) {
      Alert.alert('Error', 'Event ID not found');
      return;
    }
    
    if (editedTitle.trim() && editedTitle !== eventTitle) {
      try {
        await updateEvent(eventId, { title: editedTitle.trim() });
        Alert.alert('Success', 'Title updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } catch (error) {
        Alert.alert('Error', 'Failed to update title');
      }
    } else {
      setIsEditingTitle(false);
    }
  };

  const handleEditCategory = () => {
    Alert.alert(
      'Edit Category',
      'Select a category',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Personal', onPress: () => updateCategory('Personal') },
        { text: 'Work', onPress: () => updateCategory('Work') },
        { text: 'Family', onPress: () => updateCategory('Family') },
        { text: 'Other', onPress: () => updateCategory('Other') },
      ]
    );
  };

  const updateCategory = async (category: string) => {
    if (!eventId) return;
    try {
      // Create a simple category ID from the category name
      const categoryId = `cat_${category.toLowerCase()}`;
      await updateEvent(eventId, { categoryId });
      Alert.alert('Success', `Category set to ${category}`, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update category');
    }
  };

  const handleAdjustImage = () => {
    router.replace({
      pathname: '/add-photo',
      params: {
        eventId,
        eventName: eventTitle,
        selectedDate,
        isAllDay: String(isAllDay),
        repeats: String(repeats),
        selectedImage,
        from: 'actions',
        mode: 'adjust',
      },
    });
  };

  const handleInviteFriends = async () => {
    try {
      const result = await Share.share({
        message: `Check out my event: ${eventTitle} on ${new Date(selectedDate).toLocaleDateString()}`,
        title: 'Share Event',
      });
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to share event');
    }
  };

  const handleAddSnippet = () => {
    Alert.alert(
      'Add Snippet',
      'Snippet feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleDelete = () => {
    if (!eventId) {
      Alert.alert('Error', 'Event ID not found');
      return;
    }

    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              Alert.alert('Success', 'Event deleted', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {!!selectedImage && (
        <>
          <Image source={{ uri: selectedImage }} style={styles.bgImage} blurRadius={30} />
          {/* Soft tint picked from image (white veil lets image colors bleed through) */}
          <View style={styles.bgOverlay} />
        </>
      )}

      {/* Close button top-right */}
      <View style={styles.topRightClose}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.animatedBackdrop, { opacity: backdropOpacity }]}>
        <Pressable style={styles.backdrop} onPress={() => router.back()} />
      </Animated.View>

      <Animated.View style={[styles.sheetContainer, { transform: [{ translateY: sheetTranslateY }] }]}>
        <View style={styles.sheetHandle} />

        <TouchableOpacity 
          style={styles.sheetItem} 
          onPress={() => {
            if (eventId) {
              setIsEditingTitle(true);
            } else {
              Alert.alert('Error', 'Cannot edit title: Event ID not found');
            }
          }}
        >
          <View style={styles.iconBox}><Text style={styles.iconText}>T</Text></View>
          <Text style={styles.sheetItemText}>Edit Title</Text>
        </TouchableOpacity>
        
        {isEditingTitle && (
          <View style={styles.editTitleContainer}>
            <TextInput
              style={styles.titleInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Enter event title"
              autoFocus
            />
            <View style={styles.editTitleActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditingTitle(false);
                  setEditedTitle(eventTitle);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleEditTitle}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.sheetItem}
          onPress={() => {
            router.replace({
              pathname: '/add-date',
              params: { 
                eventId,
                selectedDate, 
                isAllDay: String(isAllDay), 
                repeats: String(repeats), 
                eventName: eventTitle, 
                from: 'actions' 
              },
            });
          }}
        >
          <View style={styles.iconBox}><Ionicons name="calendar-outline" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Edit Date</Text>
        </TouchableOpacity>

        {/* PRO row */ }
        <View style={[styles.sheetItem, styles.disabledRow]}>
          <View style={styles.iconBox}><Ionicons name="calendar-outline" size={18} color="#111" /></View>
          <Text style={[styles.sheetItemText, styles.disabledText]}>Countdown Format</Text>
          <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
        </View>

        <TouchableOpacity style={styles.sheetItem} onPress={handleEditCategory}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="format-list-bulleted" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Edit Category</Text>
        </TouchableOpacity>

        {/* PRO row */ }
        <View style={[styles.sheetItem, styles.disabledRow]}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="format-font" size={18} color="#111" /></View>
          <Text style={[styles.sheetItemText, styles.disabledText]}>Edit Font</Text>
          <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
        </View>

        <TouchableOpacity
          style={styles.sheetItem}
          onPress={() => {
            router.replace({
              pathname: '/add-photo',
              params: { 
                eventId,
                eventName: eventTitle, 
                selectedDate, 
                isAllDay: String(isAllDay), 
                repeats: String(repeats), 
                selectedImage,
                from: 'actions' 
              },
            });
          }}
        >
          <View style={styles.iconBox}><MaterialCommunityIcons name="image-outline" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Change Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sheetItem} onPress={handleAdjustImage}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="crop" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Adjust Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sheetItem} onPress={handleInviteFriends}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="account-plus-outline" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Invite Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sheetItem} onPress={handleAddSnippet}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="sticker-plus-outline" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Add Snippet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sheetItem, styles.sheetItemDestructive]} onPress={handleDelete}>
          <View style={styles.iconBox}><Ionicons name="trash-outline" size={18} color="#E53935" /></View>
          <Text style={[styles.sheetItemText, styles.sheetDestructiveText]}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // paddingTop: 220,
    paddingBottom: 10,
  },
  animatedBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  topRightClose: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  bgOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 8,
    width: '92%',
    marginTop: 80,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginTop: 8,
    marginBottom: 8,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingHorizontal: 16,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#111',
    fontWeight: '700',
  },
  sheetItemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  disabledRow: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#777',
  },
  proBadge: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#f7f7f7',
  },
  proBadgeText: {
    fontSize: 10,
    color: '#9a9a9a',
    fontWeight: '700',
  },
  sheetItemDestructive: {
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
  sheetDestructiveText: {
    color: '#E53935',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  editTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  titleInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  editTitleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


