import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div style={{
      minHeight: '100svh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-surface)', textAlign: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 10 }}>
        Access Denied
      </h1>
      <p style={{ color: 'var(--color-text-3)', fontSize: 15, maxWidth: 360, lineHeight: 1.7, marginBottom: 28 }}>
        You don't have permission to view this page. Please contact your administrator if you believe this is an error.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/feed"  className="btn-primary"  style={{ display: 'inline-flex' }}>Go to Feed</Link>
        <Link to="/login" className="btn-ghost" style={{ display: 'inline-flex' }}>Sign In</Link>
      </div>
    </div>
  );
}
