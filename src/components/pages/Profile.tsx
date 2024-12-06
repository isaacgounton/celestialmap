import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { ParishForm } from '../parish/ParishForm';
import { createParish } from '../../services/parishService';
import { Parish } from '../../types/Parish';

export function Profile() {
  const { user, logout } = useAuth();
  const [showParishForm, setShowParishForm] = useState(false);

  const handleCreateParish = async (data: Omit<Parish, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createParish(data);
      setShowParishForm(false);
      // Optionally show success message or refresh data
    } catch (error) {
      console.error('Error creating parish:', error);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Adopted Parishes</h2>
              <Button variant="primary" onClick={() => setShowParishForm(true)}>
                Add Parish
              </Button>
            </div>
            {(user.adoptedParishes ?? []).length === 0 ? (
              <p className="text-gray-600">You haven't adopted any parishes yet</p>
            ) : (
              <ul className="space-y-2">
                {(user.adoptedParishes ?? []).map((parishId) => (
                  <li key={parishId} className="text-gray-600">
                    Parish {parishId}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <Button variant="secondary">Edit Profile</Button>
              <Button variant="outline" onClick={logout}>Sign Out</Button>
            </div>
          </div>
        </div>
      </div>

      {showParishForm && (
        <ParishForm
          onSubmit={handleCreateParish}
          onCancel={() => setShowParishForm(false)}
        />
      )}
    </div>
  );
}