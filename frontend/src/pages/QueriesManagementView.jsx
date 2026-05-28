import React, { useState } from 'react';
import { Share2, Archive, Search, Lock, Plus, Settings, Send, Clock } from 'lucide-react';
import './QueriesManagementView.css';

const APPROVERS = [
  { id: 1, name: 'Rahul Prasad', code: 'STD_02134', img: '11' },
  { id: 2, name: 'Sherya Chaudhary', code: 'STD_02456', img: '5' },
  { id: 3, name: 'Udharsh Goyal', code: 'STD_02548', img: '12' }
];

const MOCK_QUERIES = [
  {
    id: '#QRY-9021',
    time: '2h ago',
    title: 'Dataset Access: Phase 2 Neuroscience',
    excerpt: 'I am unable to access the raw EEG signals from the Phase 2 dataset even after the recent credentials...',
    badge: 'URGENT',
    author: 'Rohan Malhotra · M.Tech',
    startedBy: 'Thread started by Rohan Malhotra on Oct 24, 2023',
    status: 'In Review'
  },
  {
    id: '#QRY-8995',
    time: 'Yesterday',
    title: 'Computing Cluster Allocation',
    excerpt: 'Requesting 128GB RAM node for my upcoming ML training scheduled for next week...',
    badge: 'INFRA',
    author: 'Amit K.',
    startedBy: 'Thread started by Amit K. on Oct 23, 2023',
    status: 'Pending'
  },
  {
    id: '#QRY-9018',
    time: '5h ago',
    title: 'Stipend Disbursement Delay',
    excerpt: 'Looking for an update on the Q3 research assistant stipend. The portal shows pending since...',
    badge: 'GENERAL',
    author: 'Dr. S. Iyengar',
    startedBy: 'Thread started by Dr. S. Iyengar on Oct 24, 2023',
    status: 'Pending'
  },
  {
    id: '#QRY-9025',
    time: '1d ago',
    title: 'Lab Equipment Maintenance',
    excerpt: 'The centrifuge in Lab 3 is making an unusual noise. Need a technician to inspect...',
    badge: 'FACILITIES',
    author: 'Priya S.',
    startedBy: 'Thread started by Priya S. on Oct 23, 2023',
    status: 'In Review'
  },
  {
    id: '#QRY-9030',
    time: '3d ago',
    title: 'Software License Renewal',
    excerpt: 'Our MATLAB network license expires in 5 days. Can we expedite the renewal process...',
    badge: 'IT SERVICES',
    author: 'Vikram R.',
    startedBy: 'Thread started by Vikram R. on Oct 21, 2023',
    status: 'Pending'
  }
];

