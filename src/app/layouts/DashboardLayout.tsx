import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Users, Search, Download, Shield, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useGetCurrentUserQuery } from '@/feature/authSlice';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: user } = useGetCurrentUserQuery();
  const currentUser = user?.data ?? user;
  const isAdmin = currentUser?.role === 'admin';

  const menuItems = [
    { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/profiles', label: 'Profiles', icon: Users },
    { path: '/app/search', label: 'Search', icon: Search },
    { path: '/app/export', label: 'Export', icon: Download },
    ...(isAdmin ? [{ path: '/app/manage', label: 'Manage', icon: Shield }] : []),
    { path: '/app/account', label: 'Account', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="text-lg">Insighta Labs+</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive(item.path)
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
          <div></div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <User className="w-5 h-5" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    navigate('/app/account');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Account
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-2 text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gradient-to-br from-black to-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
