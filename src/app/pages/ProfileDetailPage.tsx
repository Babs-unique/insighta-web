import { useNavigate, useParams } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, User, Calendar, Globe } from 'lucide-react';

export function ProfileDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const profile = {
    id,
    name: 'Sarah Johnson',
    gender: {
      value: 'Female',
      probability: 0.96,
    },
    age: {
      value: 28,
      group: '25-34',
    },
    country: {
      value: 'United States',
      code: 'USA',
      probability: 0.89,
    },
    analyzedAt: '2026-04-29T10:30:00Z',
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2 flex items-center"
        onClick={() => navigate('/app/profiles')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profiles
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-3xl mb-1">{profile.name}</h1>
              <p className="text-gray-400">Profile ID: {profile.id}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl">Gender Analysis</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Gender</p>
                  <p className="text-lg">{profile.gender.value}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full"
                        style={{ width: `${profile.gender.probability * 100}%` }}
                      />
                    </div>
                    <p className="text-lg">{(profile.gender.probability * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl">Age Analysis</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Estimated Age</p>
                  <p className="text-lg">{profile.age.value} years old</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Age Group</p>
                  <p className="text-lg">{profile.age.group}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-green-400" />
                <h2 className="text-xl">Nationality Analysis</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Country</p>
                  <p className="text-lg">{profile.country.value}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-600 to-blue-600 h-full rounded-full"
                        style={{ width: `${profile.country.probability * 100}%` }}
                      />
                    </div>
                    <p className="text-lg">{(profile.country.probability * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg mb-4">Metadata</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Analyzed At</p>
                <p className="text-sm">
                  {new Date(profile.analyzedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <span className="inline-block px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">
                  Verified
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg mb-4">Actions</h2>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full">
                Export Data
              </Button>
              <Button variant="ghost" className="w-full text-red-400">
                Delete Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
