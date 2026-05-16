import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, Sparkles, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useSearchProfilesQuery } from '@/feature/profileSlice';

interface SearchResult {
  id: string;
  name: string;
  gender: string;
  age: number;
  country: string;
  relevance: number;
}

const ITEMS_PER_PAGE = 10;

export function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const suggestions = [
    'young males from nigeria',
    'females aged 25-30',
    'people from asia under 35',
    'males over 40 from europe',
  ];

  // Fetch search results
  const { data: searchResults, isLoading } = useSearchProfilesQuery(
    { q: searchQuery, page: currentPage, limit: ITEMS_PER_PAGE },
    { skip: !searchQuery }
  );

  const results = searchResults?.data || [];
  const totalPages = searchResults?.totalPages || 0;
  const hasSearched = !!searchQuery;

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setQuery(q);
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl mb-2">Natural Language Search</h1>
          <p className="text-gray-400">Search profiles using plain English</p>
        </div>

        <Card className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Try: young males from nigeria"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <Button
              size="lg"
              onClick={() => handleSearch(query)}
              className="gap-2 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {!hasSearched && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {hasSearched && isLoading && (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-gray-400">Searching profiles...</p>
          </div>
        )}

        {hasSearched && !isLoading && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-400">
                Found <span className="text-white">{searchResults?.total || 0}</span> results for{' '}
                <span className="text-purple-400">"{searchQuery}"</span>
              </p>
            </div>

            {results.length > 0 ? (
              <>
                <div className="space-y-4 mb-6">
                  {results.map((result: SearchResult) => (
                    <div
                      key={result.id}
                      onClick={() => navigate(`/app/profiles/${result.id}`)}
                      className="cursor-pointer"
                    >
                      <Card className="hover:border-purple-500/50 transition-all h-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                              {result.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-lg mb-1">{result.name}</p>
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    result.gender?.toLowerCase() === 'male'
                                      ? 'bg-blue-500/10 text-blue-400'
                                      : 'bg-purple-500/10 text-purple-400'
                                  }`}
                                >
                                  {result.gender}
                                </span>
                                <span>{result.age} years old</span>
                                <span>{result.country}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400 mb-1">Relevance</p>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-800 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full"
                                  style={{ width: `${result.relevance}%` }}
                                />
                              </div>
                              <p className="text-sm">{result.relevance}%</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2">
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
              </>
            ) : (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl mb-2">No results found</h3>
                <p className="text-gray-400">
                  Try adjusting your search query or using different keywords
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
