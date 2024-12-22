import { FiHome, FiMapPin, FiBookOpen, FiShoppingBag, FiShoppingCart, FiTool } from 'react-icons/fi';
import { GiKnifeFork, GiGasStove } from 'react-icons/gi';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';

const navigationItems = [
  { icon: <FiHome size={20} />, label: 'Home', path: '/' },
  { icon: <FiMapPin size={20} />, label: 'Parishes', path: '/parishes' },
  { icon: <GiKnifeFork size={20} />, label: 'Restaurants', path: '/restaurants' },
  { icon: <FiBookOpen size={20} />, label: 'Bookstores', path: '/bookstores' },
  { icon: <FiShoppingBag size={20} />, label: 'Parish Shops', path: '/parish-shops' },
  { icon: <FiShoppingCart size={20} />, label: 'Grocery', path: '/grocery' },
  { icon: <GiGasStove size={20} />, label: 'Gas', path: '/gas' },
  { icon: <FiTool size={20} />, label: 'Services', path: '/services' },
];

interface LeftNavigationProps {
  isCollapsed: boolean;
}

export function LeftNavigation({ isCollapsed }: LeftNavigationProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo Section */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center justify-center">
          <Logo className={isCollapsed ? 'scale-75' : ''} collapsed={isCollapsed} />
        </Link>
      </div>

      {/* Search and Navigation */}
      <div className="p-4">
        <div className={`relative ${isCollapsed ? 'hidden' : 'block'}`}>
          <input
            type="text"
            placeholder="Search Parishes & Services"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="px-3 space-y-1">
          {navigationItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 ${
                  isCollapsed ? 'justify-center' : 'space-x-3'
                } ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } rounded-lg`}
              >
                <span className={isActive(item.path) ? 'text-white' : 'text-gray-500'}>
                  {item.icon}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}