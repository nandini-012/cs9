import { Link } from 'react-router-dom';
import Avatar from '../../shared/Avatar';
import SparkBadge from '../../shared/SparkBadge';
import { CATEGORIES, MOCK_USERS } from '../../../data/mockData';

export default function Sidebar({ selectedCategories, onCategoryChange }) {
  const topContributors = [...MOCK_USERS]
    .sort((a, b) => b.spark - a.spark)
    .slice(0, 3);

  const toggle = (cat) => {
    onCategoryChange(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Category filter */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--color-text-1)' }}>
          Filter by Category
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CATEGORIES.map(cat => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggle(cat)}
                style={{ accentColor: 'var(--color-primary)', width: 14, height: 14 }}
              />
              <span style={{ fontSize: 13, color: 'var(--color-text-2)' }}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--color-text-1)' }}>
            Top Contributors
          </h3>
          <Link to="/leaderboard" style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 500 }}>
            View all →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topContributors.map((u, i) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-3)', width: 16 }}>
                {i + 1}
              </span>
              <Avatar user={u} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-1)', marginBottom: 1 }}>
                  {u.name}
                </p>
                <SparkBadge points={u.spark} showPoints />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ask an Expert promo */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #243360 100%)',
        borderRadius: 10, padding: 20, color: '#fff',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
          🎓 Ask an Expert
        </p>
        <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6, marginBottom: 14 }}>
          Get verified answers from certified professionals in your field.
        </p>
        <Link
          to="/coming-soon"
          className="btn-accent"
          style={{ display: 'inline-flex', fontSize: 13, padding: '8px 16px' }}
        >
          Book a Session
        </Link>
      </div>
    </aside>
  );
}
