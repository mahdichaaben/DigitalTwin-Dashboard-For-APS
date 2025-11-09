import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContextValue';
import { Layers, User, Lock, Loader2 } from 'lucide-react';
import AppLogo from '@/assets/AppIcon/icon.png';
import HomeLayout from '@/layouts/HomeLayout';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading: authLoading, error: authError } = useContext(AuthContext);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setFormError('Please enter both username and password.');
      return;
    }
    setFormError('');
    try {
      await login({ username, password });
      navigate('/');
    } catch {
      // Context handles auth errors
    }
  };

  useEffect(() => {
    if (formError) setFormError('');
  }, [username, password, formError]);

  const errorMessage = formError || authError;

  return (

      <div className="min-h-screen flex items-center justify-center relative">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,197,94,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.07) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-green-100 relative z-10">
          <div className="flex flex-col items-center justify-center mb-6 gap-2">
            <h2 className="text-3xl font-bold text-green-700 tracking-tight">Login</h2>
          </div>
          <div className="mb-4 flex items-center gap-2 justify-center">
            <span className="h-1 w-10 bg-green-500 rounded" />
            <span className="h-1 w-6 bg-blue-400 rounded" />
          </div>
          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm text-center">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50/30"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-semibold shadow hover:scale-[1.02] transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={authLoading}
            >
              {authLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-semibold">Register</a>
          </div>
        </div>
      </div>
  );
};

export default Login;
