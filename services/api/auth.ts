import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface AuthResponse {
  success: boolean;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  token: string;
  message: string;
}

export interface VerifyResponse {
  success: boolean;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  message: string;
}

export const authApi = {
  // Google authentication with backend
  async googleAuth(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', {
      idToken
    });
    
    if (response.success && response.data) {
      // Set the JWT token for future API calls
      apiClient.setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  // Verify authentication token
  async verifyToken(): Promise<VerifyResponse> {
    const response = await apiClient.get<VerifyResponse>('/auth/verify');
    return response.data;
  },

  // Sign out
  async signOut(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/auth/signout');
    
    // Clear the auth token
    apiClient.clearAuthToken();
    
    return response.data;
  }
};
