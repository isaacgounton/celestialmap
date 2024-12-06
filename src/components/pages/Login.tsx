import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../auth/LoginForm';

export function Login() {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/map');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <LoginForm 
                    onSuccess={handleLoginSuccess}
                    onRegisterClick={handleRegisterClick}
                />
            </div>
        </div>
    );
}