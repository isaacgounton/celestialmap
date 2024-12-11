import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiEdit2, FiCreditCard, FiLock, FiHeart, FiMapPin, FiActivity, FiBell } from 'react-icons/fi';
import { TabPanel, Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { 
  AdoptedParishesPanel, 
  LocationPanel, 
  ActivityPanel, 
  NotificationPanel 
} from '../profile/ProfilePanels';
import { ParishForm } from '../parish/ParishForm';
import { createParish } from '../../lib/firebase';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showParishForm, setShowParishForm] = useState(false);

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  const handleParishSubmit = async (parishData) => {
    try {
      const toastId = toast.loading('Adding parish...');
      await createParish(parishData);
      toast.success('Parish added successfully!', { id: toastId });
      setShowParishForm(false);
    } catch (error) {
      console.error('Error creating parish:', error);
      toast.error('Failed to add parish. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-24 h-24 rounded-full"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700">
                <FiEdit2 size={16} />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.displayName}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {user.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowParishForm(true)}
          >
            Add my parish
          </Button>
        </div>
      </div>

      {/* Parish Form Modal */}
      {showParishForm && (
        <ParishForm
          onSubmit={handleParishSubmit}
          onCancel={() => setShowParishForm(false)}
        />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
              <TabPanel id="personal" icon={<FiUser />} label="Personal Information" />
              <TabPanel id="parishes" icon={<FiHeart />} label="My Parishes" />
              <TabPanel id="security" icon={<FiLock />} label="Security" />
              <TabPanel id="billing" icon={<FiCreditCard />} label="Billing" />
              <TabPanel id="location" icon={<FiMapPin />} label="Location" />
              <TabPanel id="activity" icon={<FiActivity />} label="Activity" />
              <TabPanel id="notifications" icon={<FiBell />} label="Notifications" />
            </Tabs>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Personal Information Section */}
          {activeTab === 'personal' && (
            <PersonalInformationPanel user={user} isEditing={isEditing} setIsEditing={setIsEditing} />
          )}

          {/* My Parishes Section */}
          {activeTab === 'parishes' && (
            <AdoptedParishesPanel parishes={user.adoptedParishes} />
          )}

          {/* Security Section */}
          {activeTab === 'security' && (
            <SecurityPanel />
          )}

          {/* Billing Section */}
          {activeTab === 'billing' && (
            <BillingPanel />
          )}

          {/* Location Preferences */}
          {activeTab === 'location' && (
            <LocationPanel />
          )}

          {/* Activity History */}
          {activeTab === 'activity' && (
            <ActivityPanel />
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <NotificationPanel />
          )}
        </div>
      </div>
    </div>
  );
}

// Panel Components
function PersonalInformationPanel({ user, isEditing, setIsEditing }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <Button
          variant="secondary"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            value={user.displayName}
            isEditing={isEditing}
          />
          <FormField
            label="Email"
            value={user.email}
            isEditing={isEditing}
            type="email"
          />
          <FormField
            label="Phone"
            value={user.phone || 'Not set'}
            isEditing={isEditing}
            type="tel"
          />
          <FormField
            label="Language"
            value={user.language || 'English'}
            isEditing={isEditing}
            type="select"
            options={['English', 'Spanish', 'French']}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            disabled={!isEditing}
            defaultValue={user.bio || ''}
          />
        </div>
      </div>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <form className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-3 py-2 border rounded-md"
            />
            <Button variant="primary">Update Password</Button>
          </form>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Protect your account with 2FA</p>
            <Button variant="secondary">Enable 2FA</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Billing Information</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {/* Example Card */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <FiCreditCard size={24} />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/24</p>
                </div>
              </div>
              <Button variant="secondary">Remove</Button> {/* Changed from "text" to "secondary" */}
            </div>
            <Button variant="secondary">Add New Card</Button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Billing History</h3>
          <div className="space-y-4">
            {/* Example Transaction */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Parish Store Purchase</p>
                <p className="text-sm text-gray-500">Oct 15, 2023</p>
              </div>
              <p className="font-medium">$25.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function FormField({ label, value, isEditing, type = 'text', options = [] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === 'select' ? (
        <select
          className="w-full px-3 py-2 border rounded-md"
          disabled={!isEditing}
          defaultValue={value}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 border rounded-md"
          disabled={!isEditing}
          defaultValue={value}
        />
      )}
    </div>
  );
}