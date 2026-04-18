export interface Character {
  _id: string;
  name: string;
  slug: string;
  characterId: string;
  avatarImage: string;
  about: string;
  backstory: string;
  tags: string[];
  isPublic: boolean;
  owner?: {
    _id: string;
    username: string;
    displayName?: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  _id: string;
  username: string;
  displayName?: string;
  email?: string;
  role: 'admin' | 'member';
  charactersCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  displayName?: string;
  email?: string;
  role: 'admin' | 'member';
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export interface Invite {
  token: string;
  expiresAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}
