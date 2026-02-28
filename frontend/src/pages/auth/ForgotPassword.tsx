import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.auth.forgotPassword(email);
      const msg =
        res && typeof res === 'object' && 'ok' in res
          ? 'If that email exists, a reset link has been sent.'
          : 'If that email exists, a reset link has been sent.';
      setMessage(msg);
      toast.success(msg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to request password reset';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding min-h-[80vh] flex items-center">
      <div className="container-tight max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-ink-light">Forgot password</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Enter your email address. If we find an account with that email, we&apos;ll send a password reset link.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-ink-light"
            placeholder="you@example.com"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send reset token'}
          </button>
        </form>
        {message && <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{message}</p>}
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

