import React, { useState } from 'react';
import { Parish } from '../../types/Parish';
import { Button } from '../ui/Button';

interface ParishFormProps {
  onSubmit: (data: Omit<Parish, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ParishForm({ onSubmit, onCancel }: ParishFormProps) {
  const [formData, setFormData] = useState({
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
    photos: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Parish</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block mb-1">Parish Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Address Section */}
            <div className="col-span-2">
              <label className="block mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={e => setFormData({
                  ...formData,
                  address: {...formData.address, street: e.target.value}
                })}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={e => setFormData({
                  ...formData,
                  address: {...formData.address, city: e.target.value}
                })}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Province/State</label>
              <input
                type="text"
                value={formData.address.province}
                onChange={e => setFormData({
                  ...formData,
                  address: {...formData.address, province: e.target.value}
                })}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Country</label>
              <input
                type="text"
                value={formData.address.country}
                onChange={e => setFormData({
                  ...formData,
                  address: {...formData.address, country: e.target.value}
                })}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Postal Code</label>
              <input
                type="text"
                value={formData.address.postalCode}
                onChange={e => setFormData({
                  ...formData,
                  address: {...formData.address, postalCode: e.target.value}
                })}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="col-span-2">
              <label className="block mb-1">Parish Leader</label>
              <input
                type="text"
                value={formData.leaderName}
                onChange={e => setFormData({...formData, leaderName: e.target.value})}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
                className="w-full border rounded p-2"
                placeholder="https://"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block mb-1">Latitude</label>
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
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value) || 0})}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Longitude</label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value) || 0})}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Create Parish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}