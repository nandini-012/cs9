import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  PlusCircle, 
  CheckSquare, 
  Search, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ThumbsUp, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  MessageSquare,
  FileText,
  AlertTriangle
} from 'lucide-react';
import './MyQueriesPage.css';

export default function MyQueriesPage({ 
  intern, 
  setActiveTab,
  isSidebarOpen,
  onOpenSidebar,
  onSearchClick,
  queries,
  setQueries,
  apiBaseUrl,
  token
}) {
  const [activeSubTab, setActiveSubTab] = useState('raise'); // 'raise' or 'track'
  
  const [selectedQueryId, setSelectedQueryId] = useState('4829');

  // Form State
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  // Auto scroll to query track on select
  const selectedQuery = useMemo(() => {
    return queries.find(q => q.id === selectedQueryId) || queries[0];
  }, [queries, selectedQueryId]);

  // Similar Queries filtered dynamically from unified queries prop
  const filteredSimilarQueries = useMemo(() => {
    const titleText = title.toLowerCase().trim();
    const descText = description.toLowerCase().trim();
    const searchPool = queries;

    if (!titleText && !descText) {
      return [];
    }

    const stopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'to', 'for', 'in', 'on', 'at', 'by', 'of', 'and', 'or', 'but', 
      'if', 'when', 'how', 'why', 'what', 'my', 'your', 'i', 'we', 'you', 'he', 'she', 'it', 'they', 'this', 'that', 
      'with', 'from', 'about', 'as', 'no', 'am', 'so', 'do', 'up', 'me', 'us', 'go', 'be', 'has', 'have', 'had'
    ]);

    // Extract keywords from user's title and description inputs
    const titleKeywords = titleText
      .split(/[^a-zA-Z0-9]+/)
      .filter(word => word.length >= 1 && !stopWords.has(word));

    const descKeywords = descText
      .split(/[^a-zA-Z0-9]+/)
      .filter(word => word.length >= 1 && !stopWords.has(word));

    if (titleKeywords.length === 0 && descKeywords.length === 0) {
      return [];
    }

    const scored = searchPool.map(q => {
      let score = 0;
      const qTitleLower = q.title.toLowerCase();
      const qDescLower = (q.description || q.excerpt || '').toLowerCase();

      // 1. Matches from user's title keywords
      titleKeywords.forEach(keyword => {
        if (qTitleLower.includes(keyword)) {
          score += 15; // Strong title-to-title match
        }
        if (qDescLower.includes(keyword)) {
          score += 6;  // Title keyword matches query description
        }
      });

      // 2. Matches from user's description keywords
      descKeywords.forEach(keyword => {
        if (qTitleLower.includes(keyword)) {
          score += 8;  // Description keyword matches query title
        }
        if (qDescLower.includes(keyword)) {
          score += 3;  // Description keyword matches query description
        }
      });

      // 3. Category affinity bonus
      const catLower = category.toLowerCase();
      const qCatLower = (q.category || (q.categories && q.categories[0]) || '').toLowerCase();
      
      if (catLower.includes('academic') && (qTitleLower.includes('grade') || qTitleLower.includes('reg') || qTitleLower.includes('cms'))) {
        score += 5;
      }
      if (catLower.includes('stipend') && qTitleLower.includes('stipend')) {
        score += 5;
      }
      if (catLower.includes('noc') && qTitleLower.includes('noc')) {
        score += 5;
      }
      if (catLower.includes('lab') && qTitleLower.includes('wi-fi')) {
        score += 5;
      }

      if (qCatLower && catLower.includes(qCatLower)) {
        score += 3;
      }

      return { ...q, score };
    });

    const matches = scored
      .filter(q => q.score > 0)
      .sort((a, b) => b.score - a.score);

    if (matches.length > 0) {
      return matches.map(({ score, ...q }) => q).slice(0, 3);
    }

    return [];
  }, [title, description, category, queries]);

  // Handle file drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setAttachment(file);
      } else {
        alert('File size exceeds the 5MB limit.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) {
        setAttachment(file);
      } else {
        alert('File size exceeds the 5MB limit.');
      }
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDiscard = () => {
    setCategory('');
    setTitle('');
    setDescription('');
    setIsAnonymous(false);
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Raised Query
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) {
      alert('Please select a query category.');
      return;
    }
    if (!title.trim() || !description.trim()) return;

    const newId = String(Math.floor(1000 + Math.random() * 9000));
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newQuery = {
      id: newId,
      title: title.trim(),
      category: category.toUpperCase(),
      categories: [category.toUpperCase()],
      tags: isAnonymous ? ['ANONYMOUS'] : ['USER RAISED'],
      date: formattedDate,
      time: 'Just now',
      author: isAnonymous ? 'Anonymous Student' : (intern?.name || 'Student'),
      authorName: isAnonymous ? 'Anonymous Student' : (intern?.name || 'Student'),
      authorEmail: intern?.email || 'student@samagama.in',
      excerpt: description.trim(),
      description: description.trim(),
      upvotes: 1,
      upvoted: true,
      isUpvoted: true,
      status: 'Active',
      isResolved: false,
      attachmentName: attachment ? attachment.name : null,
      timeline: [
        { label: 'Submitted', date: formattedDate, status: 'completed' },
        { label: "Peer's Resolving", date: null, status: 'active' },
        { label: 'Escalated to Admin', date: null, status: 'pending' },
        { label: 'Resolved', date: 'Awaiting Peer response', status: 'pending' }
      ],
      officialResponse: null
    };

    fetch(`${apiBaseUrl}/api/queries`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newQuery)
    })
    .then(async (res) => {
      if (res.ok) {
        const saved = await res.json();
        setQueries(prev => [saved, ...prev]);
        setSelectedQueryId(saved.id);
      } else {
        setQueries(prev => [newQuery, ...prev]);
        setSelectedQueryId(newId);
      }
    })
    .catch((err) => {
      console.error("Failed to sync new query to backend:", err);
      setQueries(prev => [newQuery, ...prev]);
      setSelectedQueryId(newId);
    });

    handleDiscard();
    setActiveSubTab('track');

    // Simulate Admin Auto-Response after 3 seconds
    setTimeout(() => {
      const autoResponseUpdate = {
        status: 'In Progress',
        timeline: [
          { label: 'Submitted', date: formattedDate, status: 'completed' },
          { label: "Peer's Resolving", date: null, status: 'completed' },
          { label: 'Escalated to Admin', date: 'JUST NOW', status: 'active', isHighPriority: true },
          { label: 'Resolved', date: 'Pending admin validation', status: 'pending' }
        ],
        officialResponse: {
          author: 'Vicharanashala Support (BOT)',
          role: 'AUTO RESPONSE',
          date: 'JUST NOW',
          text: `Dear Student, our team has received your query regarding "${category.toUpperCase()}". An administrator has been assigned to look into your ticket. In the meantime, please verify if this information is available in the FAQ Library.`,
          helpfulCount: 0,
          isHelpfulClicked: false,
          isMarkedSolution: false
        }
      };

      fetch(`${apiBaseUrl}/api/queries/${newId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(autoResponseUpdate)
      })
      .then(async (res) => {
        if (res.ok) {
          const updated = await res.json();
          setQueries(prev => prev.map(q => q.id === newId ? updated : q));
        }
      })
      .catch(err => console.error("Failed to sync auto-response to backend:", err));
    }, 3000);
  };

  // Toggle Upvote on active query
  const handleToggleUpvote = (id) => {
    let nextUpvoted = false;
    let nextUpvotesCount = 0;

    setQueries(prev => prev.map(q => {
      if (q.id === id) {
        nextUpvoted = !(q.upvoted || q.isUpvoted);
        nextUpvotesCount = nextUpvoted ? q.upvotes + 1 : q.upvotes - 1;
        return {
          ...q,
          upvotes: nextUpvotesCount,
          upvoted: nextUpvoted,
          isUpvoted: nextUpvoted
        };
      }
      return q;
    }));

    // Sync to backend in real-time
    fetch(`${apiBaseUrl}/api/queries/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        upvotes: nextUpvotesCount,
        upvoted: nextUpvoted,
        isUpvoted: nextUpvoted
      })
    }).catch(err => console.error("Failed to sync upvote to backend:", err));
  };

  // Toggle Official Helpfulness
  const handleToggleHelpful = (id) => {
    let updatedQuery = null;

    setQueries(prev => prev.map(q => {
      if (q.id === id && q.officialResponse) {
        const resp = q.officialResponse;
        const nextClicked = !resp.isHelpfulClicked;
        const nextHelpfulCount = nextClicked ? resp.helpfulCount + 1 : resp.helpfulCount - 1;
        updatedQuery = {
          ...q,
          officialResponse: {
            ...resp,
            helpfulCount: nextHelpfulCount,
            isHelpfulClicked: nextClicked
          }
        };
        return updatedQuery;
      }
      return q;
    }));

    if (updatedQuery) {
      fetch(`${apiBaseUrl}/api/queries/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          officialResponse: updatedQuery.officialResponse
        })
      }).catch(err => console.error("Failed to sync helpfulness toggle to backend:", err));
    }
  };

  // Mark Solution
  const handleMarkSolution = (id) => {
    let updatedQuery = null;

    setQueries(prev => prev.map(q => {
      if (q.id === id && q.officialResponse) {
        const resp = q.officialResponse;
        updatedQuery = {
          ...q,
          officialResponse: {
            ...resp,
            isMarkedSolution: !resp.isMarkedSolution
          }
        };
        return updatedQuery;
      }
      return q;
    }));

    if (updatedQuery) {
      fetch(`${apiBaseUrl}/api/queries/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          officialResponse: updatedQuery.officialResponse
        })
      }).catch(err => console.error("Failed to sync solution marking to backend:", err));
    }
  };

  // Mark query resolved
  const handleMarkResolved = (id) => {
    let updatedQuery = null;

    setQueries(prev => prev.map(q => {
      if (q.id === id) {
        const newStatus = !q.isResolved;
        const updatedTimeline = q.timeline ? q.timeline.map(t => {
          if (t.label === 'Resolved') {
            return {
              ...t,
              status: newStatus ? 'completed' : 'pending',
              date: newStatus ? 'RESOLVED JUST NOW' : 'Awaiting confirmation'
            };
          }
          if (t.label === 'Escalated to Admin' || t.label === "Peer's Resolving") {
            return {
              ...t,
              status: newStatus ? 'completed' : t.status
            };
          }
          return t;
        }) : [];

        updatedQuery = {
          ...q,
          isResolved: newStatus,
          status: newStatus ? 'Resolved' : 'Active',
          timeline: updatedTimeline
        };
        return updatedQuery;
      }
      return q;
    }));

    if (updatedQuery) {
      fetch(`${apiBaseUrl}/api/queries/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          isResolved: updatedQuery.isResolved,
          status: updatedQuery.status,
          timeline: updatedQuery.timeline
        })
      }).catch(err => console.error("Failed to sync resolution status to backend:", err));
    }
  };

  return (
    <div className="queries-page-root">
      
      {/* 1. Header Bar */}
      <header className="dashboard-top-bar glass-card">
        {!isSidebarOpen && (
          <button 
            className="btn-menu-hamburger dashboard-hamburger" 
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
        <div className="search-bar-wrap" onClick={onSearchClick} style={{ cursor: 'pointer' }}>
          <Search size={16} className="search-bar-icon" />
          <input 
            type="text" 
            placeholder="Search FAQs, categories, or status..." 
            readOnly
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="header-actions">
          <button className="btn-action-outline primary" onClick={() => setActiveTab('resolve')}>
            <CheckSquare size={16} />
            <span>Resolve Query</span>
          </button>

          <div className="user-profile-widget">
            <div className="user-avatar-circle">
              {intern?.name?.charAt(0) || 'R'}
            </div>
            <div className="user-profile-details">
              <span className="user-profile-name">{intern?.name || 'Rahul Prasad'}</span>
              <span className="user-profile-id">STUDENT ID #29463</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Page Tab Header */}
      <div className="queries-tabs-nav glass-card">
        <button 
          className={`queries-tab-btn ${activeSubTab === 'raise' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('raise')}
        >
          Raise a Query
        </button>
        <button 
          className={`queries-tab-btn ${activeSubTab === 'track' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('track')}
        >
          Track a Query
        </button>
      </div>

      {/* 3. Main Views */}
      <div className="queries-view-container">
        
        {/* VIEW: Raise a Query */}
        {activeSubTab === 'raise' && (
          <div className="raise-query-layout">
            
            {/* Form Column */}
            <form onSubmit={handleSubmit} className="raise-query-form glass-card">
              <h2 className="section-header-title">Raise a Query</h2>
              <p className="section-header-desc">Provide details about your grievance or request below. Our team will review it shortly.</p>
              
              <div className="raise-form-group">
                <label className="raise-label">Query Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="raise-select"
                  required
                >
                  <option value="" disabled>Select Category...</option>
                  <option value="Academics">Academics</option>
                  <option value="Stipend & Benefits">Stipend & Benefits</option>
                  <option value="NOC Requirements">NOC Requirements</option>
                  <option value="Lab Access">Lab Access</option>
                  <option value="Project Allocation">Project Allocation</option>
                  <option value="Final Report">Final Report</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              <div className="raise-form-group">
                <label className="raise-label">Query Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Briefly state your concern (e.g., Delay in Grade Upload)"
                  className="raise-input"
                  required
                />
              </div>

              <div className="raise-form-group">
                <label className="raise-label">Detailed Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide as much detail as possible to help us resolve this quickly..."
                  className="raise-textarea"
                  rows={6}
                  required
                />
              </div>

              {/* File Attachment Dropzone */}
              <div className="raise-form-group">
                <label className="raise-label">Attachments (Optional)</label>
                <div 
                  className={`attachment-dropzone ${isDragOver ? 'dragover' : ''} ${attachment ? 'has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.png"
                  />
                  {!attachment ? (
                    <div className="dropzone-empty-state">
                      <Upload size={28} className="upload-icon" />
                      <p className="dropzone-text">Click or drag and drop files here</p>
                      <span className="dropzone-subtext">PDF, JPG, PNG (Max 5MB)</span>
                    </div>
                  ) : (
                    <div className="dropzone-filled-state">
                      <FileText size={28} className="file-icon" />
                      <div className="file-info">
                        <span className="file-name">{attachment.name}</span>
                        <span className="file-size">{(attachment.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                      <button 
                        type="button" 
                        className="btn-remove-attachment" 
                        onClick={handleRemoveFile}
                        aria-label="Remove attachment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Anonymously Toggle */}
              <div className="raise-anonymous-card">
                <div className="anonymous-card-content">
                  <span className="anonymous-title-wrap">
                    <AlertTriangle size={16} className="alert-icon" />
                    <strong>Raise Anonymously</strong>
                  </span>
                  <p className="anonymous-desc">Admins won't see your profile details, but resolution may take longer.</p>
                </div>
                <label className="anonymous-switch">
                  <input 
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              {/* Actions Button */}
              <div className="raise-form-actions">
                <button type="button" className="btn-discard" onClick={handleDiscard}>
                  Discard Draft
                </button>
                <button type="submit" className="btn-submit-query">
                  Submit Query
                </button>
              </div>
            </form>

            {/* Right Panel widgets */}
            <div className="raise-widgets-column">
              
              {/* Similar Queries panel */}
              <div className="raise-widget glass-card">
                <h3 className="widget-header-title">
                  <Sparkles size={16} className="widget-header-icon" />
                  <span>Similar Queries</span>
                </h3>
                <p className="widget-header-desc">We found some queries similar to yours. Checking these might give you an instant answer.</p>
                
                <div className="similar-queries-list">
                  {filteredSimilarQueries.length > 0 ? (
                    filteredSimilarQueries.map((item, idx) => (
                      <div key={idx} className="similar-query-card">
                        <h4 className="similar-card-title">{item.title}</h4>
                        <p className="similar-card-excerpt">"{item.excerpt || item.description}"</p>
                      </div>
                    ))
                  ) : !title.trim() && !description.trim() ? (
                    <div className="similar-queries-empty-state">
                      <Sparkles size={24} className="empty-sparkles-icon" style={{ opacity: 0.5, marginBottom: '0.5rem', color: 'var(--text-accent)' }} />
                      <p>Start typing your query title or description to get real-time recommendations.</p>
                    </div>
                  ) : (
                    <div className="similar-queries-empty-state">
                      <CheckCircle2 size={24} style={{ opacity: 0.5, marginBottom: '0.5rem', color: '#10b981' }} />
                      <p>No similar queries found. Your issue seems unique!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pro Tip Card */}
              <div className="pro-tip-widget">
                <div className="pro-tip-glow-decor" />
                <h4 className="pro-tip-title">💡 Pro Tip</h4>
                <p className="pro-tip-desc">Adding screenshots or PDF receipts usually speeds up the resolution process by up to 40%.</p>
              </div>

            </div>

          </div>
        )}

        {/* VIEW: Track a Query */}
        {activeSubTab === 'track' && (
          <div className="track-query-layout">
            
            {/* Left Sidebar List of user queries */}
            <div className="track-sidebar glass-card">
              <h3 className="sidebar-list-title">Your Queries</h3>
              <div className="user-queries-list">
                {queries.map((q) => (
                  <button 
                    key={q.id}
                    className={`sidebar-query-item-btn ${selectedQueryId === q.id ? 'active' : ''}`}
                    onClick={() => setSelectedQueryId(q.id)}
                  >
                    <div className="item-btn-header">
                      <span className="item-btn-id">#{q.id}</span>
                      <span className={`item-btn-badge ${q.isResolved ? 'resolved' : 'pending'}`}>
                        {q.isResolved ? 'Resolved' : 'Active'}
                      </span>
                    </div>
                    <span className="item-btn-title">{q.title}</span>
                    <span className="item-btn-category">{q.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle Tracking details pane */}
            <div className="track-main-details">
              
              <div className="track-details-header glass-card">
                <div className="header-meta-wrap">
                  <span className="meta-breadcrumb">QUERIES / #{selectedQuery.id}</span>
                  <h2 className="meta-title">Track Your Query</h2>
                </div>
                <button 
                  className={`btn-toggle-resolve ${selectedQuery.isResolved ? 'resolved' : ''}`}
                  onClick={() => handleMarkResolved(selectedQuery.id)}
                >
                  <CheckCircle2 size={16} />
                  <span>{selectedQuery.isResolved ? 'Reopen Query' : 'Mark as Resolved'}</span>
                </button>
              </div>

              <div className="track-details-split">
                
                {/* Details card & Replies */}
                <div className="details-card-column">
                  
                  {/* Query detail card */}
                  <div className="query-track-card glass-card">
                    
                    <div className="query-track-header">
                      <div className="category-tags-wrap">
                        <span className="category-tag-badge">{selectedQuery.category}</span>
                        {selectedQuery.tags.map(t => (
                          <span key={t} className="category-tag-badge light">{t}</span>
                        ))}
                      </div>
                      <span className="query-track-id">ID: #{selectedQuery.id}</span>
                    </div>

                    <h3 className="query-track-title">{selectedQuery.title}</h3>
                    
                    <div className="query-track-author-row">
                      <div className="author-avatar-stub">
                        {selectedQuery.author.charAt(0)}
                      </div>
                      <div className="author-details">
                        <span className="author-name">{selectedQuery.author}</span>
                        <span className="author-time">{selectedQuery.date}</span>
                      </div>
                    </div>

                    <p className="query-track-desc">{selectedQuery.description}</p>
                    
                    {selectedQuery.attachmentName && (
                      <div className="query-track-attachment-box">
                        <FileText size={16} className="file-icon" />
                        <span className="attachment-filename">{selectedQuery.attachmentName}</span>
                      </div>
                    )}

                    <div className="query-track-footer">
                      <button 
                        className={`btn-upvote-track ${selectedQuery.isUpvoted ? 'active' : ''}`}
                        onClick={() => handleToggleUpvote(selectedQuery.id)}
                      >
                        <ThumbsUp size={14} />
                        <span>{selectedQuery.upvotes}</span>
                      </button>
                      
                      <button className="btn-report-track">
                        Report
                      </button>
                    </div>

                  </div>

                  {/* Admin official response reply */}
                  {selectedQuery.officialResponse ? (
                    <div className={`admin-response-card glass-card ${selectedQuery.officialResponse.isMarkedSolution ? 'marked-solution' : ''}`}>
                      {selectedQuery.officialResponse.isMarkedSolution && (
                        <div className="solution-indicator-ribbon">
                          <CheckCircle2 size={12} />
                          <span>SOLUTION MARKED BY STUDENT</span>
                        </div>
                      )}
                      
                      <div className="admin-card-header">
                        <div className="admin-profile-wrap">
                          <div className="admin-avatar-stub">A</div>
                          <div className="admin-details">
                            <span className="admin-name">{selectedQuery.officialResponse.author}</span>
                            <span className="admin-badge">{selectedQuery.officialResponse.role}</span>
                          </div>
                        </div>
                        <span className="admin-time">{selectedQuery.officialResponse.date}</span>
                      </div>

                      <p className="admin-text">
                        {selectedQuery.officialResponse.text}
                      </p>

                      <div className="admin-card-footer">
                        <button 
                          className={`btn-helpful-votes ${selectedQuery.officialResponse.isHelpfulClicked ? 'active' : ''}`}
                          onClick={() => handleToggleHelpful(selectedQuery.id)}
                        >
                          <ThumbsUp size={12} />
                          <span>{selectedQuery.officialResponse.helpfulCount} HELPFUL</span>
                        </button>
                        
                        <button 
                          className={`btn-mark-solution ${selectedQuery.officialResponse.isMarkedSolution ? 'active' : ''}`}
                          onClick={() => handleMarkSolution(selectedQuery.id)}
                        >
                          {selectedQuery.officialResponse.isMarkedSolution ? 'UNMARK AS SOLUTION' : 'MARK AS SOLUTION'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="query-track-no-response glass-card">
                      <Clock size={20} className="spinner-icon" />
                      <p>Awaiting response from team members or administrators. Auto-updates will show here shortly.</p>
                    </div>
                  )}

                </div>

                {/* Timeline Column */}
                <div className="timeline-widget-column">
                  <div className="timeline-widget-card glass-card">
                    <h3 className="timeline-widget-title">Query Timeline</h3>
                    
                    <div className="vertical-timeline-track">
                      {selectedQuery.timeline.map((step, index) => {
                        const isCompleted = step.status === 'completed';
                        const isActive = step.status === 'active';
                        const isFailed = step.status === 'failed';
                        
                        return (
                          <div key={index} className={`timeline-track-step ${step.status}`}>
                            <div className="step-marker-container">
                              <div className="step-marker-line-wrap">
                                {index > 0 && <div className={`step-line-before ${selectedQuery.timeline[index-1].status}`} />}
                                {index < selectedQuery.timeline.length - 1 && <div className={`step-line-after ${step.status}`} />}
                              </div>
                              <div className="step-marker-icon-stub">
                                {isCompleted && <CheckCircle2 size={20} className="icon completed" />}
                                {isActive && <Clock size={20} className="icon active" />}
                                {isFailed && <XCircle size={20} className="icon failed" />}
                                {step.status === 'pending' && <div className="icon pending-bullet" />}
                              </div>
                            </div>

                            <div className="step-details-wrap">
                              <div className="step-label-row">
                                <span className="step-label">{step.label}</span>
                                {step.isHighPriority && (
                                  <span className="priority-badge">HIGH PRIORITY</span>
                                )}
                              </div>
                              {step.date && <span className="step-date">{step.date}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
