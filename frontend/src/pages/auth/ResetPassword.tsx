import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../api/client';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialToken = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialToken) {
      const msg = 'Reset link is invalid or missing.';
      setMessage(msg);
      toast.error(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setMessage(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await api.auth.resetPassword(initialToken, password);
      const msg = 'Password updated. Redirecting to login...';
      setMessage(msg);
      toast.success('Password updated');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding min-h-[80vh] flex items-center">
      <div className="container-tight max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-ink-light">Reset password</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-ink-light"
            placeholder="New password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-ink-light"
            placeholder="Confirm new password"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Reset password'}
          </button>
        </form>
        {message && <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{message}</p>}
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Back to{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
            login
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

