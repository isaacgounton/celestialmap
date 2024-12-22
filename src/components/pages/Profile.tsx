import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
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
import type { User } from '../../types/User';

interface ParishFormData {
  email: string;
  name: string;
  leaderName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  latitude: number;
  longitude: number;
  description?: string;
  photos: string[]; // Make photos required with empty array default
  openingHours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

interface PersonalInformationPanelProps {
  user: User & { displayName: string }; // Add displayName requirement
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

interface FormFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  type?: 'text' | 'email' | 'tel' | 'select';
  options?: string[];
}

export function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showParishForm, setShowParishForm] = useState(false);

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  const handleParishSubmit = async (parishData: ParishFormData) => {
    try {
      const toastId = toast.loading('Adding parish...');
      await createParish({
        ...parishData,
        photos: parishData.photos || [] // Ensure photos is never undefined
      });
      toast.success('Parish added successfully!', { id: toastId });
      setShowParishForm(false);
    } catch (error) {
      console.error('Error creating parish:', error);
      toast.error('Failed to add parish. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
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
                src={user.photoURL || user.avatar || '/default-avatar.png'}
                alt={user.displayName || 'User'}
                className="w-24 h-24 rounded-full"
              />
              <button 
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
                aria-label="Edit profile picture"
              >
                <FiEdit2 size={16} />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="space-x-4">
            <Button
              variant="primary"
              onClick={() => setShowParishForm(true)}
            >
              Add my parish
            </Button>
            <Button
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
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
            <AdoptedParishesPanel parishes={user.adoptedParishes ?? []} />
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
function PersonalInformationPanel({ user, isEditing, setIsEditing }: PersonalInformationPanelProps) {
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
          <label htmlFor="user-bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="user-bio"
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            disabled={!isEditing}
            defaultValue={user.bio || ''}
            aria-label="User biography"
            placeholder="Tell us about yourself..."
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
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                className="w-full px-3 py-2 border rounded-md"
                aria-label="Current password input"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                className="w-full px-3 py-2 border rounded-md"
                aria-label="New password input"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                className="w-full px-3 py-2 border rounded-md"
                aria-label="Confirm new password input"
              />
            </div>
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
function FormField({ label, value, isEditing, type = 'text', options = [] }: FormFieldProps) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === 'select' ? (
        <select
          id={id}
          className="w-full px-3 py-2 border rounded-md"
          disabled={!isEditing}
          defaultValue={value}
          aria-label={`Select ${label.toLowerCase()}`}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          className="w-full px-3 py-2 border rounded-md"
          disabled={!isEditing}
          defaultValue={value}
          aria-label={`${label} input field`}
        />
      )}
    </div>
  );
}