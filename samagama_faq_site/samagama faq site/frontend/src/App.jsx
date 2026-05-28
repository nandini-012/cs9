import React, { useState, useEffect } from 'react';
import { Sun, Moon, ShieldCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminSidebar from './components/AdminSidebar';
import FAQPage from './pages/FAQPage';
import DashboardPage from './pages/DashboardPage';
import MyQueriesPage from './pages/MyQueriesPage';
import ResolveQueriesPage from './pages/ResolveQueriesPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminQueriesPage from './pages/AdminQueriesPage';
import AdminFAQPage from './pages/AdminFAQPage';
import AdminSpurtiPage from './pages/AdminSpurtiPage';
import './App.css';



const API_BASE_URL = 'http://localhost:5050';

const ACCENT_COLORS = {
  amber: '#a05a2c',
  lavender: '#8b5cf6',
  rose: '#db2777',
  sapphire: '#2563eb',
  emerald: '#059669'
};

function App() {
  const [activeTab, setActiveTab] = useState(() => (localStorage.getItem('samagama_email') && localStorage.getItem('samagama_token')) ? 'dashboard' : 'faq');
  const [token, setToken] = useState(() => localStorage.getItem('samagama_token') || null);
  const [userEmail, setUserEmail] = useState(() => (localStorage.getItem('samagama_email') && localStorage.getItem('samagama_token')) ? localStorage.getItem('samagama_email') : null);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('samagama_role') || null);
  const [intern, setIntern] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFaqMobileMenuOpen, setIsFaqMobileMenuOpen] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('samagama_theme_color') || 'amber');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('samagama_dark_mode') === 'true');
  const [myQueriesSubTab, setMyQueriesSubTab] = useState('raise');
  const [dbLeaderboard, setDbLeaderboard] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState(null);

  const handleLogin = (loginToken, email, role, name) => {
    localStorage.setItem('samagama_token', loginToken);
    localStorage.setItem('samagama_email', email);
    localStorage.setItem('samagama_role', role);
    setToken(loginToken);
    setUserEmail(email);
    setUserRole(role);
    setIsLoginModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('samagama_token');
    localStorage.removeItem('samagama_email');
    localStorage.removeItem('samagama_role');
    setToken(null);
    setUserEmail(null);
    setUserRole(null);
    setIntern(null);
    setActiveTab('faq');
  };

  const isAdmin = React.useMemo(() => {
    return userRole === 'admin' || (userEmail ? userEmail.toLowerCase().includes('@hotmail') : false);
  }, [userRole, userEmail]);

  // Cleanup inconsistent local storage keys on boot
  useEffect(() => {
    const localEmail = localStorage.getItem('samagama_email');
    const localToken = localStorage.getItem('samagama_token');
    if (localEmail && !localToken) {
      handleLogout();
    }
  }, []);

  // Fetch leaderboard data from API on mount
  useEffect(() => {
    if (!userEmail || !token) return;
    let active = true;
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/intern/leaderboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (active && Array.isArray(data) && data.length > 0) {
            setDbLeaderboard(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard from API:", err);
      }
    };
    fetchLeaderboard();
    return () => { active = false; };
  }, [userEmail, token]);

  // Realtime Leaderboard Data memoized from state
  const leaderboardData = React.useMemo(() => {
    const userLeaderboardName = intern?.name || 'Rahul Prasad';
    
    // Fallback if dbLeaderboard is not loaded yet
    const baseList = dbLeaderboard.length > 0 ? dbLeaderboard : [
      { name: userLeaderboardName, score: 1250, avatarInitials: 'RP', colorClass: 'user' },
      { name: 'Samad', score: 1250, avatarInitials: 'SA', colorClass: 'samad' },
      { name: 'ROY', score: 1180, avatarInitials: 'RY', colorClass: 'roy' },
      { name: 'Udharsh', score: 1150, avatarInitials: 'UD', colorClass: 'udharsh' },
      { name: 'Shreya', score: 1120, avatarInitials: 'SH', colorClass: 'shreya' },
      { name: 'Ananya', score: 1090, avatarInitials: 'AN', colorClass: 'ananya' },
      { name: 'Kartik', score: 1050, avatarInitials: 'KA', colorClass: 'kartik' },
      { name: 'Sneha', score: 980, avatarInitials: 'SN', colorClass: 'sneha' }
    ];

    const mappedList = baseList.map(peer => {
      const isCurr = peer.name.toLowerCase() === userLeaderboardName.toLowerCase();
      return {
        ...peer,
        isCurrentUser: isCurr,
        // Override color class to user for the logged-in intern
        colorClass: isCurr ? 'user' : peer.colorClass
      };
    });

    // Sort descending by score. If scores are equal, put the current user first!
    return mappedList.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.isCurrentUser ? -1 : (b.isCurrentUser ? 1 : 0);
    });
  }, [dbLeaderboard, intern]);

  // Global Queries State (Shared between Dashboard and My Queries)
  const [queries, setQueries] = useState([]);

  // Load FAQs on mount
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/faqs`);
        if (res.ok) {
          const faqData = await res.json();
          setFaqs(faqData);
        }
      } catch (e) {
        console.error("Failed to load FAQs:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  // Load Queries when token is available or changes
  useEffect(() => {
    if (!token) {
      setQueries([]);
      return;
    }
    const fetchQueries = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/queries`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const queryData = await res.json();
          setQueries(queryData);
        }
      } catch (e) {
        console.error("Failed to load queries:", e);
      }
    };
    fetchQueries();
  }, [token]);

  // Fetch/Sync profile if userEmail and token are set
  useEffect(() => {
    if (!userEmail || !token) {
      setIntern(null);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/intern/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setIntern(data);
          } else {
            console.warn("No data returned from profile fetch, logging out.");
            handleLogout();
          }
        } else {
          console.warn(`Profile fetch returned status ${res.status}, logging out.`);
          handleLogout();
        }
      } catch (e) {
        console.error("Failed to load intern profile, logging out:", e);
        handleLogout();
      }
    };
    fetchProfile();
  }, [userEmail, token]);

  // Sync selected themeColor with root '--accent' CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', ACCENT_COLORS[themeColor] || '#a05a2c');
    localStorage.setItem('samagama_theme_color', themeColor);
  }, [themeColor]);

  // Sync Dark Mode state with document.documentElement data-theme attribute
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('samagama_dark_mode', isDarkMode);
  }, [isDarkMode]);



  if (userEmail) {
    return (
      <div className="logged-in-layout">
        {isAdmin ? (
          <AdminSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userEmail={userEmail} 
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        ) : (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userEmail={userEmail} 
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main 
          className={`main-content-logged-in ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
          onClick={() => {
            if (isSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
        >
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your dashboard...</p>
            </div>
          ) : (
            <div className="logged-in-views-container" style={{ position: 'relative', width: '100%' }}>
              {isAdmin ? (
                <>
                  {/* Admin Dashboard View */}
                  <div 
                    className={`spa-view ${activeTab === 'dashboard' ? 'active' : 'inactive'}`}
                    aria-hidden={activeTab !== 'dashboard'}
                  >
                    <AdminDashboardPage 
                      queries={queries}
                      setActiveTab={setActiveTab}
                      setSelectedQueryId={setSelectedQueryId}
                      isSidebarOpen={isSidebarOpen}
                      onOpenSidebar={() => setIsSidebarOpen(true)}
                      apiBaseUrl={API_BASE_URL}
                      token={token}
                    />
                  </div>

                  {/* Admin Queries View */}
                  <div 
                    className={`spa-view ${activeTab === 'queries' ? 'active' : 'inactive'}`}
                    aria-hidden={activeTab !== 'queries'}
                  >
                    <AdminQueriesPage 
                      queries={queries}
                      setQueries={setQueries}
                      faqs={faqs}
                      setFaqs={setFaqs}
                      apiBaseUrl={API_BASE_URL}
                      selectedQueryId={selectedQueryId}
                      setSelectedQueryId={setSelectedQueryId}
                      isSidebarOpen={isSidebarOpen}
                      onOpenSidebar={() => setIsSidebarOpen(true)}
                      token={token}
                    />
                  </div>

                  {/* Admin Spurti Leaderboard View */}
                  <div 
                    className={`spa-view ${activeTab === 'leaderboard' ? 'active' : 'inactive'}`}
                    aria-hidden={activeTab !== 'leaderboard'}
                  >
                    <AdminSpurtiPage 
                      isSidebarOpen={isSidebarOpen}
                      onOpenSidebar={() => setIsSidebarOpen(true)}
                      apiBaseUrl={API_BASE_URL}
                      token={token}
                    />
                  </div>

                  {/* Admin FAQ Management View */}
                  <div 
                    className={`spa-view ${activeTab === 'faq' ? 'active' : 'inactive'}`}
                    aria-hidden={activeTab !== 'faq'}
                  >
                    <AdminFAQPage 
                      faqs={faqs}
                      setFaqs={setFaqs}
                      apiBaseUrl={API_BASE_URL}
                      isSidebarOpen={isSidebarOpen}
                      onOpenSidebar={() => setIsSidebarOpen(true)}
                      token={token}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Dashboard View */}
                  <div 
                    className={`spa-view ${activeTab === 'dashboard' ? 'active' : 'inactive'}`}
                    aria-hidden={activeTab !== 'dashboard'}
                  >
                    {intern ? (
                      <DashboardPage 
                        intern={intern} 
                        faqs={faqs}
                        apiBaseUrl={API_BASE_URL}
                        defaultFeedFilter="all"
                        onLogout={handleLogout}
                        setActiveTab={setActiveTab}
                        isSidebarOpen={isSidebarOpen}
                        onOpenSidebar={() => setIsSidebarOpen(true)}
                        activeTab={activeTab}
                        showSearchOverlay={showSearchOverlay}
                        setShowSearchOverlay={setShowSearchOverlay}
                        queries={queries}
                        setQueries={setQueries}
                        setMyQueriesSubTab={setMyQueriesSubTab}
                        dbLeaderboard={dbLeaderboard}
                        setDbLeaderboard={setDbLeaderboard}
                        leaderboardData={leaderboardData}
                        token={token}
                      />
                    ) : (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Fetching your intern record...</p>
                      </div>
                    )}
                  </div>

                  {/* Resolve Queries View */}
                  <div 
                    className={`spa-view ${activeTab === 'resolve' ? 'active' : 'inactive'}`}
                    aria-hidden={activeTab !== 'resolve'}
                  >
                    {intern ? (
                      <ResolveQueriesPage 
                        intern={intern}
                        queries={queries}
                        setQueries={setQueries}
                        faqs={faqs}
                        apiBaseUrl={API_BASE_URL}
                        isSidebarOpen={isSidebarOpen}
                        onOpenSidebar={() => setIsSidebarOpen(true)}
                        leaderboardData={leaderboardData}
                        dbLeaderboard={dbLeaderboard}
                        setDbLeaderboard={setDbLeaderboard}
                        token={token}
                      />
                    ) : (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Fetching your intern record...</p>
                      </div>
                    )}
                  </div>

                  {/* My Queries View */}
                  <div 
                    className={`spa-view ${activeTab === 'myqueries' ? 'active' : 'inactive'}`}
                    aria-hidden={activeTab !== 'myqueries'}
                  >
                    {intern ? (
                      <MyQueriesPage 
                        intern={intern}
                        setActiveTab={setActiveTab}
                        isSidebarOpen={isSidebarOpen}
                        onOpenSidebar={() => setIsSidebarOpen(true)}
                        onSearchClick={() => {
                          setActiveTab('dashboard');
                          setShowSearchOverlay(true);
                        }}
                        queries={queries}
                        setQueries={setQueries}
                        activeSubTab={myQueriesSubTab}
                        setActiveSubTab={setMyQueriesSubTab}
                        apiBaseUrl={API_BASE_URL}
                        token={token}
                      />
                    ) : (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Fetching your intern record...</p>
                      </div>
                    )}
                  </div>

                  {/* FAQ Page View */}
                  <div 
                    className={`spa-view ${activeTab === 'faq' ? 'active' : 'inactive'}`}
                    aria-hidden={activeTab !== 'faq'}
                  >
                    <FAQPage 
                      faqs={faqs} 
                      searchQuery={searchQuery} 
                      setSearchQuery={setSearchQuery} 
                      isLoggedIn={true}
                      isMobileMenuOpen={isFaqMobileMenuOpen}
                      setIsMobileMenuOpen={setIsFaqMobileMenuOpen}
                      isSidebarOpen={isSidebarOpen}
                      onOpenSidebar={() => setIsSidebarOpen(true)}
                    />
                  </div>
                </>
              )}


              {/* Settings View */}
              <div 
                className={`spa-view ${activeTab === 'settings' ? 'active' : 'inactive'}`}
                aria-hidden={activeTab !== 'settings'}
              >
                <div className="simple-page-container" style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                    {!isSidebarOpen && (
                      <button 
                        className="btn-menu-hamburger settings-hamburger" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSidebarOpen(true);
                        }}
                        aria-label="Open navigation menu"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '4px',
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          background: 'var(--glass-bg)',
                          border: '1px solid var(--glass-border)',
                          cursor: 'pointer',
                          padding: 0,
                          flexShrink: 0
                        }}
                      >
                        <span className="hamburger-line" style={{ display: 'block', width: '16px', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '9px' }}></span>
                        <span className="hamburger-line" style={{ display: 'block', width: '16px', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '9px' }}></span>
                        <span className="hamburger-line" style={{ display: 'block', width: '16px', height: '2px', backgroundColor: 'var(--text-primary)', borderRadius: '9px' }}></span>
                      </button>
                    )}
                    <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '1.4rem', margin: 0, border: 'none', padding: 0, color: 'var(--text-primary)' }}>Settings</h2>
                  </div>

                  <div style={{ maxWidth: '600px', margin: '1.25rem auto 0 auto' }}>
                    <div className="settings-card">
                      <div className="profile-hero-section">
                        <div className="profile-hero-avatar-wrap">
                          <div className="profile-hero-avatar">
                            {intern?.name ? intern.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        </div>
                        <div className="profile-hero-details">
                          <h3 style={{ color: 'var(--text-primary)' }}>{intern?.name || 'Loading Intern...'}</h3>
                          <p>{userEmail}</p>
                          
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.35rem', 
                            background: isAdmin ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.12)', 
                            color: isAdmin ? '#38bdf8' : '#10b981', 
                            padding: '0.3rem 0.75rem', 
                            borderRadius: '20px', 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            border: isAdmin ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)', 
                            marginTop: '0.5rem', 
                            width: 'fit-content' 
                          }}>
                            <ShieldCheck size={14} />
                            <span>{isAdmin ? 'Administrator' : 'Active Participant'}</span>
                          </div>

                        </div>
                      </div>

                      <div className="settings-section-title">Personalization</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Accent Theme Color</span>
                        <div className="theme-options-row">
                          {Object.keys(ACCENT_COLORS).map((colorKey) => (
                            <button
                              key={colorKey}
                              className={`theme-color-btn ${themeColor === colorKey ? 'active' : ''}`}
                              style={{ backgroundColor: ACCENT_COLORS[colorKey] }}
                              onClick={() => setThemeColor(colorKey)}
                              title={`${colorKey.charAt(0).toUpperCase() + colorKey.slice(1)} accent`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="settings-section-title">Preferences</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem', padding: '0.25rem 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dark Mode</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Toggle liquid dark theme across portal</span>
                        </div>
                        <button
                          onClick={() => setIsDarkMode(prev => !prev)}
                          style={{
                            background: isDarkMode ? 'var(--accent)' : 'rgba(0,0,0,0.06)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '30px',
                            width: '56px',
                            height: '30px',
                            position: 'relative',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'background-color 0.3s ease',
                            outline: 'none'
                          }}
                          aria-label="Toggle dark mode"
                        >
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'white',
                            position: 'absolute',
                            top: '2px',
                            left: isDarkMode ? '28px' : '2px',
                            transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            {isDarkMode ? <Moon size={14} color="var(--accent)" /> : <Sun size={14} color="#fbbf24" />}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userEmail={userEmail} 
        onLogout={handleLogout}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onMenuClick={() => setIsFaqMobileMenuOpen(true)}
      />

      <main className="main-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading Vicharanashala Portal...</p>
          </div>
        ) : (
          <FAQPage 
            faqs={faqs} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            isLoggedIn={false}
            isMobileMenuOpen={isFaqMobileMenuOpen}
            setIsMobileMenuOpen={setIsFaqMobileMenuOpen}
          />
        )}
      </main>

      <footer className="site-footer-navy">
        <div className="footer-content-wrap">
          <div className="footer-brand-sec">
            <h3 className="footer-logo">Vicharanashala Lab</h3>
            <p className="footer-desc">Pioneering excellence in technology and social innovation at IIT Ropar.</p>
          </div>
          <div className="footer-links-sec">
            <div className="footer-col">
              <h4>EXPLORE</h4>
              <ul>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); alert("Contact: contact@samagama.in"); }}>Contact Us</a></li>
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy"); }}>Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>INSTITUTION</h4>
              <ul>
                <li><a href="https://iitrpr.ac.in" target="_blank" rel="noreferrer">IIT Ropar Main Site</a></li>
                <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service"); }}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom-sec">
          <p>© Rahul Prasad RCOEM Nagpur. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      {isLoginModalOpen && (
        <LoginPage 
          onLogin={handleLogin} 
          onClose={() => setIsLoginModalOpen(false)} 
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}

export default App;
