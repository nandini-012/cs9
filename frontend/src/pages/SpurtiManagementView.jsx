import React from 'react';
import { Flag, X, Trash2 } from 'lucide-react';
import './SpurtiManagementView.css';

const SpurtiManagementView = () => {
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
                <tr>
                  <td className="sp-rank">01</td>
                  <td>
                    <div className="sp-scholar">
                      <div className="sp-avatar"><img src="https://i.pravatar.cc/150?img=11" alt="Rahul" /></div>
                      <div>
                        <div className="sp-name">Rahul Prasad</div>
                        <div className="sp-id">STD_02134</div>
                      </div>
                    </div>
                  </td>
                  <td className="sp-val">142</td>
                  <td className="sp-val">892</td>
                  <td className="sp-points">2,450</td>
                </tr>
                <tr>
                  <td className="sp-rank">02</td>
                  <td>
                    <div className="sp-scholar">
                      <div className="sp-avatar"><img src="https://i.pravatar.cc/150?img=5" alt="Sherya" /></div>
                      <div>
                        <div className="sp-name">Sherya Chaudhary</div>
                        <div className="sp-id">STD_02456</div>
                      </div>
                    </div>
                  </td>
                  <td className="sp-val">128</td>
                  <td className="sp-val">754</td>
                  <td className="sp-points">2,120</td>
                </tr>
                <tr>
                  <td className="sp-rank">03</td>
                  <td>
                    <div className="sp-scholar">
                      <div className="sp-avatar"><img src="https://i.pravatar.cc/150?img=12" alt="Udharsh" /></div>
                      <div>
                        <div className="sp-name">Udharsh Goyal</div>
                        <div className="sp-id">STD_02548</div>
                      </div>
                    </div>
                  </td>
                  <td className="sp-val">115</td>
                  <td className="sp-val">642</td>
                  <td className="sp-points">1,980</td>
                </tr>
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
              {/* Card 1 */}
              <div className="sp-flagged-card">
                <div className="sp-flag-meta">
                  <span className="sp-badge red">INACCURACY</span>
                  <span className="sp-flagged-by">Flagged by: Prof. Mehta</span>
                </div>
                <div className="sp-flagged-content">
                  <div className="sp-flagged-text">
                    "The constant in the Schwarzschild radius formula should be corrected..."
                  </div>
                  <div className="sp-flagged-actions">
                    <button className="sp-icon-btn grey"><X size={18} /></button>
                    <button className="sp-icon-btn red"><Trash2 size={18} /></button>
                    <button className="sp-action-btn orange">Edit & Resolve</button>
                  </div>
                </div>
                <div className="sp-flagged-footer">
                  Response by: <strong>Amit K.</strong> on Query #8821
                </div>
              </div>

              {/* Card 2 */}
              <div className="sp-flagged-card">
                <div className="sp-flag-meta">
                  <span className="sp-badge grey">OFF-TOPIC</span>
                  <span className="sp-flagged-by">Flagged by: System Audit</span>
                </div>
                <div className="sp-flagged-content">
                  <div className="sp-flagged-text">
                    "This seems more like a casual discussion than a technical resolution."
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
          <div className="sp-placeholder-block"></div>
          
          <div className="sp-live-activity">
            <div className="sp-la-title">LIVE ACTIVITY</div>
            
            <div className="sp-la-list">
              <div className="sp-la-item">
                <div className="sp-la-dot"></div>
                <div className="sp-la-content">
                  <div className="sp-la-text">Rahul M. earned +50 pts for 'Expert Badge'</div>
                  <div className="sp-la-time">2 mins ago</div>
                </div>
              </div>

              <div className="sp-la-item">
                <div className="sp-la-dot red"></div>
                <div className="sp-la-content">
                  <div className="sp-la-text">Content Flagged in Theoretical Physics thread</div>
                  <div className="sp-la-time">15 mins ago</div>
                </div>
              </div>

              <div className="sp-la-item">
                <div className="sp-la-dot"></div>
                <div className="sp-la-content">
                  <div className="sp-la-text">New Leader Ananya S. moved to Rank #1</div>
                  <div className="sp-la-time">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpurtiManagementView;
