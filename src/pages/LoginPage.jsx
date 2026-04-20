import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { login } from '../services/api';

const btnGradient = 'bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4]';

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(username, password);
      onLogin(data.token);
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-[45px] shadow-2xl p-10 w-full max-w-[380px] animate-in fade-in zoom-in duration-500">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full text-gray-800 outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full text-gray-800 outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-full ${btnGradient} text-white font-bold tracking-widest hover:scale-[1.02] active:scale-95 transition-all uppercase disabled:opacity-60`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
