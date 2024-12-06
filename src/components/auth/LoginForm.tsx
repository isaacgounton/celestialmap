import * as React from "react";
import { login, loginWithGoogle } from "../../services/authService";
import { isValidEmail } from "../../utils/validation";

interface LoginFormProps {
    onSuccess: () => void;
    onRegisterClick: () => void;
}

export function LoginForm({ onSuccess, onRegisterClick }: LoginFormProps) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async () => {
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await login({ email, password });
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            await loginWithGoogle();
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to login with Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
                Welcome Back
            </h2>

            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white text-gray-700 border border-gray-300 p-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-3 mb-4 shadow-sm"
            >
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    className="w-5 h-5" 
                />
                Continue with Google
            </button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
            </div>

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`p-2 border rounded ${error && error.includes("email") ? "border-red-500" : "border-gray-300"}`}
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`p-2 border rounded ${error && error.includes("password") ? "border-red-500" : "border-gray-300"}`}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Loading..." : "Login"}
            </button>

            <button
                onClick={onRegisterClick}
                disabled={loading}
                className="text-blue-500 hover:underline"
            >
                Don't have an account? Register
            </button>
        </div>
    );
}