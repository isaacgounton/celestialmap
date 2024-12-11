import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPhone, FiGlobe, FiMapPin, FiClock, FiChevronRight, FiHeart } from 'react-icons/fi';
import { getParishById } from '../../services/parishService';
import { Parish } from '../../types/Parish';
import { Button } from '../ui/Button';
import { formatPhoneNumber } from '../../utils/formatters';

function formatAddress(address: any) {
  if (!address) return '';
  const { street, city, province, postalCode, country } = address;
  return `${street}, ${city}, ${province} ${postalCode}, ${country}`.trim();
}

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading parish details...</div>
      </div>
    );
  }

  if (!parish) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Parish not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/parishes" className="hover:text-primary">Parishes</Link>
          <FiChevronRight size={14} />
          <span className="text-gray-900">{parish?.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96">
        {parish?.photos?.length > 0 ? (
          <div className="absolute inset-0">
            <img
              src={parish.photos[0]}
              alt={parish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-8 w-full">
            <h1 className="text-4xl font-bold text-white mb-4">{parish?.name}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-600">
                {parish?.description ?? 'No description available.'}
              </p>
            </div>

            {/* Mass Schedule */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Mass Schedule</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(parish?.openingHours || {}).map(([day, hours]) => (
                  <div key={day} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <FiClock className="text-primary mt-1" />
                    <div>
                      <p className="font-medium">{day}</p>
                      <p className="text-gray-600">{hours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiMapPin className="text-primary mt-1" />
                  <p className="text-gray-600">{formatAddress(parish?.address)}</p>
                </div>
                {parish?.phone && (
                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-primary" />
                    <a href={`tel:${parish.phone}`} className="text-gray-600 hover:text-primary">
                      {formatPhoneNumber(parish.phone)}
                    </a>
                  </div>
                )}
                {parish?.website && (
                  <div className="flex items-center space-x-3">
                    <FiGlobe className="text-primary" />
                    <a
                      href={parish.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="primary"
              className="w-full flex items-center justify-center space-x-2"
            >
              <FiHeart />
              <span>Adopt this Parish</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}