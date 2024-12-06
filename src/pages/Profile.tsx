import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export function Profile() {
  const { user, logout } = useAuth();

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
            <h2 className="text-xl font-semibold mb-4">My Adopted Parishes</h2>
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
    </div>
  );
}