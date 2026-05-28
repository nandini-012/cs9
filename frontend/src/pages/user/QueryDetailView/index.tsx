import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  X, CheckCircle, MessageCircle, Flag, Share2, ThumbsUp,
  ChevronRight, Users, BarChart2, FileText, ChevronUp
} from 'lucide-react'
import './QueryDetailView.css'

interface Comment {
  id: string
  author: string
  role: string
  content: string
  timestamp: string
  isSolution?: boolean
  upvotes: number
}

const mockComments: Comment[] = [
  {
    id: 'c1',
    author: 'Dr. Rajesh Kumar',
    role: 'Faculty',
    content: 'You can claim reimbursement by submitting the original receipts along with the filled reimbursement form (Form-F3) at the accounts office. The process takes about 2-3 weeks after submission. Make sure to attach the event attendance certificate as well.',
    timestamp: 'Jun 14, 2026 · 10:30 AM',
    upvotes: 12,
  },
  {
    id: 'c2',
    author: 'Priya Mehta',
    role: 'Admin',
    content: 'The accounts office is located in the Administrative Block, Ground Floor, Room 102. Timings are 10 AM – 4 PM on all working days.',
    timestamp: 'Jun 14, 2026 · 11:45 AM',
    upvotes: 8,
  },
  {
    id: 'c3',
    author: 'Vikram Singh',
    role: 'USER',
    content: 'I successfully claimed my reimbursement last month. Just ensure you have all receipts in the correct format — the amounts should be in INR and the merchant name clearly visible.',
    timestamp: 'Jun 15, 2026 · 9:15 AM',
    isSolution: true,
    upvotes: 15,
  },
]

const stepperSteps = [
  { label: 'Submitted', sublabel: 'Jun 12, 10:30 AM', done: true },
  { label: 'Under Review', sublabel: 'Jun 13, 2:00 PM', done: true },
  { label: 'In Progress', sublabel: 'Jun 14, 9:00 AM', done: true },
  { label: 'Resolved', sublabel: 'Expected Jun 18', done: false },
]

const leaderboard = [
  { rank: 1, name: 'Ananya Patel', pts: 2840, avatar: '#f59e0b' },
  { rank: 2, name: 'Rahul Verma', pts: 2410, avatar: '#6b7280' },
  { rank: 3, name: 'Sneha Reddy', pts: 2195, avatar: '#b45309' },
]

