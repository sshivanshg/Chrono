import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Event } from '../types';

const { width } = Dimensions.get('window');

interface CalendarProps {
  events: Event[];
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: Event) => void;
}

export default function Calendar({ events, onDateSelect, onEventSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.monthYear}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View style={styles.dayNamesRow}>
        {dayNames.map(day => (
          <Text key={day} style={styles.dayName}>{day}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {days.map((date, index) => {
          if (!date) {
            return <View key={index} style={styles.dayCell} />;
          }

          const dayEvents = getEventsForDate(date);
          const isCurrentDay = isToday(date);
          const isSelectedDay = isSelected(date);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isCurrentDay && styles.todayCell,
                isSelectedDay && styles.selectedCell,
              ]}
              onPress={() => handleDatePress(date)}
            >
              <Text style={[
                styles.dayText,
                isCurrentDay && styles.todayText,
                isSelectedDay && styles.selectedText,
              ]}>
                {date.getDate()}
              </Text>

              {/* Event indicators */}
              <View style={styles.eventIndicators}>
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <View
                    key={eventIndex}
                    style={[
                      styles.eventDot,
                      { backgroundColor: event.categoryId ? '#007AFF' : '#FF3B30' }
                    ]}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <Text style={styles.moreEventsText}>+{dayEvents.length - 3}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected date events */}
      {getEventsForDate(selectedDate).length > 0 && (
        <View style={styles.selectedDateEvents}>
          <Text style={styles.selectedDateTitle}>
            Events for {selectedDate.toLocaleDateString()}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getEventsForDate(selectedDate).map((event, index) => (
              <TouchableOpacity
                key={index}
                style={styles.eventCard}
                onPress={() => onEventSelect(event)}
              >
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>
                <Text style={styles.eventTime}>
                  {event.isAllDay ? 'All Day' : `${event.startTime} - ${event.endTime}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  dayNamesRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  dayCell: {
    width: (width - 20) / 7,
    height: 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
  },
  todayCell: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  selectedCell: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  eventIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
    maxWidth: (width - 20) / 7 - 10,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
    marginVertical: 1,
  },
  moreEventsText: {
    fontSize: 8,
    color: '#666',
    fontWeight: '600',
  },
  selectedDateEvents: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  eventCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 120,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
    color: '#666',
  },
});
