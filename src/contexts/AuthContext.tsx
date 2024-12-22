import { createContext, useEffect, useState } from 'react';
import { User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from '../types/User';

interface AuthContextType {
  user: (FirebaseUser & Partial<User>) | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<(FirebaseUser & Partial<User>) | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Merge Firebase user with custom user data
        const mergedUser = {
          ...firebaseUser,
          displayName: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
        } as FirebaseUser & User;
        
        setUser(mergedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user,
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};