export const QueryDetailView: React.FC = () => {
  const [replyText, setReplyText] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Reply submitted: ${replyText}`)
    setReplyText('')
  }

  return (
    <div className="qd-container">
      {/* Back button */}
      <Link
        to="/faq"
        style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        <X size={18} /> Close
      </Link>

      <div className="qd-layout">
        {/* Left Column */}
        <div className="qd-main-col">
          {/* Header */}
          <div className="qd-header">
            <div className="qd-header-tags">
              <span className="qd-tag-id">QC-2026-0042</span>
              <span className="qd-tag-label">Finance & Reimbursement</span>
            </div>
            <h1 className="qd-title">How do I claim reimbursement for conference travel expenses?</h1>
            <div className="qd-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
                <CheckCircle size={14} /> Resolved
              </span>
              <span className="qd-phase-badge">Phase 2</span>
              <span>Submitted by Amit Sharma · Jun 12, 2026</span>
            </div>
          </div>

          {/* Thread */}
          <div className="qd-thread">
            <div className="qd-thread-line" />
            {mockComments.map((comment) => (
              <div key={comment.id} className="qd-comment">
                <div className="qd-avatar">
                  <div style={{ width: '100%', height: '100%', background: '#0b1528', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', fontWeight: 700 }}>
                    {comment.author[0]}
                  </div>
                </div>
                <div className="qd-comment-box">
                  <div className="qd-cb-header">
                    <div className="qd-cb-author">
                      <span className="qd-cb-name">{comment.author}</span>
                      <span className="qd-cb-role">{comment.role}</span>
                    </div>
                    <div className="qd-cb-actions">
                      {comment.isSolution && (
                        <span className="qd-cb-solution">
                          <CheckCircle size={14} /> Solution
                        </span>
                      )}
                      <span className="qd-cb-date">{comment.timestamp}</span>
                    </div>
                  </div>
                  <div className="qd-cb-body">{comment.content}</div>
                  <div className="qd-cb-footer">
                    <div className="qd-f-left">
                      <span className="qd-upvote-control">
                        <ChevronUp size={16} />
                        {comment.upvotes}
                      </span>
                      <button className="qd-f-btn gray">
                        <MessageCircle size={14} /> Reply
                      </button>
                    </div>
                    <div className="qd-f-right">
                      <button className="qd-f-btn gray">
                        <Flag size={14} /> Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Reply Box */}
            <form onSubmit={handleReply}>
              <div className="qd-comment" style={{ marginTop: '8px' }}>
                <div className="qd-avatar">
                  <div style={{ width: '100%', height: '100%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', fontWeight: 700 }}>
                    A
                  </div>
                </div>
                <div className="qd-comment-box">
                  <div className="qd-cb-body" style={{ padding: '16px 20px' }}>
                    <textarea
                      className="form-control"
                      placeholder="Add a comment or answer..."
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', fontFamily: 'inherit', fontSize: '14px', resize: 'none', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                      <button
                        type="submit"
                        style={{
                          background: '#0b1528',
                          color: '#fff',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Post Answer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className="qd-side-col">
          {/* Progress Stepper */}
          <div className="qd-widget">
            <div className="qd-w-title">Resolution Progress</div>
            <div className="qd-stepper">
              {stepperSteps.map((step, i) => (
                <div key={i} className="qd-step">
                  <div className={`qd-step-icon ${step.done ? (i === stepperSteps.length - 1 ? '' : 'green') : ''}`}>
                    {step.done ? <CheckCircle size={10} /> : <span style={{ fontSize: '9px', fontWeight: 800 }}>{i + 1}</span>}
                  </div>
                  <div className="qd-step-content">
                    <h5>{step.label}</h5>
                    <p>{step.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="qd-widget">
            <div className="qd-w-title">Top Contributors</div>
            <div className="qd-podium">
              {leaderboard.slice(0, 3).map((user) => (
                <div key={user.rank} className="qd-pod-item">
                  <div className={`qd-pod-avatar ${user.rank === 1 ? 'gold' : user.rank === 2 ? 'silver' : 'bronze'}`}>
                    <div style={{ width: '100%', height: '100%', background: user.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 800 }}>
                      {user.name[0]}
                    </div>
                    <div className={`qd-medal ${user.rank === 1 ? 'gold' : user.rank === 2 ? 'silver' : 'bronze'}`}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                    </div>
                  </div>
                  <div className="qd-pod-name">{user.name}</div>
                  <div className="qd-pod-pts">{user.pts} pts</div>
                </div>
              ))}
            </div>
            <Link to="/leaderboard" className="qd-lb-btn">View Full Leaderboard →</Link>
          </div>

          {/* Resources */}
          <div className="qd-widget">
            <div className="qd-w-title">Related Resources</div>
            {[
              { icon: <FileText size={16} />, label: 'Form F3 – Reimbursement Claim' },
              { icon: <FileText size={16} />, label: 'Travel Policy Guidelines' },
              { icon: <FileText size={16} />, label: 'Accounts Office Contact' },
            ].map((res, i) => (
              <div key={i} className="qd-res-link">
                {res.icon}
                <span>{res.label}</span>
                <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="report-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header">
              <h3>Report Content</h3>
              <button className="report-modal-close" onClick={() => setShowReportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="report-modal-body">
              <h4>Why are you reporting this?</h4>
              {['Spam or promotional', 'Harassment or abuse', 'Incorrect information', 'Other'].map((r) => (
                <div
                  key={r}
                  className={`report-radio-option ${reportReason === r ? 'selected' : ''}`}
                  onClick={() => setReportReason(r)}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={reportReason === r}
                    onChange={() => setReportReason(r)}
                  />
                  {r}
                </div>
              ))}
              <textarea placeholder="Additional details (optional)..." style={{ marginTop: '16px' }} />
            </div>
            <div className="report-modal-footer">
              <button className="btn-report-cancel" onClick={() => setShowReportModal(false)}>Cancel</button>
              <button className="btn-report-submit">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QueryDetailView