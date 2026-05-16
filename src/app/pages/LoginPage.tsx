import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Github, Sparkles } from 'lucide-react';
import { useGetAuthUrlQuery } from '@/feature/authSlice';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { data: authData, isLoading: isLoadingUrl, error: urlError } = useGetAuthUrlQuery();

  const errorParam = searchParams.get('error');
  const [showError, setShowError] = useState(!!errorParam);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleLogin = () => {
    if (authData?.authorizationUrl) {
      window.location.href = authData.authorizationUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">Insighta Labs+</h1>
          </div>
          <p className="text-gray-400">
            Sign in to access your demographic intelligence platform
          </p>
        </div>

        {showError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-red-400 text-sm">
              {errorParam === 'invalid_params'
                ? 'Invalid authentication parameters. Please try again.'
                : errorParam === 'exchange_failed'
                ? 'Failed to complete authentication. Please try again.'
                : 'Authentication was cancelled. Please try again.'}
            </p>
          </div>
        )}

        <Button
          size="lg"
          className="w-full gap-2 flex items-center justify-center"
          onClick={handleLogin}
          disabled={isLoadingUrl || !authData}
        >
          <Github className="w-5 h-5" />
          {isLoadingUrl ? 'Loading...' : 'Continue with GitHub'}
        </Button>

        {urlError && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded">
            <p className="text-red-400 text-xs">
              Failed to load authentication. Please refresh and try again.
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
}
