import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LayoutGrid, MessageSquare, Settings, Search, PlusCircle, CheckCircle2, Bell, ChevronUp, MessageCircle, CheckCircle, Clock, TrendingUp, Link as LinkIcon, LogOut, Info, Banknote, ShieldCheck, DoorOpen, Users, ClipboardList, FileText, GraduationCap, X, Moon, Sun } from 'lucide-react';
import RaiseQueryView from './RaiseQueryView';
import QueryDetailView from './QueryDetailView';
import ProfileSettingsView from './ProfileSettingsView';
import './StudentDashboard.css';

const mockNotifications = [
  { id: 1, text: "Admin replied to your query 'Late grade submission...'", time: "10 mins ago", read: false },
  { id: 2, text: "Your query 'Hostel Wi-Fi downtime' has been marked as Resolved.", time: "2 hours ago", read: true },
  { id: 3, text: "HR Dept requested more details on 'Offer letter' query.", time: "1 day ago", read: true }
];

const loremDesc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const initialQueries = [
  {
    id: 1,
    upvotes: 124,
    hasUpvoted: false,
    author: 'other',
    timestamp: 3,
    tags: [
      { label: 'ABOUT', type: 'dark' }, 
      { label: 'GENERAL', type: 'light' }
    ],
    meta: '2 hours ago',
    title: 'What is the Vicharanashala internship?',
    desc: loremDesc,
    comments: 42,
    status: 'Active',
    statusIcon: CheckCircle,
    statusColor: '#0b1528'
  },
  {
    id: 2,
    upvotes: 89,
    hasUpvoted: false,
    author: 'self',
    timestamp: 2,
    tags: [
      { label: 'NOC', type: 'custom', customStyle: { background: '#e5ccb3', color: '#8c6a40' } }
    ],
    meta: '5 hours ago • Administration',
    title: 'When do I submit the NOC?',
    desc: loremDesc,
    comments: 18,
    status: 'In Progress',
    statusIcon: Clock,
    statusColor: '#4b5563'
  },
  {
    id: 3,
    upvotes: 56,
    hasUpvoted: false,
    author: 'other',
    timestamp: 1,
    tags: [
      { label: 'SELECTION', type: 'custom', customStyle: { background: '#e5ccb3', color: '#8c6a40' } }
    ],
    meta: 'Yesterday • HR Dept',
    title: 'How do I receive my offer letter and certificate?',
    desc: loremDesc,
    comments: 9,
    status: 'Resolved',
    statusIcon: CheckCircle,
    statusColor: '#16a34a' // Green color for resolved
  }
];

