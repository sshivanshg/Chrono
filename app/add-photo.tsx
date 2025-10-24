import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');






export default function AddPhotoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventName = params.eventName as string || '';
  const selectedDate = params.selectedDate as string || '';
  const isAllDay = params.isAllDay === 'true';
  const repeats = params.repeats === 'true';
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [localPhotos, setLocalPhotos] = useState([
    {
      id: 'local1',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop',
      title: 'Temple'
    },
    {
      id: 'local2',
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop',
      title: 'Sleeping'
    },
    {
      id: 'local3',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
      title: 'Couple'
    }
  ]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photo library to select images for your events.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              // In a real app, you would open device settings
              console.log('Open settings');
            }}
          ]
        );
      }
    } else {
      setHasPermission(true);
    }
  };

  const pickImageFromLibrary = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant photo library access to select images.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = {
          id: `local_${Date.now()}`,
          url: result.assets[0].uri,
          title: 'Selected Photo'
        };
        setLocalPhotos(prev => [newPhoto, ...prev]);
        
        // Upload the image to backend
        await selectImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const selectImage = async (imageUrl: string) => {
    try {
      // Upload image to backend
      const formData = new FormData();
      formData.append('image', {
        uri: imageUrl,
        type: 'image/jpeg',
        name: 'event-image.jpg',
      } as any);

      const response = await fetch('http://localhost:3000/api/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('Image upload result:', result);

      if (result.success && result.data.imageUrl) {
        setSelectedImage(result.data.imageUrl);
        console.log('Image uploaded successfully:', result.data.imageUrl);
      } else {
        console.error('Failed to upload image:', result.error);
        // Fallback to local image
        setSelectedImage(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to local image
      setSelectedImage(imageUrl);
    }
  };

  const handleContinue = () => {
    if (selectedImage) {
      console.log('Event Name:', eventName);
      console.log('Selected Date:', selectedDate);
      console.log('Selected Image:', selectedImage);
      
      // Navigate to event preview
      router.push({
        pathname: '/event-preview',
        params: {
          eventName: eventName,
          selectedDate: selectedDate,
          selectedImage: selectedImage,
          isAllDay: isAllDay,
          repeats: repeats
        }
      });
    } else {
      Alert.alert('No Image Selected', 'Please select an image for your event.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSeeAll = () => {
    pickImageFromLibrary();
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Add photo</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo Library Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photo library</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleSeeAll}>
              <Text style={styles.actionButtonText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosContainer}
          >
            {localPhotos.map((photo) => (
              <TouchableOpacity
                key={photo.id}
                style={[
                  styles.photoThumbnail,
                  selectedImage === photo.url && styles.selectedPhoto
                ]}
                onPress={() => selectImage(photo.url)}
              >
                <Image source={{ uri: photo.url }} style={styles.thumbnailImage} />
                {selectedImage === photo.url && (
                  <View style={styles.selectedOverlay}>
                    <Text style={styles.selectedIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>


        {/* Selected Image Preview */}
        {selectedImage && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Selected Image</Text>
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedImage && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedImage}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  photosContainer: {
    paddingHorizontal: 0,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPhoto: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  previewSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
