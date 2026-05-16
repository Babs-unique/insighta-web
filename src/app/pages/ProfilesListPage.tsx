import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetProfilesQuery } from '@/feature/profileSlice';

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  ageGroup: string;
  country: string;
}

const ITEMS_PER_PAGE = 10;

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

  // Fetch filtered profiles
  const { 
    data: profilesResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetProfilesQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    gender: filters.gender,
    ageGroup: filters.ageGroup,
    country: filters.country,
    minAge: filters.minAge,
    maxAge: filters.maxAge,
  });

  const profiles = profilesResponse?.data || [];
  const totalPages = profilesResponse?.totalPages || 0;
  const total = profilesResponse?.total || 0;

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  const handleResetFilters = () => {
    handleFilterChange({
      gender: 'all',
      ageGroup: 'all',
      country: '',
      minAge: '',
      maxAge: '',
    });
  };

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
              onChange={(e) => handleFilterChange({ ...filters, gender: e.target.value })}
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
              onChange={(e) => handleFilterChange({ ...filters, ageGroup: e.target.value })}
            />

            <Input
              label="Country"
              placeholder="e.g. USA"
              value={filters.country}
              onChange={(e) => handleFilterChange({ ...filters, country: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Min Age"
                type="number"
                placeholder="18"
                value={filters.minAge}
                onChange={(e) => handleFilterChange({ ...filters, minAge: e.target.value })}
              />
              <Input
                label="Max Age"
                type="number"
                placeholder="65"
                value={filters.maxAge}
                onChange={(e) => handleFilterChange({ ...filters, maxAge: e.target.value })}
              />
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Loading profiles...</p>
              </div>
            ) : isError ? (
              <div className="p-8 text-center">
                <p className="text-red-400">
                  Error loading profiles: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">No profiles found matching your filters.</p>
              </div>
            ) : (
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
                    {profiles.map((profile: Profile) => (
                      <tr
                        key={profile.id}
                        onClick={() => navigate(`/app/profiles/${profile.id}`)}
                        className="border-b border-gray-800 hover:bg-gray-900 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-4">{profile.name}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            profile.gender?.toLowerCase() === 'male'
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
            )}
          </Card>

          {!isLoading && profiles.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} profiles
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1 || isLoading}
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
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
