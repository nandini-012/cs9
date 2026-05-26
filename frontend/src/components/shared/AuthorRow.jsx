import Avatar from './Avatar';
import { getUserById, relativeTime } from '../../data/mockData';

export default function AuthorRow({ authorId, timestamp, category, showCategory = true }) {
  const user = getUserById(authorId);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <Avatar user={user} size={28} />
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-1)' }}>
        {user?.name || 'Unknown'}
      </span>
      {user?.role === 'expert' && (
        <span className="badge badge-accent" style={{ fontSize: 10 }}>Expert</span>
      )}
      <span style={{ fontSize: 12, color: 'var(--color-text-3)' }}>
        {relativeTime(timestamp)}
      </span>
      {showCategory && category && (
        <span className="badge badge-primary" style={{ marginLeft: 4 }}>{category}</span>
      )}
    </div>
  );
}
