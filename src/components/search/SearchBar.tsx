import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, debounceMs = 300 }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(() => {
    onSearch?.(searchTerm);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    const timer = setTimeout(debouncedSearch, debounceMs);
    return () => clearTimeout(timer);
  }, [debouncedSearch, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="px-4 py-3">
      <div className="relative max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search Parishes & Services"
          value={searchTerm}
          onChange={handleChange}
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search parishes and services"
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      </div>
    </div>
  );
};