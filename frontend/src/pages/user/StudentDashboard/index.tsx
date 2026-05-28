import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Search, Bell, ChevronDown, ArrowUp,
  MessageCircle, Bookmark, HelpCircle, TrendingUp, LogOut,
  Loader
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import publicAxios from '@/api/axios'
import './StudentDashboard.css'

interface Question {
  question_id: string
  title: string
  body: string
  body_plain?: string
  kind: string
  status: string
  category: string
  upvotes: number
  answer_count: number
  view_count: number
  created_at: string
  author_id: string
}

interface FAQ {
  id: string
  question: string
  category: string
}

interface TimelineEvent {
  id: string
  text: string
  time: string
  dot: 'default' | 'red' | 'green' | 'amber'
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function avatarColor(name: string): string {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31
  return colors[Math.abs(hash) % colors.length]
}

function statusBadge(status: string) {
  const map: Record<string, { cls: string; label: string }> = {
    published:  { cls: 'q-badge published',  label: 'Published' },
    draft:      { cls: 'q-badge draft',      label: 'Draft' },
    answered:   { cls: 'q-badge answered',   label: 'Answered' },
    unresolved: { cls: 'q-badge unanswered', label: 'Unanswered' },
    unanswered: { cls: 'q-badge unanswered', label: 'Unanswered' },
    removed:    { cls: 'q-badge default',    label: 'Removed' },
  }
  const s = map[status] ?? { cls: 'q-badge default', label: status }
  return <span className={s.cls}>{s.label}</span>
}

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('my-queries')
  const [showDropdown, setShowDropdown] = useState(false)
  const [search, setSearch] = useState('')
  const [loadingQueries, setLoadingQueries] = useState(true)
  const [queries, setQueries] = useState<Question[]>([])
  const [topFaqs, setTopFaqs] = useState<FAQ[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [error, setError] = useState<string | null>(null)

  const userName = user?.name ?? 'Student'
  const initials = userName.slice(0, 2).toUpperCase()

  const fetchQueries = useCallback(async () => {
    setLoadingQueries(true)
    setError(null)
    try {
      const params = new URLSearchParams({ my: '1', limit: '20' })
      if (search) params.set('search', search)
      const res = await publicAxios.get(`/api/questions?${params}`)
      setQueries(res.data.questions ?? [])
    } catch {
      setError('Failed to load your queries')
    } finally {
      setLoadingQueries(false)
    }
  }, [search])

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await publicAxios.get('/api/faqs')
      const cats = res.data.faqs as Record<string, FAQ[]>
      const first = Object.values(cats)[0] ?? []
      setTopFaqs(first.slice(0, 3))
    } catch {
      // non-critical
    }
  }, [])

  useEffect(() => {
    fetchQueries()
    fetchFaqs()
  }, [fetchQueries, fetchFaqs])

  // Build timeline from query data
  useEffect(() => {
    if (!queries.length) { setTimeline([]); return }
    const events: TimelineEvent[] = queries.slice(0, 4).map((q) => ({
      id: q.question_id,
      text: q.title,
      time: timeAgo(q.created_at),
      dot: q.status === 'published' ? 'green'
        : q.status === 'answered' ? 'default'
        : 'amber',
    }))
    setTimeline(events)
  }, [queries])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchQueries()
  }

  const excerpt = (text: string, max = 120) =>
    text.length > max ? text.slice(0, max) + '…' : text

  return (
    <div className="dash-wrapper-v2">
      {/* Sidebar */}
      <aside className="dash-sidebar-v2">
        <div className="dash-logo-v2">
          <h2>Vicharanashala</h2>
          <p>LAB INTERNSHIP HUB</p>
        </div>
        <nav>
          <ul className="dash-nav-v2">
            {[
              { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: true },
              { icon: <HelpCircle size={18} />, label: 'Browse FAQs', active: false, href: '/faq' },
              { icon: <Bookmark size={18} />, label: 'Saved', active: false },
              { icon: <TrendingUp size={18} />, label: 'Leaderboard', active: false },
              { icon: <MessageCircle size={18} />, label: 'Raise Query', active: false, href: '/raise-query' },
            ].map((item) => (
              <li
                key={item.label}
                className={`dash-nav-item-v2 ${item.active ? 'active' : ''}`}
              >
                {item.icon}
                <Link
                  to={item.href ?? '#'}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="dash-main-v2">
        {/* Header */}
        <header className="dash-header-v2">
          <form onSubmit={handleSearch} className="dash-search-v2">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search your queries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="dash-header-right-v2">
            <button className="action-btn-v2">
              <Bell size={16} />
              Notifications
            </button>
            <div
              className="user-profile-v2"
              onClick={() => setShowDropdown(!showDropdown)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowDropdown(!showDropdown)}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: avatarColor(userName), display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '12px', fontWeight: 700,
              }}>
                {initials}
              </div>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>{userName}</span>
              <ChevronDown size={14} />
            </div>
            {showDropdown && (
              <div className="logout-dropdown">
                <Link
                  to="/profile"
                  style={{ padding: '10px 24px', fontSize: '13px', color: '#111827', textDecoration: 'none' }}
                  onClick={() => setShowDropdown(false)}
                >
                  Profile Settings
                </Link>
                <button
                  className="logout-btn"
                  style={{
                    border: 'none', background: 'transparent',
                    padding: '10px 24px', cursor: 'pointer', fontWeight: 600,
                    textAlign: 'left', width: '100%', fontSize: '13px',
                    color: '#dc2626',
                  }}
                  onClick={handleLogout}
                >
                  <LogOut size={13} style={{ marginRight: '8px', display: 'inline' }} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="dash-content-v2">
          {/* Main Column */}
          <div className="dash-col-main">
            {/* Tabs */}
            <div className="dash-tabs">
              <div className="tabs-left">
                {['My Queries', 'Saved', 'Following'].map((tab) => (
                  <span
                    key={tab}
                    className={`tab-v2 ${activeTab === tab.toLowerCase().replace(/ /g, '-') ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, '-'))}
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <div className="tabs-right">
                <button className="filter-btn" onClick={() => { setSearch(''); fetchQueries() }}>
                  Clear filter
                </button>
                <Link
                  to="/raise-query"
                  style={{
                    background: '#0b1528', color: '#fff', border: 'none',
                    padding: '8px 16px', borderRadius: '6px', fontWeight: 600,
                    fontSize: '12px', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  + New Query
                </Link>
              </div>
            </div>

            {/* Loading */}
            {loadingQueries && (
              <div className="dash-loading">
                <div className="dash-spinner" />
                <p>Loading your queries…</p>
              </div>
            )}

            {/* Error */}
            {!loadingQueries && error && (
              <div style={{
                padding: '16px 20px', background: '#fee2e2', border: '1px solid #fecaca',
                borderRadius: '8px', color: '#dc2626', fontSize: '13px', marginBottom: '16px',
              }}>
                {error} <button onClick={fetchQueries} style={{ marginLeft: '12px', textDecoration: 'underline', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
              </div>
            )}

            {/* Empty state */}
            {!loadingQueries && !error && queries.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
                <HelpCircle size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>No queries yet</p>
                <p style={{ fontSize: '13px', marginBottom: '20px' }}>Raise your first query and get answers from the community</p>
                <Link to="/raise-query" style={{
                  background: '#0b1528', color: '#fff',
                  padding: '10px 20px', borderRadius: '6px',
                  textDecoration: 'none', fontWeight: 600, fontSize: '13px',
                }}>
                  Raise a Query
                </Link>
              </div>
            )}

            {/* Query List */}
            {!loadingQueries && queries.map((q) => (
              <div key={q.question_id} className="query-card">
                <div className="upvote-box">
                  <ArrowUp size={18} />
                  {q.upvotes}
                </div>
                <div className="query-content">
                  <div className="query-header">
                    <div className="query-tags">
                      {q.kind === 'faq' ? (
                        <span className="q-tag light">FAQ</span>
                      ) : (
                        <span className="q-tag">{q.category || 'General'}</span>
                      )}
                      <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>
                        QC-{q.question_id.split('-')[0]?.toUpperCase() ?? q.question_id.slice(0, 8)}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>
                      {timeAgo(q.created_at)}
                    </span>
                  </div>
                  <Link to={`/query/${q.question_id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="query-title">{q.title}</h3>
                  </Link>
                  <p className="query-desc">{excerpt(q.body_plain ?? q.body)}</p>
                  <div className="query-footer">
                    <span className="q-footer-item">
                      <MessageCircle size={14} /> {q.answer_count} {q.answer_count === 1 ? 'answer' : 'answers'}
                    </span>
                    <span className="q-footer-item">
                      <TrendingUp size={14} /> {q.view_count} views
                    </span>
                    {statusBadge(q.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Side Column */}
          <div className="dash-col-side">
            {/* FAQ Widget */}
            <div className="widget">
              <div className="widget-title">
                <div className="w-icon">?</div>
                Top FAQs
              </div>
              {topFaqs.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>No FAQs yet</p>
              ) : (
                <ul className="w-faq-list">
                  {topFaqs.map((f, i) => (
                    <li key={f.id ?? i} className="w-faq-item">
                      <span className="w-faq-num">0{i + 1}</span>
                      <div className="w-faq-text">
                        <h5>{excerpt(f.question, 60)}</h5>
                        <p>{f.category}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/faq" className="w-btn">View All FAQs</Link>
            </div>

            {/* Activity Timeline */}
            <div className="widget">
              <div className="widget-title">
                <div className="w-icon">◉</div>
                Recent Activity
              </div>
              {timeline.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>No recent activity</p>
              ) : (
                <div className="timeline">
                  {timeline.map((item) => (
                    <div key={item.id} className="t-item">
                      <div className={`t-dot ${item.dot === 'default' ? '' : item.dot}`} />
                      <div>
                        <h5>{excerpt(item.text, 50)}</h5>
                        <p>{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="copy-footer">© 2026 Vicharanashala Lab · All rights reserved</p>
      </div>
    </div>
  )
}

export default StudentDashboard