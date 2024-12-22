import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { ImportButton } from '../admin/ImportButton';
import { CountrySelect } from '../admin/CountrySelect';
import { ref, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import { setAdminStatus } from '../../services/adminService';
import { countries } from '../../data/countries';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export function Admin() {
  const { isAdmin, loading } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const usersData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          email: data.email,
          role: data.role || 'user'
        }));
        setUsers(usersData);
      }
    };

    loadUsers();
  }, []);

  const handleSetAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await setAdminStatus(userId, isAdmin);
      toast.success(`User ${isAdmin ? 'promoted to' : 'removed from'} admin`);
    } catch (error) {
      toast.error('Failed to update admin status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access denied</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Import Controls */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Data Import</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Google Places Import</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Country
                  </label>
                  <CountrySelect onSelect={setSelectedCountry} />
                </div>
                <ImportButton
                  endpoint="importFromGooglePlaces"
                  label={`Import ${selectedCountry ? `${countries.find((c) => c.code === selectedCountry)?.name} ` : ''}Parishes`}
                  countryCode={selectedCountry}
                  source="places"
                  disabled={!selectedCountry}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Custom Maps Import</h3>
            <div className="flex gap-4">
              <ImportButton
                endpoint="importExistingPlaces"
                label="Import from My Maps"
                source="mymaps"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Manual Data Import</h3>
            <div className="flex gap-4">
              <ImportButton
                endpoint="importFromSpreadsheet"
                label="Import from Spreadsheet"
                source="spreadsheet"
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Management */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        
        {/* User List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Role</th>
                <th className="text-right py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.role}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleSetAdmin(user.id, user.role !== 'admin')}
                      className="px-3 py-1 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                      {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
