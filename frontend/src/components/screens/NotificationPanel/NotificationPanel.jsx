import { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../../../data/mockData';

const TYPE_ICON = {
  answer:  '💬',
  upvote:  '▲',
  badge:   '🏅',
  mention: '@',
};

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div style={{
      width: 320,
      background: 'var(--color-bg)',
      border: '1px solid var(--color-border)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-modal)',
      overflow: 'hidden',
      zIndex: 300,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--color-text-1)' }}>
          Notifications
        </span>
        <button
          onClick={markAllRead}
          style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--color-accent)', fontWeight: 500, cursor: 'pointer' }}
        >
          Mark all read
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <p style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-3)', fontSize: 13 }}>
            No notifications
          </p>
        ) : notifications.map(n => (
          <div
            key={n.id}
            style={{
              display: 'flex', gap: 10,
              padding: '12px 16px',
              background: n.read ? 'transparent' : 'rgba(26,39,68,0.03)',
              borderBottom: '1px solid var(--color-border)',
              position: 'relative',
            }}
          >
            {/* Unread dot */}
            {!n.read && (
              <div style={{
                position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
                width: 6, height: 6, borderRadius: '50%',
                background: '#2563EB',
              }} />
            )}
            {/* Icon */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>
              {TYPE_ICON[n.type] || '•'}
            </div>
            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.5, marginBottom: 2 }}>
                {n.text}
              </p>
              <p style={{ fontSize: 11, color: 'var(--color-text-3)' }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
