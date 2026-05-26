import { useState } from 'react';
import Modal from '../../shared/Modal';
import { CATEGORIES } from '../../../data/mockData';

export default function AskQuestionModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title:    '',
    category: '',
    tags:     '',
    body:     '',
  });
  const [tagInput, setTagInput] = useState('');
  const [tags,     setTags]     = useState([]);
  const [error,    setError]    = useState('');

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const t = tagInput.trim().replace(',', '');
      if (t && !tags.includes(t) && tags.length < 5) {
        setTags(prev => [...prev, t]);
        setTagInput('');
      }
    }
  };
  const removeTag = (t) => setTags(prev => prev.filter(x => x !== t));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title.trim().length < 10) {
      setError('Title must be at least 10 characters.');
      return;
    }
    if (!form.category) {
      setError('Please select a category.');
      return;
    }

    const newQuestion = {
      id:        `q${Date.now()}`,
      title:     form.title.trim(),
      body:      form.body.trim(),
      category:  form.category,
      tags,
      authorId:  'u2',
      timestamp: new Date().toISOString(),
      upvotes:   0,
      views:     0,
      status:    'unanswered',
      pinned:    false,
      answers:   [],
      upvotedBy: [],
    };

    onSubmit?.(newQuestion);
    onClose();
  };

  return (
    <Modal onClose={onClose} width={520}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 20 }}>
        💬 Ask a Question
      </h2>

      {error && (
        <div style={{
          background: 'rgba(217,64,64,0.1)', border: '1px solid rgba(217,64,64,0.3)',
          borderRadius: 8, padding: '10px 14px', color: 'var(--color-danger)',
          fontSize: 13, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Title */}
        <div>
          <label className="form-label">
            Question title <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            className="form-input"
            value={form.title}
            onChange={set('title')}
            placeholder="What would you like to know? (min 10 chars)"
            required
          />
          <p style={{ fontSize: 11, color: 'var(--color-text-3)', marginTop: 4 }}>
            {form.title.length} / 10 minimum
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="form-label">
            Category <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <select
            className="form-input"
            value={form.category}
            onChange={set('category')}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="form-label">Tags (up to 5)</label>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6,
            padding: '6px 10px', border: '1px solid var(--color-border)',
            borderRadius: 8, minHeight: 40,
          }}>
            {tags.map(t => (
              <span key={t} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 20, padding: '2px 8px', fontSize: 12,
              }}>
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)', padding: 0, fontSize: 12 }}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder={tags.length === 0 ? 'Type and press Enter or comma…' : ''}
              style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, minWidth: 100, background: 'transparent' }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Additional description (optional)</label>
          <textarea
            className="form-input"
            rows={4}
            value={form.body}
            onChange={set('body')}
            placeholder="Provide more context about your question…"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Submit Question</button>
        </div>
      </form>
    </Modal>
  );
}
