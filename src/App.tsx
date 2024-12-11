import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadScriptNext } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';
import { Layout } from './components/layout/Layout';
import { ParishDetails } from './components/pages/ParishDetails';
import { Marketplace } from './components/pages/Marketplace';
import { Profile } from './components/pages/Profile';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './components/pages/Home';
import { Parishes } from './components/pages/Parishes';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const libraries: Libraries = ['places', 'geometry', 'drawing'];

const App = () => {
  return (
    <LoadScriptNext
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      version="weekly"
      loadingElement={
        <div className="w-full h-screen flex items-center justify-center">
          Loading Maps...
        </div>
      }
    >
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parish/:id" element={<ParishDetails />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/parishes" element={<Parishes />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </LoadScriptNext>
  );
}

export default App;