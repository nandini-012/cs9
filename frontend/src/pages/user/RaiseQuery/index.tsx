import React, { useState } from 'react'
import { Upload, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import './RaiseQuery.css'

export const RaiseQuery: React.FC = () => {
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Query submitted!\nCategory: ${category}\nTitle: ${title}\nAnonymous: ${isAnonymous}`)
  }

  return (
    <div className="query-container">
      <div className="query-header">
        <h2>Raise a Query</h2>
        <p>Couldn't find your answer in the FAQ? Submit your question here.</p>
      </div>

      <div className="query-content">
        <form className="query-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="infra">Infrastructure</option>
              <option value="admin">Administration</option>
              <option value="ethics">Ethics & Compliance</option>
              <option value="academics">Academics</option>
              <option value="finance">Finance & Reimbursement</option>
              <option value="facilities">Facilities</option>
            </select>
          </div>

          <div className="form-group">
            <label>Query Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Summarize your question in one line"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              placeholder="Provide as much context as possible..."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Attachments (optional)</label>
            <div className="upload-box">
              <Upload size={32} />
              <h5>Click to upload or drag and drop</h5>
              <p>PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>

          <div className="anon-box">
            <div className="anon-text">
              <h5>Submit Anonymously</h5>
              <p>Your identity will be hidden from the public thread.</p>
            </div>
            <div
              className="toggle-switch"
              onClick={() => setIsAnonymous(!isAnonymous)}
              role="switch"
              aria-checked={isAnonymous}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsAnonymous(!isAnonymous)}
            >
              <div
                className="toggle-circle"
                style={{ left: isAnonymous ? '22px' : '2px' }}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-discard">Discard</button>
            <button type="submit" className="btn-submit">Submit Query</button>
          </div>
        </form>

        <div className="rq-side-col">
          <div className="sim-queries-widget">
            <div className="sim-title">
              <Info size={16} /> Similar Queries
            </div>
            <p className="sim-desc">Before submitting, check if your question has been asked before.</p>
            <div className="sim-card">
              <span className="sim-badge resolved">Resolved</span>
              <h4>How do I apply for lab access after hours?</h4>
              <p>Submit a request through the faculty portal with your supervisor's approval.</p>
            </div>
            <div className="sim-card">
              <span className="sim-badge progress">In Progress</span>
              <h4>What is the reimbursement process for travel?</h4>
              <p>Submit receipts via the finance portal within 30 days of travel.</p>
            </div>
          </div>

          <div className="pro-tip">
            <h4>💡 Pro Tip</h4>
            <p>
              Be specific and include context like dates, names, or reference numbers. The more details you provide, the faster you&apos;ll get an accurate answer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaiseQuery