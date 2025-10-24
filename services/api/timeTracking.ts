// Time Tracking API service
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { TimeEntry, TimeEntryFilters, PaginatedResponse } from '../../types';

export const timeTrackingApiService = {
  // Get all time entries with optional filters
  async getTimeEntries(filters?: TimeEntryFilters): Promise<PaginatedResponse<TimeEntry>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.TIME_ENTRIES.BASE}?${queryParams.toString()}`
      : API_ENDPOINTS.TIME_ENTRIES.BASE;
      
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get time entry by ID
  async getTimeEntryById(id: string): Promise<TimeEntry> {
    const response = await apiClient.get(API_ENDPOINTS.TIME_ENTRIES.BY_ID(id));
    return response.data;
  },

  // Create new time entry
  async createTimeEntry(timeEntry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<TimeEntry> {
    const response = await apiClient.post(API_ENDPOINTS.TIME_ENTRIES.BASE, timeEntry);
    return response.data;
  },

  // Update time entry
  async updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
    const response = await apiClient.put(API_ENDPOINTS.TIME_ENTRIES.BY_ID(id), updates);
    return response.data;
  },

  // Delete time entry
  async deleteTimeEntry(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TIME_ENTRIES.BY_ID(id));
  },

  // Get current active time entry
  async getCurrentTimeEntry(): Promise<TimeEntry | null> {
    const response = await apiClient.get(API_ENDPOINTS.TIME_ENTRIES.CURRENT);
    return response.data;
  },

  // Start time tracking
  async startTimeTracking(data: {
    taskId?: string;
    description: string;
    category: string;
    tags?: string[];
    isBreak?: boolean;
  }): Promise<TimeEntry> {
    const response = await apiClient.post(API_ENDPOINTS.TIME_ENTRIES.START, data);
    return response.data;
  },

  // Stop time tracking
  async stopTimeTracking(): Promise<TimeEntry> {
    const response = await apiClient.post(API_ENDPOINTS.TIME_ENTRIES.STOP);
    return response.data;
  },

  // Get time entries by date range
  async getTimeEntriesByDateRange(
    startDate: Date,
    endDate: Date,
    filters?: Omit<TimeEntryFilters, 'dateRange'>
  ): Promise<TimeEntry[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('dateFrom', startDate.toISOString());
    queryParams.append('dateTo', endDate.toISOString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, String(item)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const response = await apiClient.get(`${API_ENDPOINTS.TIME_ENTRIES.BY_DATE_RANGE}?${queryParams.toString()}`);
    return response.data;
  },
};
