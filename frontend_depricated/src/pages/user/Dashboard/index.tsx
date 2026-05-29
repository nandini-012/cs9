import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="dashboard-container container animate-fade-in">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search FAQs, categories, or status..."
            onFocus={() => navigate('/faq')}
          />
        </div>
      </div>

      <div className="dashboard-actions">
        <button
          className="btn-primary"
          onClick={() => navigate('/raise-query')}
        >
          Raise New Query
        </button>
      </div>

      <div className="dashboard-content">
        <div className="queries-list glass-panel">
          <h3>Your Queries</h3>
          <div className="empty-state">
            <p>You haven&apos;t raised any queries yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard