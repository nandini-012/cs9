import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthorRow from '../../shared/AuthorRow';
import TagPill from '../../shared/TagPill';
import FlagModal from '../FlagModal/FlagModal';

const STATUS_BORDER = {
  answered:   'var(--color-success)',
  unanswered: 'var(--color-accent)',
};

export default function QuestionCard({ question, onUpvote }) {
  const [upvoted,   setUpvoted]   = useState(false);
  const [upvotes,   setUpvotes]   = useState(question.upvotes);
  const [showFlag,  setShowFlag]  = useState(false);

  const handleUpvote = () => {
    setUpvoted(v => !v);
    setUpvotes(v => upvoted ? v - 1 : v + 1);
    onUpvote?.(question.id, !upvoted);
  };

  return (
    <>
      <div className="card" style={{
        padding: '16px 20px',
        borderLeft: `3px solid ${STATUS_BORDER[question.status] || 'transparent'}`,
        position: 'relative',
        transition: 'box-shadow 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
      >
        {/* Pinned star */}
        {question.pinned && (
          <span style={{
            position: 'absolute', top: 12, right: 14,
            fontSize: 14, color: 'var(--color-accent)',
          }} title="Pinned">★</span>
        )}

        {/* Author row */}
        <AuthorRow
          authorId={question.authorId}
          timestamp={question.timestamp}
          category={question.category}
        />

        {/* Title */}
        <Link to={`/questions/${question.id}`} style={{ display: 'block', marginTop: 10 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
            color: 'var(--color-text-1)', marginBottom: 6, lineHeight: 1.4,
          }}>
            {question.title}
          </h3>
        </Link>

        {/* Preview */}
        <p style={{
          fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginBottom: 10,
        }}>
          {question.body}
        </p>

        {/* Tags */}
        {question.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {question.tags.slice(0, 3).map(t => <TagPill key={t} label={t} />)}
          </div>
        )}

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--color-text-3)', fontSize: 13 }}>
          <button
            onClick={handleUpvote}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              color: upvoted ? 'var(--color-accent)' : 'var(--color-text-3)',
              fontWeight: upvoted ? 600 : 400, fontSize: 13,
              padding: 0,
            }}
          >
            ▲ {upvotes}
          </button>
          <span>💬 {question.answers.length}</span>
          <span>👁 {question.views}</span>
          <button
            onClick={() => setShowFlag(true)}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--color-text-3)', fontSize: 13,
              padding: 0, display: 'flex', alignItems: 'center', gap: 3,
            }}
            title="Report"
          >
            🚩
          </button>
        </div>
      </div>

      {showFlag && (
        <FlagModal
          onClose={() => setShowFlag(false)}
          onSubmit={(data) => console.log('Flagged:', question.id, data)}
        />
      )}
    </>
  );
}
