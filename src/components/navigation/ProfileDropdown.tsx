import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../hooks/useAdmin';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const ProfileDropdown = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center">
        {/* Avatar button */}
        <div className="h-8 w-8 rounded-full bg-gray-300">
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => navigate('/profile')}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex w-full px-4 py-2 text-sm text-gray-700`}
              >
                Your Profile
              </button>
            )}
          </Menu.Item>

          {isAdmin && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate('/admin')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex w-full px-4 py-2 text-sm text-gray-700`}
                >
                  Admin Dashboard
                </button>
              )}
            </Menu.Item>
          )}

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => navigate('/settings')}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex w-full px-4 py-2 text-sm text-gray-700`}
              >
                Settings
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex w-full px-4 py-2 text-sm text-gray-700`}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
