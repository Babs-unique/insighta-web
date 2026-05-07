import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  ageGroup: string;
  country: string;
}

export function ProfilesListPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    gender: 'all',
    ageGroup: 'all',
    country: '',
    minAge: '',
    maxAge: '',
  });

  const mockProfiles: Profile[] = [
    { id: '1', name: 'Sarah Johnson', gender: 'Female', age: 28, ageGroup: '25-34', country: 'USA' },
    { id: '2', name: 'Michael Chen', gender: 'Male', age: 34, ageGroup: '25-34', country: 'China' },
    { id: '3', name: 'Emma Williams', gender: 'Female', age: 42, ageGroup: '35-44', country: 'UK' },
    { id: '4', name: 'Ahmed Hassan', gender: 'Male', age: 29, ageGroup: '25-34', country: 'Egypt' },
    { id: '5', name: 'Maria Garcia', gender: 'Female', age: 31, ageGroup: '25-34', country: 'Spain' },
    { id: '6', name: 'James Smith', gender: 'Male', age: 45, ageGroup: '45-54', country: 'USA' },
    { id: '7', name: 'Yuki Tanaka', gender: 'Female', age: 26, ageGroup: '25-34', country: 'Japan' },
    { id: '8', name: 'Carlos Rodriguez', gender: 'Male', age: 38, ageGroup: '35-44', country: 'Mexico' },
  ];

  const totalPages = 5;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Profiles</h1>
        <p className="text-gray-400">Browse and filter all analyzed profiles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <h2 className="text-lg mb-4">Filters</h2>
          <div className="space-y-4">
            <Select
              label="Gender"
              options={[
                { value: 'all', label: 'All Genders' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            />

            <Select
              label="Age Group"
              options={[
                { value: 'all', label: 'All Ages' },
                { value: '18-24', label: '18-24' },
                { value: '25-34', label: '25-34' },
                { value: '35-44', label: '35-44' },
                { value: '45-54', label: '45-54' },
                { value: '55+', label: '55+' },
              ]}
              value={filters.ageGroup}
              onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
            />

            <Input
              label="Country"
              placeholder="e.g. USA"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Min Age"
                type="number"
                placeholder="18"
                value={filters.minAge}
                onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
              />
              <Input
                label="Max Age"
                type="number"
                placeholder="65"
                value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
              />
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setFilters({ gender: 'all', ageGroup: 'all', country: '', minAge: '', maxAge: '' })}
            >
              Reset Filters
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-400">Gender</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-400">Age</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-400">Age Group</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-400">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProfiles.map((profile) => (
                    <tr
                      key={profile.id}
                      onClick={() => navigate(`/app/profiles/${profile.id}`)}
                      className="border-b border-gray-800 hover:bg-gray-900 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4">{profile.name}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          profile.gender === 'Male'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {profile.gender}
                        </span>
                      </td>
                      <td className="py-4 px-4">{profile.age}</td>
                      <td className="py-4 px-4">{profile.ageGroup}</td>
                      <td className="py-4 px-4">{profile.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {mockProfiles.length} of 12,543 profiles
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
