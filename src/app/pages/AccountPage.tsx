import { useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Mail, Shield, LogOut } from 'lucide-react';

export function AccountPage() {
  const navigate = useNavigate();

  const user = {
    username: 'sarah.johnson',
    email: 'sarah.johnson@example.com',
    role: 'Admin',
    joinedAt: '2025-01-15',
    lastLogin: '2026-04-29T09:15:00Z',
  };

  const handleLogout = () => {
    navigate('/');
  };

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
                {user.username.split('.').map(n => n[0].toUpperCase()).join('')}
              </div>
              <div>
                <h2 className="text-2xl mb-1">{user.username}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-800">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Username</p>
                  <p className="text-lg">{user.username}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email Address</p>
                  <p className="text-lg">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Role</p>
                  <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-orange-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Member Since</p>
                  <p className="text-lg">
                    {new Date(user.joinedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
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
                <span>{new Date(user.lastLogin).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400">Total Searches</span>
                <span>1,247</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-400">Profiles Analyzed</span>
                <span>12,543</span>
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
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
