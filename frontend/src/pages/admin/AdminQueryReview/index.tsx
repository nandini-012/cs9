import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminQueryReview.css'

export const AdminQueryReview: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="review-container">
      <div className="review-header">
        <button className="btn-secondary" onClick={() => navigate('/admin')}>
          ← Back to Dashboard
        </button>
        <h2>Review Query #4829</h2>
      </div>

      <div className="review-content">
        <div className="query-details glass-panel">
          <h3>Query Information</h3>
          <div className="info-group">
            <label>Category:</label>
            <span>NOC Submission</span>
          </div>
          <div className="info-group">
            <label>Description:</label>
            <p>
              I am unable to procure the signature of my HOD for the NOC due to the
              current semester break. The submission deadline is approaching and I need
              guidance on the alternative process available.
            </p>
          </div>
        </div>

        <div className="admin-actions glass-panel">
          <h3>Actions</h3>
          <textarea
            rows={4}
            placeholder="Enter resolution notes or response to the student..."
          />

          <div className="action-buttons">
            <button className="btn-secondary danger">Flag as Inappropriate</button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary">Seek Approval (Higher Authority)</button>
              <button className="btn-primary">Resolve Query</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminQueryReview