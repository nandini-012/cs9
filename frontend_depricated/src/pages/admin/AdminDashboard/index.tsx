import React, { useEffect, useState } from 'react'
import {
  Users, FileQuestion, MessageSquare, Flag,
  TrendingUp, TrendingDown, Zap, ArrowRight,
  RefreshCw, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import publicAxios from '@/api/axios'
import { Badge } from '@/components/ui'
import './AdminDashboard.css'

interface Metrics {
  users: { total: number; thisWeek: number; thisMonth: number }
  questions: { total: number; faq: number; community: number }
  answers: { total: number }
  flags: { open: number }
  sparks: { total: number }
}

interface RecentItem {
  question_id?: string
  user_id?: string
  id?: string
  title?: string
  name?: string
  email?: string
  kind?: string
  status?: string
  role?: string
  reason?: string
  description?: string
  created_at: string
  author_id?: string
}

interface DashboardData {
  metrics: Metrics
  recent: {
    questions: RecentItem[]
    users: RecentItem[]
    flags: RecentItem[]
  }
}

const METRIC_CARDS = [
  {
    key: 'users',
    label: 'Total Users',
    icon: <Users size={18} />,
    color: '#4338ca',
    bg: '#e0e7ff',
    getValue: (m: Metrics) => m.users.total.toLocaleString(),
    getTrend: (m: Metrics) => `+${m.users.thisWeek} this week`,
    trendUp: true,
  },
  {
    key: 'questions',
    label: 'Total FAQs',
    icon: <FileQuestion size={18} />,
    color: '#0f766e',
    bg: '#ccfbf1',
    getValue: (m: Metrics) => m.questions.total.toLocaleString(),
    getTrend: (m: Metrics) => `${m.questions.faq} published, ${m.questions.community} community`,
    trendUp: true,
  },
  {
    key: 'answers',
    label: 'Total Answers',
    icon: <MessageSquare size={18} />,
    color: '#b45309',
    bg: '#fef3c7',
    getValue: (m: Metrics) => m.answers.total.toLocaleString(),
    getTrend: (m: Metrics) => 'Across all questions',
    trendUp: true,
  },
  {
    key: 'flags',
    label: 'Open Flags',
    icon: <Flag size={18} />,
    color: '#dc2626',
    bg: '#fee2e2',
    getValue: (m: Metrics) => m.flags.open.toLocaleString(),
    getTrend: (m: Metrics) => m.flags.open > 0 ? 'Needs review' : 'All clear',
    trendUp: false,
    danger: (m: Metrics) => m.flags.open > 0,
  },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function avatarColor(name: string) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31
  return colors[Math.abs(hash) % colors.length]
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    published:  { bg: '#dcfce7', color: '#16a34a', label: 'Published' },
    draft:      { bg: '#fef9c3', color: '#854d0e', label: 'Draft' },
    answered:   { bg: '#dbeafe', color: '#1d4ed8', label: 'Answered' },
    unanswered: { bg: '#fee2e2', color: '#dc2626', label: 'Unanswered' },
    pending:    { bg: '#fef3c7', color: '#b45309', label: 'Pending' },
    active:     { bg: '#dcfce7', color: '#16a34a', label: 'Active' },
  }
  const s = map[status] ?? { bg: '#f1f5f9', color: '#64748b', label: status }
  return (
    <span style={{ background: s.bg, color: s.color }} className="admin-badge">
      {s.label}
    </span>
  )
}

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  const fetchDashboard = async () => {
    try {
      setError(null)
      const res = await publicAxios.get('/api/admin/dashboard')
      setData(res.data)
      setLastRefreshed(new Date())
    } catch {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])

  // Weekly chart — generate from 7 days
  const chartBars = [65, 80, 55, 90, 70, 85, 60]
  const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-loading">
            <div className="admin-spinner" />
            <p>Loading dashboard…</p>
          </div>
        </div>
      </div>
    )
  }

  const metrics = data?.metrics
  const recent = data?.recent

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
            { label: 'Dashboard', active: true },
            { label: 'Queries' },
            { label: 'FAQ Mgmt' },
            { label: 'Spark Economy' },
            { label: 'Users' },
            { label: 'Reports' },
            { label: 'Settings' },
          ].map((item) => (
            <div
              key={item.label}
              className={`admin-nav-item ${item.active ? 'active' : ''}`}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-search">
            <input type="text" placeholder="Search queries, users, FAQs…" readOnly />
          </div>
          <div className="admin-header-right">
            <button className="admin-export-btn" onClick={fetchDashboard}>
              <RefreshCw size={14} /> Refresh
            </button>
            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              Updated {lastRefreshed.toLocaleTimeString()}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">

          {error && (
            <div className="admin-error-banner">
              <AlertCircle size={14} /> {error}
              <button onClick={fetchDashboard}>Retry</button>
            </div>
          )}

          {/* Page Header */}
          <div className="admin-page-header">
            <div className="admin-page-title">
              <h1>Dashboard</h1>
              <p>Platform overview — {metrics ? `${metrics.users.total} users, ${metrics.questions.total} questions` : 'loading…'}</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="admin-metrics">
            {METRIC_CARDS.map((card) => {
              const danger = card.danger && metrics && card.danger(metrics)
              return (
                <div key={card.key} className="admin-metric-card">
                  <div className="admin-metric-header">
                    <div className="admin-metric-icon" style={{ background: card.bg, color: card.color }}>
                      {card.icon}
                    </div>
                    {metrics && (
                      <span className={`admin-metric-trend ${card.trendUp ? 'up' : 'down'}`}>
                        {card.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {card.getTrend(metrics)}
                      </span>
                    )}
                  </div>
                  <div className="admin-metric-title">{card.label}</div>
                  <div className="admin-metric-value" style={danger ? { color: '#dc2626' } : {}}>
                    {metrics ? card.getValue(metrics) : '—'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Chart + Activity */}
          <div className="admin-middle-section">
            {/* Weekly Chart */}
            <div className="admin-chart-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Weekly Activity</div>
                <div className="admin-legend">
                  <span className="admin-legend-item">
                    <span className="admin-dot" style={{ background: '#0b1528' }} />Questions
                  </span>
                  <span className="admin-legend-item">
                    <span className="admin-dot" style={{ background: '#d1d5db' }} />Resolved
                  </span>
                </div>
              </div>
              <div className="admin-chart-area">
                {chartBars.map((h, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '32px',
                      height: `${h}%`,
                      background: '#0b1528',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '20px',
                      maxHeight: '160px',
                      transition: 'height 0.3s ease',
                    }} />
                  </div>
                ))}
              </div>
              <div className="admin-chart-labels">
                {chartLabels.map((l) => <span key={l}>{l}</span>)}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="admin-chart-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Recent Flags</div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {recent?.flags.length ?? 0} open
                </span>
              </div>
              <div className="admin-timeline-list">
                {!recent?.flags.length ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0', fontSize: '13px' }}>
                    <CheckCircle size={20} style={{ margin: '0 auto 8px', display: 'block', color: '#10b981' }} />
                    No open flags — all clear!
                  </div>
                ) : (
                  recent.flags.map((flag) => (
                    <div key={flag.id} className="admin-timeline-item">
                      <div className="admin-t-avatar" style={{ background: '#f59e0b' }}>
                        <Flag size={14} />
                      </div>
                      <div className="admin-t-content">
                        <h5 style={{ textTransform: 'capitalize' }}>{flag.reason}</h5>
                        <div className="admin-t-meta">
                          <span>{flag.description?.slice(0, 40) || 'No description'}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0' }}>
                          {timeAgo(flag.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Questions */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div className="admin-table-title">Recent Questions</div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{recent?.questions.length ?? 0} recent</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {!recent?.questions.length ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No questions yet</td></tr>
                ) : (
                  recent.questions.map((q) => (
                    <tr key={q.question_id} className="admin-table-row">
                      <td className="admin-issue">{q.title ?? 'Untitled'}</td>
                      <td>
                        <span className="admin-badge" style={{
                          background: q.kind === 'faq' ? '#dcfce7' : '#dbeafe',
                          color: q.kind === 'faq' ? '#16a34a' : '#1d4ed8',
                        }}>{q.kind}</span>
                      </td>
                      <td><StatusBadge status={q.status ?? 'unanswered'} /></td>
                      <td style={{ color: '#6b7280', fontSize: '12px' }}>{timeAgo(q.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Users */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div className="admin-table-title">Recent Users</div>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{recent?.users.length ?? 0} recent</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {!recent?.users.length ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No users yet</td></tr>
                ) : (
                  recent.users.map((u) => (
                    <tr key={u.user_id} className="admin-table-row">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="admin-t-avatar" style={{
                            background: avatarColor(u.name ?? u.email ?? '?'),
                            width: '28px', height: '28px', fontSize: '11px',
                          }}>
                            {(u.name ?? '?')[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{u.name ?? 'Unknown'}</span>
                        </div>
                      </td>
                      <td style={{ color: '#374151', fontSize: '13px' }}>{u.email}</td>
                      <td>
                        <span className="admin-badge" style={{
                          background: u.role === 'ADMIN' ? '#fee2e2' : '#f1f5f9',
                          color: u.role === 'ADMIN' ? '#dc2626' : '#64748b',
                          textTransform: 'uppercase',
                        }}>{u.role}</span>
                      </td>
                      <td><StatusBadge status={u.status ?? 'active'} /></td>
                      <td style={{ color: '#6b7280', fontSize: '12px' }}>{timeAgo(u.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard