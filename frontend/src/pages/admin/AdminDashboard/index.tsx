import React from 'react'
import { Search, Download, Bell, TrendingUp, TrendingDown } from 'lucide-react'
import './AdminDashboard.css'

const metrics = [
  { title: 'Total Queries', value: '1,284', trend: '+12%', up: true, icon: '?' },
  { title: 'Resolved Today', value: '24', trend: '+5', up: true, icon: '✓' },
  { title: 'Pending Review', value: '18', trend: '-3', up: true, icon: '◉' },
  { title: 'Active Users', value: '342', trend: '+8%', up: true, icon: '◀' },
]

const chartBars = [65, 80, 55, 90, 70, 85, 60]
const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const recentActivity = [
  { avatar: '#10b981', name: 'Rahul V.', meta: 'Resolved · 5m ago', detail: 'Query QC-2026-0038 marked as resolved' },
  { avatar: '#3b82f6', name: 'Priya M.', meta: 'Commented · 12m ago', detail: 'Left a comment on Lab access query' },
  { avatar: '#f59e0b', name: 'Admin', meta: 'Promoted · 1h ago', detail: 'Promoted 2 FAQs to official knowledge base' },
]

const topIssues = [
  { id: 'QC-2026-0041', issue: 'Wi-Fi connectivity in lab wing B', category: 'IT', priority: 'High', resolver: 'Network Team' },
  { id: 'QC-2026-0040', issue: 'Reimbursement form not available online', category: 'Finance', priority: 'Medium', resolver: 'Accounts' },
  { id: 'QC-2026-0039', issue: 'Lab access after working hours', category: 'Facilities', priority: 'Medium', resolver: 'Admin' },
  { id: 'QC-2026-0038', issue: 'Missing scholarship disbursement', category: 'Finance', priority: 'High', resolver: 'Finance Head' },
]

export const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Vicharanashala</h2>
          <p>ADMIN PANEL</p>
        </div>
        <nav className="admin-nav">
          {[
            'Dashboard', 'Queries', 'FAQ Mgmt', 'Spark Economy', 'Users', 'Reports', 'Settings'
          ].map((item, i) => (
            <div
              key={item}
              className={`admin-nav-item ${i === 0 ? 'active' : ''}`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-search">
            <Search size={16} />
            <input type="text" placeholder="Search queries, users, FAQs..." />
          </div>
          <div className="admin-header-right">
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              <Download size={14} /> Export
            </button>
            <div className="admin-profile">
              <div className="admin-profile-info">
                <h4>Admin User</h4>
                <p>Super Admin</p>
              </div>
              <div className="admin-avatar">A</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {/* Page Header */}
          <div className="admin-page-header">
            <div className="admin-page-title">
              <h1>Dashboard</h1>
              <p>Overview of all platform activity</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="admin-metrics">
            {metrics.map((m) => (
              <div key={m.title} className="admin-metric-card">
                <div className="admin-metric-header">
                  <div className="admin-metric-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
                    {m.icon}
                  </div>
                  <span className={`admin-metric-trend ${m.up ? 'up' : 'down'}`}>
                    {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {m.trend}
                  </span>
                </div>
                <div className="admin-metric-title">{m.title}</div>
                <div className="admin-metric-value">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Chart + Activity */}
          <div className="admin-middle-section">
            {/* Chart Card */}
            <div className="admin-chart-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Weekly Query Volume</div>
                <div className="admin-legend">
                  <span className="admin-legend-item">
                    <span className="admin-dot" style={{ background: '#0b1528' }} />
                    Queries
                  </span>
                  <span className="admin-legend-item">
                    <span className="admin-dot" style={{ background: '#d1d5db' }} />
                    Resolved
                  </span>
                </div>
              </div>
              <div className="admin-chart-area">
                {chartBars.map((h, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '32px', height: `${h}%`, background: '#0b1528', borderRadius: '4px 4px 0 0', minHeight: '20px', maxHeight: '160px' }} />
                  </div>
                ))}
              </div>
              <div className="admin-chart-labels">
                {chartLabels.map((l) => <span key={l}>{l}</span>)}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="admin-chart-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Recent Activity</div>
              </div>
              <div className="admin-timeline-list">
                {recentActivity.map((a, i) => (
                  <div key={i} className="admin-timeline-item">
                    <div className="admin-t-avatar" style={{ background: a.avatar }}>
                      {a.name[0]}
                    </div>
                    <div className="admin-t-content">
                      <h5>{a.name}</h5>
                      <div className="admin-t-meta">
                        <span>{a.meta}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0' }}>{a.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-t-view-all">View All →</div>
            </div>
          </div>

          {/* Top Issues Table */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div className="admin-table-title">Top Open Issues</div>
              <div className="admin-table-subtitle">
                <span style={{ fontSize: '12px', color: '#6b7280' }}>4 issues</span>
              </div>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Query ID</th>
                  <th>Issue</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {topIssues.map((row) => (
                  <tr key={row.id} className="admin-table-row">
                    <td><span className="admin-id">{row.id}</span></td>
                    <td className="admin-issue">{row.issue}</td>
                    <td>
                      <span className={`admin-badge ${row.category.toLowerCase()}`}>
                        {row.category}
                      </span>
                    </td>
                    <td>
                      <span className="admin-priority" style={{ color: row.priority === 'High' ? '#ef4444' : '#d97706' }}>
                        {row.priority === 'High' ? '● ' : '○ '}
                        {row.priority}
                      </span>
                    </td>
                    <td className="admin-resolver">{row.resolver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="admin-table-footer">View All Issues →</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard