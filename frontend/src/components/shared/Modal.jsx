import { useEffect } from 'react';

export default function Modal({ onClose, width = 480, children }) {
  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card" style={{ maxWidth: width }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16, right: 16,
            background: 'none',
            border: 'none',
            fontSize: 20,
            color: 'var(--color-text-3)',
            cursor: 'pointer',
            lineHeight: 1,
            padding: 4,
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
