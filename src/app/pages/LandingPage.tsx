import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Sparkles, Search, Filter, Github } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="text-xl">Insighta Labs+</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="mb-6">
          <h1 className="text-6xl mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Turn Names into Insights
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Analyze gender, age, and nationality data instantly. Transform profile information into actionable demographic intelligence.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="gap-2 flex items-center"
          >
            <Github className="w-5 h-5" />
            Get Started with GitHub
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/app')}
          >
            View Demo
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl mb-3">Smart Profile Analysis</h3>
            <p className="text-gray-400">
              Automatically extract gender, age, and nationality insights from profile data with high accuracy.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl mb-3">Natural Language Search</h3>
            <p className="text-gray-400">
              Query your data using plain English. Try "young males from Nigeria" or "females aged 25-30".
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Filter className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl mb-3">Advanced Filtering & Sorting</h3>
            <p className="text-gray-400">
              Filter by gender, age group, country, and more. Sort and export data for deeper analysis.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          © 2026 Insighta Labs+. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
