import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@cetro.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest<{ token: string; user: { name: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user_name', data.user.name);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2ee] grid place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-[420px] bg-white rounded-2xl border border-[#dfe2e6] p-8">
        <h1 className="text-[30px] font-bold text-[#1f2c3c] mb-2">Admin Login</h1>
        <p className="text-[#6b7683] text-[14px] mb-6">Access dashboard to control all website content.</p>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full h-12 rounded-lg border border-[#d8dde3] px-4 outline-none"
            placeholder="Email"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full h-12 rounded-lg border border-[#d8dde3] px-4 outline-none"
            placeholder="Password"
            required
          />
        </div>

        {error ? <p className="text-red-600 text-[13px] mt-3">{error}</p> : null}

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full h-12 rounded-lg bg-[#00A859] hover:bg-[#008f4c] text-white font-semibold disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
