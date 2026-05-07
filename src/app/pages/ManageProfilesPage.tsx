import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  country: string;
  createdAt: string;
}

export function ManageProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: 'Sarah Johnson', gender: 'Female', age: 28, country: 'USA', createdAt: '2026-04-29' },
    { id: '2', name: 'Michael Chen', gender: 'Male', age: 34, country: 'China', createdAt: '2026-04-28' },
    { id: '3', name: 'Emma Williams', gender: 'Female', age: 42, country: 'UK', createdAt: '2026-04-27' },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    gender: 'male',
    age: '',
    country: '',
  });

  const handleCreateProfile = () => {
    if (!newProfile.name || !newProfile.age || !newProfile.country) {
      alert('Please fill in all fields');
      return;
    }

    const profile: Profile = {
      id: String(profiles.length + 1),
      name: newProfile.name,
      gender: newProfile.gender === 'male' ? 'Male' : 'Female',
      age: parseInt(newProfile.age),
      country: newProfile.country,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProfiles([profile, ...profiles]);
    setNewProfile({ name: '', gender: 'male', age: '', country: '' });
    setShowCreateForm(false);
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      setProfiles(profiles.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl">Manage Profiles</h1>
            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
              Admin Only
            </span>
          </div>
          <p className="text-gray-400">Create and delete profiles in the system</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2 flex items-center"
        >
          <Plus className="w-5 h-5" />
          Create Profile
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6 border-purple-500/50">
          <h2 className="text-xl mb-6">Create New Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Full Name"
              placeholder="e.g. John Smith"
              value={newProfile.name}
              onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
            />
            <Select
              label="Gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
              value={newProfile.gender}
              onChange={(e) => setNewProfile({ ...newProfile, gender: e.target.value })}
            />
            <Input
              label="Age"
              type="number"
              placeholder="e.g. 28"
              value={newProfile.age}
              onChange={(e) => setNewProfile({ ...newProfile, age: e.target.value })}
            />
            <Input
              label="Country"
              placeholder="e.g. USA"
              value={newProfile.country}
              onChange={(e) => setNewProfile({ ...newProfile, country: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleCreateProfile}>
              Create Profile
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateForm(false);
                setNewProfile({ name: '', gender: 'male', age: '', country: '' });
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center gap-2 mb-6 text-orange-400">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">
            Warning: Deleting profiles is permanent and cannot be undone. Use with caution.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm text-gray-400">ID</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">Gender</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">Age</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">Country</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">Created</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr
                  key={profile.id}
                  className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-500">#{profile.id}</td>
                  <td className="py-4 px-4">{profile.name}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        profile.gender === 'Male'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-purple-500/10 text-purple-400'
                      }`}
                    >
                      {profile.gender}
                    </span>
                  </td>
                  <td className="py-4 px-4">{profile.age}</td>
                  <td className="py-4 px-4">{profile.country}</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">{profile.createdAt}</td>
                  <td className="py-4 px-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:bg-red-500/10 gap-1 flex items-center"
                      onClick={() => handleDeleteProfile(profile.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {profiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No profiles found. Create one to get started.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
