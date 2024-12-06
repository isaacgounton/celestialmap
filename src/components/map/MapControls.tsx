import React from 'react';

interface MapControlsProps {
  onRefresh: () => void;
  onSearch: () => void;
  loading?: boolean;
}

export function MapControls({ onRefresh, onSearch, loading }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <button
        onClick={onRefresh}
        disabled={loading}
        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 disabled:opacity-50"
        aria-label="Refresh location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
      <button
        onClick={onSearch}
        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
        aria-label="Search location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}