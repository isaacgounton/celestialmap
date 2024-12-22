import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';
import { Admin } from './components/pages/Admin';
import { LocationProvider } from './contexts/LocationContext';

const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <div className="min-h-screen bg-gray-50">
          <BrowserRouter>
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
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          </BrowserRouter>
          <Toaster position="top-right" />
        </div>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;