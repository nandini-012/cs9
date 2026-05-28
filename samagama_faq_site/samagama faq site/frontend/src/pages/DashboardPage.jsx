import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  CheckSquare, 
  Search, 
  MessageSquare, 
  ChevronUp, 
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Link,
  ChevronDown,
  LogOut,
  Settings,
  Info,
  Wallet,
  ShieldCheck,
  DoorOpen,
  Users,
  ClipboardList,
  FileText,
  GraduationCap,
  X,
  BookOpen,
  LockKeyhole
} from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Accordion from '../components/Accordion';
import './DashboardPage.css';

export default function DashboardPage({ 
  intern, 
  faqs = [],
  apiBaseUrl, 
  defaultFeedFilter, 
  onLogout, 
  setActiveTab,
  isSidebarOpen,
  onOpenSidebar,
  activeTab,
  showSearchOverlay,
  setShowSearchOverlay,
  queries,
  setQueries,
  setMyQueriesSubTab,
  dbLeaderboard,
  setDbLeaderboard,
  leaderboardData,
  token
}) {
  // Filters & Modal State
  const [feedTab, setFeedTab] = useState(defaultFeedFilter || 'all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchVal, setSearchVal] = useState('');
  
  // Raise Query Modal State
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('about');
  const [newDescription, setNewDescription] = useState('');
  
  // Resolve Query Modal State
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showAllCategoriesModal, setShowAllCategoriesModal] = useState(false);
  const [selectedModalCategory, setSelectedModalCategory] = useState('SELECTION');

  // Leaderboard States
  const [userResolvedIds, setUserResolvedIds] = useState([]);
  const [showFullLeaderboardModal, setShowFullLeaderboardModal] = useState(false);

  // Profile Dropdown State
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Search Overlay States (showSearchOverlay and setShowSearchOverlay are now passed as props)
  const [overlaySearchQuery, setOverlaySearchQuery] = useState('');
  const [overlayCategoryFilter, setOverlayCategoryFilter] = useState(null); // Initially no category selected
  const [overlayOpenAccordions, setOverlayOpenAccordions] = useState({});
  const [showOverlaySuggest, setShowOverlaySuggest] = useState(false);

  const closeSearchOverlay = () => {
    setShowSearchOverlay(false);
    setOverlaySearchQuery('');
    setOverlayCategoryFilter(null);
    setOverlayOpenAccordions({});
    setShowOverlaySuggest(false);
  };

  const closeResolveModal = () => {
    setShowResolveModal(false);
    if (activeTab === 'resolve') {
      setActiveTab('dashboard');
    }
  };

  // Sync activeTab to open/close resolve modal
  React.useEffect(() => {
    if (activeTab === 'resolve') {
      setShowResolveModal(true);
    }
  }, [activeTab]);

  // Close search overlay on Escape key
  React.useEffect(() => {
    if (!showSearchOverlay) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSearchOverlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSearchOverlay]);

  // Categories list matching visual design and icons, mapped to database section indices
  const categoriesList = useMemo(() => [
    { index: 1, dbIndices: ['1', '7'], label: 'Internship Info', icon: Info, colorClass: 'info' },
    { index: 2, dbIndices: ['8'], label: 'Stipend & Benefits', icon: Wallet, colorClass: 'stipend' },
    { index: 3, dbIndices: ['3'], label: 'NOC Requirements', icon: ShieldCheck, colorClass: 'noc' },
    { index: 4, dbIndices: ['10', '11', '12'], label: 'Lab Access', icon: DoorOpen, colorClass: 'lab' },
    { index: 5, dbIndices: ['6'], label: 'Work Culture', icon: Users, colorClass: 'work' },
    { index: 6, dbIndices: ['5'], label: 'Project Allocation', icon: ClipboardList, colorClass: 'project' },
    { index: 7, dbIndices: ['9'], label: 'Final Report', icon: FileText, colorClass: 'report' },
    { index: 8, dbIndices: ['2', '13'], label: 'Academic Credits', icon: GraduationCap, colorClass: 'academic' },
  ], []);

  // Dynamic counts derived from faqs database
  const getCategoryCount = (cat) => {
    const count = faqs.filter(faq => cat.dbIndices.includes(String(faq.categoryIndex))).length;
    if (count > 0) return count;
    // Fallback numbers from mockup if database doesn't have records
    const fallbacks = { 1: 45, 2: 32, 3: 28, 4: 67, 5: 19, 6: 38, 7: 24, 8: 15 };
    return fallbacks[cat.index] || 0;
  };

  // Filtered FAQs inside search overlay
  const filteredOverlayFaqs = useMemo(() => {
    if (!faqs) return [];
    
    // Find active category item
    const activeCat = categoriesList.find(c => c.index === overlayCategoryFilter);
    
    return faqs.filter(faq => {
      // 1. Search matching - if search query is present, match globally across all FAQs
      if (overlaySearchQuery.trim() !== '') {
        const q = overlaySearchQuery.toLowerCase().trim();
        // If a category filter is also selected, search within that category, else search globally
        if (activeCat && !activeCat.dbIndices.includes(String(faq.categoryIndex))) {
          return false;
        }
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q)
        );
      }
      
      // 2. Category match - if no search query is present, check if a category is selected
      if (activeCat) {
        return activeCat.dbIndices.includes(String(faq.categoryIndex));
      }
      
      // 3. If neither search query nor category filter is active, show nothing
      return false;
    });
  }, [faqs, overlayCategoryFilter, overlaySearchQuery, categoriesList]);

  // Suggestions for autocomplete as typing
  const overlaySuggestions = useMemo(() => {
    const q = overlaySearchQuery.toLowerCase().trim();
    if (q === '') return [];
    return faqs
      .filter(faq => faq.question.toLowerCase().includes(q))
      .slice(0, 5); // Show top 5 suggestions
  }, [faqs, overlaySearchQuery]);

  const toggleOverlayAccordion = (id) => {
    setOverlayOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const nextState = {};
    filteredOverlayFaqs.forEach(faq => {
      nextState[faq.id] = true;
    });
    setOverlayOpenAccordions(nextState);
  };

  const handleCollapseAll = () => {
    setOverlayOpenAccordions({});
  };



  // Sync feed tab with sidebar selections
  React.useEffect(() => {
    if (defaultFeedFilter) {
      setFeedTab(defaultFeedFilter);
    }
  }, [defaultFeedFilter]);

  // Dynamic FAQ categories calculation from queries state
  const topFaqCategories = useMemo(() => {
    const baselines = {
      'SELECTION': { label: 'Selection & Onboarding', baseUpvotes: 364, baseQueries: 11, iconName: 'selection' },
      'NOC': { label: 'NOC Requirements', baseUpvotes: 221, baseQueries: 7, iconName: 'noc' },
      'ABOUT': { label: 'Internship Info', baseUpvotes: 71, baseQueries: 4, iconName: 'about' }
    };

    const categoriesMap = {};

    // Initialize map with baselines
    Object.keys(baselines).forEach(key => {
      categoriesMap[key] = {
        label: baselines[key].label,
        upvotes: baselines[key].baseUpvotes,
        queryCount: baselines[key].baseQueries,
        iconName: baselines[key].iconName
      };
    });

    // Aggregate queries dynamically
    queries.forEach(q => {
      q.categories.forEach(cat => {
        const catKey = cat.toUpperCase();
        const targetKey = catKey === 'GENERAL' ? 'ABOUT' : catKey;

        if (categoriesMap[targetKey]) {
          categoriesMap[targetKey].queryCount += 1;
          categoriesMap[targetKey].upvotes += q.upvotes;
        } else {
          categoriesMap[targetKey] = {
            label: targetKey.charAt(0) + targetKey.slice(1).toLowerCase(),
            upvotes: q.upvotes,
            queryCount: 1,
            iconName: 'about'
          };
        }
      });
    });

    // Sort categories by upvotes descending
    return Object.entries(categoriesMap)
      .map(([key, data]) => ({
        key,
        label: data.label,
        upvotes: data.upvotes,
        queryCount: data.queryCount,
        iconName: data.iconName
      }))
      .sort((a, b) => b.upvotes - a.upvotes);
  }, [queries]);

  // Handle Query Submission
  const handleRaiseQuerySubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newQueryItem = {
      id: `q-user-${Date.now()}`,
      upvotes: 1,
      categories: [newCategory.toUpperCase()],
      category: newCategory.toUpperCase(),
      time: 'Just now',
      date: formattedDate,
      title: newTitle,
      excerpt: newDescription,
      description: newDescription,
      comments: 0,
      status: 'Active',
      isResolved: false,
      upvoted: true,
      isUpvoted: true,
      authorEmail: intern.email,
      authorName: intern.name,
      author: intern.name,
      tags: ['USER RAISED'],
      timeline: [
        { label: 'Submitted', date: formattedDate, status: 'completed' },
        { label: "Peer's Resolving", date: null, status: 'active' },
        { label: 'Escalated to Admin', date: null, status: 'pending' },
        { label: 'Resolved', date: 'Awaiting Peer response', status: 'pending' }
      ],
      officialResponse: null
    };

    setQueries(prev => [newQueryItem, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setShowRaiseModal(false);
    setFeedTab('myqueries'); // Go to user's queries to see it!
  };

  // Toggle Upvote
  const handleToggleUpvote = (id) => {
    setQueries(prev => prev.map(q => {
      if (q.id === id) {
        const nextUpvoted = !(q.upvoted || q.isUpvoted);
        return {
          ...q,
          upvotes: nextUpvoted ? q.upvotes + 1 : q.upvotes - 1,
          upvoted: nextUpvoted,
          isUpvoted: nextUpvoted
        };
      }
      return q;
    }));
  };

  // Handle Resolve action
  const handleResolveQuery = (id) => {
    setQueries(prev => prev.map(q => {
      if (q.id === id) {
        const updatedTimeline = q.timeline ? q.timeline.map(t => {
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
        return {
          ...q,
          status: 'Resolved',
          isResolved: true,
          timeline: updatedTimeline
        };
      }
      return q;
    }));

    setUserResolvedIds(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });

    // Update score in local state and sync to backend
    const userLeaderboardName = intern?.name || 'Rahul Prasad';
    setDbLeaderboard(prev => {
      const list = [...prev];
      // If list is empty, initialize base items first
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
  };

  // Filtered Queries List
  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      // 1. Feed tab filter
      if (feedTab === 'myqueries' && q.authorEmail !== intern.email) return false;
      if (feedTab === 'resolved' && q.status.toLowerCase() !== 'resolved') return false;
      if (feedTab === 'trending' && q.upvotes < 80) return false;

      // 2. Category filter dropdown
      if (categoryFilter !== 'all' && !q.categories.includes(categoryFilter.toUpperCase())) return false;

      // 3. Status filter dropdown
      if (statusFilter !== 'all' && q.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

      // 4. Search bar query matching
      if (searchVal.trim() !== '') {
        const keyword = searchVal.toLowerCase();
        return (
          q.title.toLowerCase().includes(keyword) ||
          q.excerpt.toLowerCase().includes(keyword) ||
          q.categories.some(c => c.toLowerCase().includes(keyword))
        );
      }

      return true;
    });
  }, [queries, feedTab, categoryFilter, statusFilter, searchVal, intern.email]);

  return (
    <div className="dashboard-root">
      
      {/* 1. Dashboard Top Header Bar */}
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
        <div className="search-bar-wrap" onClick={() => setShowSearchOverlay(true)} style={{ cursor: 'pointer' }}>
          <Search size={16} className="search-bar-icon" />
          <input 
            type="text" 
            placeholder="Search FAQs, categories, or status..." 
            readOnly
            value={searchVal}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="header-actions">
          <Button variant="outline-primary" onClick={() => {
            setActiveTab('myqueries');
            if (setMyQueriesSubTab) {
              setMyQueriesSubTab('raise');
            }
          }}>
            <PlusCircle size={16} />
            <span>RAISE NEW QUERY</span>
          </Button>
          
          <Button variant="outline-secondary" onClick={() => setActiveTab('resolve')}>
            <CheckSquare size={16} />
            <span>RESOLVE QUERY</span>
          </Button>

          <div className="user-profile-widget" onClick={() => setShowProfileMenu(prev => !prev)}>
            <div className="user-avatar-circle">
              {intern.name.charAt(0)}
            </div>
            <div className="user-profile-details">
              <span className="user-profile-name">{intern.name}</span>
              <span className="user-profile-id">STUDENT ID #29463</span>
            </div>
            <ChevronDown size={14} className={`profile-chevron ${showProfileMenu ? 'open' : ''}`} />
            
            {showProfileMenu && (
              <div className="profile-dropdown-menu glass-card" onClick={e => e.stopPropagation()}>
                <button className="dropdown-item" onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}>
                  <Settings size={14} />
                  <span>Settings</span>
                </button>
                <button className="dropdown-item logout" onClick={() => { onLogout(); setShowProfileMenu(false); }}>
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Compact Journey Progress Badges */}
      <section className="compact-badges-section">
        <h2 className="journey-section-title">My Journey - Progress Badges</h2>
        <div className="compact-badges-row">
          <Badge 
            level="bronze" 
            status={intern.status.bronzeStatus} 
            title="Coursework & Onboarding" 
            subtitle="Complete orientation proctored paths & lessons on ViBe."
            compact={true}
          />
          <Badge 
            level="silver" 
            status={intern.status.silverStatus} 
            title="Main Open-source Contributions" 
            subtitle="Build active project deliverables under your assigned mentor."
            compact={true}
          />
          <Badge 
            level="gold" 
            status={intern.status.goldStatus} 
            title="Stellar Feature Badge" 
            subtitle="Earned by authoring a significant stand-alone feature."
            compact={true}
          />
          <Badge 
            level="platinum" 
            status={intern.status.platinumStatus} 
            title="IIT Ropar Visit Invite" 
            subtitle="Includes travel support to visit the lab in person."
            compact={true}
          />
        </div>
      </section>

      {/* 3. Main Split Content Layout */}
      <div className="dashboard-content-split">
        
        {/* Left Column - Query Feed */}
        <div className="query-feed-column">
          
          {/* Feed Filter Menu & Dropdowns */}
          <div className="feed-header-row">
            <div className="feed-tabs">
              <button 
                className={`feed-tab-btn ${feedTab === 'all' ? 'active' : ''}`}
                onClick={() => setFeedTab('all')}
              >
                All Queries
              </button>
              <button 
                className={`feed-tab-btn ${feedTab === 'trending' ? 'active' : ''}`}
                onClick={() => setFeedTab('trending')}
              >
                Trending
              </button>
              <button 
                className={`feed-tab-btn ${feedTab === 'myqueries' ? 'active' : ''}`}
                onClick={() => setFeedTab('myqueries')}
              >
                My Queries
              </button>
              <button 
                className={`feed-tab-btn ${feedTab === 'resolved' ? 'active' : ''}`}
                onClick={() => setFeedTab('resolved')}
              >
                Resolved
              </button>
            </div>

            <div className="feed-dropdowns">
              <div className="select-wrap">
                <label>Category:</label>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="about">About</option>
                  <option value="noc">NOC</option>
                  <option value="selection">Selection</option>
                </select>
              </div>

              <div className="select-wrap">
                <label>Status:</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Queries list */}
          <div className="queries-feed-list">
            {filteredQueries.length > 0 ? (
              filteredQueries.map((query) => (
                <div key={query.id} className="query-card glass-card">
                  
                  {/* Upvote side widget */}
                  <button 
                    className={`query-upvote-panel ${query.upvoted ? 'upvoted' : ''}`}
                    onClick={() => handleToggleUpvote(query.id)}
                  >
                    <ChevronUp size={20} className="upvote-icon" />
                    <span className="upvote-count">{query.upvotes}</span>
                  </button>

                  {/* Query text details */}
                  <div className="query-card-content">
                    <div className="query-card-meta">
                      <div className="query-tags">
                        {query.categories.map(cat => (
                          <span key={cat} className={`tag-badge ${cat.toLowerCase()}`}>
                            {cat}
                          </span>
                        ))}
                      </div>
                      <span className="query-meta-time">
                        {query.time} {query.authorName ? `• ${query.authorName}` : ''}
                      </span>
                    </div>

                    <h3 className="query-card-title">{query.title}</h3>
                    <p className="query-card-excerpt">{query.excerpt}</p>

                    <div className="query-card-footer">
                      <span className="query-comments-count">
                        💬 {query.comments} comments
                      </span>
                      
                      <div className={`query-status-indicator ${query.status.toLowerCase().replace(' ', '-')}`}>
                        <span className="status-dot" />
                        <span className="status-text">{query.status}</span>
                      </div>

                      {/* Mock avatar overlap */}
                      <div className="avatar-overlap-group">
                        <div className="mini-avatar red">A</div>
                        <div className="mini-avatar blue">S</div>
                        <div className="mini-avatar orange">R</div>
                        <div className="mini-avatar-more">+5</div>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="no-queries-notice glass-card">
                <p>No queries match your current filter selection.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Widgets */}
        <aside className="widgets-column">
          
          {/* Top FAQ Categories Widget */}
          <div className="sidebar-widget glass-card">
            <h3 className="widget-title">
              <TrendingUp size={16} className="widget-title-icon trend" />
              <span>Top FAQ Categories</span>
            </h3>
            <div className="widget-categories-list">
              {topFaqCategories.slice(0, 3).map((cat, index) => (
                <div key={cat.key} className="category-row-item">
                  <span className="category-num">{`0${index + 1}`}</span>
                  <div className="category-row-details">
                    <h4>{cat.label}</h4>
                    <p>{cat.upvotes} UPVOTES • {cat.queryCount} QUERIES</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="widget-link" onClick={() => {
              setSelectedModalCategory(topFaqCategories[0]?.key || 'SELECTION');
              setShowAllCategoriesModal(true);
            }}>
              <span>View All Categories</span>
              <ExternalLink size={12} />
            </Button>
          </div>

          {/* Peer Resolver Leaderboard Widget */}
          <div className="sidebar-widget glass-card resolver-leaderboard-widget">
            <h3 className="widget-title">
              <span>PEER RESOLVER LEADERBOARD</span>
              <span className="widget-title-icon-star">⭐</span>
            </h3>
            
            <div className="podium-container">
              {/* 2nd Place */}
              {leaderboardData[1] && (
                <div className="podium-col second-place">
                  <div className="podium-avatar-wrap">
                    <div className={`podium-avatar ${leaderboardData[1].colorClass}`}>
                      {leaderboardData[1].avatarInitials}
                    </div>
                    <span className="podium-rank-badge">2</span>
                  </div>
                  <span className="podium-name">{leaderboardData[1].name}</span>
                  <span className="podium-score">{leaderboardData[1].score}</span>
                  <div className="podium-bar second-bar"></div>
                </div>
              )}

              {/* 1st Place */}
              {leaderboardData[0] && (
                <div className="podium-col first-place">
                  <div className="podium-avatar-wrap">
                    <div className={`podium-avatar first-avatar ${leaderboardData[0].colorClass}`}>
                      {leaderboardData[0].avatarInitials}
                    </div>
                    <span className="podium-rank-badge gold">1</span>
                  </div>
                  <span className="podium-name">{leaderboardData[0].name}</span>
                  <span className="podium-score bold">{leaderboardData[0].score}</span>
                  <div className="podium-bar first-bar"></div>
                </div>
              )}

              {/* 3rd Place */}
              {leaderboardData[2] && (
                <div className="podium-col third-place">
                  <div className="podium-avatar-wrap">
                    <div className={`podium-avatar ${leaderboardData[2].colorClass}`}>
                      {leaderboardData[2].avatarInitials}
                    </div>
                    <span className="podium-rank-badge">3</span>
                  </div>
                  <span className="podium-name">{leaderboardData[2].name}</span>
                  <span className="podium-score">{leaderboardData[2].score}</span>
                  <div className="podium-bar third-bar"></div>
                </div>
              )}
            </div>

            <div className="runners-list-sec">
              <h4 className="runners-title">LEADERBOARD - THIS MONTH</h4>
              <div className="runners-list">
                {leaderboardData.slice(3, 5).map((peer, index) => (
                  <div key={peer.name} className="runner-row">
                    <span className="runner-rank-num">{index + 1}</span>
                    <div className={`runner-avatar ${peer.colorClass}`}>
                      {peer.avatarInitials}
                    </div>
                    <span className="runner-name">{peer.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="widget-link" onClick={() => setShowFullLeaderboardModal(true)}>
              <span>VIEW FULL LEADERBOARD</span>
            </Button>
          </div>

        </aside>

      </div>

      {/* 4. Raise Query Dialog Modal */}
      {showRaiseModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowRaiseModal(false)}>
          <div className="modal-card-custom glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h3>Raise New Query</h3>
              <button className="btn-modal-close" onClick={() => setShowRaiseModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleRaiseQuerySubmit} className="modal-form-custom">
              <div className="form-group-custom">
                <label>Query Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  placeholder="Enter a summary of your question..."
                  required
                />
              </div>

              <div className="form-group-custom">
                <label>Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  <option value="about">About</option>
                  <option value="noc">NOC</option>
                  <option value="selection">Selection</option>
                </select>
              </div>

              <div className="form-group-custom">
                <label>Description</label>
                <textarea 
                  value={newDescription} 
                  onChange={e => setNewDescription(e.target.value)} 
                  placeholder="Provide more context for your question..."
                  rows={4}
                  required
                />
              </div>

              <div className="modal-actions-custom">
                <Button variant="cancel" type="button" onClick={() => setShowRaiseModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Submit Query</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Resolve Query Dialog Modal */}
      {showResolveModal && (
        <div className="modal-backdrop-custom" onClick={closeResolveModal}>
          <div className="modal-card-custom glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h3>Resolve Pending Queries</h3>
              <button className="btn-modal-close" onClick={closeResolveModal}>&times;</button>
            </div>
            <div className="modal-body-custom">
              <p className="modal-info-text">Select a pending query raised by other cohort members to mark it resolved.</p>
              
              <div className="resolve-queries-list">
                {queries.filter(q => q.status !== 'Resolved').length > 0 ? (
                  queries.filter(q => q.status !== 'Resolved').map(q => (
                    <div key={q.id} className="resolve-list-item">
                      <div className="resolve-item-info">
                        <strong>{q.title}</strong>
                        <span>Asked by {q.authorName} ({q.time})</span>
                      </div>
                      <Button variant="primary" style={{ height: '30px', padding: '0 0.85rem', fontSize: '0.75rem', borderRadius: '6px' }} onClick={() => handleResolveQuery(q.id)}>
                        Resolve
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="no-resolve-notice">🎉 All queries are currently resolved!</p>
                )}
              </div>
              
              <div className="modal-actions-custom" style={{ marginTop: '1.5rem' }}>
                <Button variant="cancel" onClick={closeResolveModal}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Search & FAQ Overlay */}
      {showSearchOverlay && (
        <div 
          className="search-overlay-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains('search-overlay-backdrop') || e.target.classList.contains('search-overlay-scroll-wrap')) {
              closeSearchOverlay();
            }
          }}
        >
          <div className="search-overlay-scroll-wrap">
            <div className="search-overlay-content-card glass-card" onClick={e => e.stopPropagation()}>
              
              {/* Top search bar wrapper */}
              <div className="overlay-search-bar-wrap">
                <div className="search-input-wrap">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search FAQs, categories, or status..." 
                    value={overlaySearchQuery}
                    onChange={e => {
                      setOverlaySearchQuery(e.target.value);
                      setShowOverlaySuggest(true);
                    }}
                    onFocus={() => setShowOverlaySuggest(true)}
                    autoFocus
                    aria-label="Search FAQs"
                    autoComplete="off"
                  />
                  {overlaySearchQuery && (
                    <button 
                      type="button"
                      className="btn-clear" 
                      onClick={() => { 
                        setOverlaySearchQuery(''); 
                        setOverlayCategoryFilter(null); 
                        setOverlayOpenAccordions({});
                      }}
                      title="Clear search query"
                    >
                      <X size={15} />
                    </button>
                  )}

                  {/* Autocomplete suggestions dropdown */}
                  {showOverlaySuggest && overlaySuggestions.length > 0 && (
                    <div className="overlay-suggestions-dropdown glass-card">
                      {overlaySuggestions.map(faq => (
                        <div 
                          key={faq.id} 
                          className="overlay-suggestion-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOverlaySearchQuery(faq.question);
                            const foundCat = categoriesList.find(c => c.dbIndices.includes(String(faq.categoryIndex)));
                            if (foundCat) {
                              setOverlayCategoryFilter(foundCat.index);
                            }
                            setOverlayOpenAccordions({ [faq.id]: true });
                            setShowOverlaySuggest(false);
                          }}
                        >
                          <Search size={14} className="suggestion-item-icon" />
                          <span className="suggestion-item-text">{faq.question}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  className="overlay-close-btn" 
                  onClick={closeSearchOverlay}
                  aria-label="Close search overlay"
                >
                  <X size={20} />
                </button>
              </div>

              {/* CATEGORIES header */}
              <div className="overlay-categories-sec" onClick={() => setShowOverlaySuggest(false)}>
                <h4 className="overlay-categories-title">CATEGORIES</h4>
                <div className="overlay-categories-grid">
                  {categoriesList.map(cat => {
                    const IconComponent = cat.icon;
                    const isSelected = overlayCategoryFilter === cat.index;
                    const count = getCategoryCount(cat);
                    return (
                      <div 
                        key={cat.index} 
                        className={`overlay-category-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setOverlayCategoryFilter(isSelected ? null : cat.index);
                          setOverlayOpenAccordions({}); // reset accordion open states on category change
                        }}
                      >
                        <div className={`overlay-cat-icon-wrap ${cat.colorClass}`}>
                          <IconComponent size={20} />
                        </div>
                        <span className="overlay-cat-label">{cat.label}</span>
                        <span className={`overlay-cat-badge ${isSelected ? 'selected' : ''}`}>
                          {count} FAQS
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Accordion Results - Only shown if a category is selected or text is searched */}
              {(overlayCategoryFilter !== null || overlaySearchQuery.trim() !== '') && (
                <div className="overlay-results-sec" onClick={() => setShowOverlaySuggest(false)}>
                  <div className="overlay-results-header">
                    <h4 className="overlay-results-title">
                      {overlayCategoryFilter 
                        ? `FAQS under ${categoriesList.find(c => c.index === overlayCategoryFilter)?.label || ''}` 
                        : 'All FAQ Matches'} 
                      {overlaySearchQuery && ` matching "${overlaySearchQuery}"`}
                    </h4>
                    {filteredOverlayFaqs.length > 0 && (
                      <div className="faq-control-actions-row" style={{ marginTop: 0 }}>
                        <button className="faq-control-btn expand-btn" onClick={handleExpandAll}>
                          <BookOpen size={14} />
                          Expand all
                        </button>
                        <button className="faq-control-btn collapse-btn" onClick={handleCollapseAll}>
                          <LockKeyhole size={14} />
                          Collapse all
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overlay-accordions-list">
                    {filteredOverlayFaqs.length > 0 ? (
                      filteredOverlayFaqs.map(faq => (
                        <Accordion 
                          key={faq.id}
                          faq={faq}
                          isOpen={!!overlayOpenAccordions[faq.id]}
                          onToggle={() => toggleOverlayAccordion(faq.id)}
                          searchQuery={overlaySearchQuery}
                        />
                      ))
                    ) : (
                      <div className="overlay-no-results glass-card">
                        <p>No FAQs match your search criteria. Try a different keyword or category.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 6. Detailed Categories Analysis Modal */}
      {showAllCategoriesModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowAllCategoriesModal(false)}>
          <div className="modal-card-custom glass-card categories-detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px', width: '90%' }}>
            <div className="modal-header-custom">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} className="trend" style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0 }}>Detailed FAQ Categories Analysis</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setShowAllCategoriesModal(false)}>&times;</button>
            </div>
            <div className="modal-body-custom categories-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem', minHeight: '380px' }}>
              
              {/* Left Pane - Categories List */}
              <div className="modal-categories-list-pane" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRight: '1px solid rgba(0,0,0,0.06)', paddingRight: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.5rem 0' }}>All Active Categories</h4>
                {topFaqCategories.map((cat, index) => {
                  const isSelected = selectedModalCategory === cat.key;
                  return (
                    <div 
                      key={cat.key} 
                      className={`modal-category-item-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedModalCategory(cat.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.95rem 1.1rem',
                        borderRadius: '14px',
                        background: isSelected ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.2)',
                        border: isSelected ? '1px solid rgba(160, 90, 44, 0.25)' : '1px solid rgba(255, 255, 255, 0.35)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>{cat.label}</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{cat.upvotes} UPVOTES • {cat.queryCount} QUERIES</span>
                      </div>
                      <ChevronRight size={16} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }} />
                    </div>
                  );
                })}
              </div>

              {/* Right Pane - Selected Category Details */}
              <div className="modal-category-details-pane" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ borderBottom: '1.5px solid rgba(0,0,0,0.04)', paddingBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {topFaqCategories.find(c => c.key === selectedModalCategory)?.label || 'Category Details'}
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    List of active student queries raised under this category.
                  </p>
                </div>

                <div className="modal-category-queries-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '300px', paddingRight: '0.25rem' }}>
                  {queries.filter(q => q.categories.some(c => c.toUpperCase() === selectedModalCategory || (selectedModalCategory === 'ABOUT' && c.toUpperCase() === 'GENERAL'))).length > 0 ? (
                    queries.filter(q => q.categories.some(c => c.toUpperCase() === selectedModalCategory || (selectedModalCategory === 'ABOUT' && c.toUpperCase() === 'GENERAL'))).map(q => (
                      <div key={q.id} className="modal-query-detail-row glass-card" style={{ padding: '0.95rem 1.1rem', background: 'rgba(255,255,255,0.22)', display: 'flex', flexDirection: 'column', gap: '0.45rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.45)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }}>#{q.id}</span>
                          <span className={`item-btn-badge ${q.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: q.status === 'Resolved' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', color: q.status === 'Resolved' ? '#10b981' : '#f59e0b', fontWeight: 850 }}>
                            {q.status}
                          </span>
                        </div>
                        <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.35 }}>{q.title}</strong>
                        <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>👍 {q.upvotes} Upvotes</span>
                          <span>•</span>
                          <span>💬 {q.comments} Comments</span>
                          <span>•</span>
                          <span>{q.time}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>No active queries under this category.</p>
                  )}
                </div>
              </div>

            </div>
            <div className="modal-actions-custom" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
              <Button variant="outline-primary" style={{ padding: '0.4rem 1.25rem', borderRadius: '12px' }} onClick={() => { setShowAllCategoriesModal(false); setActiveTab('faq'); }}>
                Go to FAQ Library
              </Button>
              <Button variant="cancel" style={{ padding: '0.4rem 1.25rem', borderRadius: '12px' }} onClick={() => setShowAllCategoriesModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Cohort Resolver Leaderboard Modal */}
      {showFullLeaderboardModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowFullLeaderboardModal(false)}>
          <div className="modal-card-custom glass-card full-leaderboard-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header-custom">
              <h3>Cohort Resolver Leaderboard</h3>
              <button className="btn-modal-close" onClick={() => setShowFullLeaderboardModal(false)}>&times;</button>
            </div>
            <div className="modal-body-custom full-leaderboard-modal-body">
              <p className="modal-info-text">Active cohort members ranking based on queries resolved this month.</p>
              <div className="leaderboard-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {leaderboardData.map((peer, index) => (
                  <div 
                    key={peer.name} 
                    className={`leaderboard-list-item ${peer.isCurrentUser ? 'highlight-user' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '14px',
                      background: peer.isCurrentUser ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.22)',
                      border: peer.isCurrentUser ? '1.5px solid rgba(59, 130, 246, 0.25)' : '1px solid rgba(255, 255, 255, 0.45)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span 
                      className={`item-rank ${index === 0 ? 'gold-rank' : index === 1 ? 'silver-rank' : index === 2 ? 'bronze-rank' : ''}`}
                      style={{
                        fontSize: '0.94rem',
                        fontWeight: 800,
                        color: index === 0 ? '#eab308' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'var(--text-secondary)',
                        width: '20px',
                        textAlign: 'center'
                      }}
                    >
                      {index + 1}
                    </span>
                    <div 
                      className={`item-avatar ${peer.colorClass}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#ffffff'
                      }}
                    >
                      {peer.avatarInitials}
                    </div>
                    <div className="item-name-wrap" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="item-name" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{peer.name}</span>
                      {peer.isCurrentUser && (
                        <span 
                          className="item-badge-status"
                          style={{
                            fontSize: '0.62rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: 'rgba(59, 130, 246, 0.12)',
                            color: '#3b82f6',
                            fontWeight: 800
                          }}
                        >
                          You
                        </span>
                      )}
                    </div>
                    <span className="item-score-val" style={{ fontSize: '0.86rem', fontWeight: 750, color: 'var(--text-primary)' }}>{peer.score} pts</span>
                  </div>
                ))}
              </div>
              <div className="modal-actions-custom" style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                <Button variant="cancel" style={{ padding: '0.4rem 1.25rem', borderRadius: '12px' }} onClick={() => setShowFullLeaderboardModal(false)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
