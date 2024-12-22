import * as React from "react";
import { auth } from '../lib/firebase';  // Add this import
import { login, logout, isAuthenticated } from "../services/authService";
import type { User } from "../types/User";
import type { AuthUser } from "../types/auth";

export function useAuth() {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const authenticated = await isAuthenticated();
            if (authenticated) {
                // Get the current user from Firebase Auth
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const defaultUser: User = {
                        id: currentUser.uid, // Use Firebase Auth UID
                        name: currentUser.displayName || '',
                        email: currentUser.email || '',
                        role: 'user',
                    };
                    setUser(defaultUser);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const mapAuthUserToUser = (authUser: AuthUser): User => {
        return {
            id: authUser.id,
            name: authUser.displayName,
            email: authUser.email,
            role: authUser.role || 'user',
            photoURL: authUser.avatar,
            createdAt: authUser.createdAt?.toISOString(),
            updatedAt: authUser.updatedAt?.toISOString()
        };
    };

    const handleLogin = async (email: string, password: string) => {
        const authData = await login({ email, password });
        const user = mapAuthUserToUser(authData);
        setUser(user);
        return user;
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return {
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!user,
    };
}