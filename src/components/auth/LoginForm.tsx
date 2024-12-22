import * as React from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithGoogle } from "../../services/authService";
import { isValidEmail } from "../../utils/validation";
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onClose?: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth(); // Only use what we need
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSuccess = async () => {
    if (onClose) {
      onClose();
    }
    navigate('/profile', { replace: true });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");

    try {
      setLoading(true);
      await login({ email, password });
      handleSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      setLoading(true);
      await loginWithGoogle();
      handleSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="relative text-center py-8 bg-blue-600 text-white px-6">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('/church-pattern.png')] bg-repeat"></div>
          <div className="relative">
            <h2 className="text-3xl font-serif mb-2">Welcome Back</h2>
            <p className="text-blue-100">Continue your spiritual journey</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading || authLoading}
            className="w-full bg-white text-gray-700 border-2 border-gray-200 py-3 px-4 rounded-xl 
              hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-3 
              transition duration-200 ease-in-out shadow-sm"
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
              <span className="px-4 bg-white text-gray-500">or continue with email</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 
                  focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 
                  focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || authLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 
              disabled:opacity-50 font-medium transition duration-200 ease-in-out transform 
              hover:translate-y-[-1px] active:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center">
            <button
              onClick={handleRegisterClick}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Don't have an account? <span className="underline">Register here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}