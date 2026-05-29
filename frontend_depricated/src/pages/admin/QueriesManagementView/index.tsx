import React, { useState } from 'react'
import { Search, Send, ChevronUp, ChevronDown, Check } from 'lucide-react'
import './QueriesManagementView.css'

interface QueryCard {
  id: string
  title: string
  excerpt: string
  badge: string
  time: string
  author: string
}

const mockQueries: QueryCard[] = [
  { id: 'QC-2026-0041', title: 'Wi-Fi connectivity in lab wing B', excerpt: 'Students in wing B have been experiencing...', badge: 'IT', time: '10m ago', author: 'Rahul V.' },
  { id: 'QC-2026-0040', title: 'Reimbursement form not available online', excerpt: 'The Form F3 for travel reimbursement is not...', badge: 'Finance', time: '1h ago', author: 'Priya M.' },
  { id: 'QC-2026-0039', title: 'Lab access after working hours', excerpt: 'I need to access the lab after 7 PM for my...', badge: 'Facilities', time: '3h ago', author: 'Amit S.' },
]

export const QueriesManagementView: React.FC = () => {
  const [activeQuery, setActiveQuery] = useState<QueryCard | null>(mockQueries[0])
  const [replyText, setReplyText] = useState('')
  const [showApproval, setShowApproval] = useState(false)

  return (
    <div className="qm-container">
      {/* Inbox */}
      <div className="qm-inbox">
        <div className="qm-inbox-header">Query Inbox</div>
        <div className="qm-filters">
          {['All', 'Pending', 'Resolved'].map((f) => (
            <button
              key={f}
              className={`qm-filter-btn ${f === 'All' ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="qm-card-list">
          {mockQueries.map((q) => (
            <div
              key={q.id}
              className={`qm-card ${activeQuery?.id === q.id ? 'active' : ''}`}
              onClick={() => setActiveQuery(q)}
            >
              <div className="qm-card-top">
                <span className="qm-card-id">{q.id}</span>
                <span className="qm-card-time">{q.time}</span>
              </div>
              <div className="qm-card-title">{q.title}</div>
              <div className="qm-card-excerpt">{q.excerpt}</div>
              <div className="qm-card-footer">
                <span className="qm-card-badge">{q.badge}</span>
                <span className="qm-card-author">{q.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workspace */}
      {activeQuery ? (
        <div className="qm-workspace">
          {/* Thread Panel */}
          <div className="qm-panel qm-thread-panel">
            <div className="qm-thread-header">
              <div className="qm-thread-title">
                <h2>{activeQuery.title}</h2>
                <p>From {activeQuery.author} · {activeQuery.id}</p>
              </div>
              <div className="qm-thread-actions">
                <button className="qm-thread-btn">Flag</button>
                <button
                  className="qm-thread-btn"
                  style={{ background: '#0b1528', color: '#fff', border: 'none' }}
                >
                  <Check size={14} /> Resolve
                </button>
              </div>
            </div>

            <div className="qm-thread-content">
              <div className="qm-message">
                <div className="qm-msg-avatar">
                  <div style={{ width: '100%', height: '100%', background: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#111827' }}>
                    {activeQuery.author[0]}
                  </div>
                </div>
                <div className="qm-msg-body">
                  <div className="qm-msg-header">
                    <span className="qm-msg-name">{activeQuery.author}</span>
                    <span className="qm-msg-time">Just now</span>
                  </div>
                  <div className="qm-msg-text">{activeQuery.excerpt} Further details would be provided upon request.</div>
                </div>
              </div>

              {/* Internal note */}
              <div className="qm-internal-note">
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#111827', letterSpacing: '0.5px' }}>INTERNAL NOTE</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Escalated to Facilities team — waiting on their response.</span>
              </div>
            </div>
          </div>

          {/* Resolution Panel */}
          <div className="qm-panel qm-resolution-panel">
            <div className="qm-res-title">RESOLUTION</div>
            <div className="qm-res-grid">
              <div className="qm-res-col">
                <div className="qm-label">Promote to FAQ</div>
                <div className="qm-faq-chip">
                  <span>Can be generalized → FAQ</span>
                </div>
              </div>
              <div className="qm-res-col">
                <div className="qm-label">Assign To</div>
                <div className="qm-search-wrap">
                  <input type="text" placeholder="Search team..." />
                </div>
              </div>
            </div>

            <div className="qm-promote-box">
              <div className="qm-promote-left">
                <Check size={16} />
                <span>Mark as Priority</span>
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  className="qm-thread-btn"
                  onClick={() => setShowApproval(!showApproval)}
                >
                  Seek Approval <ChevronDown size={14} />
                </button>
                {showApproval && (
                  <div className="qm-approval-popup">
                    {['Admin', 'Faculty', 'Director'].map((role, i) => (
                      <div key={role} className={`qm-approver ${i === 0 ? 'active' : 'inactive'} ${i === 2 ? 'no-border' : ''}`}>
                        <div className="qm-approver-avatar">
                          <div style={{ width: '100%', height: '100%', background: '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>
                            {role[0]}
                          </div>
                        </div>
                        <div className="qm-approver-info">
                          <h5>{role}</h5>
                          <p>Approve &amp; Resolve</p>
                        </div>
                      </div>
                    ))}
                    <button className="qm-approval-send-btn">
                      <Send size={14} /> Send for Approval
                    </button>
                  </div>
                )}
              </div>
            </div>

            <textarea
              className="qm-textarea"
              placeholder="Add a resolution note..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />

            <div className="qm-res-actions">
              <button className="qm-btn-outline-danger">Escalate</button>
              <button className="qm-btn-primary">
                <Check size={14} /> Resolve Query
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="qm-workspace" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#9ca3af' }}>Select a query from the inbox to view details.</p>
        </div>
      )}
    </div>
  )
}

export default QueriesManagementView