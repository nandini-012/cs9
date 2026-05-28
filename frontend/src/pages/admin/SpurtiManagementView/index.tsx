import React from 'react'
import { Flag, X, Trash2 } from 'lucide-react'
import './SpurtiManagementView.css'

export const SpurtiManagementView: React.FC = () => {
  return (
    <div className="sp-container">
      <div className="sp-header">
        <h1 className="sp-title">Spurti Achievement Leaderboard</h1>
        <p className="sp-subtitle">
          Recognizing academic rigor and community contribution. Top researchers are ranked based on their commitment to resolving peer queries and maintaining community standards.
        </p>
      </div>

      <div className="sp-grid">
        {/* Left Column */}
        <div className="sp-left-col">
          {/* Top Contributors Card */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h2 className="sp-card-title">Top Contributors</h2>
              <div className="sp-toggle">
                <button className="sp-toggle-btn">Monthly</button>
                <button className="sp-toggle-btn active">Today</button>
              </div>
            </div>

            <table className="sp-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Scholar</th>
                  <th>Resolved</th>
                  <th>Upvotes</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: '01', name: 'Rahul Prasad', id: 'STD_02134', resolved: 142, upvotes: 892, pts: '2,450', img: 'https://i.pravatar.cc/150?img=11' },
                  { rank: '02', name: 'Sherya Chaudhary', id: 'STD_02456', resolved: 128, upvotes: 754, pts: '2,120', img: 'https://i.pravatar.cc/150?img=5' },
                  { rank: '03', name: 'Udharsh Goyal', id: 'STD_02548', resolved: 115, upvotes: 642, pts: '1,980', img: 'https://i.pravatar.cc/150?img=12' },
                ].map((s) => (
                  <tr key={s.rank}>
                    <td className="sp-rank">{s.rank}</td>
                    <td>
                      <div className="sp-scholar">
                        <div className="sp-avatar">
                          <img src={s.img} alt={s.name} />
                        </div>
                        <div>
                          <div className="sp-name">{s.name}</div>
                          <div className="sp-id">{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="sp-val">{s.resolved}</td>
                    <td className="sp-val">{s.upvotes}</td>
                    <td className="sp-points">{s.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Flagged Content Section */}
          <div className="sp-flagged-section">
            <div className="sp-flagged-header">
              <div className="sp-flagged-title-wrap">
                <div className="sp-flagged-title">
                  <Flag color="#ef4444" size={24} /> Flagged Content Review
                </div>
                <div className="sp-flagged-subtitle">Pending moderation actions for student peer responses.</div>
              </div>
              <button className="sp-review-all-btn">Review All</button>
            </div>

            <div className="sp-flagged-list">
              <div className="sp-flagged-card">
                <div className="sp-flag-meta">
                  <span className="sp-badge red">INACCURACY</span>
                  <span className="sp-flagged-by">Flagged by: Prof. Mehta</span>
                </div>
                <div className="sp-flagged-content">
                  <div className="sp-flagged-text">
                    &quot;The constant in the Schwarzschild radius formula should be corrected...&quot;
                  </div>
                  <div className="sp-flagged-actions">
                    <button className="sp-icon-btn grey"><X size={18} /></button>
                    <button className="sp-icon-btn red"><Trash2 size={18} /></button>
                    <button className="sp-action-btn orange">Edit &amp; Resolve</button>
                  </div>
                </div>
                <div className="sp-flagged-footer">
                  Response by: <strong>Amit K.</strong> on Query #8821
                </div>
              </div>

              <div className="sp-flagged-card">
                <div className="sp-flag-meta">
                  <span className="sp-badge grey">OFF-TOPIC</span>
                  <span className="sp-flagged-by">Flagged by: System Audit</span>
                </div>
                <div className="sp-flagged-content">
                  <div className="sp-flagged-text">
                    &quot;This seems more like a casual discussion than a technical resolution.&quot;
                  </div>
                  <div className="sp-flagged-actions">
                    <button className="sp-action-btn dark">Moderate Now</button>
                  </div>
                </div>
                <div className="sp-flagged-footer">
                  Response by: <strong>Sarah J.</strong> on Query #9102
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="sp-right-col">
          <div className="sp-placeholder-block" />
          <div className="sp-live-activity">
            <div className="sp-la-title">LIVE ACTIVITY</div>
            <div className="sp-la-list">
              {[
                { dot: '', text: 'Rahul M. earned +50 pts for Expert Badge', time: '2 mins ago' },
                { dot: 'red', text: 'Content Flagged in Theoretical Physics thread', time: '15 mins ago' },
                { dot: '', text: 'New Leader Ananya S. moved to Rank #1', time: '1 hour ago' },
              ].map((item, i) => (
                <div key={i} className="sp-la-item">
                  <div className={`sp-la-dot ${item.dot}`} />
                  <div className="sp-la-content">
                    <div className="sp-la-text">{item.text}</div>
                    <div className="sp-la-time">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpurtiManagementView