import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadScriptNext } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';
import { Layout } from './components/layout/Layout';
import { ParishDetails } from './pages/ParishDetails';
import { Marketplace } from './pages/Marketplace';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </LoadScriptNext>
  );
}

export default App;