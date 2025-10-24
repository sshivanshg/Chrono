import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Event, EventFilters, PaginatedResponse, CreateEventRequest, UpdateEventRequest } from '../../types';
import AuthService from '../authService';

export const eventsApi = {
  // Get all events with optional filters
  async getEvents(filters?: EventFilters): Promise<PaginatedResponse<Event>> {
    // Get auth header for authenticated request
    const authHeader = await AuthService.getAuthHeader();
    
    // Use proper authenticated endpoint
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.LIST, filters, authHeader);
    return response.data;
  },

  // Get a specific event by ID
  async getEventById(id: string): Promise<Event> {
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.BY_ID(id));
    return response.data;
  },

  // Create a new event
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    // Get auth header for authenticated request
    const authHeader = await AuthService.getAuthHeader();
    
    // Use proper authenticated endpoint
    const response = await apiClient.post(API_ENDPOINTS.EVENTS.LIST, eventData, authHeader);
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
