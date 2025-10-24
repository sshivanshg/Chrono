import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Category } from '../../types';

export const categoriesApi = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },

  // Get a specific category by ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data;
  },

  // Create a new category
  async createCategory(categoryData: {
    name: string;
    color?: string;
    icon?: string;
  }): Promise<Category> {
    const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
    return response.data;
  },

  // Update an existing category
  async updateCategory(id: string, categoryData: {
    name?: string;
    color?: string;
    icon?: string;
  }): Promise<Category> {
    const response = await apiClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), categoryData);
    return response.data;
  },

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};
