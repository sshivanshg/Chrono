import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EventActionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventTitle = (params.eventTitle as string) || '';
  const selectedDate = (params.selectedDate as string) || '';
  const isAllDay = params.isAllDay === 'true';
  const repeats = params.repeats === 'true';
  const selectedImage = (params.selectedImage as string) || '';

  return (
    <View style={styles.container}>
      {!!selectedImage && (
        <>
          <Image source={{ uri: selectedImage }} style={styles.bgImage} blurRadius={30} />
          <View style={styles.bgOverlay} />
        </>
      )}

      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <View style={styles.sheetContainer}>
        <View style={styles.sheetHandle} />

        <TouchableOpacity style={styles.sheetItem} onPress={() => router.back()}>
          <Text style={styles.sheetItemIcon}>T</Text>
          <Text style={styles.sheetItemText}>Edit Title</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sheetItem}
          onPress={() => {
            router.replace({
              pathname: '/add-date',
              params: { selectedDate, isAllDay: String(isAllDay), repeats: String(repeats), eventName: eventTitle, from: 'actions' },
            });
          }}
        >
          <Text style={styles.sheetItemIcon}>🗓️</Text>
          <Text style={styles.sheetItemText}>Edit Date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sheetItem}
          onPress={() => {
            router.replace({
              pathname: '/add-photo',
              params: { eventName: eventTitle, selectedDate, isAllDay: String(isAllDay), repeats: String(repeats), from: 'actions' },
            });
          }}
        >
          <Text style={styles.sheetItemIcon}>🖼️</Text>
          <Text style={styles.sheetItemText}>Change Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sheetItem, styles.sheetItemDestructive]} onPress={() => router.back()}>
          <Text style={[styles.sheetItemText, styles.sheetDestructiveText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    paddingBottom: 24,
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
  sheetItemIcon: {
    width: 28,
    textAlign: 'center',
    marginRight: 12,
    color: '#444',
  },
  sheetItemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
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
});


