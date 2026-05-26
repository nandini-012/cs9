export default function TagPill({ label }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      background: 'var(--color-surface)',
      color: 'var(--color-text-2)',
      border: '1px solid var(--color-border)',
    }}>
      {label}
    </span>
  );
}
