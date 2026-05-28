import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      window.location.href = '/';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-root">
      <div className="login-page-bg-pattern" />
      <div className="login-page-card-wrapper">
        <div className="login-page-card glass-card">
          <div className="login-page-header">
            <div className="login-brand">
              <h1 className="login-logo">Vicharanashala Lab</h1>
              <p className="login-tagline">IIT Ropar Internship Portal</p>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Welcome Back</h2>

            {error && <div className="login-error">{error}</div>}

            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@iitr.ac.in"
                required
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="login-actions">
              <button type="submit" className="btn-submit-login" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>Demo accounts: <code>admin@iitr.ac.in</code> / <code>student@iitr.ac.in</code> — password: <code>password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}