import React, { useState } from 'react';
import { X, CheckCircle2, User, Paperclip, ChevronUp, ChevronDown, Star, AlertTriangle, MoreHorizontal, Check, FileText, HelpCircle } from 'lucide-react';
import './QueryDetailView.css';

const QueryDetailView = ({ query, onClose }) => {
  const [upvotes, setUpvotes] = useState(42);
  const [voteState, setVoteState] = useState(null); // 'up', 'down', or null
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const handleUpvote = () => {
    if (voteState === 'up') {
      setUpvotes(upvotes - 1);
      setVoteState(null);
    } else if (voteState === 'down') {
      setUpvotes(upvotes + 2);
      setVoteState('up');
    } else {
      setUpvotes(upvotes + 1);
      setVoteState('up');
    }
  };

  const handleDownvote = () => {
    if (voteState === 'down') {
      setUpvotes(upvotes + 1);
      setVoteState(null);
    } else if (voteState === 'up') {
      setUpvotes(upvotes - 2);
      setVoteState('down');
    } else {
      setUpvotes(upvotes - 1);
      setVoteState('down');
    }
  };

  return (
    <div className="qd-container">
      <button className="qd-close-btn" onClick={onClose}>
        <X size={32} strokeWidth={1} />
      </button>

      <div className="qd-layout">
        
        {/* Left Main Content */}
        <div className="qd-main-col">
          
          <div className="qd-header">
            <div className="qd-header-tags">
              <span className="qd-tag-id">#2409</span>
              <span className="qd-tag-label">{query?.tags[0]?.label || 'NOC Requirements'}</span>
            </div>
            <h1 className="qd-title">{query?.title || 'When do I submit the NOC?'}</h1>
            
            <div className="qd-meta">
              <div className="qd-status-badge">
                <CheckCircle2 size={16} /> Resolved
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> <strong>Student User</strong> opened this on Oct 12
              </div>
              <span className="qd-phase-badge">PHASE 1</span>
            </div>
          </div>

          <div className="qd-thread">
            <div className="qd-thread-line"></div>

            {/* Comment 1 (Solution) */}
            <div className="qd-comment">
              <div className="qd-avatar">
                <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=0D8ABC&color=fff" alt="Alex Rivera" />
              </div>
              
              <div className="qd-comment-box">
                <div className="qd-cb-header">
                  <div className="qd-cb-author">
                    <span className="qd-cb-name">Alex Rivera</span>
                    <span className="qd-cb-role">PEER RESOLVER</span>
                    <span className="qd-cb-date">commented Oct 13</span>
                  </div>
                  <div className="qd-cb-actions">
                    <span className="qd-cb-solution"><Check size={14} strokeWidth={3} /> SOLUTION</span>
                    <MoreHorizontal size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                  </div>
                </div>
                
                <div className="qd-cb-body">
                  Hey! The NOC is essentially required to finalize your internship contract.
                  You should ideally upload it via the portal under the "Compliance" tab
                  before the end of your first week. If you miss this, the stipend processing
                  might be delayed, but your registration remains active.

                  <div className="qd-cb-attachment">
                    <Paperclip size={16} color="#9ca3af" /> NOC_Template_V2.pdf
                  </div>
                </div>

                <div className="qd-cb-footer">
                  <div className="qd-f-left">
                    <div className="qd-upvote-control">
                      <ChevronUp 
                        size={20} 
                        color={voteState === 'up' ? '#2563eb' : '#6b7280'} 
                        onClick={handleUpvote} 
                        style={{ cursor: 'pointer' }}
                      /> 
                      <span style={{ color: voteState !== null ? '#111827' : '#111827' }}>{upvotes}</span> 
                      <ChevronDown 
                        size={20} 
                        color={voteState === 'down' ? '#dc2626' : '#6b7280'} 
                        onClick={handleDownvote} 
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div 
                      className="qd-f-btn orange"
                      style={{ cursor: 'default', background: 'transparent', border: 'none' }}
                      title="This solution has been endorsed by an Admin"
                    >
                      <Star size={14} fill="currentColor" /> ADMIN ENDORSED
                    </div>
                  </div>
                  <div className="qd-f-right">
                    <button className="qd-f-btn gray" onClick={() => setShowReportModal(true)}>
                      <AlertTriangle size={14} /> REPORT
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment 2 (Original Post) */}
            <div className="qd-comment" style={{ marginBottom: 0 }}>
              <div className="qd-avatar" style={{ border: 'none', width: '36px', height: '36px', left: '-54px', top: '10px' }}>
                <img src="https://ui-avatars.com/api/?name=Student+User&background=111827&color=fff" alt="Student" />
              </div>
              
              <div className="qd-comment-box" style={{ borderBottom: 'none', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                <div className="qd-cb-header" style={{ borderBottom: 'none' }}>
                  <div className="qd-cb-author">
                    <span className="qd-cb-name">Student User</span>
                    <span className="qd-cb-date">commented Oct 12</span>
                  </div>
                  <div className="qd-cb-actions">
                    <MoreHorizontal size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                  </div>
                </div>
                
                <div className="qd-cb-body" style={{ paddingTop: 0 }}>
                  I am currently in the onboarding phase. Should the NOC (No Objection
                  Certificate) be submitted before the first stipend disbursement or is it
                  mandatory during the initial registration?
                </div>
              </div>
            </div>

            {/* Comment 3 (Logged In User - Cannot Report Themselves) */}
            <div className="qd-comment">
              <div className="qd-avatar" style={{ border: 'none', width: '48px', height: '48px', left: '-60px', top: '0' }}>
                <img src="https://ui-avatars.com/api/?name=Rahul+Prasad&background=f59e0b&color=fff" alt="Rahul Prasad" />
              </div>
              
              <div className="qd-comment-box">
                <div className="qd-cb-header" style={{ borderBottom: 'none' }}>
                  <div className="qd-cb-author">
                    <span className="qd-cb-name">Rahul Prasad (You)</span>
                    <span className="qd-cb-date">commented Oct 14</span>
                  </div>
                  <div className="qd-cb-actions">
                    <MoreHorizontal size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                  </div>
                </div>
                
                <div className="qd-cb-body" style={{ paddingTop: 0 }}>
                  Got it, thanks Alex! I will upload the NOC document to the portal by tomorrow.
                </div>
                
                <div className="qd-cb-footer">
                  <div className="qd-f-left">
                    <div className="qd-upvote-control">
                      <ChevronUp size={20} color="#6b7280" style={{ cursor: 'pointer' }} /> 
                      <span style={{ color: '#111827' }}>2</span> 
                      <ChevronDown size={20} color="#6b7280" style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                  <div className="qd-f-right">
                    {/* The Report button is intentionally omitted here because users cannot report themselves */}
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>Cannot report own comment</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* New Comment Input Box */}
            <div className="qd-comment" style={{ marginBottom: 0, marginTop: '32px' }}>
              <div className="qd-avatar" style={{ border: 'none', width: '36px', height: '36px', left: '-54px', top: '10px' }}>
                <img src="https://ui-avatars.com/api/?name=Rahul+Prasad&background=f59e0b&color=fff" alt="You" />
              </div>
              
              <div className="qd-comment-box" style={{ padding: '16px 20px' }}>
                <textarea 
                  placeholder="Drop your resolution, comment, or suggestions here..."
                  style={{ 
                    width: '100%', 
                    minHeight: '80px', 
                    border: 'none', 
                    outline: 'none', 
                    resize: 'vertical',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    color: '#111827'
                  }}
                ></textarea>
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginTop: '8px' }}>
                  <button 
                    style={{ 
                      background: '#0b1528', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '8px 20px', 
                      borderRadius: '6px', 
                      fontWeight: '600', 
                      fontSize: '13px', 
                      cursor: 'pointer' 
                    }}
                    onClick={(e) => {
                      e.target.parentElement.previousSibling.value = '';
                      alert("Your comment has been posted!");
                    }}
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Widgets */}
        <div className="qd-side-col">
          
          {/* Query Status */}
          <div className="qd-widget">
            <h4 className="qd-w-title">Query Status</h4>
            
            <div className="qd-stepper">
              <div className="qd-step">
                <div className="qd-step-icon"><Check size={12} strokeWidth={3} /></div>
                <div className="qd-step-content">
                  <h5>Submitted</h5>
                  <p>Oct 12, 10:30 AM</p>
                </div>
              </div>
              
              <div className="qd-step">
                <div className="qd-step-icon"><Check size={12} strokeWidth={3} /></div>
                <div className="qd-step-content">
                  <h5>Peer Resolving</h5>
                  <p>Alex Rivera Active</p>
                </div>
              </div>

              <div className="qd-step" style={{ marginBottom: 0 }}>
                <div className="qd-step-icon green"><Check size={12} strokeWidth={3} /></div>
                <div className="qd-step-content">
                  <h5 style={{ color: '#166534' }}>Resolved</h5>
                  <p>Closed Oct 14</p>
                </div>
              </div>
            </div>
          </div>

          {/* Peer Resolver Leaderboard */}
          <div className="qd-widget">
            <h4 className="qd-w-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Peer Resolver Leaderboard
              <Star size={14} color="#f59e0b" />
            </h4>
            
            <div className="qd-podium">
              {/* 2nd Place */}
              <div className="qd-pod-item" style={{ marginBottom: '-10px' }}>
                <div className="qd-pod-avatar silver">
                  <img src="https://ui-avatars.com/api/?name=Samad&background=f3f4f6" alt="Samad" />
                  <div className="qd-medal silver">2</div>
                </div>
                <div className="qd-pod-name">Samad</div>
                <div className="qd-pod-pts" style={{ color: '#9ca3af', fontWeight: '400' }}>1250</div>
              </div>
              
              {/* 1st Place */}
              <div className="qd-pod-item" style={{ zIndex: 2 }}>
                <div className="qd-pod-avatar gold">
                  <img src="https://ui-avatars.com/api/?name=Rahul+Prasad&background=f3f4f6" alt="Rahul" />
                  <div className="qd-medal gold">1</div>
                </div>
                <div className="qd-pod-name" style={{ fontSize: '13px' }}>Rahul<br/>Prasad</div>
                <div className="qd-pod-pts" style={{ fontSize: '13px' }}>1250</div>
              </div>
              
              {/* 3rd Place */}
              <div className="qd-pod-item" style={{ marginBottom: '-20px' }}>
                <div className="qd-pod-avatar bronze">
                  <img src="https://ui-avatars.com/api/?name=ROY&background=f3f4f6" alt="Roy" />
                  <div className="qd-medal bronze">3</div>
                </div>
                <div className="qd-pod-name">ROY</div>
                <div className="qd-pod-pts" style={{ color: '#9ca3af', fontWeight: '400' }}>1180</div>
              </div>
            </div>

            <h4 className="qd-w-title" style={{ marginBottom: '16px' }}>Leaderboard - This Month</h4>
            
            <div className="qd-lb-list">
              <div className="qd-lb-row">
                <div className="qd-lb-rank">1</div>
                <div className="qd-lb-av"><img src="https://ui-avatars.com/api/?name=Udharsh&background=f3f4f6" alt="U" /></div>
                <div className="qd-lb-name">Udharsh</div>
              </div>
              <div className="qd-lb-row">
                <div className="qd-lb-rank">2</div>
                <div className="qd-lb-av"><img src="https://ui-avatars.com/api/?name=Shreya&background=f3f4f6" alt="S" /></div>
                <div className="qd-lb-name">Shreya</div>
              </div>
            </div>

            <a className="qd-lb-btn">VIEW FULL LEADERBOARD</a>
          </div>

          {/* Resource Links */}
          <div className="qd-widget">
            <h4 className="qd-w-title">Resource Links</h4>
            <div className="qd-res-link" onClick={() => alert("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")}>
              <FileText size={16} /> Official Internship Policy
            </div>
            <div className="qd-res-link" onClick={() => alert("Lorem ipsum dolor sit amet. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.")}>
              <HelpCircle size={16} /> Help Desk Contact
            </div>
          </div>

        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="report-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <div className="report-modal-header">
              <h3>Report Content</h3>
              <button className="report-modal-close" onClick={() => setShowReportModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="report-modal-body">
              <h4>Why are you reporting this?</h4>
              
              <label className={`report-radio-option ${reportReason === 'inappropriate' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="reportReason" 
                  value="inappropriate" 
                  checked={reportReason === 'inappropriate'}
                  onChange={() => setReportReason('inappropriate')}
                />
                Inappropriate content
              </label>

              <label className={`report-radio-option ${reportReason === 'incorrect' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="reportReason" 
                  value="incorrect" 
                  checked={reportReason === 'incorrect'}
                  onChange={() => setReportReason('incorrect')}
                />
                Incorrect information
              </label>

              <label className={`report-radio-option ${reportReason === 'spam' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="reportReason" 
                  value="spam" 
                  checked={reportReason === 'spam'}
                  onChange={() => setReportReason('spam')}
                />
                Spam
              </label>

              <label className={`report-radio-option ${reportReason === 'other' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="reportReason" 
                  value="other" 
                  checked={reportReason === 'other'}
                  onChange={() => setReportReason('other')}
                />
                Other
              </label>

              <h4 style={{ marginTop: '24px' }}>Additional Details (Optional)</h4>
              <textarea 
                placeholder="Please provide more information..."
                value={reportDetails}
                onChange={e => setReportDetails(e.target.value)}
              ></textarea>
            </div>
            <div className="report-modal-footer">
              <button className="btn-report-cancel" onClick={() => setShowReportModal(false)}>CANCEL</button>
              <button 
                className="btn-report-submit" 
                onClick={() => {
                  if(!reportReason) {
                    alert("Please select a reason for reporting.");
                    return;
                  }
                  alert(`Report submitted successfully.\nReason: ${reportReason}`);
                  setShowReportModal(false);
                  setReportReason('');
                  setReportDetails('');
                }}
              >
                SEND REPORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryDetailView;
