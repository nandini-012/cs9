import { Link } from 'react-router-dom';

export default function ComingSoon() {
  return (
    <div style={{
      minHeight: '100svh',
      background: 'var(--color-surface)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 24,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 60,
        marginBottom: 24, lineHeight: 1,
      }}>
        ⚡
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, marginBottom: 12 }}>
        Coming Soon
      </h1>
      <p style={{ fontSize: 16, color: 'var(--color-text-3)', maxWidth: 400, lineHeight: 1.7, marginBottom: 32 }}>
        This feature is under development. We're working hard to bring it to you soon!
      </p>
      <Link to="/feed" className="btn-primary" style={{ display: 'inline-flex' }}>
        ← Back to Feed
      </Link>
    </div>
  );
}
