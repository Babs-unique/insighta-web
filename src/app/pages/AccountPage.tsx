import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Mail, Shield, LogOut, Loader } from 'lucide-react';
import { useGetCurrentUserQuery, useLogoutMutation } from '@/feature/authSlice';

export function AccountPage() {
  const navigate = useNavigate();
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUserQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-400">Loading account information...</p>
        </div>
      </div>
    );
  }

  const userData = currentUser?.data;
  const initials = userData?.username
    ? userData.username.split('.').map((n: string) => n[0].toUpperCase()).join('')
    : '?';

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                {initials}
              </div>
              <div>
                <h2 className="text-2xl mb-1">{userData?.username || 'User'}</h2>
                <p className="text-gray-400">{userData?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-800">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Username</p>
                  <p className="text-lg">{userData?.username || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email Address</p>
                  <p className="text-lg">{userData?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Role</p>
                  <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm">
                    {userData?.role || 'user'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-orange-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Member Since</p>
                  <p className="text-lg">
                    {userData?.joinedAt
                      ? new Date(userData.joinedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl mb-4">Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400">Last Login</span>
                <span>
                  {userData?.lastLogin
                    ? new Date(userData.lastLogin).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl mb-4">Actions</h2>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full">
                Change Password
              </Button>
              <Button variant="secondary" className="w-full">
                Update Email
              </Button>
              <Button variant="secondary" className="w-full">
                Download My Data
              </Button>
              <Button
                variant="ghost"
                className="w-full text-red-400 hover:bg-red-500/10 gap-2 flex items-center justify-center"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
