import React, { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import './TrackQuery.css'

interface TimelineStep {
  label: string
  sublabel: string
  completed: boolean
  active?: boolean
}

const mockSteps: TimelineStep[] = [
  { label: 'Query Submitted', sublabel: 'Jun 12, 2026 · 10:30 AM', completed: true },
  { label: 'Under Review', sublabel: 'Jun 12, 2026 · 2:15 PM', completed: true },
  { label: 'Assigned to Team', sublabel: 'Jun 13, 2026 · 9:00 AM', completed: true, active: true },
  { label: 'Resolution in Progress', sublabel: 'Expected by Jun 15', completed: false },
  { label: 'Resolved & Closed', sublabel: '', completed: false },
]

export const TrackQuery: React.FC = () => {
  const [queryId, setQueryId] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [trackId] = useState('QC-2026-0042')

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="track-container">
      <div className="track-header">
        <span className="badge-academics">Student Portal</span>
        <h2>Track Your Query</h2>
        {!submitted && (
          <p className="query-id">Enter your query ID to see real-time status</p>
        )}
      </div>

      {!submitted ? (
        <div className="track-content">
          <form className="query-details" onSubmit={handleTrack}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Query ID (e.g. QC-2026-0042)"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit" style={{ marginTop: '16px' }}>
                Track <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="tips-card">
            <h3>How to find your Query ID</h3>
            <p>Your Query ID was sent to your registered email when you submitted the query. It starts with &quot;QC-&quot; followed by the year and a number.</p>
          </div>
        </div>
      ) : (
        <div className="track-content">
          <div className="query-details">
            <div className="user-profile">
              <div className="avatar" />
              <div>
                <strong style={{ color: '#111827' }}>Amit Sharma</strong>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Submitted Jun 12, 2026</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <span className="qd-tag-id">{trackId}</span>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#0b1528', marginTop: '12px' }}>
                How do I claim reimbursement for the Lab workshop materials?
              </h3>
            </div>

            <p className="query-text">
              I attended the Lab workshop on embedded systems last week. The receipt for the components I purchased is attached. Please let me know the process to get it reimbursed.
            </p>

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
              <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '12px' }}>
                Finance
              </span>
              <span style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '12px' }}>
                In Progress
              </span>
            </div>
          </div>

          <div className="resolution-timeline">
            <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '24px' }}>Resolution Timeline</h3>
            {mockSteps.map((step, i) => (
              <div key={i} className={`timeline-item ${!step.completed ? 'pending' : ''}`}>
                <div className={`timeline-icon ${step.completed ? (step.active ? 'warning' : 'success') : ''}`}>
                  {step.completed ? <CheckCircle size={12} /> : <Clock size={12} />}
                </div>
                <div className="timeline-content">
                  <h4>{step.label}</h4>
                  {step.sublabel && <span>{step.sublabel}</span>}
                </div>
              </div>
            ))}

            <div style={{ marginTop: '32px', padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertCircle size={14} color="#b45309" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#b45309' }}>Estimated Response</span>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                The team aims to respond within 48 hours. You&apos;ll receive an email notification when there&apos;s an update.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackQuery