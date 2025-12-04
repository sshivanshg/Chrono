import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AnimatedScreen } from '../components/AnimatedScreen';

const { width } = Dimensions.get('window');

// Mock event suggestions
const eventSuggestions = [
  { title: 'Shobit birthday', timeframe: 'IN 90 DAYS' },
  { title: 'Holika Dahana', timeframe: 'IN 131 DAYS' },
  { title: 'Holi Festival', timeframe: 'IN 131 DAYS' },
  { title: 'Diwali', timeframe: 'IN 200 DAYS' },
  { title: 'New Year', timeframe: 'IN 365 DAYS' },
];

export default function AddEventScreen() {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState(eventSuggestions);

  useEffect(() => {
    if (eventName.trim()) {
      const filtered = eventSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(eventName.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(eventSuggestions);
    }
  }, [eventName]);

  const handleContinue = () => {
    if (eventName.trim()) {
      // Navigate to date picker with the event name
      router.push({
        pathname: '/add-date',
        params: { eventName: eventName.trim() }
      });
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setEventName(suggestion);
  };

  const handleClose = () => {
    router.back();
  };

  const handleCalendarPress = () => {
    router.push('/calendar');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <AnimatedScreen>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Add event</Text>
          
          <TouchableOpacity onPress={handleCalendarPress} style={styles.calendarButton}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Prompt */}
          <View style={styles.promptSection}>
            <Text style={styles.promptText}>Give your event a name.</Text>
          </View>
          
          {/* Event Name Input */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={eventName}
                onChangeText={setEventName}
                placeholder="Enter event name"
                placeholderTextColor="#999"
                maxLength={25}
                autoFocus
              />
              <Text style={styles.characterCount}>
                {eventName.length}/25
              </Text>
            </View>
          </View>
          
          {/* Event Suggestions */}
          {filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsSection}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsContainer}
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionCard}
                    onPress={() => handleSuggestionPress(suggestion.title)}
                  >
                    <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                    <Text style={styles.suggestionTimeframe}>{suggestion.timeframe}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
        
        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !eventName.trim() && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!eventName.trim()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </AnimatedScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  promptSection: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 40,
  },
  inputContainer: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterCount: {
    position: 'absolute',
    right: 16,
    top: 16,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  suggestionsSection: {
    marginBottom: 40,
  },
  suggestionsContainer: {
    paddingHorizontal: 0,
  },
  suggestionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  suggestionTimeframe: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
