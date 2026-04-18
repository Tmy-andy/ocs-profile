import api from './api';
import { LoginCredentials, User, RegisterPayload, Invite } from '../types';

const AUTH_TOKEN_KEY = 'oc_admin_token';

const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/login', credentials);
    const user = response.data.data;
    localStorage.setItem(AUTH_TOKEN_KEY, user.token);
    return user;
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  setupAdmin: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/setup', credentials);
    const user = response.data.data;
    localStorage.setItem(AUTH_TOKEN_KEY, user.token);
    return user;
  },

  createInvite: async (): Promise<Invite> => {
    const response = await api.post('/auth/invites');
    return response.data.data;
  },

  verifyInvite: async (token: string): Promise<{ expiresAt: string }> => {
    const response = await api.get(`/auth/invites/${token}`);
    return response.data.data;
  },

  register: async (token: string, payload: RegisterPayload): Promise<User> => {
    const response = await api.post(`/auth/register/${token}`, payload);
    const user = response.data.data;
    localStorage.setItem(AUTH_TOKEN_KEY, user.token);
    return user;
  }
};

export default authService;
