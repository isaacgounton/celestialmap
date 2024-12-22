import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              CelestialMap
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/map" className="text-gray-600 hover:text-primary">
              Find Parishes
            </Link>
            <Link to="/marketplace" className="text-gray-600 hover:text-primary">
              Marketplace
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-primary">
                  Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-gray-600 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}