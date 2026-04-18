export type RelationshipStatus = '' | 'single' | 'dating' | 'married' | 'single-parent';

export interface RelationshipLink {
  description?: string;
  character?: string | { _id: string; name: string; slug?: string; owner?: any } | null;
  text?: string;
}

export interface CharacterCore {
  fullName?: string;
  gender?: string;
  birthday?: string;
  age?: string;
  mbti?: string;
  appearance?: string;
  physique?: string;
  occupation?: string;
  workplace?: string;
  nationality?: string;
  residence?: string;
  relationshipStatus?: RelationshipStatus;
  partner?: RelationshipLink;
  personality?: string;
}

export interface CharacterVisual {
  face?: string;
  hair?: string;
  skin?: string;
}

export interface CharacterAesthetics {
  outfit?: string;
  colorPalette?: string;
  accessories?: string;
  inspiration?: string;
}

export interface CharacterDetails {
  habits?: string;
  flaws?: string;
  likes?: string;
  dislikes?: string;
  intimateLife?: string;
}

export interface CharacterAdditional {
  skills?: string;
  assets?: string;
  secrets?: string;
}

export interface Character {
  _id: string;
  name: string;
  slug: string;
  characterId: string;
  avatarImage: string;
  tags: string[];
  isPublic: boolean;
  owner?: {
    _id: string;
    username: string;
    slug?: string;
    displayName?: string;
  } | string;
  core?: CharacterCore;
  visual?: CharacterVisual;
  aesthetics?: CharacterAesthetics;
  details?: CharacterDetails;
  complexRelationships?: RelationshipLink[];
  backstory?: string;
  additional?: CharacterAdditional;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  _id: string;
  username: string;
  slug?: string;
  displayName?: string;
  email?: string;
  role: 'admin' | 'member';
  charactersCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  slug?: string;
  displayName?: string;
  email?: string;
  role: 'admin' | 'member';
  token: string;
}

export interface UpdateProfilePayload {
  username?: string;
  slug?: string;
  displayName?: string;
  email?: string;
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