const QueriesManagementView = () => {
  const [showApprovalMenu, setShowApprovalMenu] = useState(false);
  const [selectedApproverId, setSelectedApproverId] = useState(APPROVERS[0].id);
  const [approvalPendingFor, setApprovalPendingFor] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedQueryId, setSelectedQueryId] = useState(MOCK_QUERIES[0].id);

  // Filter queries based on active tab
  const filteredQueries = MOCK_QUERIES.filter(q => {
    if (activeTab === 'All') return true;
    return q.status === activeTab;
  });

  const selectedQuery = MOCK_QUERIES.find(q => q.id === selectedQueryId) || MOCK_QUERIES[0];

  const handleResolve = () => {
    alert(`Query ${selectedQuery.id} marked as Resolved & Sent!`);
  };

  const handleShare = () => {
    alert(`Share link for ${selectedQuery.id} copied to clipboard!`);
  };

  const handleArchive = () => {
    alert(`Query ${selectedQuery.id} has been archived.`);
  };

  return (
    <div className="qm-container">
      {/* Left Inbox Column */}
      <div className="qm-inbox">
        <h3 className="qm-inbox-header">Query Inbox</h3>
        
        <div className="qm-filters">
          <div 
            className={`qm-filter-btn ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => setActiveTab('All')}
          >All ({MOCK_QUERIES.length})</div>
          <div 
            className={`qm-filter-btn ${activeTab === 'Pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('Pending')}
          >Pending ({MOCK_QUERIES.filter(q => q.status === 'Pending').length})</div>
          <div 
            className={`qm-filter-btn ${activeTab === 'In Review' ? 'active' : ''}`}
            onClick={() => setActiveTab('In Review')}
          >In Review ({MOCK_QUERIES.filter(q => q.status === 'In Review').length})</div>
        </div>

        <div className="qm-card-list">
          {filteredQueries.map(query => {
            const isActive = selectedQueryId === query.id;
            return (
              <div 
                key={query.id}
                className={`qm-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSelectedQueryId(query.id);
                  setApprovalPendingFor(null); // Reset approval state when switching cards
                }}
              >
                {isActive && approvalPendingFor && (
                  <div style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '8px 12px',
                    borderRadius: '10px 10px 0 0',
                    margin: '-20px -20px 16px -20px',
                    borderBottom: '1px solid #fee2e2',
                    textAlign: 'center',
                    letterSpacing: '0.5px'
                  }}>
                    UNDER SEEK APPROVAL FROM {approvalPendingFor.toUpperCase()}
                  </div>
                )}
                <div className="qm-card-top">
                  <span className="qm-card-id">{query.id}</span>
                  <span className="qm-card-time">{query.time}</span>
                </div>
                <h4 className="qm-card-title">{query.title}</h4>
                <p className="qm-card-excerpt">{query.excerpt}</p>
                <div className="qm-card-footer">
                  <span className="qm-card-badge">{query.badge}</span>
                  <span className="qm-card-author">{query.author}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Workspace Column */}
      <div className="qm-workspace">
        
        {/* Top Thread Panel */}
        <div className="qm-panel qm-thread-panel">
          <div className="qm-thread-header">
            <div className="qm-thread-title">
              <h2>{selectedQuery.title}</h2>
              <p>{selectedQuery.startedBy}</p>
            </div>
            <div className="qm-thread-actions">
              <button className="qm-thread-btn" onClick={handleShare}><Share2 size={16}/> Share</button>
              <button className="qm-thread-btn" onClick={handleArchive}><Archive size={16}/> Archive</button>
            </div>
          </div>
          
          <div className="qm-thread-content">
            <div className="qm-message">
              <div className="qm-msg-avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
              </div>
              <div className="qm-msg-body">
                <div className="qm-msg-header">
                  <div className="qm-msg-name">{selectedQuery.author.split('·')[0].trim()}</div>
                  <div className="qm-msg-time">10:42 AM</div>
                </div>
                <div className="qm-msg-text">
                  {selectedQuery.excerpt} I am requesting further assistance on this issue as it is blocking my work. Please let me know the next steps or if additional documentation is required.
                </div>
              </div>
            </div>

            <div className="qm-internal-note">
              <Lock size={16} color="#6b7280" />
              <p>INTERNAL NOTE: THIS QUERY WAS ESCALATED BASED ON PRIORITY FLAGS.</p>
            </div>

            <div className="qm-message">
              <div className="qm-msg-avatar">
                <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
              </div>
              <div className="qm-msg-body">
                <div className="qm-msg-header">
                  <div className="qm-msg-name">{selectedQuery.author.split('·')[0].trim()}</div>
                  <div className="qm-msg-time">1:15 PM</div>
                </div>
                <div className="qm-msg-text">
                  Just checking if there's any update. I need to start the preprocessing today for the supervisor meeting tomorrow.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Resolution Workspace Panel */}
        <div className="qm-panel qm-resolution-panel">
          <h3 className="qm-res-title">RESOLUTION WORKSPACE</h3>
          
          {approvalPendingFor ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 0', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Clock size={24} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                Pending Approval from {approvalPendingFor}
              </h4>
              <p style={{ fontSize: '13px', color: '#6b7280', maxWidth: '300px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                This response has been routed for administrative review. You will be notified once it is approved or rejected.
              </p>
              <button 
                className="qm-btn-outline-danger"
                onClick={() => setApprovalPendingFor(null)}
              >
                Cancel Request
              </button>
            </div>
          ) : (
            <div className="qm-res-grid">
              {/* Left Col: Search & Link */}
              <div className="qm-res-col">
                <div className="qm-label">Search FAQ to link</div>
                <div className="qm-search-wrap">
                  <input type="text" placeholder="Search keywords" />
                  <Search size={18} />
                </div>
                
                <button className="qm-faq-chip" onClick={() => alert("Linked Dataset Access Policy!")}>
                  Dataset Access Policy <Plus size={16} color="#6b7280" />
                </button>
                <button className="qm-faq-chip" onClick={() => alert("Linked LDAP Authentication Help!")}>
                  LDAP Authentication Help <Plus size={16} color="#6b7280" />
                </button>

                <div className="qm-promote-box">
                  <div className="qm-promote-left">
                    <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                    <span>Promote this query to public FAQ list</span>
                  </div>
                  <Settings size={18} color="#6b7280" style={{ cursor: 'pointer' }} />
                </div>
              </div>

              {/* Right Col: Custom Text */}
              <div className="qm-res-col">
                <div className="qm-label">Custom Text Response</div>
                <textarea 
                  className="qm-textarea" 
                  placeholder="Type your response here. Maintain an authoritative yet helpful tone..."
                ></textarea>
                
                <div className="qm-res-actions" style={{ position: 'relative' }}>
                  <button className="qm-btn-primary" onClick={handleResolve}><Send size={16} /> Resolve & Send</button>
                  <button 
                    className="qm-btn-outline-danger"
                    onClick={() => setShowApprovalMenu(!showApprovalMenu)}
                  >
                    Seek Approval
                  </button>

                  {/* Seek Approval Popup */}
                  {showApprovalMenu && (
                    <div className="qm-approval-popup">
                      {APPROVERS.map((approver, index) => {
                        const isActive = selectedApproverId === approver.id;
                        const isLast = index === APPROVERS.length - 1;
                        
                        let className = "qm-approver";
                        if (isActive) {
                          className += " active";
                        } else {
                          className += " inactive";
                          if (isLast) className += " no-border";
                        }

                        return (
                          <div 
                            key={approver.id} 
                            className={className}
                            onClick={() => setSelectedApproverId(approver.id)}
                          >
                            <div className="qm-approver-avatar">
                              <img src={`https://i.pravatar.cc/150?img=${approver.img}`} alt={approver.name} />
                            </div>
                            <div className="qm-approver-info">
                              <h5>{approver.name}</h5>
                              <p>{approver.code}</p>
                            </div>
                          </div>
                        );
                      })}

                      <button 
                        className="qm-approval-send-btn"
                        onClick={() => {
                          const selected = APPROVERS.find(a => a.id === selectedApproverId);
                          setApprovalPendingFor(selected.name);
                          setShowApprovalMenu(false);
                        }}
                      >
                        <Send size={16} /> Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default QueriesManagementView;
