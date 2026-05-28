import React from 'react'
import { Check, MoreHorizontal, ChevronUp, ChevronDown, Paperclip, Star } from 'lucide-react'
import './AnswerCard.css'

export interface AnswerCardProps {
  id: string
  author: string
  authorInitials: string
  authorRole?: string
  avatarBg?: string
  body: string
  date: string
  upvotes: number
  voteState?: 'up' | 'down' | null
  isSolution?: boolean
  isAdminEndorsed?: boolean
  attachment?: { name: string; url?: string }
  canReport?: boolean
  isOwn?: boolean
  onUpvote?: () => void
  onDownvote?: () => void
  onReport?: () => void
  onSubmitComment?: (text: string) => void
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  id,
  author,
  authorInitials,
  authorRole,
  avatarBg = '#0D8ABC',
  body,
  date,
  upvotes,
  voteState = null,
  isSolution = false,
  isAdminEndorsed = false,
  attachment,
  canReport = true,
  isOwn = false,
  onUpvote,
  onDownvote,
  onReport,
  onSubmitComment,
}) => {
  const [commentText, setCommentText] = React.useState('')

  const handleSubmit = () => {
    onSubmitComment?.(commentText)
    setCommentText('')
  }

  return (
    <div className={`answer-card ${isSolution ? 'is-solution' : ''}`}>
      <div className="answer-avatar">
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(authorInitials)}&background=${avatarBg.replace('#', '')}&color=fff`} alt={author} />
      </div>

      <div className="answer-body">
        <div className="answer-header">
          <div className="answer-author">
            <span className="answer-name">{author}</span>
            {authorRole && <span className="answer-role">{authorRole}</span>}
            <span className="answer-date">{date}</span>
          </div>
          <div className="answer-actions">
            {isSolution && (
              <span className="answer-solution-badge">
                <Check size={14} strokeWidth={3} /> SOLUTION
              </span>
            )}
            <MoreHorizontal size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
          </div>
        </div>

        <div className="answer-content">
          {body}
          {attachment && (
            <div className="answer-attachment">
              <Paperclip size={16} color="#9ca3af" /> {attachment.name}
            </div>
          )}
        </div>

        <div className="answer-footer">
          <div className="answer-vote">
            <ChevronUp
              size={20}
              color={voteState === 'up' ? '#2563eb' : '#6b7280'}
              onClick={onUpvote}
              style={{ cursor: 'pointer' }}
            />
            <span>{upvotes}</span>
            <ChevronDown
              size={20}
              color={voteState === 'down' ? '#dc2626' : '#6b7280'}
              onClick={onDownvote}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {isAdminEndorsed && (
            <div className="answer-endorsed">
              <Star size={14} fill="currentColor" /> ADMIN ENDORSED
            </div>
          )}

          <div className="answer-footer-right">
            {!isOwn && canReport && onReport && (
              <button className="answer-report-btn" onClick={onReport}>
                REPORT
              </button>
            )}
            {isOwn && (
              <span className="answer-own-hint">Cannot report own comment</span>
            )}
          </div>
        </div>

        {/* Inline comment input */}
        <div className="answer-comment-box">
          <textarea
            placeholder="Drop your resolution, comment, or suggestions here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="answer-comment-actions">
            <button
              className="answer-submit-comment"
              onClick={handleSubmit}
            >
              Submit Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnswerCard