// Task API service
import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Task, TaskFilters, PaginatedResponse } from '../../types';

export const taskApiService = {
  // Get all tasks with optional filters
  async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
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
      ? `${API_ENDPOINTS.TASKS.BASE}?${queryParams.toString()}`
      : API_ENDPOINTS.TASKS.BASE;
      
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get task by ID
  async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get(API_ENDPOINTS.TASKS.BY_ID(id));
    return response.data;
  },

  // Create new task
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const response = await apiClient.post(API_ENDPOINTS.TASKS.BASE, task);
    return response.data;
  },

  // Update task
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await apiClient.put(API_ENDPOINTS.TASKS.BY_ID(id), updates);
    return response.data;
  },

  // Delete task
  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TASKS.BY_ID(id));
  },

  // Update task status
  async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    const response = await apiClient.patch(`${API_ENDPOINTS.TASKS.BY_ID(id)}/status`, { status });
    return response.data;
  },

  // Get tasks by category
  async getTasksByCategory(categoryId: string): Promise<Task[]> {
    const response = await apiClient.get(API_ENDPOINTS.TASKS.BY_CATEGORY(categoryId));
    return response.data;
  },

  // Search tasks
  async searchTasks(query: string, filters?: TaskFilters): Promise<Task[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    
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
    
    const response = await apiClient.get(`${API_ENDPOINTS.TASKS.SEARCH}?${queryParams.toString()}`);
    return response.data;
  },
};
