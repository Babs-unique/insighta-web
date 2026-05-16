import { Card } from '../components/Card';
import { Users, User, Globe, TrendingUp } from 'lucide-react';
import { useGetProfilesQuery } from '@/feature/profileSlice';

export function DashboardPage() {
  const { data: profilesResponse } = useGetProfilesQuery(undefined);
  const profiles = profilesResponse?.data || [];

  const percentMale = profiles.length ? Math.round((profiles.filter((p : { gender: string }) => p.gender === 'Male').length / profiles.length) * 100) : 0;
  const percentFemale = profiles.length ? Math.round((profiles.filter((p : { gender: string }) => p.gender === 'Female').length / profiles.length) * 100) : 0;


  const stats = [
    {
      label: 'Total Profiles',
      value: profiles ? profiles.length.toLocaleString() : '0',
      icon: Users,
      change: '+12%',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Male / Female',
      value: profiles ? `${percentMale}% / ${percentFemale}%` : '0% / 0%',
      icon: User,
      change: 'Balanced',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Top Country',
      value: profiles && profiles.length > 0 ? profiles[0].country : 'United States',
      icon: Globe,
      change: '3,421 profiles',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'This Month',
      value: profiles ? `+${Math.round(profiles.length * 0.18).toLocaleString()}` : '+1,284',
      icon: TrendingUp,
      change: '+18%',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const recentActivity = [
    { name: 'Sarah Johnson', action: 'Profile analyzed', time: '2 min ago', country: 'USA' },
    { name: 'Michael Chen', action: 'Profile analyzed', time: '5 min ago', country: 'China' },
    { name: 'Emma Williams', action: 'Profile analyzed', time: '12 min ago', country: 'UK' },
    { name: 'Ahmed Hassan', action: 'Profile analyzed', time: '18 min ago', country: 'Egypt' },
    { name: 'Maria Garcia', action: 'Profile analyzed', time: '25 min ago', country: 'Spain' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your demographic intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:border-purple-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.change}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <h2 className="text-xl mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-sm">
                  {activity.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p>{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{activity.country}</p>
                <p className="text-xs text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
