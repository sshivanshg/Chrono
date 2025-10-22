import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { Event, EventFilters, PaginatedResponse, CreateEventRequest, UpdateEventRequest } from '../../types';

export const eventsApi = {
  // Get all events with optional filters
  async getEvents(filters?: EventFilters): Promise<PaginatedResponse<Event>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.EVENTS.BASE}?${queryParams.toString()}`
      : API_ENDPOINTS.EVENTS.BASE;
      
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get a specific event by ID
  async getEventById(id: string): Promise<Event> {
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.BY_ID(id));
    return response.data;
  },

  // Create a new event
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    const response = await apiClient.post(API_ENDPOINTS.EVENTS.BASE, eventData);
    return response.data;
  },

  // Update an existing event
  async updateEvent(id: string, eventData: UpdateEventRequest): Promise<Event> {
    const response = await apiClient.put(API_ENDPOINTS.EVENTS.BY_ID(id), eventData);
    return response.data;
  },

  // Delete an event
  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.EVENTS.BY_ID(id));
  },

  // Get event title suggestions
  async getEventSuggestions(search?: string): Promise<string[]> {
    const queryParams = new URLSearchParams();
    if (search) {
      queryParams.append('search', search);
    }
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.EVENTS.SUGGESTIONS}?${queryParams.toString()}`
      : API_ENDPOINTS.EVENTS.SUGGESTIONS;
      
    const response = await apiClient.get(url);
    return response.data;
  },
};
