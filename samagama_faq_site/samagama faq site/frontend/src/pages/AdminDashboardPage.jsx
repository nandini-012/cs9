import React, { useMemo } from 'react';
import { 
  Download, 
  TrendingUp, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import Button from '../components/Button';
import './AdminDashboardPage.css';

export default function AdminDashboardPage({ 
  queries = [], 
  setActiveTab, 
  setSelectedQueryId, 
  isSidebarOpen, 
  onOpenSidebar 
}) {
  
  // 1. Calculate real metrics
  const stats = useMemo(() => {
    const total = queries.length || 1;
    const resolved = queries.filter(q => q.status === 'Resolved' || q.isResolved).length;
    const open = queries.filter(q => q.status !== 'Resolved' && !q.isResolved).length;
    const rate = Math.round((resolved / total) * 100);
    
    // Count escalated: queries with "Escalated" in status or timeline
    const escalated = queries.filter(q => {
      if (q.status === 'In Progress') return true;
      if (q.timeline && q.timeline.some(t => t.label === 'Escalated to Admin' && t.status === 'active')) return true;
      return false;
    }).length;

    return {
      open,
      rate,
      escalated
    };
  }, [queries]);

  // 2. Resolver Activity Mock Data
  const resolverActivities = [
    { id: 1, name: 'John Doe', action: 'resolved query #q-1', time: '10 mins ago', colorClass: 'samad' },
    { id: 2, name: 'Alice Smith', action: 'updated answer in NOC', time: '45 mins ago', colorClass: 'roy' },
    { id: 3, name: 'Robert Mason', action: 'resolved query #4829', time: '2 hours ago', colorClass: 'udharsh' },
    { id: 4, name: 'Suryanshu', action: 'resolved 5 queries today', time: '4 hours ago', colorClass: 'user' }
  ];

  // 3. Needs Attention List (queries that are open/pending)
  const needsAttentionQueries = useMemo(() => {
    return queries.filter(q => q.status !== 'Resolved' && !q.isResolved).slice(0, 5);
  }, [queries]);

  // 4. Dynamic category counts for the bar chart
  const categoryChartData = useMemo(() => {
    const counts = {
      ACADEMICS: 5,
      NOC: 12,
      STIPEND: 8,
      SELECTION: 6,
      HR: 3,
      GENERAL: 7
    };

    // Aggregate from real queries
    queries.forEach(q => {
      const cat = (q.category || 'GENERAL').toUpperCase();
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      } else {
        counts[cat] = 1;
      }
    });

    const maxCount = Math.max(...Object.values(counts));

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / maxCount) * 100)
    }));
  }, [queries]);

  const handleExportReport = () => {
    const headers = 'ID,Title,Status,Author,Category\n';
    const rows = queries.map(q => `"${q.id}","${q.title}","${q.status}","${q.authorName || q.author}","${q.category || 'General'}"`).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Vicharanashala_Queries_Report_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="admin-dashboard-root">
      {/* Top Header */}
      <header className="admin-dashboard-header glass-card">
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
            <h2 className="admin-title-text">Main Dashboard</h2>
            <p className="admin-subtitle-text">Real-time performance metrics for Vicharanashala Lab.</p>
          </div>
        </div>
        <Button variant="outline-primary" onClick={handleExportReport}>
          <Download size={14} style={{ marginRight: '0.45rem' }} />
          Export Report
        </Button>
      </header>

      {/* Metrics Row */}
      <section className="admin-metrics-grid">
        <div className="admin-metric-card glass-card">
          <div className="metric-icon open">
            <AlertCircle size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Open Queries</span>
            <span className="metric-value">{stats.open}</span>
          </div>
        </div>

        <div className="admin-metric-card glass-card">
          <div className="metric-icon rate">
            <TrendingUp size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Resolution Rate</span>
            <span className="metric-value">{stats.rate}%</span>
          </div>
        </div>

        <div className="admin-metric-card glass-card">
          <div className="metric-icon time">
            <Clock size={20} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Avg. Resolution Time</span>
            <span className="metric-value">2.4 Days</span>
          </div>
        </div>

        <div className="admin-metric-card glass-card">
          <div className="metric-icon escalated">
            <AlertCircle size={20} style={{ transform: 'rotate(180deg)' }} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Escalated Today</span>
            <span className="metric-value">{stats.escalated}</span>
          </div>
        </div>
      </section>

      {/* Grid Layout: Chart and Activity */}
      <div className="admin-grid-layout">
        
        {/* Left Widget: Category Chart */}
        <div className="admin-widget-card glass-card chart-widget">
          <h3 className="widget-title">Query Volume by Category</h3>
          <div className="custom-bar-chart">
            {categoryChartData.map(item => (
              <div key={item.name} className="chart-bar-row">
                <span className="bar-label">{item.name}</span>
                <div className="bar-container">
                  <div 
                    className="bar-filled" 
                    style={{ width: `${item.percent}%` }}
                    title={`${item.count} queries`}
                  >
                    <span className="bar-tooltip">{item.count}</span>
                  </div>
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Widget: Resolver Activity */}
        <div className="admin-widget-card glass-card activity-widget">
          <h3 className="widget-title">Resolver Activity</h3>
          <div className="activity-list">
            {resolverActivities.map(act => (
              <div key={act.id} className="activity-row">
                <div className={`activity-avatar ${act.colorClass}`}>
                  {act.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="activity-details">
                  <p className="activity-text">
                    <strong>{act.name}</strong> {act.action}
                  </p>
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="btn-view-all-activity"
            onClick={() => setActiveTab('leaderboard')}
          >
            View All Activity
            <ChevronRight size={14} />
          </button>
        </div>

      </div>

      {/* Bottom Section: Needs Attention Table */}
      <section className="admin-table-section glass-card">
        <h3 className="widget-title">Needs Attention</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>STUDENT</th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>PRIORITY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {needsAttentionQueries.length > 0 ? (
                needsAttentionQueries.map(q => (
                  <tr key={q.id}>
                    <td className="query-id-cell">#{q.id}</td>
                    <td>
                      <div className="student-profile-cell">
                        <div className="cell-avatar">
                          {q.authorName ? q.authorName.charAt(0) : 'S'}
                        </div>
                        <span className="cell-name">{q.authorName || 'Student'}</span>
                      </div>
                    </td>
                    <td className="query-title-cell" title={q.title}>
                      {q.title}
                    </td>
                    <td>
                      <span className={`category-tag-badge ${(q.category || 'general').toLowerCase()}`}>
                        {q.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${q.status === 'In Progress' ? 'high' : 'medium'}`}>
                        {q.status === 'In Progress' ? 'High' : 'Medium'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-table-action"
                        onClick={() => {
                          setSelectedQueryId(q.id);
                          setActiveTab('queries');
                        }}
                      >
                        Resolve
                        <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty-row">
                    🎉 Excellent! No queries currently require administrative attention.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
