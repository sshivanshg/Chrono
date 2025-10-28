import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '../types';
import { eventsApi } from '../services/api/events';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => Event[];
  loading: boolean;
  loadEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: React.ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Load events from storage on mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Save events to storage whenever events change
  useEffect(() => {
    if (!loading) {
      saveEvents();
    }
  }, [events, loading]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading events from authenticated API...');
      
      // Use the proper authenticated API
      const response = await eventsApi.getEvents();
      console.log('🔍 API response:', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        const parsedEvents = response.data.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        }));
        console.log('🔍 Loaded events from API:', parsedEvents);
        setEvents(parsedEvents);
      } else {
        console.log('🔍 No events found, using empty array');
        setEvents([]);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      // Fallback to empty array if API fails
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const saveEvents = async () => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🔍 Adding event via authenticated API:', eventData);
      
      // Use the proper authenticated API
      const newEvent = await eventsApi.createEvent(eventData);
      console.log('🔍 Event created successfully:', newEvent);
      
      setEvents(prev => {
        const updated = [...prev, newEvent];
        console.log('🔍 Events after add:', updated);
        return updated;
      });
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id 
          ? { ...event, ...eventData, updatedAt: new Date() }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const value: EventContextType = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    loading,
    loadEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
