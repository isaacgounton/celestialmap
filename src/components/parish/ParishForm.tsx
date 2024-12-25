import React, { useState, useEffect } from 'react';
import { Parish } from '../../types/Parish';
import { Button } from '../ui/Button';

interface ParishFormProps {
  parish?: Parish;  // Optional parish for edit mode
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Parish>) => Promise<void>;
}

interface ParishAddress {
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
}

export function ParishForm({ parish, isOpen, onClose, onSubmit }: ParishFormProps) {
  const [formData, setFormData] = useState<Partial<Parish> & { address: ParishAddress }>({
    name: '',
    address: {
      street: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
    },
    latitude: 0,
    longitude: 0,
    leaderName: '',
    phone: '',
    email: '',
    website: '',
    openingHours: {
      Monday: '8:00 AM - 5:00 PM',
      Tuesday: '8:00 AM - 5:00 PM',
      Wednesday: '8:00 AM - 5:00 PM',
      Thursday: '8:00 AM - 5:00 PM',
      Friday: '8:00 AM - 5:00 PM',
      Saturday: '8:00 AM - 5:00 PM',
      Sunday: '6:00 AM - 8:00 PM'
    },
    photos: []
  });

  // Load parish data when editing
  useEffect(() => {
    if (parish) {
      setFormData({
        ...parish,
        address: {
          street: parish.address?.street || '',
          city: parish.address?.city || '',
          province: parish.address?.province || '',
          country: parish.address?.country || '',
          postalCode: parish.address?.postalCode || '',
        },
        latitude: parish.latitude || 0,
        longitude: parish.longitude || 0,
        leaderName: parish.leaderName || '',
        phone: parish.phone || '',
        email: parish.email || '',
        website: parish.website || '',
        openingHours: parish.openingHours || {
          Monday: '8:00 AM - 5:00 PM',
          Tuesday: '8:00 AM - 5:00 PM',
          Wednesday: '8:00 AM - 5:00 PM',
          Thursday: '8:00 AM - 5:00 PM',
          Friday: '8:00 AM - 5:00 PM',
          Saturday: '8:00 AM - 5:00 PM',
          Sunday: '6:00 AM - 8:00 PM'
        },
        photos: parish.photos || []
      });
    }
  }, [parish]);

  const handleAddressChange = (field: keyof ParishAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...(prev.address as ParishAddress),
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const generateId = (fieldName: string) => `parish-${fieldName.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {parish ? 'Edit Parish' : 'Add New Parish'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor={generateId('name')} className="block mb-1">Parish Name</label>
              <input
                id={generateId('name')}
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded p-2"
                required
                aria-label="Parish name"
              />
            </div>

            {/* Address Section */}
            <div className="col-span-2">
              <label htmlFor={generateId('street')} className="block mb-1">Street Address</label>
              <input
                id={generateId('street')}
                type="text"
                value={formData.address?.street || ''}
                onChange={e => handleAddressChange('street', e.target.value)}
                className="w-full border rounded p-2"
                required
                aria-label="Street address"
              />
            </div>

            <div>
              <label htmlFor={generateId('city')} className="block mb-1">City</label>
              <input
                id={generateId('city')}
                type="text"
                value={formData.address.city}
                onChange={e => handleAddressChange('city', e.target.value)}
                className="w-full border rounded p-2"
                required
                aria-label="City"
              />
            </div>

            <div>
              <label htmlFor={generateId('province')} className="block mb-1">Province/State</label>
              <input
                id={generateId('province')}
                type="text"
                value={formData.address.province}
                onChange={e => handleAddressChange('province', e.target.value)}
                className="w-full border rounded p-2"
                required
                aria-label="Province or state"
              />
            </div>

            <div>
              <label htmlFor={generateId('country')} className="block mb-1">Country</label>
              <input
                id={generateId('country')}
                type="text"
                value={formData.address.country}
                onChange={e => handleAddressChange('country', e.target.value)}
                className="w-full border rounded p-2"
                required
                aria-label="Country"
              />
            </div>

            <div>
              <label htmlFor={generateId('postal')} className="block mb-1">Postal Code</label>
              <input
                id={generateId('postal')}
                type="text"
                value={formData.address.postalCode}
                onChange={e => handleAddressChange('postalCode', e.target.value)}
                className="w-full border rounded p-2"
                required
                aria-label="Postal code"
              />
            </div>

            {/* Contact Information */}
            <div className="col-span-2">
              <label htmlFor={generateId('leader')} className="block mb-1">Parish Leader</label>
              <input
                id={generateId('leader')}
                type="text"
                value={formData.leaderName}
                onChange={e => setFormData({...formData, leaderName: e.target.value})}
                className="w-full border rounded p-2"
                aria-label="Parish leader name"
              />
            </div>

            <div>
              <label htmlFor={generateId('phone')} className="block mb-1">Phone</label>
              <input
                id={generateId('phone')}
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full border rounded p-2"
                aria-label="Phone number"
                placeholder="e.g., +1 234 567 8900"
              />
            </div>

            <div>
              <label htmlFor={generateId('email')} className="block mb-1">Email</label>
              <input
                id={generateId('email')}
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border rounded p-2"
                aria-label="Email address"
                placeholder="parish@example.com"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor={generateId('website')} className="block mb-1">Website</label>
              <input
                id={generateId('website')}
                type="url"
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
                className="w-full border rounded p-2"
                placeholder="https://"
                aria-label="Website URL"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor={generateId('latitude')} className="block mb-1">Latitude</label>
                <a
                  href="https://locatorgabrielle.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Need coordinates? Click here
                </a>
              </div>
              <input
                id={generateId('latitude')}
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value) || 0})}
                className="w-full border rounded p-2"
                required
                aria-label="Latitude coordinate"
              />
            </div>

            <div>
              <label htmlFor={generateId('longitude')} className="block mb-1">Longitude</label>
              <input
                id={generateId('longitude')}
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value) || 0})}
                className="w-full border rounded p-2"
                required
                aria-label="Longitude coordinate"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {parish ? 'Update Parish' : 'Create Parish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}