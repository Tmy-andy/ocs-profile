import api from './api';
import { Character, ApiResponse, PaginatedResponse } from '../types';

export const characterService = {
  // Get all characters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string;
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
};

export default characterService;
