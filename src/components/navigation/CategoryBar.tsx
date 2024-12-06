import React from 'react';
import { FiHome, FiBookOpen, FiShoppingBag, FiShoppingCart, FiTool } from 'react-icons/fi';
import { GiKnifeFork, GiGasStove } from 'react-icons/gi';

interface CategoryBarProps {
  onCategorySelect?: (category: string) => void;
}

const categories = [
  { icon: <FiHome size={20} />, label: 'Parishes' },
  { icon: <GiKnifeFork size={20} />, label: 'Restaurants' },
  { icon: <FiBookOpen size={20} />, label: 'Bookstores' },
  { icon: <FiShoppingBag size={20} />, label: 'Parish Shops' },
  { icon: <FiShoppingCart size={20} />, label: 'Grocery' },
  { icon: <GiGasStove size={20} />, label: 'Gas' },
  { icon: <FiTool size={20} />, label: 'Services' },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({ onCategorySelect }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto px-4 py-2 no-scrollbar">
        {categories.map((category, index) => (
          <button
            key={index}
            className="flex flex-col items-center min-w-[80px] px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            {category.icon}
            <span className="text-sm mt-1">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};