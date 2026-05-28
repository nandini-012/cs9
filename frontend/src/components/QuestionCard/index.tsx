import React from 'react'
import { MessageCircle, CheckCircle, Clock, ChevronUp } from 'lucide-react'
import './QuestionCard.css'

export interface QuestionCardProps {
  id: number
  title: string
  desc: string
  upvotes: number
  hasUpvoted?: boolean
  author?: 'self' | 'other'
  tags: Array<{
    label: string
    type?: 'dark' | 'light' | 'custom'
    customStyle?: React.CSSProperties
  }>
  meta: string
  comments: number
  status: 'Active' | 'In Progress' | 'Resolved'
  onUpvote?: (id: number) => void
  onClick?: (id: number) => void
}

const STATUS_ICONS = {
  Active: Clock,
  'In Progress': Clock,
  Resolved: CheckCircle,
}

const STATUS_COLORS = {
  Active: '#0b1528',
  'In Progress': '#4b5563',
  Resolved: '#16a34a',
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  title,
  desc,
  upvotes,
  hasUpvoted = false,
  tags,
  meta,
  comments,
  status,
  onUpvote,
  onClick,
}) => {
  const StatusIcon = STATUS_ICONS[status]

  return (
    <div className="question-card">
      <div
        className={`question-upvote ${hasUpvoted ? 'upvoted' : ''}`}
        onClick={(e) => { e.stopPropagation(); onUpvote?.(id) }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onUpvote?.(id)}
      >
        <ChevronUp size={24} />
        <span>{upvotes}</span>
      </div>

      <div className="question-body" onClick={() => onClick?.(id)} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.(id)}>
        <div className="question-header">
          <div className="question-tags">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={`q-tag ${tag.type === 'light' ? 'tag-light' : ''}`}
                style={tag.type === 'custom' ? tag.customStyle : {}}
              >
                {tag.label}
              </span>
            ))}
          </div>
          <div className="question-meta">{meta}</div>
        </div>

        <h3 className="question-title">{title}</h3>
        <p className="question-desc">{desc}</p>

        <div className="question-footer">
          <div className="q-footer-item">
            <MessageCircle size={14} /> {comments} comments
          </div>
          <div className="q-footer-item" style={{ color: STATUS_COLORS[status] }}>
            <StatusIcon size={14} /> {status}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard