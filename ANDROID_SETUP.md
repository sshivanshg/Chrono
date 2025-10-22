# Android Setup Guide for Chrono App

## ✅ Issues Fixed

I've resolved the following issues that were preventing your app from running on Android:

1. **Removed deprecated packages:**
   - `expo-firebase-core` (deprecated as of SDK 48)
   - `expo-firebase-auth` (conflicting versions)

2. **Fixed dependency conflicts:**
   - Updated `@react-native-async-storage/async-storage` to version 2.2.0
   - Cleaned up duplicate dependencies in node_modules

3. **Updated app.json configuration:**
   - Removed deprecated `expo-firebase-core` plugin
   - Kept only necessary plugins for your setup

## 🚀 How to Run on Android

### Option 1: Expo Go (Quick Testing)
```bash
cd Chrono
npx expo start
# Then scan QR code with Expo Go app on Android
```

### Option 2: Development Build (Recommended for Firebase)
Since you're using Firebase and Google Sign-In, you should use a development build:

```bash
cd Chrono

# For Android
npx expo run:android

# Make sure you have:
# - Android Studio installed
# - Android SDK configured
# - USB debugging enabled on your device
```

### Option 3: Prebuild and Run (Alternative)
```bash
cd Chrono
npx expo prebuild --platform android
npx expo run:android
```

## 📱 Prerequisites

### For Android Development Build:
1. **Install Android Studio**
2. **Set up Android SDK** (API level 33 or higher recommended)
3. **Enable Developer Options** on your Android device:
   - Go to Settings > About Phone > Tap "Build Number" 7 times
   - Go back to Settings > Developer Options > Enable "USB Debugging"
4. **Connect device via USB** or use Android emulator

### For Expo Go (Limited):
- Install Expo Go app from Google Play Store
- Scan QR code from `npx expo start`

## 🔧 Troubleshooting

### If you get "Command failed" errors:
```bash
# Clean everything and retry
cd Chrono
rm -rf node_modules
rm -rf .expo
npx expo install --fix
npx expo run:android
```

### If Firebase doesn't work in Expo Go:
- Use development build (`npx expo run:android`) instead
- Expo Go has limitations with native Firebase modules

### If Google Sign-In fails:
- Make sure you're using the development build
- Check that your `google-services.json` is properly configured
- Verify the web client ID in Firebase Console matches your app

## 📋 Current Configuration

Your app is now configured with:
- ✅ Firebase v12.4.0 (latest)
- ✅ Google Sign-In using Expo AuthSession (Expo Go compatible)
- ✅ All dependencies properly resolved
- ✅ No deprecated packages

## 🎯 Next Steps

1. Run `npx expo run:android` for full functionality
2. Test Google authentication on your device
3. Your Firebase integration should work properly now

The app should now run successfully on Android! 🎉

