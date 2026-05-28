import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Search, Bell, ChevronDown, ArrowUp, MessageCircle,
  Bookmark, HelpCircle, TrendingUp, Clock
} from 'lucide-react'
import './StudentDashboard.css'

interface QueryCard {
  id: string
  title: string
  excerpt: string
  category: string
  votes: number
  answers: number
  status: string
  time: string
}

const mockQueries: QueryCard[] = [
  {
    id: 'QC-2026-0039',
    title: 'What is the process for extending internship by 2 months?',
    excerpt: 'I need to extend my internship period due to ongoing research work. What documents do I need and who should I contact?',
    category: 'Academics',
    votes: 24,
    answers: 3,
    status: 'Resolved',
    time: '2 hours ago',
  },
  {
    id: 'QC-2026-0038',
    title: 'Lab access card not working after hours',
    excerpt: 'My access card works during the day but doesn\'t grant entry after 7 PM. Is there a separate permission needed?',
    category: 'Infrastructure',
    votes: 18,
    answers: 5,
    status: 'In Progress',
    time: '1 day ago',
  },
  {
    id: 'QC-2026-0037',
    title: 'Claiming reimbursement for conference travel',
    excerpt: 'I attended a conference in Bangalore. What is the reimbursement process and how long does it take?',
    category: 'Finance',
    votes: 15,
    answers: 2,
    status: 'Resolved',
    time: '3 days ago',
  },
]

const faqWidgets = [
  { num: '01', title: 'How do I apply for a extension?', cat: 'Academics' },
  { num: '02', title: 'Wi-Fi connectivity issues?', cat: 'Infrastructure' },
  { num: '03', title: 'Finance reimbursement process?', cat: 'Finance' },
]

const timelineItems = [
  { dot: '', text: 'Your query QC-2026-0039 was marked as Resolved', time: '2h ago' },
  { dot: 'red', text: 'New comment on Lab access card issue', time: '1d ago' },
  { dot: '', text: 'Your query was assigned to Infrastructure team', time: '2d ago' },
]

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('my-queries')
  const [showDropdown, setShowDropdown] = useState(false)

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
              { icon: <HelpCircle size={18} />, label: 'Browse FAQs', active: false },
              { icon: <Bookmark size={18} />, label: 'Saved', active: false },
              { icon: <TrendingUp size={18} />, label: 'Leaderboard', active: false },
            ].map((item, i) => (
              <li
                key={i}
                className={`dash-nav-item-v2 ${item.active ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="dash-main-v2">
        {/* Header */}
        <header className="dash-header-v2">
          <div className="dash-search-v2">
            <Search size={16} />
            <input type="text" placeholder="Search queries, FAQs..." />
          </div>
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
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gradient)' }} />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Amit Sharma</span>
              <ChevronDown size={14} />
            </div>
            {showDropdown && (
              <div className="logout-dropdown">
                <Link to="/profile" style={{ padding: '10px 24px', fontSize: '13px', color: '#111827', textDecoration: 'none' }}>Profile Settings</Link>
                <button className="logout-btn" style={{ border: '1px solid #0b1528', background: 'transparent', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <Link to="/" style={{ textDecoration: 'none', color: '#0b1528', fontSize: '13px' }}>Logout</Link>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="dash-content-v2">
          {/* Main Column */}
          <div className="dash-col-main">
            <div className="dash-tabs">
              <div className="tabs-left">
                {['My Queries', 'Saved', 'Following'].map((tab) => (
                  <span
                    key={tab}
                    className={`tab-v2 ${activeTab === tab.toLowerCase().replace(' ', '-') ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <div className="tabs-right">
                <button className="filter-btn">All Categories</button>
                <Link
                  to="/raise-query"
                  style={{
                    background: '#0b1528',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '12px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  + New Query
                </Link>
              </div>
            </div>

            {/* Query List */}
            <div>
              {mockQueries.map((q) => (
                <div key={q.id} className="query-card">
                  <div className="upvote-box">
                    <ArrowUp size={18} />
                    {q.votes}
                  </div>
                  <div className="query-content">
                    <div className="query-header">
                      <div className="query-tags">
                        <span className="q-tag">{q.category}</span>
                        <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>{q.id}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>{q.time}</span>
                    </div>
                    <h3 className="query-title">{q.title}</h3>
                    <p className="query-desc">{q.excerpt}</p>
                    <div className="query-footer">
                      <span className="q-footer-item">
                        <MessageCircle size={14} /> {q.answers} answers
                      </span>
                      <span
                        className="q-footer-item"
                        style={{
                          color: q.status === 'Resolved' ? '#16a34a' : '#d97706',
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      >
                        {q.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Column */}
          <div className="dash-col-side">
            {/* FAQ Widget */}
            <div className="widget">
              <div className="widget-title">
                <div className="w-icon">?</div>
                Top FAQs
              </div>
              <ul className="w-faq-list">
                {faqWidgets.map((f) => (
                  <li key={f.num} className="w-faq-item">
                    <span className="w-faq-num">{f.num}</span>
                    <div className="w-faq-text">
                      <h5>{f.title}</h5>
                      <p>{f.cat}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/faq" className="w-btn">View All FAQs</Link>
            </div>

            {/* Activity Timeline */}
            <div className="widget">
              <div className="widget-title">
                <div className="w-icon">◉</div>
                Recent Activity
              </div>
              <div className="timeline">
                {timelineItems.map((item, i) => (
                  <div key={i} className="t-item">
                    <div className={`t-dot ${item.dot}`} />
                    <div>
                      <h5>{item.text}</h5>
                      <p>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="copy-footer">© 2026 Vicharanashala Lab · All rights reserved</p>
      </div>
    </div>
  )
}

export default StudentDashboard