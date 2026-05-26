import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Topbar from '../../Topbar/Topbar';
import AuthorRow from '../../shared/AuthorRow';
import TagPill from '../../shared/TagPill';
import AnswerCard from './AnswerCard';
import BonusOptions from './BonusOptions';
import FlagModal from '../FlagModal/FlagModal';
import {
  getQuestionById,
  getAnswersByQuestionId,
  MOCK_ANSWERS,
} from '../../../data/mockData';

const SORT_OPTIONS = ['Best', 'Newest', 'Oldest'];

export default function QuestionDetail() {
  const { id } = useParams();
  const question = getQuestionById(id);

  const [answers,    setAnswers]    = useState(
    question ? getAnswersByQuestionId(id) : []
  );
  const [sortBy,     setSortBy]     = useState('Best');
  const [upvoted,    setUpvoted]    = useState(false);
  const [upvotes,    setUpvotes]    = useState(question?.upvotes || 0);
  const [showFlag,   setShowFlag]   = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!question) {
    return (
      <div style={{ minHeight: '100svh', background: 'var(--color-surface)' }}>
        <Topbar />
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🤔</p>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Question not found</h2>
          <Link to="/feed" className="btn-primary" style={{ display: 'inline-flex' }}>Back to Feed</Link>
        </div>
      </div>
    );
  }

  const sortedAnswers = [...answers].sort((a, b) => {
    if (sortBy === 'Best')   return (b.accepted ? 1 : 0) - (a.accepted ? 1 : 0) || b.upvotes - a.upvotes;
    if (sortBy === 'Newest') return new Date(b.timestamp) - new Date(a.timestamp);
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  const handleAccept = (answerId) => {
    setAnswers(prev => prev.map(a => ({ ...a, accepted: a.id === answerId })));
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (answerText.length < 20) return;
    setSubmitting(true);
    const newAnswer = {
      id:         `a${Date.now()}`,
      questionId: id,
      authorId:   'u2',
      body:       answerText,
      upvotes:    0,
      accepted:   false,
      isExpert:   false,
      expertType: null,
      timestamp:  new Date().toISOString(),
      references: [],
      upvotedBy:  [],
      comments:   [],
    };
    setTimeout(() => {
      setAnswers(prev => [newAnswer, ...prev]);
      setAnswerText('');
      setSubmitting(false);
    }, 400);
  };

  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-surface)' }}>
      <Topbar />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px' }}>
        {/* Back link */}
        <Link to="/feed" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-3)', marginBottom: 20 }}>
          ← Back to Feed
        </Link>

        {/* Question block */}
        <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
            {question.title}
          </h1>

          <AuthorRow
            authorId={question.authorId}
            timestamp={question.timestamp}
            category={question.category}
          />

          <div style={{ marginTop: 16, marginBottom: 16, fontSize: 15, lineHeight: 1.75, color: 'var(--color-text-2)' }}>
            {question.body}
          </div>

          {/* Tags */}
          {question.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {question.tags.map(t => <TagPill key={t} label={t} />)}
            </div>
          )}

          {/* Action row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setUpvoted(v => !v); setUpvotes(v => upvoted ? v-1 : v+1); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                border: `1px solid ${upvoted ? 'var(--color-accent)' : 'var(--color-border)'}`,
                background: upvoted ? 'rgba(232,160,32,0.1)' : 'transparent',
                color: upvoted ? 'var(--color-accent)' : 'var(--color-text-2)',
                fontWeight: 500, fontSize: 13, cursor: 'pointer',
              }}
            >
              ▲ {upvotes} Upvotes
            </button>
            <span style={{ fontSize: 13, color: 'var(--color-text-3)' }}>💬 {answers.length} Answers</span>
            <button
              onClick={() => setShowFlag(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-3)' }}
            >
              🚩 Flag
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-3)' }}
            >
              🔗 Share
            </button>
          </div>
        </div>

        {/* Answers section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>
            <div style={{ display: 'flex', gap: 4 }}>
              {SORT_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                    border: `1px solid ${sortBy === s ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: sortBy === s ? 'var(--color-primary)' : 'transparent',
                    color: sortBy === s ? '#fff' : 'var(--color-text-2)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedAnswers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-3)', background: 'var(--color-bg)', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 24, marginBottom: 8 }}>💡</p>
                <p>No answers yet. Be the first to help!</p>
              </div>
            ) : (
              sortedAnswers.map(a => (
                <AnswerCard
                  key={a.id}
                  answer={a}
                  isAuthor={question.authorId === 'u2'}
                  onAccept={handleAccept}
                />
              ))
            )}
          </div>
        </div>

        {/* Answer editor */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>Your Answer</h3>
          <form onSubmit={handleSubmitAnswer} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Toolbar */}
            <div style={{
              display: 'flex', gap: 4,
              padding: '6px 10px',
              background: 'var(--color-surface)',
              borderRadius: '8px 8px 0 0',
              border: '1px solid var(--color-border)',
              borderBottom: 'none',
            }}>
              {['B', 'I', '🔗', '<>', '≡'].map(t => (
                <button
                  key={t}
                  type="button"
                  style={{
                    padding: '4px 8px', borderRadius: 4, border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)', fontSize: 13, cursor: 'pointer',
                    color: 'var(--color-text-2)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              className="form-input"
              rows={5}
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              placeholder="Write your answer here… (minimum 20 characters)"
              style={{ borderRadius: '0 0 8px 8px', resize: 'vertical', borderTop: 'none' }}
              minLength={20}
            />

            {/* Bonus options */}
            <BonusOptions />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-3)' }}>
                {answerText.length < 20 ? `${20 - answerText.length} more chars needed` : '✓ Ready to submit'}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to={`/answer-select/${id}`} className="btn-ghost" style={{ fontSize: 13 }}>
                  Submit as Expert
                </Link>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={answerText.length < 20 || submitting}
                  style={{ opacity: answerText.length < 20 ? 0.5 : 1 }}
                >
                  {submitting ? 'Submitting…' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showFlag && (
        <FlagModal
          onClose={() => setShowFlag(false)}
          onSubmit={(data) => console.log('Flagged question:', id, data)}
        />
      )}
    </div>
  );
}
