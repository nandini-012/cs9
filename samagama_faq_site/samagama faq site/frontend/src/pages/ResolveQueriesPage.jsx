import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckSquare, 
  TrendingUp, 
  Award, 
  Search, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  Sparkles,
  ClipboardList,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import Button from '../components/Button';
import './ResolveQueriesPage.css';

export default function ResolveQueriesPage({
  intern,
  queries,
  setQueries,
  faqs = [],
  apiBaseUrl,
  isSidebarOpen,
  onOpenSidebar,
  leaderboardData,
  dbLeaderboard,
  setDbLeaderboard,
  token
}) {
  const [workspaceTab, setWorkspaceTab] = useState('open'); // 'open' or 'myresolutions'
  const [searchVal, setSearchVal] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Resolve Form states
  const [resolvingQueryId, setResolvingQueryId] = useState(null);
  const [solutionText, setSolutionText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Inline FAQ search states
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqSearchResults, setFaqSearchResults] = useState([]);

  // Clear sub-states when switching resolving query
  useEffect(() => {
    setSolutionText('');
    setFaqSearchQuery('');
    setFaqSearchResults([]);
  }, [resolvingQueryId]);

  // 1. Get stats
  const totalQueriesResolved = useMemo(() => {
    return queries.filter(q => q.status === 'Resolved' && q.resolverName === intern.name).length;
  }, [queries, intern]);

  const userRank = useMemo(() => {
    const idx = leaderboardData.findIndex(item => item.isCurrentUser);
    return idx >= 0 ? idx + 1 : '-';
  }, [leaderboardData]);

  const userScore = useMemo(() => {
    const user = leaderboardData.find(item => item.isCurrentUser);
    return user ? user.score : 1250;
  }, [leaderboardData]);

  const pendingPeerQueries = useMemo(() => {
    return queries.filter(q => q.status !== 'Resolved' && q.authorEmail !== intern.email);
  }, [queries, intern]);

  const myResolutions = useMemo(() => {
    return queries.filter(q => q.status === 'Resolved' && q.resolverName === intern.name);
  }, [queries, intern]);

  // 2. Filtered open/pending queries list
  const filteredOpenQueries = useMemo(() => {
    return pendingPeerQueries.filter(q => {
      // Category filter
      if (activeCategory !== 'all' && !q.categories.includes(activeCategory.toUpperCase())) {
        return false;
      }
      // Search filter
      if (searchVal.trim() !== '') {
        const keyword = searchVal.toLowerCase();
        return (
          q.title.toLowerCase().includes(keyword) ||
          q.excerpt.toLowerCase().includes(keyword) ||
          (q.authorName || '').toLowerCase().includes(keyword)
        );
      }
      return true;
    });
  }, [pendingPeerQueries, activeCategory, searchVal]);

  // 3. Filtered my resolutions list
  const filteredMyResolutions = useMemo(() => {
    return myResolutions.filter(q => {
      if (searchVal.trim() !== '') {
        const keyword = searchVal.toLowerCase();
        return (
          q.title.toLowerCase().includes(keyword) ||
          (q.officialResponse?.text || '').toLowerCase().includes(keyword)
        );
      }
      return true;
    });
  }, [myResolutions, searchVal]);

  // 4. Calculate automatic FAQ suggestion for selected query
  const automaticFaqSuggestion = useMemo(() => {
    if (!resolvingQueryId || !faqs || faqs.length === 0) return null;
    const activeQuery = queries.find(q => q.id === resolvingQueryId);
    if (!activeQuery) return null;

    const titleLower = activeQuery.title.toLowerCase();
    
    // Simple score matching
    const scored = faqs.map(faq => {
      let score = 0;
      const qWords = titleLower.split(/[^a-zA-Z0-9]+/);
      const faqQ = faq.question.toLowerCase();
      const faqA = faq.answer.replace(/<[^>]*>/g, '').toLowerCase();

      qWords.forEach(word => {
        if (word.length > 3) {
          if (faqQ.includes(word)) score += 8;
          if (faqA.includes(word)) score += 3;
        }
      });
      return { ...faq, score };
    });

    const matches = scored.filter(f => f.score > 0).sort((a, b) => b.score - a.score);
    return matches.length > 0 ? matches[0] : null;
  }, [resolvingQueryId, queries, faqs]);

  // 5. Manual inline FAQ search handler
  const handleFaqSearch = () => {
    const term = faqSearchQuery.toLowerCase().trim();
    if (!term) {
      setFaqSearchResults([]);
      return;
    }

    const scored = faqs.map(faq => {
      let score = 0;
      const termWords = term.split(/[^a-zA-Z0-9]+/);
      const faqQ = faq.question.toLowerCase();
      const faqA = faq.answer.replace(/<[^>]*>/g, '').toLowerCase();

      termWords.forEach(word => {
        if (word.length >= 2) {
          if (faqQ.includes(word)) score += 8;
          if (faqA.includes(word)) score += 3;
        }
      });
      return { ...faq, score };
    });

    const results = scored
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // top 3 matches
      
    setFaqSearchResults(results);
  };

  // 6. Handle Resolve Submission
  const handleResolveSubmit = (e, queryId) => {
    e.preventDefault();
    if (!solutionText.trim()) return;

    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Find the current query first to construct timeline update
    const activeQuery = queries.find(q => q.id === queryId);
    if (!activeQuery) return;

    const updatedTimeline = activeQuery.timeline ? activeQuery.timeline.map(t => {
      if (t.label === 'Resolved') {
        return {
          ...t,
          status: 'completed',
          date: 'RESOLVED JUST NOW'
        };
      }
      if (t.label === 'Escalated to Admin' || t.label === "Peer's Resolving") {
        return {
          ...t,
          status: 'completed'
        };
      }
      return t;
    }) : [];

    const updateFields = {
      status: 'Resolved',
      isResolved: true,
      resolverName: intern.name,
      timeline: updatedTimeline,
      officialResponse: {
        author: `${intern.name} (Peer Resolver)`,
        role: 'PEER RESOLUTION',
        date: formattedDate,
        text: solutionText,
        helpfulCount: 0,
        isHelpfulClicked: false,
        isMarkedSolution: true
      }
    };

    // Optimistic local state update
    setQueries(prev => prev.map(q => q.id === queryId ? { ...q, ...updateFields } : q));

    // Sync to backend via PUT
    fetch(`${apiBaseUrl}/api/queries/${queryId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateFields)
    }).catch(err => console.error("Failed to sync resolution to backend:", err));

    // Update leaderboard score in state and database
    setDbLeaderboard(prev => {
      const userLeaderboardName = intern?.name || 'Rahul Prasad';
      const list = [...prev];
      // If list is empty, initialize base items
      const baseList = list.length > 0 ? list : [
        { name: userLeaderboardName, score: 1250, avatarInitials: 'RP', colorClass: 'user' },
        { name: 'Samad', score: 1250, avatarInitials: 'SA', colorClass: 'samad' },
        { name: 'ROY', score: 1180, avatarInitials: 'RY', colorClass: 'roy' },
        { name: 'Udharsh', score: 1150, avatarInitials: 'UD', colorClass: 'udharsh' },
        { name: 'Shreya', score: 1120, avatarInitials: 'SH', colorClass: 'shreya' },
        { name: 'Ananya', score: 1090, avatarInitials: 'AN', colorClass: 'ananya' },
        { name: 'Kartik', score: 1050, avatarInitials: 'KA', colorClass: 'kartik' },
        { name: 'Sneha', score: 980, avatarInitials: 'SN', colorClass: 'sneha' }
      ];
      const idx = baseList.findIndex(item => item.name.toLowerCase() === userLeaderboardName.toLowerCase());
      if (idx >= 0) {
        const newScore = baseList[idx].score + 100;
        baseList[idx] = { ...baseList[idx], score: newScore };
        // Sync to backend via POST
        fetch(`${apiBaseUrl}/api/intern/leaderboard`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: baseList[idx].name, score: newScore })
        }).catch(err => console.error("Failed to sync score to backend:", err));
      }
      return baseList;
    });

    setSuccessMessage('🎉 Solution submitted! You earned +100 points!');
    setResolvingQueryId(null);
    setSolutionText('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  return (
    <div className="resolve-page-root">
      {/* Top Header */}
      <header className="resolve-page-header glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!isSidebarOpen && (
            <button 
              className="btn-menu-hamburger resolve-hamburger" 
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
            <h2 className="resolve-title-text">Resolution Workspace</h2>
            <p className="resolve-subtitle-text">Support your peers by answering queries and climb the cohort rankings.</p>
          </div>
        </div>
      </header>

      {successMessage && (
        <div className="resolve-success-banner glass-card animate-slide-down">
          <span>{successMessage}</span>
        </div>
      )}

      {/* Stats Section */}
      <section className="resolve-stats-grid">
        <div className="resolve-stat-card glass-card">
          <div className="stat-card-icon points">
            <Award size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-label">Resolution Points</span>
            <span className="stat-value">{userScore} pts</span>
          </div>
        </div>

        <div className="resolve-stat-card glass-card">
          <div className="stat-card-icon rank">
            <TrendingUp size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-label">Cohort Rank</span>
            <span className="stat-value">#{userRank}</span>
          </div>
        </div>

        <div className="resolve-stat-card glass-card">
          <div className="stat-card-icon resolves">
            <CheckSquare size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-label">My Resolutions</span>
            <span className="stat-value">{totalQueriesResolved} resolved</span>
          </div>
        </div>

        <div className="resolve-stat-card glass-card">
          <div className="stat-card-icon pending">
            <HelpCircle size={20} />
          </div>
          <div className="stat-card-info">
            <span className="stat-label">Open Peer Queries</span>
            <span className="stat-value">{pendingPeerQueries.length} waiting</span>
          </div>
        </div>
      </section>

      {/* Workspace Tabs Navigation */}
      <div className="workspace-tabs-row">
        <button 
          className={`workspace-tab-btn ${workspaceTab === 'open' ? 'active' : ''}`}
          onClick={() => { setWorkspaceTab('open'); setResolvingQueryId(null); }}
        >
          <HelpCircle size={16} />
          <span>Open Peer Queries</span>
          <span className="tab-count-badge">{pendingPeerQueries.length}</span>
        </button>
        <button 
          className={`workspace-tab-btn ${workspaceTab === 'myresolutions' ? 'active' : ''}`}
          onClick={() => { setWorkspaceTab('myresolutions'); setResolvingQueryId(null); }}
        >
          <ClipboardList size={16} />
          <span>My Resolutions Tracker</span>
          <span className="tab-count-badge green">{totalQueriesResolved}</span>
        </button>
      </div>

      {/* Split Workspace */}
      <div className="resolve-workspace-split">
        
        {/* Left Column - Query resolver lists */}
        <div className="resolve-feed-column">
          
          {/* Feed Header (Search + Category Pills) - Only render for Open Queries */}
          {workspaceTab === 'open' && (
            <div className="resolve-feed-header glass-card">
              <div className="resolve-search-bar-wrap">
                <Search size={16} className="search-bar-icon" />
                <input 
                  type="text" 
                  placeholder="Search peer queries..." 
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                />
              </div>

              <div className="resolve-category-pills">
                <button 
                  className={`pill-btn ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Categories
                </button>
                <button 
                  className={`pill-btn ${activeCategory === 'noc' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('noc')}
                >
                  NOC
                </button>
                <button 
                  className={`pill-btn ${activeCategory === 'selection' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('selection')}
                >
                  Selection
                </button>
                <button 
                  className={`pill-btn ${activeCategory === 'about' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('about')}
                >
                  General Info
                </button>
              </div>
            </div>
          )}

          {/* Search bar only for Tracker */}
          {workspaceTab === 'myresolutions' && searchVal && (
            <div className="resolve-feed-header glass-card" style={{ padding: '0.85rem 1.25rem' }}>
              <div className="resolve-search-bar-wrap">
                <Search size={16} className="search-bar-icon" />
                <input 
                  type="text" 
                  placeholder="Search my answers..." 
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Core Resolving lists */}
          <div className="resolve-queries-list">
            
            {/* Open Queries Tab */}
            {workspaceTab === 'open' && (
              filteredOpenQueries.length > 0 ? (
                filteredOpenQueries.map(q => (
                  <div key={q.id} className="resolve-query-card glass-card animate-fade-in">
                    <div className="card-top-row">
                      <div className="query-categories">
                        {q.categories.map(cat => (
                          <span key={cat} className={`tag-badge ${cat.toLowerCase()}`}>{cat}</span>
                        ))}
                      </div>
                      <span className="query-timestamp">{q.time} • by {q.authorName}</span>
                    </div>

                    <h3 className="query-title">{q.title}</h3>
                    <p className="query-description">{q.description || q.excerpt}</p>

                    {resolvingQueryId === q.id ? (
                      <div className="resolution-form-panel animate-slide-up">
                        
                        {/* 💡 Automatic FAQ Recommendation Area */}
                        {automaticFaqSuggestion && (
                          <div className="faq-recommendation-box glass-card">
                            <div className="faq-recommendation-header">
                              <Sparkles size={14} className="sparkle-icon" />
                              <span>Recommended Solution from FAQ Library:</span>
                            </div>
                            <h4 className="faq-question-title">{automaticFaqSuggestion.question}</h4>
                            <div 
                              className="faq-answer-excerpt"
                              dangerouslySetInnerHTML={{ 
                                __html: automaticFaqSuggestion.answer.slice(0, 160) + (automaticFaqSuggestion.answer.length > 160 ? '...' : '') 
                              }}
                            />
                            <button 
                              type="button" 
                              className="btn-use-suggestion"
                              onClick={() => {
                                const plainText = automaticFaqSuggestion.answer.replace(/<[^>]*>/g, '').trim();
                                setSolutionText(plainText);
                              }}
                            >
                              Use this FAQ answer
                            </button>
                          </div>
                        )}

                        {/* 🔍 Manual Search suggestion tool */}
                        <div className="manual-faq-search-box glass-card">
                          <span className="search-label">Don't know the answer? Search FAQ Library:</span>
                          <div className="search-input-row">
                            <input 
                              type="text" 
                              placeholder="Type keywords (e.g. NOC dates, stipend)..." 
                              value={faqSearchQuery}
                              onChange={e => setFaqSearchQuery(e.target.value)}
                            />
                            <Button 
                              variant="outline-secondary" 
                              type="button" 
                              style={{ height: '34px', padding: '0 0.85rem', fontSize: '0.72rem', borderRadius: '8px' }}
                              onClick={handleFaqSearch}
                            >
                              Search
                            </Button>
                          </div>
                          {faqSearchResults.length > 0 && (
                            <div className="search-results-mini-list">
                              {faqSearchResults.map(faq => (
                                <div key={faq.id} className="search-result-item">
                                  <div className="result-text-block">
                                    <strong>{faq.question}</strong>
                                    <p>{faq.answer.replace(/<[^>]*>/g, '').slice(0, 80)}...</p>
                                  </div>
                                  <button 
                                    type="button" 
                                    className="btn-apply-faq"
                                    onClick={() => {
                                      const plainText = faq.answer.replace(/<[^>]*>/g, '').trim();
                                      setSolutionText(plainText);
                                    }}
                                  >
                                    Apply
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Submission Form */}
                        <form onSubmit={(e) => handleResolveSubmit(e, q.id)} className="resolve-form glass-card">
                          <div className="form-group-custom">
                            <label>Your Resolution Answer</label>
                            <textarea 
                              placeholder="Provide a clear, detailed solution to help your peer..." 
                              value={solutionText}
                              onChange={e => setSolutionText(e.target.value)}
                              rows={4}
                              required
                            />
                          </div>
                          <div className="form-actions">
                            <Button variant="cancel" type="button" onClick={() => setResolvingQueryId(null)}>
                              Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                              <Send size={14} style={{ marginRight: '0.35rem' }} />
                              Submit Solution
                            </Button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="card-footer-actions">
                        <Button variant="outline-primary" onClick={() => setResolvingQueryId(q.id)}>
                          <MessageSquare size={14} style={{ marginRight: '0.35rem' }} />
                          Resolve Query
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="resolve-empty-state glass-card">
                  <Sparkles size={36} className="sparkle-icon" />
                  <h3>All Clear!</h3>
                  <p>No pending peer queries match your filters. Check back later or explore other categories.</p>
                </div>
              )
            )}

            {/* My Resolutions Tracker Tab */}
            {workspaceTab === 'myresolutions' && (
              filteredMyResolutions.length > 0 ? (
                filteredMyResolutions.map(q => (
                  <div key={q.id} className="resolve-query-card glass-card tracker-card animate-fade-in">
                    <div className="card-top-row">
                      <div className="query-categories">
                        {q.categories.map(cat => (
                          <span key={cat} className={`tag-badge ${cat.toLowerCase()}`}>{cat}</span>
                        ))}
                      </div>
                      <span className="success-badge">
                        ✓ Resolved (+100 pts)
                      </span>
                    </div>

                    <h3 className="query-title">{q.title}</h3>
                    <p className="query-description"><strong>Query:</strong> {q.description || q.excerpt}</p>

                    <div className="resolution-tracker-answer-box glass-card">
                      <span className="answer-label">My Resolution Answer:</span>
                      <p className="answer-text">{q.officialResponse?.text}</p>
                      <span className="answer-date">Resolved on {q.officialResponse?.date || 'Just now'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="resolve-empty-state glass-card">
                  <BookOpen size={36} className="sparkle-icon" style={{ opacity: 0.5 }} />
                  <h3>No resolutions tracked yet</h3>
                  <p>Resolutions you submit in the Open Queries tab will appear here so you can easily track your contributions.</p>
                </div>
              )
            )}

          </div>
        </div>

        {/* Right Column - Mini Leaderboard */}
        <aside className="resolve-leaderboard-sidebar">
          <div className="sidebar-widget glass-card resolver-widget-compact">
            <h3 className="widget-title">
              <span>PEER RESOLVER RANKINGS</span>
              <span className="widget-title-icon-star">⭐</span>
            </h3>
            
            <div className="resolve-mini-leaderboard-list">
              {leaderboardData.map((peer, index) => (
                <div key={peer.name} className={`mini-leaderboard-row ${peer.isCurrentUser ? 'highlight-user' : ''}`}>
                  <span className={`rank-num ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>{index + 1}</span>
                  <div className={`row-avatar ${peer.colorClass}`}>{peer.avatarInitials}</div>
                  <span className="peer-name">{peer.name}</span>
                  <span className="peer-score">{peer.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
