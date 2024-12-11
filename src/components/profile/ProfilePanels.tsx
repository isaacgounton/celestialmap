
import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Parish } from '../../types/Parish';

interface AdoptedParishesPanelProps {
  parishes: string[];
}

export function AdoptedParishesPanel({ parishes }: AdoptedParishesPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">My Adopted Parishes</h2>
      {parishes.length === 0 ? (
        <p className="text-gray-600">You haven't adopted any parishes yet.</p>
      ) : (
        <div className="space-y-4">
          {parishes.map((parishId) => (
            <div key={parishId} className="p-4 border rounded-lg">
              <p className="font-medium">Parish {parishId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LocationPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Location Preferences</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Search Location
          </label>
          <input
            type="text"
            placeholder="Enter your location"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Radius
          </label>
          <select className="w-full px-4 py-2 border rounded-lg">
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function ActivityPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <p className="font-medium">Parish Adoption</p>
          <p className="text-sm text-gray-500">St. Mary's Church - Oct 15, 2023</p>
        </div>
      </div>
    </div>
  );
}

export function NotificationPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive updates about your parishes</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
}