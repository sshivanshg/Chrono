import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventActionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventTitle = (params.eventTitle as string) || '';
  const selectedDate = (params.selectedDate as string) || '';
  const isAllDay = params.isAllDay === 'true';
  const repeats = params.repeats === 'true';
  const selectedImage = (params.selectedImage as string) || '';

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

        <TouchableOpacity style={styles.sheetItem} onPress={() => router.back()}>
          <View style={styles.iconBox}><Text style={styles.iconText}>T</Text></View>
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
          <View style={styles.iconBox}><Ionicons name="calendar-outline" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Edit Date</Text>
        </TouchableOpacity>

        {/* PRO row */ }
        <View style={[styles.sheetItem, styles.disabledRow]}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="calendar-range-outline" size={18} color="#111" /></View>
          <Text style={[styles.sheetItemText, styles.disabledText]}>Countdown Format</Text>
          <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
        </View>

        <TouchableOpacity style={styles.sheetItem} onPress={() => router.back()}>
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
              params: { eventName: eventTitle, selectedDate, isAllDay: String(isAllDay), repeats: String(repeats), from: 'actions' },
            });
          }}
        >
          <View style={styles.iconBox}><MaterialCommunityIcons name="image-outline" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Change Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sheetItem} onPress={() => router.back()}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="crop" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Adjust Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sheetItem} onPress={() => router.back()}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="account-plus-outline" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Invite Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sheetItem} onPress={() => router.back()}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="sticker-plus-outline" size={18} color="#111" /></View>
          <Text style={styles.sheetItemText}>Add Snippet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sheetItem, styles.sheetItemDestructive]} onPress={() => router.back()}>
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
});


