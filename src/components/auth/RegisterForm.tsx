import * as React from "react";
import { useNavigate } from "react-router-dom";
import { register, loginWithGoogle } from "../../services/authService";
import { isValidEmail } from "../../utils/validation";

interface RegisterFormProps {
    onClose?: () => void;
}

export function RegisterForm({ onClose }: RegisterFormProps) {
    const navigate = useNavigate();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSuccess = () => {
        if (onClose) {
            onClose();
        }
        navigate('/map');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError("Name is required");
            return false;
        }
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            await register({ email, password, name });
            handleSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setLoading(true);
        setError("");
        try {
            await loginWithGoogle();
            handleSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to register with Google");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
                Create an Account
            </h2>

            <button
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full bg-white text-gray-700 border border-gray-300 p-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-3 mb-4 shadow-sm"
            >
                <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google" 
                    className="w-5 h-5" 
                />
                Sign up with Google
            </button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or register with email</span>
                </div>
            </div>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="p-2 border rounded border-gray-300"
            />

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-2 border rounded border-gray-300"
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-2 border rounded border-gray-300"
            />

            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="p-2 border rounded border-gray-300"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                onClick={handleRegister}
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Creating account..." : "Register"}
            </button>

            <button
                onClick={handleLoginClick}
                disabled={loading}
                className="text-blue-500 hover:underline"
            >
                Already have an account? Login
            </button>
        </div>
    );
}