import { createContext } from 'react';
import { User } from '@/lib/types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, language: string) => Promise<boolean>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  canPost: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
