import api from './api';
import { UserSummary } from '../types';

const userService = {
  getAll: async (): Promise<UserSummary[]> => {
    const response = await api.get('/users');
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};

export default userService;