const StudentDashboard = ({ user, onLogout }) => {
  const [queries, setQueries] = useState(initialQueries);
  const [showLogout, setShowLogout] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedQuery, setSelectedQuery] = useState(null);
  
  // Navigation & Filtering States
  const [activeSidebarNav, setActiveSidebarNav] = useState('Dashboard');
  const [activeTab, setActiveTab] = useState('All Queries');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handleUpvote = (id) => {
    setQueries(queries.map(q => {
      if (q.id === id) {
        const isUpvoting = !q.hasUpvoted;
        return {
          ...q,
          hasUpvoted: isUpvoting,
          upvotes: isUpvoting ? q.upvotes + 1 : q.upvotes - 1
        };
      }
      return q;
    }));
  };

  let filteredQueries = queries.filter(q => {
    // 1. Sidebar Filter
    if (activeSidebarNav === 'My Queries' && q.author !== 'self') return false;
    
    // 2. Tab Filter
    if (activeTab === 'Resolved' && q.status !== 'Resolved') return false;
    if (activeTab === 'Unanswered' && q.status !== 'Active' && q.status !== 'In Progress') return false;

    // 3. Dropdown Filters
    if (categoryFilter !== 'All') {
      const hasCat = q.tags.some(t => t.label === categoryFilter.toUpperCase());
      if (!hasCat) return false;
    }
    if (statusFilter !== 'All' && q.status !== statusFilter) return false;
    
    // 4. Search Filter
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesSearch;
  });

  // 5. Tab Sorting (Trending / Recent)
  if (activeTab === 'Trending') {
    filteredQueries.sort((a, b) => b.upvotes - a.upvotes);
  } else if (activeTab === 'Recent') {
    filteredQueries.sort((a, b) => b.timestamp - a.timestamp);
  }

  return (
    <div className={`dash-wrapper-v2 ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Sidebar */}
      <aside className="dash-sidebar-v2">
        <div 
          className="dash-logo-v2" 
          style={{ cursor: 'pointer' }}
          onClick={() => {
            window.scrollTo(0, 0);
            setShowLogout(false);
            setIsNotificationsOpen(false);
            setSearchQuery('');
            setCurrentView('dashboard');
          }}
        >
          <h2>Vicharanashala</h2>
          <p>LAB INTERNSHIP HUB</p>
        </div>
        <nav className="dash-nav-v2">
          <div 
            className={`dash-nav-item-v2 ${activeSidebarNav === 'Dashboard' && currentView !== 'raiseQuery' ? 'active' : ''}`}
            onClick={() => { setActiveSidebarNav('Dashboard'); setCurrentView('dashboard'); }}
          >
            <LayoutGrid size={20} /> Dashboard
          </div>
          <div 
            className={`dash-nav-item-v2 ${activeSidebarNav === 'My Queries' && currentView !== 'raiseQuery' ? 'active' : ''}`}
            onClick={() => { setActiveSidebarNav('My Queries'); setCurrentView('dashboard'); }}
          >
            <MessageSquare size={20} /> My Queries
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dash-main-v2">
        {/* Header */}
        <header className="dash-header-v2">
          <div 
            className="dash-search-v2" 
            onClick={() => setIsSearchModalOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <Search size={16} color="#6b7280" style={{ marginRight: '10px' }} />
            <input 
              type="text" 
              placeholder="Search FAQs, categories, or status..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ pointerEvents: 'none', background: 'transparent' }}
              readOnly
            />
          </div>

          <div className="dash-header-right-v2">
            {currentView === 'dashboard' && (
              <button className="action-btn-v2" onClick={() => setCurrentView('raiseQuery')}>
                <PlusCircle size={16} /> RAISE NEW QUERY
              </button>
            )}
            
            <div 
              style={{ position: 'relative', cursor: 'pointer', color: '#4b5563', padding: '0 12px' }}
              onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setShowLogout(false); }}
            >
              <Bell size={20} />
              <div style={{ position: 'absolute', top: 0, right: '12px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
              
              {isNotificationsOpen && (
                <div className="logout-dropdown" style={{ right: '0', top: '35px', minWidth: '320px', padding: 0, overflow: 'hidden', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontWeight: '700', color: '#111827' }}>
                    Notifications
                  </div>
                  <div>
                    {mockNotifications.map(notif => (
                      <div key={notif.id} style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', background: notif.read ? '#fff' : '#f0f9ff' }}>
                        <p style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', lineHeight: 1.4 }}>{notif.text}</p>
                        <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600' }}>{notif.time}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#0b1528', fontWeight: '700', cursor: 'pointer', background: '#f9fafb' }}>
                    View All Activity
                  </div>
                </div>
              )}
            </div>

            <div 
              style={{ cursor: 'pointer', color: '#4b5563', padding: '0 12px', display: 'flex', alignItems: 'center' }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Day/Night Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>

            <div className="user-profile-v2" onClick={() => { setShowLogout(!showLogout); setIsNotificationsOpen(false); }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>{user?.name || 'Rahul Prasad'}</div>
                <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>STUDENT ID #29463</div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                RP
              </div>
            </div>

            {showLogout && (
              <div className="logout-dropdown">
                <div 
                  style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#4b5563', fontSize: '13px', fontWeight: '600' }}
                  onClick={() => {
                    setCurrentView('profileSettings');
                    setShowLogout(false);
                  }}
                >
                  <Settings size={16} /> Profile Settings
                </div>
                <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }}></div>
                <button 
                  style={{ width: '100%', border: 'none', textAlign: 'left', padding: '10px 16px', color: '#dc2626', fontSize: '13px', background: 'transparent', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', cursor: 'pointer' }}
                  onClick={onLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Layout */}
        {currentView === 'dashboard' ? (
          <div className="dash-content-v2">
            
            {/* Left Column (Queries List) */}
            <div className="dash-col-main">
              {activeSidebarNav === 'My Queries' && (
                <h2 style={{ marginBottom: '24px', fontFamily: 'Inter', fontSize: '24px', color: '#111827' }}>My Queries</h2>
              )}
              
              <div className="dash-tabs">
                <div className="tabs-left">
                  {['All Queries', 'Trending', 'Recent', 'Unanswered', 'Resolved'].map(tab => (
                    <div 
                      key={tab}
                      className={`tab-v2 ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                      style={{ cursor: 'pointer' }}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
                <div className="tabs-right">
                  {/* Category Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button 
                      className="filter-btn" 
                      onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsStatusOpen(false); }}
                    >
                      Category: {categoryFilter} ▼
                    </button>
                    {isCategoryOpen && (
                      <div className="logout-dropdown" style={{ right: 0, minWidth: '150px', padding: '8px 0' }}>
                        {['All', 'ABOUT', 'GENERAL', 'NOC', 'SELECTION'].map(cat => (
                          <div 
                            key={cat} 
                            onClick={() => { setCategoryFilter(cat); setIsCategoryOpen(false); }} 
                            style={{ padding: '8px 24px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: categoryFilter === cat ? '#0b1528' : '#4b5563', background: categoryFilter === cat ? '#f3f4f6' : 'transparent' }}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button 
                      className="filter-btn" 
                      onClick={() => { setIsStatusOpen(!isStatusOpen); setIsCategoryOpen(false); }}
                    >
                      Status: {statusFilter} ▼
                    </button>
                    {isStatusOpen && (
                      <div className="logout-dropdown" style={{ right: 0, minWidth: '150px', padding: '8px 0' }}>
                        {['All', 'Active', 'In Progress', 'Resolved'].map(stat => (
                          <div 
                            key={stat} 
                            onClick={() => { setStatusFilter(stat); setIsStatusOpen(false); }} 
                            style={{ padding: '8px 24px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: statusFilter === stat ? '#0b1528' : '#4b5563', background: statusFilter === stat ? '#f3f4f6' : 'transparent' }}
                          >
                            {stat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {filteredQueries.length === 0 && (
                <div style={{ color: '#6b7280', marginTop: '20px' }}>
                  No matching queries found for "{searchQuery}".
                </div>
              )}

              {/* Map over filtered queries */}
              {filteredQueries.map((query) => {
                const StatusIcon = query.statusIcon;
                
                return (
                  <div key={query.id} className="query-card">
                    <div 
                      className="upvote-box"
                      style={{ 
                        cursor: 'pointer',
                        background: query.hasUpvoted ? '#0b1528' : '#d1d5db',
                        color: query.hasUpvoted ? '#fff' : '#111827',
                        transition: '0.2s all'
                      }}
                      onClick={() => handleUpvote(query.id)}
                    >
                      <ChevronUp size={24} color={query.hasUpvoted ? '#fff' : '#111827'} />
                      <span>{query.upvotes}</span>
                    </div>
                    <div className="query-content">
                      <div className="query-header">
                        <div className="query-tags">
                          {query.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className={`q-tag ${tag.type === 'light' ? 'light' : ''}`}
                              style={tag.type === 'custom' ? tag.customStyle : {}}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                        <div className="query-meta">{query.meta}</div>
                      </div>
                      <h3 className="query-title">{query.title}</h3>
                      <p className="query-desc">{query.desc}</p>
                      <div className="query-footer">
                        <div 
                          className="q-footer-item" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedQuery(query);
                            setCurrentView('queryDetail');
                          }}
                        >
                          <MessageCircle size={14} /> {query.comments} comments
                        </div>
                        <div className="q-footer-item" style={{ color: query.statusColor }}>
                          <StatusIcon size={14} /> {query.status}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="copy-footer">
                © 2026 Vicharanashala Lab Internship Hub. All rights reserved.
              </div>
            </div>

            {/* Right Column (Widgets) */}
            <div className="dash-col-side">
              
              {/* Widget 1 */}
              <div className="widget">
                <div className="widget-title">
                  <div className="w-icon"><TrendingUp size={20} /></div>
                  Top FAQ Categories
                </div>
                <ul className="w-faq-list">
                  <li className="w-faq-item" style={{ cursor: 'pointer' }} onClick={() => alert("Filtering by Selection & Onboarding...")}>
                    <div className="w-faq-num">01</div>
                    <div className="w-faq-text">
                      <h5>Selection & Onboarding</h5>
                      <p>420 UPVOTES • 12 QUERIES</p>
                    </div>
                  </li>
                  <li className="w-faq-item" style={{ cursor: 'pointer' }} onClick={() => alert("Filtering by NOC Requirements...")}>
                    <div className="w-faq-num">02</div>
                    <div className="w-faq-text">
                      <h5>NOC Requirements</h5>
                      <p>310 UPVOTES • 8 QUERIES</p>
                    </div>
                  </li>
                  <li className="w-faq-item" style={{ cursor: 'pointer' }} onClick={() => alert("Filtering by Project Allocation...")}>
                    <div className="w-faq-num">03</div>
                    <div className="w-faq-text">
                      <h5>Project Allocation</h5>
                      <p>195 UPVOTES • 5 QUERIES</p>
                    </div>
                  </li>
                </ul>
                <button 
                  className="w-btn"
                  onClick={() => alert("Opening full Categories Directory...")}
                >
                  View All Categories
                </button>
              </div>

              {/* Widget 2 */}
              <div className="widget">
                <div className="widget-title">
                  <div className="w-icon" style={{ background: '#d1d5db', color: '#4b5563' }}><LinkIcon size={20} /></div>
                  Your Contribution
                </div>
                <div className="timeline">
                  <div className="t-item" style={{ cursor: 'pointer' }} onClick={() => alert("Opening your resolution for: Hostel Wi-Fi downtime...")}>
                    <div className="t-dot green" style={{ background: '#16a34a' }}></div>
                    <h5>Resolved: Hostel Wi-Fi downtime</h5>
                    <p>RESOLVED 10 MINS AGO</p>
                  </div>
                  <div className="t-item" style={{ cursor: 'pointer' }} onClick={() => alert("Opening your comment on: CMS102 Grade Upload...")}>
                    <div className="t-dot" style={{ background: '#3b82f6' }}></div>
                    <h5>Commented: CMS102 Grade Upload</h5>
                    <p>2 HOURS AGO</p>
                  </div>
                  <div className="t-item" style={{ cursor: 'pointer' }} onClick={() => alert("Opening your comment on: Portal Elective Registration...")}>
                    <div className="t-dot" style={{ background: '#3b82f6' }}></div>
                    <h5>Commented: Portal Elective Reg...</h5>
                    <p>YESTERDAY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'raiseQuery' ? (
          <RaiseQueryView />
        ) : currentView === 'queryDetail' ? (
          <QueryDetailView 
            query={selectedQuery} 
            onClose={() => setCurrentView('dashboard')} 
          />
        ) : currentView === 'profileSettings' ? (
          <ProfileSettingsView />
        ) : null}
      </div>

      {/* Search Modal Overlay */}
      {isSearchModalOpen && createPortal(
        <div className="search-modal-overlay" onClick={() => setIsSearchModalOpen(false)}>
          <div className="search-modal" onClick={e => e.stopPropagation()}>
            <div className="sm-input-wrapper">
              <div className="sm-input-container">
                <Search size={24} color="#6b7280" />
                <input 
                  type="text" 
                  className="sm-input" 
                  placeholder="Search FAQs, categories, or status..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <X size={24} color="#6b7280" style={{ cursor: 'pointer' }} onClick={() => setIsSearchModalOpen(false)} />
              </div>
            </div>

            <div className="sm-categories-section">
              <div className="sm-cat-header">
                <span>CATEGORIES</span>
                <div className="sm-cat-line"></div>
              </div>
              
              <div className="sm-cat-grid">
                {/* Category Cards */}
                {[
                  { icon: Info, title: 'Internship Info', count: 45, color: '#1e3a8a', bg: '#eff6ff' },
                  { icon: Banknote, title: 'Stipend & Benefits', count: 32, color: '#9a3412', bg: '#ffedd5' },
                  { icon: ShieldCheck, title: 'NOC Requirements', count: 28, color: '#c2410c', bg: '#ffedd5' },
                  { icon: DoorOpen, title: 'Lab Access', count: 67, color: '#7e22ce', bg: '#f3e8ff' },
                  { icon: Users, title: 'Work Culture', count: 19, color: '#be123c', bg: '#ffe4e6' },
                  { icon: ClipboardList, title: 'Project Allocation', count: 38, color: '#1d4ed8', bg: '#eff6ff' },
                  { icon: FileText, title: 'Final Report', count: 24, color: '#374151', bg: '#f3f4f6' },
                  { icon: GraduationCap, title: 'Academic Credits', count: 15, color: '#b45309', bg: '#fef3c7' }
                ].map((cat, idx) => (
                  <div 
                    key={idx} 
                    className={`sm-cat-card ${idx === 0 ? 'active' : ''}`}
                    onClick={() => {
                      alert(`Filtering dashboard feed by category: ${cat.title}`);
                      setCategoryFilter('All'); // Real integration would set proper enum
                      setSearchQuery(cat.title); // Simulating filter via search
                      setIsSearchModalOpen(false);
                      setCurrentView('dashboard');
                    }}
                  >
                    <div className="sm-cat-icon" style={{ color: cat.color, background: cat.bg }}>
                      <cat.icon size={20} />
                    </div>
                    <h4>{cat.title}</h4>
                    <div className="sm-cat-badge">{cat.count} FAQS</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default StudentDashboard;
