import React from 'react';

interface TopParishesProps {
  country?: string;
}

export const TopParishes: React.FC<TopParishesProps> = ({ country = 'Nigeria' }) => {
  const topParishes = [
    { id: '1', name: 'CCC Parish 1', location: 'Lagos, Nigeria' },
    { id: '2', name: 'CCC Parish 2', location: 'Ibadan, Nigeria' },
    { id: '3', name: 'CCC Parish 3', location: 'Port Harcourt, Nigeria' },
    { id: '4', name: 'CCC Parish 4', location: 'Abuja, Nigeria' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
      <h2 className="text-lg font-semibold mb-3">
        Explore top parishes in {country}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {topParishes.map((parish) => (
          <div key={parish.id} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
            <h3 className="font-medium">{parish.name}</h3>
            <p className="text-sm text-gray-600">{parish.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};