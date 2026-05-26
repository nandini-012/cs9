import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Topbar from '../../Topbar/Topbar';
import { getQuestionById } from '../../../data/mockData';

const EXPERT_TYPES = [
  'University Registrar',
  'Academic Advisor',
  'Technical Support',
  'Financial Counselor',
  'Medical Professional',
  'Legal Advisor',
  'Other',
];

export default function ExpertAnswerForm() {
  const { questionId } = useParams();
  const navigate       = useNavigate();
  const question       = getQuestionById(questionId);

  const [form, setForm] = useState({
    expertType: '',
    specialty:  '',
    body:       '',
    references: [''],
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const addRef = () => setForm(prev => ({ ...prev, references: [...prev.references, ''] }));
  const setRef = (i, v) => setForm(prev => ({
    ...prev,
    references: prev.references.map((r, idx) => idx === i ? v : r),
  }));
  const removeRef = (i) => setForm(prev => ({
    ...prev,
    references: prev.references.filter((_, idx) => idx !== i),
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate(`/questions/${questionId}`), 1500);
  };

  if (!question) {
    return (
      <div style={{ minHeight: '100svh', background: 'var(--color-surface)' }}>
        <Topbar />
        <div style={{ textAlign: 'center', padding: 80 }}>
          <h2>Question not found</h2>
          <Link to="/feed" className="btn-primary" style={{ display: 'inline-flex', marginTop: 16 }}>Back to Feed</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100svh', background: 'var(--color-surface)' }}>
        <Topbar />
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>✅</p>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Expert Answer Submitted!</h2>
          <p style={{ color: 'var(--color-text-3)', fontSize: 14 }}>Redirecting you back…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-surface)' }}>
      <Topbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>

        {/* Back */}
        <Link to={`/questions/${questionId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-3)', marginBottom: 20 }}>
          ← Back to Question
        </Link>

        {/* Question recap */}
        <div style={{
          background: 'rgba(26,39,68,0.05)',
          borderLeft: '3px solid var(--color-primary)',
          borderRadius: '0 8px 8px 0',
          padding: '12px 16px', marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Answering question
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--color-text-1)' }}>
            {question.title}
          </p>
        </div>

        {/* Form card */}
        <div className="card" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(232,160,32,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🎓</div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 2 }}>Expert Answer Submission</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-3)' }}>Your answer will be tagged as Expert Verified (+20 Spark points)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Expert type */}
            <div>
              <label className="form-label">Doctor / Expert Type <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <select className="form-input" value={form.expertType} onChange={set('expertType')} required>
                <option value="">Select your expert role…</option>
                {EXPERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Specialty */}
            <div>
              <label className="form-label">Specialty / Qualification</label>
              <input
                className="form-input"
                value={form.specialty}
                onChange={set('specialty')}
                placeholder="e.g. MBA Finance, MBBS, LLB…"
              />
            </div>

            {/* Answer body */}
            <div>
              <label className="form-label">Expert Answer <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <textarea
                className="form-input"
                rows={7}
                value={form.body}
                onChange={set('body')}
                placeholder="Provide a thorough, expert-level answer…"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            {/* References */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Reference URL(s)</label>
                <button type="button" onClick={addRef} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  + Add reference
                </button>
              </div>
              {form.references.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    className="form-input"
                    value={r}
                    onChange={e => setRef(i, e.target.value)}
                    placeholder="https://…"
                  />
                  {form.references.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRef(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: 18 }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <Link to={`/questions/${questionId}`} className="btn-ghost">Cancel</Link>
              <button type="submit" className="btn-primary">
                ✓ Submit Expert Answer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
