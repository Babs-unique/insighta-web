import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Github, Sparkles } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl">Insighta Labs+</h1>
          </div>
          <p className="text-gray-400">
            Sign in to access your demographic intelligence platform
          </p>
        </div>

        <Button
          size="lg"
          className="w-full gap-2 flex items-center justify-center"
          onClick={handleLogin}
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </Button>

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
}
