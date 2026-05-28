import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Trash2, 
  Archive, 
  AlertTriangle, 
  Link2, 
  Send,
  HelpCircle,
  Clock,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import Button from '../components/Button';
import './AdminQueriesPage.css';

export default function AdminQueriesPage({ 
  queries = [], 
  setQueries, 
  faqs = [], 
  setFaqs,
  apiBaseUrl, 
  selectedQueryId,
  setSelectedQueryId,
  isSidebarOpen, 
  onOpenSidebar,
  token
}) {
  const [filterTab, setFilterTab] = useState('active'); // 'active', 'pending', 'resolved'
  const [searchVal, setSearchVal] = useState('');
  
  // Resolution states for selected query
  const [solutionText, setSolutionText] = useState('');
  const [promoteToFaq, setPromoteToFaq] = useState(false);
  const [selectedAuthority, setSelectedAuthority] = useState('');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqSearchResults, setFaqSearchResults] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Clear resolution state when query changes
  useEffect(() => {
    setSolutionText('');
    setPromoteToFaq(false);
    setSelectedAuthority('');
    setFaqSearchQuery('');
    setFaqSearchResults([]);
    setStatusMessage('');
  }, [selectedQueryId]);

  // Find active selected query
  const activeQuery = useMemo(() => {
    return queries.find(q => q.id === selectedQueryId) || null;
  }, [queries, selectedQueryId]);

  // Count active / pending queries
  const counts = useMemo(() => {
    const active = queries.filter(q => q.status !== 'Resolved' && !q.isResolved).length;
    const pending = queries.filter(q => q.status === 'In Progress').length;
    const resolved = queries.filter(q => q.status === 'Resolved' || q.isResolved).length;
    return { active, pending, resolved };
  }, [queries]);

  // Filtered queries list for left panel
  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      // 1. Tab filter
      if (filterTab === 'active' && (q.status === 'Resolved' || q.isResolved)) return false;
      if (filterTab === 'pending' && q.status !== 'In Progress') return false;
      if (filterTab === 'resolved' && q.status !== 'Resolved' && !q.isResolved) return false;

      // 2. Search keyword filter
      if (searchVal.trim() !== '') {
        const keyword = searchVal.toLowerCase();
        return (
          q.title.toLowerCase().includes(keyword) ||
          (q.description || q.excerpt).toLowerCase().includes(keyword) ||
          (q.authorName || q.author || '').toLowerCase().includes(keyword) ||
          q.id.toLowerCase().includes(keyword)
        );
      }
      return true;
    });
  }, [queries, filterTab, searchVal]);

  // Local FAQ search handler
  const handleFaqSearch = () => {
    const term = faqSearchQuery.toLowerCase().trim();
    if (!term) {
      setFaqSearchResults([]);
      return;
    }

    const matches = faqs.filter(faq => 
      faq.question.toLowerCase().includes(term) || 
      faq.answer.toLowerCase().includes(term)
    ).slice(0, 3);

    setFaqSearchResults(matches);
  };

  // Link FAQ action
  const handleLinkFaq = (faq) => {
    const plainText = faq.answer.replace(/<[^>]*>/g, '').trim();
    setSolutionText(plainText);
    setPromoteToFaq(true);
    setStatusMessage(`📝 Linked answer from FAQ: "${faq.question}"`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Seek Approval Action
  const handleSeekApproval = () => {
    if (!selectedAuthority) return;
    
    const updatedTimeline = [...(activeQuery.timeline || [])];
    // Add new pending item to timeline
    updatedTimeline.push({
      label: `Awaiting Admin Approval`,
      date: `Sent to ${selectedAuthority.split(' - ')[0]}`,
      status: 'active',
      isHighPriority: true
    });

    const updateFields = {
      status: 'In Progress',
      timeline: updatedTimeline
    };

    setQueries(prev => prev.map(q => q.id === selectedQueryId ? { ...q, ...updateFields } : q));

    fetch(`${apiBaseUrl}/api/queries/${selectedQueryId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateFields)
    }).catch(err => console.error("Failed to sync approval request to backend:", err));

    setStatusMessage(`✉️ Approval request sent to ${selectedAuthority.split(' - ')[0]}!`);
    setSelectedAuthority('');
    setTimeout(() => setStatusMessage(''), 3500);
  };

  // Thread Actions
  const handleEscalateQuery = () => {
    const updatedTimeline = [...(activeQuery.timeline || [])];
    if (!updatedTimeline.some(t => t.label === 'Escalated to Admin')) {
      updatedTimeline.push({
        label: 'Escalated to Admin',
        date: 'UPDATED JUST NOW',
        status: 'active',
        isHighPriority: true
      });
    }

    const updateFields = {
      status: 'In Progress',
      timeline: updatedTimeline
    };

    setQueries(prev => prev.map(q => q.id === selectedQueryId ? { ...q, ...updateFields } : q));

    fetch(`${apiBaseUrl}/api/queries/${selectedQueryId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateFields)
    }).catch(err => console.error("Failed to sync escalation to backend:", err));

    setStatusMessage('⚠️ Query escalated to administrator!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleDeleteQuery = () => {
    if (!window.confirm("Are you sure you want to delete this student query?")) return;
    
    setQueries(prev => prev.filter(q => q.id !== selectedQueryId));
    
    fetch(`${apiBaseUrl}/api/queries/${selectedQueryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(err => console.error("Failed to delete query in backend:", err));

    setSelectedQueryId(null);
    setStatusMessage('🗑️ Query deleted.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleArchiveQuery = () => {
    const updateFields = {
      status: 'Resolved',
      isResolved: true
    };

    setQueries(prev => prev.map(q => q.id === selectedQueryId ? { ...q, ...updateFields } : q));

    fetch(`${apiBaseUrl}/api/queries/${selectedQueryId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateFields)
    }).catch(err => console.error("Failed to sync query archive to backend:", err));

    setStatusMessage('📦 Query marked as resolved and archived.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Submit Answer & Resolve
  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!solutionText.trim()) return;

    const resolverName = 'Office of the Registrar (ADMIN)';
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const updatedTimeline = activeQuery.timeline ? activeQuery.timeline.map(t => {
      if (t.label === 'Resolved') {
        return {
          ...t,
          status: 'completed',
          date: formattedDate
        };
      }
      if (t.label === 'Escalated to Admin' || t.label === "Peer's Resolving" || t.label === 'Awaiting Admin Approval') {
        return {
          ...t,
          status: 'completed'
        };
      }
      return t;
    }) : [];

    if (!updatedTimeline.some(t => t.label === 'Resolved')) {
      updatedTimeline.push({
        label: 'Resolved',
        date: formattedDate,
        status: 'completed'
      });
    }

    const updateFields = {
      status: 'Resolved',
      isResolved: true,
      resolverName: resolverName,
      timeline: updatedTimeline,
      officialResponse: {
        author: resolverName,
        role: 'OFFICIAL RESPONSE',
        date: formattedDate,
        text: solutionText,
        helpfulCount: 0,
        isHelpfulClicked: false,
        isMarkedSolution: true
      }
    };

    // Optimistic local state update
    setQueries(prev => prev.map(q => q.id === selectedQueryId ? { ...q, ...updateFields } : q));

    // Sync query update to backend
    try {
      await fetch(`${apiBaseUrl}/api/queries/${selectedQueryId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateFields)
      });
    } catch (err) {
      console.error("Failed to sync query resolution to backend:", err);
    }

    // If promoteToFaq is checked, post a new FAQ to backend database
    if (promoteToFaq) {
      try {
        const response = await fetch(`${apiBaseUrl}/api/faqs`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            question: activeQuery.title,
            answer: solutionText,
            category: activeQuery.category || 'General'
          })
        });
        if (response.ok) {
          const newFaq = await response.json();
          setFaqs(prev => [...prev, newFaq]);
          setStatusMessage('✅ Query resolved & promoted to FAQ Library!');
        }
      } catch (err) {
        console.error("Failed to sync FAQ promotion to backend:", err);
      }
    } else {
      setStatusMessage('✅ Query resolved successfully!');
    }

    setSolutionText('');
    setPromoteToFaq(false);
    setSelectedQueryId(null);

    setTimeout(() => {
      setStatusMessage('');
    }, 4000);
  };

  return (
    <div className="admin-queries-root">
      {/* Top Header */}
      <header className="admin-queries-header glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isSidebarOpen && (
            <button 
              className="btn-menu-hamburger" 
              onClick={(e) => {
                e.stopPropagation();
                onOpenSidebar();
              }}
              aria-label="Open navigation menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          )}
          <div>
            <h2 className="admin-title-text">Queries Management</h2>
            <p className="admin-subtitle-text">Moderate student queries, link reference documentation, and publish resolutions.</p>
          </div>
        </div>
      </header>

      {statusMessage && (
        <div className="resolve-success-banner glass-card animate-slide-down" style={{ zIndex: 100 }}>
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="queries-split-layout">
        
        {/* Left Side: Master Queries List */}
        <div className="queries-list-column">
          <div className="list-filters-card glass-card">
            
            {/* Filter Tabs */}
            <div className="query-filter-tabs">
              <button 
                className={`filter-tab-btn ${filterTab === 'active' ? 'active' : ''}`}
                onClick={() => setFilterTab('active')}
              >
                All Active
                <span className="badge">{counts.active}</span>
              </button>
              <button 
                className={`filter-tab-btn ${filterTab === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterTab('pending')}
              >
                In Review
                <span className="badge yellow">{counts.pending}</span>
              </button>
              <button 
                className={`filter-tab-btn ${filterTab === 'resolved' ? 'active' : ''}`}
                onClick={() => setFilterTab('resolved')}
              >
                Resolved
                <span className="badge green">{counts.resolved}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="query-search-wrap">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by title, student, or ID..." 
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
            </div>
          </div>

          {/* Query Scroll Cards List */}
          <div className="query-scroll-list">
            {filteredQueries.length > 0 ? (
              filteredQueries.map(q => (
                <div 
                  key={q.id} 
                  className={`query-scroll-card glass-card ${selectedQueryId === q.id ? 'active' : ''}`}
                  onClick={() => setSelectedQueryId(q.id)}
                >
                  <div className="card-top">
                    <span className="query-id">#{q.id}</span>
                    <span className={`status-badge ${q.status.toLowerCase().replace(' ', '-')}`}>
                      {q.status}
                    </span>
                  </div>
                  <h4 className="query-title">{q.title}</h4>
                  <p className="query-excerpt">{q.excerpt || q.description.slice(0, 100) + '...'}</p>
                  <div className="card-bottom">
                    <span className="query-author">By {q.authorName || 'Student'}</span>
                    <span className={`cat-tag ${(q.category || 'general').toLowerCase()}`}>{q.category || 'General'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="queries-empty-state glass-card">
                <HelpCircle size={36} className="empty-icon" />
                <h4>No Queries Found</h4>
                <p>Try modifying your search query or switching filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detail Workspace Pane */}
        <div className="query-detail-column">
          {activeQuery ? (
            <div className="query-detail-pane glass-card animate-fade-in">
              
              {/* Detail Header */}
              <div className="detail-header-row">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.50rem' }}>
                    <span className="detail-query-id">#{activeQuery.id}</span>
                    <span className={`status-badge ${activeQuery.status.toLowerCase().replace(' ', '-')}`}>
                      {activeQuery.status}
                    </span>
                  </div>
                  <h3 className="detail-title">{activeQuery.title}</h3>
                  <p className="detail-meta">
                    Submitted by <strong>{activeQuery.authorName || 'Student'}</strong> ({activeQuery.authorEmail})
                  </p>
                </div>
              </div>

              {/* Toolbar Actions */}
              <div className="detail-toolbar-actions">
                <button className="toolbar-btn" onClick={handleEscalateQuery}>
                  <AlertTriangle size={14} className="icon-orange" />
                  Escalate to Admin
                </button>
                <button className="toolbar-btn" onClick={() => setFaqSearchQuery(activeQuery.category || '')}>
                  <Link2 size={14} className="icon-blue" />
                  Link to FAQ
                </button>
                <button className="toolbar-btn" onClick={handleArchiveQuery}>
                  <Archive size={14} className="icon-green" />
                  Archive
                </button>
                <button className="toolbar-btn" onClick={handleDeleteQuery}>
                  <Trash2 size={14} className="icon-red" />
                  Delete Query
                </button>
              </div>

              {/* Conversation Feed */}
              <div className="detail-scroll-pane">
                
                {/* Discussion Thread */}
                <div className="conversation-thread">
                  
                  {/* Student Question Bubble */}
                  <div className="message-bubble student-msg">
                    <div className="msg-avatar student">
                      {activeQuery.authorName ? activeQuery.authorName.charAt(0) : 'S'}
                    </div>
                    <div className="msg-content">
                      <div className="msg-header">
                        <span className="msg-author">{activeQuery.authorName || 'Student'}</span>
                        <span className="msg-time">{activeQuery.date || 'OCT 26, 09:30 AM'}</span>
                      </div>
                      <p className="msg-text">{activeQuery.description || activeQuery.excerpt}</p>
                    </div>
                  </div>

                  {/* Previous Answer Bubble if Resolved */}
                  {(activeQuery.isResolved || activeQuery.status === 'Resolved') && activeQuery.officialResponse && (
                    <div className="message-bubble admin-msg">
                      <div className="msg-avatar admin">
                        A
                      </div>
                      <div className="msg-content">
                        <div className="msg-header">
                          <span className="msg-author">{activeQuery.officialResponse.author}</span>
                          <span className="msg-time">{activeQuery.officialResponse.date}</span>
                        </div>
                        <p className="msg-text">{activeQuery.officialResponse.text}</p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Vertical Timeline */}
                {activeQuery.timeline && (
                  <div className="timeline-tracker-box">
                    <h4 className="timeline-title">Query Timeline Status</h4>
                    <div className="timeline-items">
                      {activeQuery.timeline.map((step, idx) => (
                        <div key={idx} className={`timeline-item ${step.status}`}>
                          <div className="timeline-point">
                            {step.status === 'completed' ? (
                              <CheckCircle size={12} />
                            ) : step.isHighPriority ? (
                              <AlertTriangle size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                          </div>
                          <div className="timeline-text-block">
                            <span className="timeline-label">{step.label}</span>
                            <span className="timeline-date">{step.date || 'Awaiting response'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1. FAQ Link Suggestion Workspace */}
                <div className="faq-search-workspace-card">
                  <h4 className="card-sub-title">Search FAQ to link:</h4>
                  <div className="faq-search-inline-row">
                    <input 
                      type="text" 
                      placeholder="Type keywords (e.g. NOC timeline, stipend rates)..." 
                      value={faqSearchQuery}
                      onChange={e => setFaqSearchQuery(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={handleFaqSearch}>
                      Search
                    </Button>
                  </div>
                  {faqSearchResults.length > 0 && (
                    <div className="faq-inline-results">
                      {faqSearchResults.map(faq => (
                        <div key={faq.id} className="faq-link-item">
                          <div className="faq-link-text">
                            <strong>{faq.question}</strong>
                            <p>{faq.answer.replace(/<[^>]*>/g, '').slice(0, 100)}...</p>
                          </div>
                          <button 
                            type="button" 
                            className="btn-link-faq-apply"
                            onClick={() => handleLinkFaq(faq)}
                          >
                            Link Answer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Seek Approval Workspace */}
                <div className="seek-approval-card">
                  <h4 className="card-sub-title">Seek Approval from higher authorities:</h4>
                  <div className="seek-approval-controls">
                    <select 
                      value={selectedAuthority} 
                      onChange={e => setSelectedAuthority(e.target.value)}
                      className="authority-select-dropdown"
                    >
                      <option value="">Select Authority...</option>
                      <option value="Ranjeet Chaudhari - HOD Office">Ranjeet Chaudhari - HOD Office</option>
                      <option value="Akarshan Dayal - Dean, Research">Akarshan Dayal - Dean, Research</option>
                    </select>
                    <Button 
                      variant="outline-primary" 
                      onClick={handleSeekApproval}
                      disabled={!selectedAuthority}
                    >
                      Send Approval Request
                    </Button>
                  </div>
                </div>

                {/* 3. Resolution Response Form */}
                <form onSubmit={handleResolveSubmit} className="admin-response-submit-form">
                  <div className="form-group">
                    <label className="textarea-label">Custom Text Response</label>
                    <textarea 
                      placeholder="Enter the official resolution response here..." 
                      value={solutionText}
                      onChange={e => setSolutionText(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="form-checkbox-row">
                    <label className="checkbox-wrap">
                      <input 
                        type="checkbox" 
                        checked={promoteToFaq}
                        onChange={e => setPromoteToFaq(e.target.checked)}
                      />
                      <span className="checkbox-text">Promote this query to public FAQ library</span>
                    </label>
                  </div>

                  <div className="form-submit-row">
                    <Button variant="cancel" type="button" onClick={() => setSolutionText('')}>
                      Clear
                    </Button>
                    <Button variant="primary" type="submit">
                      <UserCheck size={14} style={{ marginRight: '0.35rem' }} />
                      Approve & Resolve
                    </Button>
                  </div>
                </form>

              </div>
            </div>
          ) : (
            <div className="query-detail-empty glass-card">
              <MessageSquare size={48} className="empty-icon" />
              <h3>Select a student query</h3>
              <p>Click on any student query card on the left panel to open the resolution thread workspace.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
