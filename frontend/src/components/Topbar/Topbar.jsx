import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../shared/Avatar';
import NotificationPanel from '../screens/NotificationPanel/NotificationPanel';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export default function Topbar({ onAskQuestion }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [search,    setSearch]    = useState('');

  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/feed?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--color-bg)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: 16,
        height: 60,
      }}>
        {/* Logo */}
        <Link to="/feed" style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 18,
          color: 'var(--color-primary)',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          ⚡ FAQ Portal
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 480 }}>
          <input
            className="form-input"
            placeholder="Search questions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            style={{ borderRadius: 24, padding: '8px 16px', fontSize: 14 }}
          />
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {onAskQuestion && (
            <button className="btn-accent" onClick={onAskQuestion} style={{ whiteSpace: 'nowrap' }}>
              + Ask a Question
            </button>
          )}

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifOpen(o => !o); setMenuOpen(false); }}
              style={{
                background: 'none', border: 'none', fontSize: 20,
                color: 'var(--color-text-2)', position: 'relative',
                padding: '6px', borderRadius: 8,
                display: 'flex', alignItems: 'center',
              }}
            >
              🔔
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--color-danger)', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute', top: 44, right: 0 }}>
                <NotificationPanel onClose={() => setNotifOpen(false)} />
              </div>
            )}
          </div>

          {/* Avatar / menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setMenuOpen(o => !o); setNotifOpen(false); }}
              style={{ background: 'none', border: 'none', padding: 0, display: 'flex' }}
            >
              <Avatar user={user || { name: 'Guest', avatarInitials: 'G' }} size={34} />
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', top: 42, right: 0,
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                boxShadow: 'var(--shadow-modal)',
                minWidth: 160,
                overflow: 'hidden',
                zIndex: 200,
              }}>
                <Link to="/leaderboard" style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>
                  🏆 Leaderboard
                </Link>
                <Link to="/admin" style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: 'var(--color-text-2)' }} onClick={() => setMenuOpen(false)}>
                  🛡 Admin
                </Link>
                <div style={{ height: 1, background: 'var(--color-border)' }} />
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 16px',
                    fontSize: 14, color: 'var(--color-danger)',
                    background: 'none', border: 'none',
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
