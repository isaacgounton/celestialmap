import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getParishById } from '../services/parishService';
import { Parish } from '../types/Parish';
import { Button } from '../components/ui/Button';
import { formatPhoneNumber } from '../utils/formatters';

export function ParishDetails() {
  const { id } = useParams<{ id: string }>();
  const [parish, setParish] = useState<Parish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadParish(id);
    }
  }, [id]);

  const loadParish = async (parishId: string) => {
    try {
      const data = await getParishById(parishId);
      setParish(data);
    } catch (error) {
      console.error('Error loading parish:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!parish) {
    return <div>Parish not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={parish.photos[0]}
          alt={parish.name}
          className="w-full h-64 object-cover"
        />
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{parish.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
              <p className="text-gray-600 mb-2">{parish.address}</p>
              <p className="text-gray-600 mb-2">{formatPhoneNumber(parish.phone)}</p>
              {parish.website && (
                <a
                  href={parish.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit Website
                </a>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Opening Hours</h2>
              {Object.entries(parish.openingHours).map(([day, hours]) => (
                <p key={day} className="text-gray-600 mb-1">
                  <span className="font-medium">{day}:</span> {hours}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button>Adopt this Parish</Button>
          </div>
        </div>
      </div>
    </div>
  );
}