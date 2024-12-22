import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { login as authLogin, logout as authLogout, onAuthStateChange } from '../services/authService';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async () => {
    if (!user) return false;

    try {
      const functions = getFunctions();
      const checkAdmin = httpsCallable(functions, 'checkAdminStatus');
      const result = await checkAdmin();
      const adminStatus = (result.data as { isAdmin: boolean }).isAdmin;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      if (user) {
        await checkAdminStatus();
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const userData = await authLogin({ email, password });
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        checkAdminStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}