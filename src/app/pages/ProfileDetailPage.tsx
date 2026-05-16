import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, User, Calendar, Globe, Loader } from 'lucide-react';
import { useGetProfileByIdQuery, useDeleteProfileMutation } from '@/feature/profileSlice';

export function ProfileDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [deleteProfile, { isLoading: isDeleting }] = useDeleteProfileMutation();

  const { data: profile, isLoading, isError, error } = useGetProfileByIdQuery(id || '', {
    skip: !id,
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      try {
        await deleteProfile(id || '').unwrap();
        navigate('/app/profiles');
      } catch (err) {
        console.error('Error deleting profile:', err);
      }
    }
  };

  if (!id) {
    return (
      <div className="p-8">
        <p className="text-red-400">Invalid profile ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
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
        <Card className="text-center py-12">
          <p className="text-red-400 mb-4">Error loading profile</p>
          <p className="text-gray-400 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </Card>
      </div>
    );
  }

  const genderProb = profile.gender?.probability || 0;
  const countryProb = profile.country?.probability || 0;

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
              {profile.name.split(' ').map((n: string) => n[0]).join('')}
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
                  <p className="text-lg">{profile.gender?.value || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full"
                        style={{ width: `${genderProb * 100}%` }}
                      />
                    </div>
                    <p className="text-lg">{(genderProb * 100).toFixed(0)}%</p>
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
                  <p className="text-lg">{profile.age?.value || 'N/A'} years old</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Age Group</p>
                  <p className="text-lg">{profile.age?.group || 'N/A'}</p>
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
                  <p className="text-lg">{profile.country?.value || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-600 to-blue-600 h-full rounded-full"
                        style={{ width: `${countryProb * 100}%` }}
                      />
                    </div>
                    <p className="text-lg">{(countryProb * 100).toFixed(0)}%</p>
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
                  {profile.analyzedAt ? new Date(profile.analyzedAt).toLocaleString() : 'N/A'}
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
              <Button
                variant="ghost"
                className="w-full text-red-400 hover:bg-red-500/10"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Profile'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
