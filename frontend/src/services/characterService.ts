import api from './api';
import authService from './authService';
import { Character, ApiResponse, PaginatedResponse } from '../types';

export const characterService = {
  getMine: async (): Promise<PaginatedResponse<Character>> => {
    const me = await authService.getCurrentUser();
    const ownerKey = me.slug || me.username;
    const response = await api.get('/characters', { params: { owner: ownerKey, limit: 100 } });
    return response.data;
  },

  // Get all characters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string;
    owner?: string;
  }): Promise<PaginatedResponse<Character>> => {
    const response = await api.get('/characters', { params });
    return response.data;
  },

  // Get single character by ID
  getById: async (id: string): Promise<ApiResponse<Character>> => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  // Create new character
  create: async (data: Partial<Character>): Promise<ApiResponse<Character>> => {
    const response = await api.post('/characters', data);
    return response.data;
  },

  // Update character
  update: async (id: string, data: Partial<Character>): Promise<ApiResponse<Character>> => {
    const response = await api.put(`/characters/${id}`, data);
    return response.data;
  },

  // Delete character
  delete: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/characters/${id}`);
    return response.data;
  },

  // Reorder characters
  reorder: async (orderedIds: string[]): Promise<ApiResponse<{}>> => {
    const response = await api.patch('/characters/reorder', { orderedIds });
    return response.data;
  },
};

export default characterService;
