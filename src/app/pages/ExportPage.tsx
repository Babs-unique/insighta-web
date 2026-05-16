import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Download, FileJson, FileSpreadsheet, FileText, Loader } from 'lucide-react';
import { useExportProfilesQuery } from '@/feature/profileSlice';

export function ExportPage() {
  const [format, setFormat] = useState('csv');
  const [filter, setFilter] = useState('all');
  const [shouldFetch, setShouldFetch] = useState(false);

  // Trigger export query only when user clicks export
  const { data: exportData, isLoading, error } = useExportProfilesQuery(
    { sort_by: 'name', order: 'asc', format },
    { skip: !shouldFetch }
  );

  const handleExport = () => {
    setShouldFetch(true);

    // Simulate file download
    setTimeout(() => {
      if (exportData) {
        const element = document.createElement('a');
        const file = new Blob([JSON.stringify(exportData)], {
          type: 'application/octet-stream',
        });
        element.href = URL.createObjectURL(file);
        element.download = `export_${Date.now()}.${format}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        setShouldFetch(false);
      }
    }, 500);
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Export Data</h1>
          <p className="text-gray-400">Download your profile data in various formats</p>
        </div>

        <Card>
          <h2 className="text-xl mb-6">Export Settings</h2>

          <div className="space-y-6">
            <Select
              label="Export Format"
              options={[
                { value: 'csv', label: 'CSV - Comma Separated Values' },
                { value: 'json', label: 'JSON - JavaScript Object Notation' },
                { value: 'xlsx', label: 'XLSX - Excel Spreadsheet' },
                { value: 'txt', label: 'TXT - Plain Text' },
              ]}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            />

            <Select
              label="Data Filter"
              options={[
                { value: 'all', label: 'All Profiles (12,543)' },
                { value: 'male', label: 'Males Only (6,522)' },
                { value: 'female', label: 'Females Only (6,021)' },
                { value: 'recent', label: 'Recent (Last 30 days)' },
              ]}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />

            <div className="border-t border-gray-800 pt-6">
              <h3 className="mb-4">Format Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setFormat('csv')}
                  className={`p-4 rounded-lg border transition-all ${
                    format === 'csv'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <p className="text-sm">CSV</p>
                </button>
                <button
                  onClick={() => setFormat('json')}
                  className={`p-4 rounded-lg border transition-all ${
                    format === 'json'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <FileJson className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <p className="text-sm">JSON</p>
                </button>
                <button
                  onClick={() => setFormat('xlsx')}
                  className={`p-4 rounded-lg border transition-all ${
                    format === 'xlsx'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm">XLSX</p>
                </button>
                <button
                  onClick={() => setFormat('txt')}
                  className={`p-4 rounded-lg border transition-all ${
                    format === 'txt'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">TXT</p>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-400 text-sm">
                  Export failed. Please try again.
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full gap-2 flex items-center justify-center"
              onClick={handleExport}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isLoading ? 'Exporting...' : 'Export Data'}
            </Button>
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="text-xl mb-4">Recent Exports</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <p>all_profiles.csv</p>
                <p className="text-sm text-gray-500">12,543 records</p>
              </div>
              <p className="text-sm text-gray-400">2 days ago</p>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <p>males_only.json</p>
                <p className="text-sm text-gray-500">6,522 records</p>
              </div>
              <p className="text-sm text-gray-400">5 days ago</p>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p>recent_profiles.xlsx</p>
                <p className="text-sm text-gray-500">1,284 records</p>
              </div>
              <p className="text-sm text-gray-400">1 week ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
