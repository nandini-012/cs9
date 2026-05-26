import { useState } from 'react';
import Modal from '../../shared/Modal';

const REASONS = ['Spam', 'Misinformation', 'Offensive language', 'Other'];

export default function FlagModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [notes,  setNotes]  = useState('');

  const handleSubmit = () => {
    if (!reason) return;
    onSubmit?.({ reason, notes });
    onClose();
  };

  return (
    <Modal onClose={onClose} width={400}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 20 }}>
        🚩 Report this content
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {REASONS.map(r => (
          <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="radio"
              name="reason"
              value={r}
              checked={reason === r}
              onChange={() => setReason(r)}
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span style={{ fontSize: 14, color: 'var(--color-text-2)' }}>{r}</span>
          </label>
        ))}
      </div>

      {reason === 'Other' && (
        <div style={{ marginBottom: 16 }}>
          <label className="form-label">Additional notes</label>
          <textarea
            className="form-input"
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Describe the issue..."
            style={{ resize: 'vertical' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button
          className="btn-danger"
          onClick={handleSubmit}
          disabled={!reason}
          style={{ opacity: reason ? 1 : 0.5 }}
        >
          Submit Report
        </button>
      </div>
    </Modal>
  );
}
