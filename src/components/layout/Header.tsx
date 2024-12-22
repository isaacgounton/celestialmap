import { useState } from 'react';
import { Link } from 'react-router-dom'; // Removed useLocation import
import { FiMenu, FiX, FiUser, FiChevronDown, FiSidebar } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';  // Updated import path
import { countries } from '../../data/countries';
import { useAdmin } from '../../hooks/useAdmin';  // Add this import
import { useLocation } from '../../contexts/LocationContext';

interface HeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Header({ isCollapsed, onToggleCollapse }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin } = useAdmin();  // Add this hook
  const { selectedCountry, setSelectedCountry } = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // Removed isMenuOpen state as it's no longer needed

  const renderProfileButton = (isMobile = false) => (
    <div className="relative">
      <button
        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        className={`hover:bg-gray-50 rounded-lg flex items-center ${
          isMobile ? 'p-2' : 'px-3 py-2 space-x-3'
        }`}
        aria-label="User menu"
      >
        {/* Show name only on desktop */}
        {!isMobile && isAuthenticated && (
          <span className="text-gray-700 hidden md:block">
            {user?.displayName || user?.email || 'User'}
          </span>
        )}
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <FiUser size={20} className="text-gray-600" />
          )}
        </div>
        {/* Show dropdown arrow only on desktop */}
        {!isMobile && <FiChevronDown size={16} className="hidden md:block text-gray-600" />}
      </button>

      {isProfileDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsProfileDropdownOpen(false)}
          >
            Profile
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsProfileDropdownOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              setIsProfileDropdownOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30">
      <div className="h-full px-4">
        <div className="flex items-center justify-between h-full">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Menu buttons */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={onToggleCollapse}
              aria-label="Toggle menu"
            >
              {!isCollapsed ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            
            <button 
              className="hidden md:block p-2 hover:bg-gray-100 rounded-lg"
              onClick={onToggleCollapse}
              aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} sidebar`}
            >
              <FiSidebar size={20} className={isCollapsed ? 'rotate-180' : ''} />
            </button>

            {/* Country selector - responsive width */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full md:w-48 form-select border border-gray-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              aria-label="Select country"
              title="Select country"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Right section - Profile */}
          <div className="flex items-center">
            {/* Mobile profile */}
            <div className="md:hidden">
              {isAuthenticated ? (
                renderProfileButton(true)
              ) : (
                <Link
                  to="/login"
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Login"
                >
                  <FiUser size={24} className="text-gray-600" />
                </Link>
              )}
            </div>

            {/* Desktop profile */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                renderProfileButton(false)
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
      </div>
    </header>
  );
}