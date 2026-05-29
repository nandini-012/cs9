import React, { useState } from 'react';
import { LayoutGrid, MessageSquare, Briefcase, HelpCircle, Search, Bell, Download, TrendingUp, TrendingDown, ClipboardList, CheckCircle, Clock, AlertCircle, Filter, LogOut, User, Settings } from 'lucide-react';
import QueriesManagementView from './QueriesManagementView';
import SpurtiManagementView from './SpurtiManagementView';
import FAQManagementView from './FAQManagementView';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [currentAdminView, setCurrentAdminView] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Vicharanashala</h2>
          <p>LAB INTERNSHIP HUB</p>
        </div>
        <nav className="admin-nav">
          <div 
            className={`admin-nav-item ${currentAdminView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentAdminView('dashboard')}
          >
            <LayoutGrid size={20} /> Dashboard
          </div>
          <div 
            className={`admin-nav-item ${currentAdminView === 'queriesManagement' ? 'active' : ''}`}
            onClick={() => setCurrentAdminView('queriesManagement')}
          >
            <MessageSquare size={20} /> Queries Management
          </div>
          <div 
            className={`admin-nav-item ${currentAdminView === 'spurtiManagement' ? 'active' : ''}`}
            onClick={() => setCurrentAdminView('spurtiManagement')}
          >
            <Briefcase size={20} /> Spurti Management
          </div>
          <div 
            className={`admin-nav-item ${currentAdminView === 'faqManagement' ? 'active' : ''}`}
            onClick={() => setCurrentAdminView('faqManagement')}
          >
            <Settings size={20} /> FAQ
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-search">
            <Search size={18} color="#9ca3af" />
            <input 
              type="text" 
              placeholder="Search FAQs, categories, or status..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') alert(`Executing admin search for: ${searchQuery}`);
              }}
            />
          </div>
          <div className="admin-header-right">
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            >
              <Bell size={20} color="#6b7280" />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></div>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '100%', right: '-10px', marginTop: '16px',
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
                  width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100,
                  cursor: 'default'
                }} onClick={e => e.stopPropagation()}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontWeight: '700', fontSize: '14px' }}>Notifications (2)</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', marginTop: '6px' }}></div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: '#111827' }}>Urgent Query Escalated</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>Query #Q-4589 needs immediate attention.</p>
                      </div>
                    </div>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%', marginTop: '6px' }}></div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: '#111827' }}>Spurti Application Submitted</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>A new Spurti application has been received.</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#2563eb', fontWeight: '600', cursor: 'pointer' }} className="admin-dropdown-item">Mark all as read</div>
                </div>
              )}
            </div>
            
            <div 
              className="admin-profile"
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            >
              <div className="admin-profile-info">
                <h4>{user?.name || 'Rahul Prasad'}</h4>
                <p>ADMIN ID #29463</p>
              </div>
              <div className="admin-avatar" style={{ overflow: 'hidden' }}>
                <img src="https://i.pravatar.cc/150?img=11" alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '16px',
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
                  width: '200px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100,
                  overflow: 'hidden'
                }} onClick={e => e.stopPropagation()}>
                  <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#4b5563', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }} className="admin-dropdown-item">
                    <User size={16} /> Admin Settings
                  </div>
                  <div 
                    style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600', color: '#ef4444', cursor: 'pointer' }} 
                    className="admin-dropdown-item"
                    onClick={onLogout}
                  >
                    <LogOut size={16} /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        {currentAdminView === 'dashboard' ? (
        <div className="admin-content">
          <div className="admin-page-header">
            <div className="admin-page-title">
              <h1>Main Dashboard</h1>
              <p>Real-time performance metrics for Vicharanashala Lab.</p>
            </div>
            <button className="admin-export-btn">
              <Download size={16} /> Export Report
            </button>
          </div>

          {/* Metrics Row */}
          <div className="admin-metrics">
            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <div className="admin-metric-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <ClipboardList size={20} />
                </div>
                <div className="admin-metric-trend up"><TrendingUp size={14} /> 12%</div>
              </div>
              <div className="admin-metric-title">OPEN QUERIES</div>
              <div className="admin-metric-value">1,284</div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <div className="admin-metric-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <CheckCircle size={20} />
                </div>
                <div className="admin-metric-trend up"><TrendingUp size={14} /> 3.4%</div>
              </div>
              <div className="admin-metric-title">RESOLUTION RATE</div>
              <div className="admin-metric-value">94.2%</div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <div className="admin-metric-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                  <Clock size={20} />
                </div>
                <div className="admin-metric-trend down"><TrendingDown size={14} /> 0.5d</div>
              </div>
              <div className="admin-metric-title">AVG. RESOLUTION TIME</div>
              <div className="admin-metric-value">2.4 Days</div>
            </div>

            <div className="admin-metric-card">
              <div className="admin-metric-header">
                <div className="admin-metric-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                  <AlertCircle size={20} />
                </div>
                <div className="admin-metric-badge">URGENT</div>
              </div>
              <div className="admin-metric-title">ESCALATED TODAY</div>
              <div className="admin-metric-value">18</div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="admin-middle-section">
            <div className="admin-chart-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Query Volume by Category</div>
                <div className="admin-legend">
                  <div className="admin-legend-item"><div className="admin-dot" style={{ background: '#2563eb' }}></div> New</div>
                  <div className="admin-legend-item"><div className="admin-dot" style={{ background: '#9ca3af' }}></div> Resolved</div>
                </div>
              </div>
              <div className="admin-chart-area">
                {/* Mocking chart bars to match layout */}
                <div style={{ width: '12%', height: '60%', background: '#e5e7eb', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '40%', background: '#2563eb', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '80%', background: '#e5e7eb', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '30%', background: '#2563eb', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '70%', background: '#e5e7eb', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '90%', background: '#2563eb', borderRadius: '4px' }}></div>
              </div>
              <div className="admin-chart-labels">
                <span>ACADEMIC</span>
                <span>NOC</span>
                <span>SPURTI</span>
                <span>STIPEND</span>
                <span>VIBE</span>
                <span>OFFER LETTER</span>
              </div>
            </div>

            <div className="admin-chart-card">
              <div className="admin-card-title" style={{ marginBottom: '24px' }}>Resolver Activity</div>
              <div className="admin-timeline-list">
                <div className="admin-timeline-item">
                  <div className="admin-t-avatar" style={{ overflow: 'hidden' }}><img src="https://i.pravatar.cc/150?img=12" alt="" width="100%"/></div>
                  <div className="admin-t-content">
                    <h5>John Doe resolved #Q-4521</h5>
                    <div className="admin-t-meta">2 minutes ago • Financial Aid</div>
                  </div>
                </div>
                <div className="admin-timeline-item">
                  <div className="admin-t-avatar" style={{ overflow: 'hidden' }}><img src="https://i.pravatar.cc/150?img=5" alt="" width="100%"/></div>
                  <div className="admin-t-content">
                    <h5>Alice Smith updated status on #Q-4530</h5>
                    <div className="admin-t-meta">15 minutes ago • Academic</div>
                  </div>
                </div>
                <div className="admin-timeline-item">
                  <div className="admin-t-avatar" style={{ background: '#60a5fa' }}><AlertCircle size={16}/></div>
                  <div className="admin-t-content">
                    <h5>Robert Brown claimed #Q-4532</h5>
                    <div className="admin-t-meta">45 minutes ago • Facilities</div>
                  </div>
                </div>
                <div className="admin-timeline-item">
                  <div className="admin-t-avatar" style={{ background: '#bfdbfe', color: '#2563eb' }}><TrendingDown size={16}/></div>
                  <div className="admin-t-content">
                    <h5>System auto-archived 12 queries</h5>
                    <div className="admin-t-meta">1 hour ago</div>
                  </div>
                </div>
                <div className="admin-timeline-item">
                  <div className="admin-t-avatar" style={{ overflow: 'hidden' }}><img src="https://i.pravatar.cc/150?img=9" alt="" width="100%"/></div>
                  <div className="admin-t-content">
                    <h5>Mary Key responded to #Q-4511</h5>
                    <div className="admin-t-meta">2 hours ago • IT Services</div>
                  </div>
                </div>
              </div>
              <div className="admin-t-view-all">View All Activity</div>
            </div>
          </div>

          {/* Bottom Table */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div className="admin-table-title">Needs Attention</div>
              <div className="admin-table-subtitle">Showing 5 escalated queries <Filter size={16}/></div>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>STUDENT</th>
                  <th>ISSUE</th>
                  <th>CATEGORY</th>
                  <th>PRIORITY</th>
                  <th>RESOLVER</th>
                </tr>
              </thead>
              <tbody>
                <tr className="admin-table-row">
                  <td className="admin-id">#Q-4589</td>
                  <td>
                    <div className="admin-student">
                      <div className="admin-student-avatar" style={{ background: '#dbeafe', color: '#1d4ed8' }}>SM</div>
                      <div>Sarah<br/>Miller</div>
                    </div>
                  </td>
                  <td className="admin-issue">Tuition waiver not reflected in account statemen...</td>
                  <td><div className="admin-badge finance">FINANCE</div></td>
                  <td><div className="admin-priority"><div className="admin-dot" style={{ background: '#ef4444' }}></div> Urgent</div></td>
                  <td className="admin-resolver">Admin<br/>Finance<br/>Team</td>
                </tr>
                <tr className="admin-table-row">
                  <td className="admin-id">#Q-4592</td>
                  <td>
                    <div className="admin-student">
                      <div className="admin-student-avatar" style={{ background: '#e0e7ff', color: '#4338ca' }}>TH</div>
                      <div>Tom<br/>Harris</div>
                    </div>
                  </td>
                  <td className="admin-issue">Hostel water supply disruption in Block C floor 4...</td>
                  <td><div className="admin-badge facilities">FACILITIES</div></td>
                  <td><div className="admin-priority"><div className="admin-dot" style={{ background: '#f59e0b' }}></div> High</div></td>
                  <td className="admin-resolver">Maint.<br/>Dept</td>
                </tr>
                <tr className="admin-table-row">
                  <td className="admin-id">#Q-4601</td>
                  <td>
                    <div className="admin-student">
                      <div className="admin-student-avatar" style={{ background: '#ffedd5', color: '#c2410c' }}>EL</div>
                      <div>Emily<br/>Lu</div>
                    </div>
                  </td>
                  <td className="admin-issue">Exam portal login error during registration windo...</td>
                  <td><div className="admin-badge it">IT SERVICES</div></td>
                  <td><div className="admin-priority"><div className="admin-dot" style={{ background: '#ef4444' }}></div> Urgent</div></td>
                  <td className="admin-resolver">IT Desk<br/>(Level 2)</td>
                </tr>
                <tr className="admin-table-row">
                  <td className="admin-id">#Q-4610</td>
                  <td>
                    <div className="admin-student">
                      <div className="admin-student-avatar" style={{ background: '#f3f4f6', color: '#4b5563' }}>MK</div>
                      <div>Mark<br/>Knight</div>
                    </div>
                  </td>
                  <td className="admin-issue">Credit transfer from exchange program not visib...</td>
                  <td><div className="admin-badge academic">ACADEMIC</div></td>
                  <td><div className="admin-priority"><div className="admin-dot" style={{ background: '#6b7280' }}></div> Medium</div></td>
                  <td className="admin-resolver">Registrar<br/>Office</td>
                </tr>
              </tbody>
            </table>
            <div className="admin-table-footer">View All Escalated Queries →</div>
          </div>
        </div>
        ) : currentAdminView === 'queriesManagement' ? (
          <div className="admin-content" style={{ padding: '32px' }}>
            <QueriesManagementView />
          </div>
        ) : currentAdminView === 'spurtiManagement' ? (
          <div className="admin-content" style={{ padding: '32px 40px' }}>
            <SpurtiManagementView />
          </div>
        ) : currentAdminView === 'faqManagement' ? (
          <div className="admin-content" style={{ padding: '32px 40px' }}>
            <FAQManagementView />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default AdminDashboard;
