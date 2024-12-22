import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '../types/User';

interface AuthState {
  user: (FirebaseUser & User) | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    user: context.user as (FirebaseUser & User) | null,
    loading: context.loading,
    isAuthenticated: context.isAuthenticated,
    logout: context.logout
  };
};