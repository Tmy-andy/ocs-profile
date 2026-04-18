import api from './api';
import { LoginCredentials, User } from '../types';

const AUTH_TOKEN_KEY = 'oc_admin_token';

const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/login', credentials);
    const user = response.data.data;
    
    // Save token to localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, user.token);
    
    return user;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Check if logged in
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Setup admin (first time only)
  setupAdmin: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/setup', credentials);
    const user = response.data.data;
    
    localStorage.setItem(AUTH_TOKEN_KEY, user.token);
    
    return user;
  }
};

export default authService;
