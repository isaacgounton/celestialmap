import React from 'react';
import { FiHome, FiBookOpen, FiShoppingBag, FiShoppingCart, FiTool } from 'react-icons/fi';
import { GiKnifeFork, GiGasStove } from 'react-icons/gi';

const navigationItems = [
  { icon: <FiHome size={20} />, label: 'Parishes' },
  { icon: <GiKnifeFork size={20} />, label: 'Restaurants' },
  { icon: <FiBookOpen size={20} />, label: 'Bookstores' },
  { icon: <FiShoppingBag size={20} />, label: 'Parish Shops' },
  { icon: <FiShoppingCart size={20} />, label: 'Grocery' },
  { icon: <GiGasStove size={20} />, label: 'Gas' },
  { icon: <FiTool size={20} />, label: 'Services' },
];

export function LeftNavigation() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <div className="relative">
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
              <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-left">
                <span className="text-gray-500">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}