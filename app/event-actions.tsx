import { ThemedText } from '@/components/themed-text';
import { ActionSheetItem } from '@/components/ui/ActionSheetItem';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useEvents } from '../contexts/EventContext';

export default function EventActionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateEvent } = useEvents();
  const eventId = (params.eventId as string) || '';
  const eventTitle = (params.eventTitle as string) || '';
  const selectedDate = (params.selectedDate as string) || '';
  const isAllDay = params.isAllDay === 'true';
  const repeats = params.repeats === 'true';
  const selectedImage = (params.selectedImage as string) || '';

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(eventTitle);

  // Reanimated values
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(24);

  useEffect(() => {
    backdropOpacity.value = withTiming(0.35, { duration: 200 });
    sheetTranslateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

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
    router.replace({
      pathname: '/event-detail',
      params: { eventId, confirmDelete: 'true' },
    });
  };

  return (
    <View style={styles.container}>
      {!!selectedImage && (
        <>
          <Image source={{ uri: selectedImage }} style={styles.bgImage} blurRadius={30} />
          <View style={styles.bgOverlay} />
        </>
      )}

      {/* Close button top-right */}
      <View style={styles.topRightClose}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <ThemedText style={styles.closeIcon}>✕</ThemedText>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.animatedBackdrop, backdropStyle]}>
        <Pressable style={styles.backdrop} onPress={() => router.back()} />
      </Animated.View>

      <Animated.View style={[styles.sheetContainer, sheetStyle]}>
        <View style={styles.sheetHandle} />

        <ActionSheetItem
          label="Edit Title"
          icon={<ThemedText style={{ fontWeight: '700', color: '#111' }}>T</ThemedText>}
          onPress={() => {
            if (eventId) {
              setIsEditingTitle(true);
            } else {
              Alert.alert('Error', 'Cannot edit title: Event ID not found');
            }
          }}
        />

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
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleEditTitle}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ActionSheetItem
          label="Edit Date"
          icon={<Ionicons name="calendar-outline" size={18} color="#111" />}
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
        />

        <ActionSheetItem
          label="Countdown Format"
          icon={<Ionicons name="calendar-outline" size={18} color="#111" />}
          isPro
          disabled
        />

        <ActionSheetItem
          label="Edit Category"
          icon={<MaterialCommunityIcons name="format-list-bulleted" size={18} color="#111" />}
          onPress={handleEditCategory}
        />

        <ActionSheetItem
          label="Edit Font"
          icon={<MaterialCommunityIcons name="format-font" size={18} color="#111" />}
          isPro
          disabled
        />

        <ActionSheetItem
          label="Change Image"
          icon={<MaterialCommunityIcons name="image-outline" size={18} color="#111" />}
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
        />

        <ActionSheetItem
          label="Adjust Image"
          icon={<MaterialCommunityIcons name="crop" size={18} color="#111" />}
          onPress={handleAdjustImage}
        />

        <ActionSheetItem
          label="Invite Friends"
          icon={<MaterialCommunityIcons name="account-plus-outline" size={18} color="#111" />}
          onPress={handleInviteFriends}
        />

        <ActionSheetItem
          label="Add Snippet"
          icon={<MaterialCommunityIcons name="sticker-plus-outline" size={18} color="#111" />}
          onPress={handleAddSnippet}
        />

        <ActionSheetItem
          label="Delete"
          icon={<Ionicons name="trash-outline" size={18} color="#E53935" />}
          onPress={handleDelete}
          isDestructive
          style={{ borderBottomWidth: 0 }}
        />
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
    paddingBottom: 10,
  },
  animatedBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
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


