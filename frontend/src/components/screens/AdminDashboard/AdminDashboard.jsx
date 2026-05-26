import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_QUESTIONS, MOCK_FLAGS, MOCK_USERS, MOCK_ANSWERS, getUserById } from '../../../data/mockData';

const NAV_ITEMS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'questions', label: '❓ Questions' },
  { id: 'users',     label: '👥 Users' },
  { id: 'reports',   label: '🚩 Reports' },
  { id: 'settings',  label: '⚙️ Settings' },
];

const STAT_CARDS = [
  { label: 'Total Questions',    value: MOCK_QUESTIONS.length, icon: '❓', color: 'var(--color-primary)' },
  { label: 'Pending Moderation', value: MOCK_FLAGS.filter(f => f.status === 'pending').length, icon: '⏳', color: 'var(--color-accent)' },
  { label: 'Active Users Today', value: 12, icon: '👤', color: 'var(--color-success)' },
  { label: 'Answers This Week',  value: MOCK_ANSWERS.length, icon: '💬', color: '#7C3AED' },
];

function Sidebar({ active, onChange }) {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--color-primary)',
      minHeight: '100vh',
      padding: '24px 0',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#fff' }}>
          ⚡ FAQ Portal
        </Link>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Admin Console</p>
      </div>
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV_ITEMS.map(n => (
          <button
            key={n.id}
            onClick={() => onChange(n.id)}
            style={{
              width: '100%', textAlign: 'left',
              padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active === n.id ? 'rgba(255,255,255,0.15)' : 'transparent',
              color: active === n.id ? '#fff' : 'rgba(255,255,255,0.65)',
              fontSize: 13, fontWeight: active === n.id ? 600 : 400,
              marginBottom: 2,
            }}
          >
            {n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Link to="/feed" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>← Back to Portal</Link>
      </div>
    </aside>
  );
}

function StatCard({ card }) {
  return (
    <div className="card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, fontSize: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${card.color}18`,
      }}>
        {card.icon}
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: card.color, marginBottom: 2 }}>
          {card.value}
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-3)' }}>{card.label}</p>
      </div>
    </div>
  );
}

function ModerationQueue() {
  const [flags, setFlags] = useState(MOCK_FLAGS);

  const approve = (id) => setFlags(prev => prev.filter(f => f.id !== id));
  const reject  = (id) => setFlags(prev => prev.map(f => f.id === id ? { ...f, status: 'rejected' } : f));

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>Moderation Queue</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--color-surface)' }}>
              {['Question', 'Category', 'Reported By', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--color-border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flags.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-3)' }}>
                  ✅ Moderation queue is clear
                </td>
              </tr>
            ) : flags.map(f => {
              const question = MOCK_QUESTIONS.find(q => q.id === f.questionId);
              const reporter = getUserById(f.reportedBy);
              const rejected = f.status === 'rejected';
              return (
                <tr
                  key={f.id}
                  style={{
                    borderLeft: rejected ? '3px solid var(--color-danger)' : '3px solid var(--color-accent)',
                    opacity: rejected ? 0.6 : 1,
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <td style={{ padding: '12px 16px', maxWidth: 240 }}>
                    <Link to={`/questions/${f.questionId}`} style={{ color: 'var(--color-text-1)', fontWeight: 500 }}>
                      {rejected ? <s>{question?.title}</s> : question?.title}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-3)' }}>{question?.category}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-2)' }}>{reporter?.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-3)' }}>{f.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {rejected ? (
                      <span className="badge badge-danger">Rejected</span>
                    ) : (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => approve(f.id)}
                          style={{
                            padding: '5px 12px', borderRadius: 6, border: '1px solid var(--color-success)',
                            background: 'rgba(34,160,96,0.1)', color: 'var(--color-success)',
                            fontSize: 12, fontWeight: 500, cursor: 'pointer',
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(f.id)}
                          style={{
                            padding: '5px 12px', borderRadius: 6, border: '1px solid var(--color-danger)',
                            background: 'rgba(217,64,64,0.1)', color: 'var(--color-danger)',
                            fontSize: 12, fontWeight: 500, cursor: 'pointer',
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecentActivity() {
  const recent = [...MOCK_QUESTIONS].sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp)).slice(0,5);
  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Recent Activity</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recent.map(q => {
          const author = getUserById(q.authorId);
          return (
            <div key={q.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>❓</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/questions/${q.id}`} style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-1)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {q.title}
                </Link>
                <p style={{ fontSize: 11, color: 'var(--color-text-3)', marginTop: 2 }}>by {author?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersTable() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>All Users</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--color-surface)' }}>
            {['Name', 'Role', 'Spark Points', 'Actions'].map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_USERS.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--color-text-1)' }}>{u.name}</td>
              <td style={{ padding: '12px 16px' }}>
                <span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'expert' ? 'accent' : 'primary'}`}>
                  {u.role}
                </span>
              </td>
              <td style={{ padding: '12px 16px', color: 'var(--color-accent)', fontWeight: 600 }}>{u.spark} pts</td>
              <td style={{ padding: '12px 16px' }}>
                <button style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: 'var(--color-text-2)' }}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard');

  const renderContent = () => {
    if (active === 'questions') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Questions</h2>
          <ModerationQueue />
        </div>
      );
    }
    if (active === 'users') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Users</h2>
          <UsersTable />
        </div>
      );
    }
    if (active === 'reports') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Reports</h2>
          <ModerationQueue />
        </div>
      );
    }
    if (active === 'settings') {
      return (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>⚙️</p>
          <h2 style={{ fontFamily: 'var(--font-display)' }}>Settings</h2>
          <p style={{ color: 'var(--color-text-3)', marginTop: 8 }}>Coming soon</p>
        </div>
      );
    }

    // Default: dashboard
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Dashboard Overview</h2>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {STAT_CARDS.map(c => <StatCard key={c.label} card={c} />)}
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          <ModerationQueue />
          <RecentActivity />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100svh' }}>
      <Sidebar active={active} onChange={setActive} />

      <main style={{ flex: 1, background: 'var(--color-surface)', padding: '32px 32px', overflowY: 'auto' }}>
        {renderContent()}
      </main>
    </div>
  );
}
