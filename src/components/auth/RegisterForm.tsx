import * as React from "react";
import { useNavigate } from "react-router-dom";
import { register, loginWithGoogle } from "../../services/authService";
import { isValidEmail } from "../../utils/validation";
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
    onClose?: () => void;
}

export function RegisterForm({ onClose }: RegisterFormProps) {
    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSuccess = async () => {
        setIsAuthenticated(true);
        // Add small delay to allow auth state to update
        await new Promise(resolve => setTimeout(resolve, 500));
        if (onClose) {
            onClose();
        }
        navigate('/profile', { replace: true });
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative text-center py-8 bg-blue-600 text-white px-6">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('/church-pattern.png')] bg-repeat"></div>
                    <div className="relative">
                        <h2 className="text-3xl font-serif mb-2">Create Account</h2>
                        <p className="text-blue-100">Begin your spiritual journey</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <button
                        onClick={handleGoogleRegister}
                        disabled={loading}
                        className="w-full bg-white text-gray-700 border-2 border-gray-200 py-3 px-4 rounded-xl hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-3 transition duration-200 ease-in-out shadow-sm"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            className="w-5 h-5" 
                        />
                        <span className="font-medium">Continue with Google</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">or register with email</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium transition duration-200 ease-in-out transform hover:translate-y-[-1px] active:translate-y-0"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    <div className="text-center">
                        <button
                            onClick={handleLoginClick}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Already have an account? <span className="underline">Sign in</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}