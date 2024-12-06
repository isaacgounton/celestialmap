import * as React from "react";
import { login, logout, isAuthenticated } from "../services/authService";
import type { User } from "../types/User";

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
                // TODO: Fetch user profile
                setUser({} as User);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (email: string, password: string) => {
        const user = await login({ email, password });
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