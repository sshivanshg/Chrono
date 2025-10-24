import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function AddDateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventName = params.eventName as string || '';
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAllDay, setIsAllDay] = useState(true);
  const [repeats, setRepeats] = useState(false);
  
  // Date picker state
  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
  
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  // Generate data for pickers
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const updateSelectedDate = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    setSelectedDate(newDate);
  };

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    updateSelectedDate();
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    updateSelectedDate();
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    updateSelectedDate();
  };

  const scrollToItem = (scrollRef: React.RefObject<ScrollView>, index: number, itemHeight: number = 50) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        y: index * itemHeight,
        animated: true,
      });
    }
  };

  // Initialize scroll positions on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToItem(dayScrollRef, selectedDay - 1);
      scrollToItem(monthScrollRef, selectedMonth);
      const yearIndex = years.findIndex(year => year === selectedYear);
      if (yearIndex !== -1) {
        scrollToItem(yearScrollRef, yearIndex);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    // Navigate to photo selection screen
    console.log('Event Name:', eventName);
    console.log('Date selected:', selectedDate);
    console.log('All Day:', isAllDay);
    console.log('Repeats:', repeats);
    
    // Navigate to photo selection screen
    router.push({
      pathname: '/add-photo',
      params: { 
        eventName: eventName,
        selectedDate: selectedDate.toISOString(),
        isAllDay: isAllDay.toString(),
        repeats: repeats.toString()
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      

      

      {/* Secondary Header */}
      <View style={styles.secondaryHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Add date</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Date Picker Card */}
        <View style={styles.datePickerCard}>
          <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
          
          {/* Date Picker */}
          <View style={styles.datePickerContainer}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Day</Text>
              <View style={styles.pickerWheel}>
                <ScrollView
                  ref={dayScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  style={styles.pickerScroll}
                >
                  {days.map((day, index) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.pickerOption,
                        selectedDay === day && styles.selectedOption
                      ]}
                      onPress={() => {
                        handleDayChange(day);
                        scrollToItem(dayScrollRef, index);
                      }}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        selectedDay === day && styles.selectedOptionText
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Month</Text>
              <View style={styles.pickerWheel}>
                <ScrollView
                  ref={monthScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  style={styles.pickerScroll}
                >
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerOption,
                        selectedMonth === index && styles.selectedOption
                      ]}
                      onPress={() => {
                        handleMonthChange(index);
                        scrollToItem(monthScrollRef, index);
                      }}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        selectedMonth === index && styles.selectedOptionText
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Year</Text>
              <View style={styles.pickerWheel}>
                <ScrollView
                  ref={yearScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={50}
                  decelerationRate="fast"
                  style={styles.pickerScroll}
                >
                  {years.map((year, index) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerOption,
                        selectedYear === year && styles.selectedOption
                      ]}
                      onPress={() => {
                        handleYearChange(year);
                        scrollToItem(yearScrollRef, index);
                      }}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        selectedYear === year && styles.selectedOptionText
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>

        {/* All Day Toggle */}
        <View style={styles.toggleCard}>
          <Text style={styles.toggleLabel}>All Day</Text>
          <TouchableOpacity 
            style={[styles.toggle, isAllDay && styles.toggleActive]}
            onPress={() => setIsAllDay(!isAllDay)}
          >
            <View style={[styles.toggleThumb, isAllDay && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>

        {/* Repeats Toggle */}
        <View style={styles.toggleCard}>
          <Text style={styles.toggleLabel}>Repeats</Text>
          <TouchableOpacity 
            style={[styles.toggle, repeats && styles.toggleActive]}
            onPress={() => setRepeats(!repeats)}
          >
            <View style={[styles.toggleThumb, repeats && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  windowControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  controlDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  secondaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  datePickerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
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
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 200,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  pickerWheel: {
    height: 150,
    width: 80,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  pickerScroll: {
    flex: 1,
  },
  pickerOption: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  selectedOptionText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  toggleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#000',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
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
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
