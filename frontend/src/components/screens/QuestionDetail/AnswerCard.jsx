import { useState } from 'react';
import AuthorRow from '../../shared/AuthorRow';
import { Link } from 'react-router-dom';

export default function AnswerCard({ answer, isAuthor, onAccept }) {
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(answer.upvotes);
  const [showComments, setShowComments] = useState(false);

  const handleUpvote = () => {
    setUpvoted(v => !v);
    setUpvotes(v => upvoted ? v - 1 : v + 1);
  };

  return (
    <div style={{
      border: `1px solid ${answer.accepted ? 'var(--color-success)' : 'var(--color-border)'}`,
      borderRadius: 10,
      overflow: 'hidden',
      background: 'var(--color-bg)',
    }}>
      {/* Accepted banner */}
      {answer.accepted && (
        <div style={{
          background: 'rgba(34,160,96,0.1)',
          borderBottom: '1px solid rgba(34,160,96,0.2)',
          padding: '8px 20px',
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--color-success)', fontSize: 13, fontWeight: 600,
        }}>
          ✓ Accepted Answer
        </div>
      )}

      <div style={{ padding: '18px 20px' }}>
        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <AuthorRow
            authorId={answer.authorId}
            timestamp={answer.timestamp}
            showCategory={false}
          />
          {answer.isExpert && (
            <span className="badge badge-accent" style={{ marginLeft: 4 }}>
              ✓ Expert · {answer.expertType}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.75, marginBottom: 14 }}>
          {answer.body}
        </div>

        {/* References */}
        {answer.references?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {answer.references.map((r, i) => (
              <a key={i} href={r} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 12, color: 'var(--color-primary)', fontWeight: 500,
                background: 'var(--color-surface)',
                padding: '4px 10px', borderRadius: 20,
                border: '1px solid var(--color-border)',
              }}>
                🔗 {r}
              </a>
            ))}
          </div>
        )}

        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13 }}>
          <button
            onClick={handleUpvote}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: upvoted ? 'rgba(232,160,32,0.1)' : 'none',
              border: `1px solid ${upvoted ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
              color: upvoted ? 'var(--color-accent)' : 'var(--color-text-3)',
              fontWeight: upvoted ? 600 : 400,
            }}
          >
            ▲ {upvotes}
          </button>

          <button
            onClick={() => setShowComments(v => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-3)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            💬 {answer.comments?.length || 0} comments
          </button>

          {/* Accept answer (only question author) */}
          {isAuthor && !answer.accepted && (
            <button
              onClick={() => onAccept?.(answer.id)}
              style={{
                marginLeft: 'auto', background: 'none',
                border: '1px solid var(--color-success)',
                borderRadius: 6, padding: '5px 12px', cursor: 'pointer',
                color: 'var(--color-success)', fontSize: 12, fontWeight: 500,
              }}
            >
              ✓ Accept answer
            </button>
          )}

          {/* Expert answer link */}
          {!answer.isExpert && (
            <Link
              to={`/answer-select/${answer.questionId}`}
              style={{ marginLeft: isAuthor ? 0 : 'auto', fontSize: 12, color: 'var(--color-text-3)' }}
            >
              Submit as Expert →
            </Link>
          )}
        </div>

        {/* Comments */}
        {showComments && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
            {(answer.comments || []).map(c => (
              <div key={c.id} style={{
                display: 'flex', gap: 8, marginBottom: 10, fontSize: 13,
              }}>
                <span style={{ color: 'var(--color-accent)' }}>└</span>
                <div>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-1)', marginRight: 6 }}>User:</span>
                  <span style={{ color: 'var(--color-text-2)' }}>{c.body}</span>
                </div>
              </div>
            ))}
            {(answer.comments || []).length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--color-text-3)' }}>No comments yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
