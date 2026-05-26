import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRoleRedirect, useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const [form,       setForm]       = useState({ email: '', password: '' });
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form);
      const from = location.state?.from?.pathname;
      navigate(from || getRoleRedirect(user?.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-primary) 0%, #243360 100%)',
      padding: 24,
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: 36 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
            FAQ Portal
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-3)' }}>Welcome back! Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(217,64,64,0.1)',
              border: '1px solid rgba(217,64,64,0.3)',
              borderRadius: 8, padding: '10px 14px',
              color: 'var(--color-danger)', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@university.edu"
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>
            <input
              className="form-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '12px', marginTop: 4, fontSize: 15 }}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Footer link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--color-text-3)' }}>
          Don't have an account?{' '}
          <Link to="/" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
}
