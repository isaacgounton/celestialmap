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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // Removed unused location variable

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-4">
        <div className="flex items-center justify-between h-full">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={onToggleCollapse}
              aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} sidebar`}
              title={`${isCollapsed ? 'Expand' : 'Collapse'} sidebar`}
            >
              <FiSidebar size={20} className={isCollapsed ? 'rotate-180' : ''} />
            </button>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="form-select border border-gray-300 rounded-lg py-1 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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

          {/* Desktop Navigation - Now only contains profile section */}
          <div className="hidden md:flex items-center">
            {/* User Profile Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <span className="text-gray-700">
                    {user?.displayName || 'User'}
                  </span>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiUser size={20} className="text-gray-600" />
                  </div>
                  <FiChevronDown size={16} />
                </button>

                {/* Profile Dropdown */}
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
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {/* ...existing code... */}
          </nav>
        )}
      </div>
    </header>
  );
}