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
    address: '',
    latitude: 0,
    longitude: 0,
    leaderName: '',
    phone: '',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Parish Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded p-2"
                placeholder="St. Mary's Catholic Church"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Leader Name</label>
              <input
                type="text"
                value={formData.leaderName}
                onChange={e => setFormData({...formData, leaderName: e.target.value})}
                className="w-full border rounded p-2"
                placeholder="Rev. Fr. John Doe"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full border rounded p-2"
                placeholder="+234-123-456-7890"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full border rounded p-2"
                placeholder="123 Church Street, Lagos"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Latitude</label>
              <input
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={formData.latitude}
                onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value) || 0})}
                className="w-full border rounded p-2"
                placeholder="-90.000000 to 90.000000"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Longitude</label>
              <input
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={formData.longitude}
                onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value) || 0})}
                className="w-full border rounded p-2"
                placeholder="-180.000000 to 180.000000"
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