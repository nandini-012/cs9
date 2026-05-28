import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, BookOpen, ChevronDown, ExternalLink, Download, HelpCircle
} from 'lucide-react'
import './FAQPage.css'

interface FAQCategory {
  id: string
  title: string
  count: string
  icon: React.ReactNode
}

const categories: FAQCategory[] = [
  { id: 'infra', title: 'Infrastructure', count: '24 FAQs', icon: <HelpCircle size={16} /> },
  { id: 'admin', title: 'Administration', count: '18 FAQs', icon: <HelpCircle size={16} /> },
  { id: 'ethics', title: 'Ethics & Compliance', count: '12 FAQs', icon: <HelpCircle size={16} /> },
  { id: 'academics', title: 'Academics', count: '31 FAQs', icon: <HelpCircle size={16} /> },
  { id: 'finance', title: 'Finance & Reimbursement', count: '9 FAQs', icon: <HelpCircle size={16} /> },
  { id: 'facilities', title: 'Facilities', count: '15 FAQs', icon: <HelpCircle size={16} /> },
]

interface FAQItem {
  question: string
  answer: string
}

const faqItems: Record<string, FAQItem[]> = {
  infra: [
    { question: 'How do I connect to the lab Wi-Fi?', answer: 'Connect to "VLab-Secure" and use your institute credentials. For VPN access, submit a request via the IT portal.' },
    { question: 'What are the lab working hours?', answer: 'The lab is accessible 24/7 with your access card. Core working hours are 9 AM – 9 PM on weekdays.' },
  ],
  admin: [
    { question: 'How do I apply for a leave?', answer: 'Submit a leave request through the HR portal at least 3 days in advance for planned leave.' },
    { question: 'Who is my supervisor?', answer: 'Your supervisor is assigned at the time of joining. Check your offer letter or contact the academic office.' },
  ],
}

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('infra')
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const items = faqItems[activeCategory] || []

  return (
    <div className="faq-page-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-logo">Vicharanashala</div>
        <Link to="/" className="login-btn">Home</Link>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">
            <h3>FAQ Categories</h3>
            <p>Browse by topic</p>
          </div>
          <nav>
            <ul className="sidebar-nav">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`sidebar-item ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveCategory(cat.id)}
                >
                  {cat.icon}
                  {cat.title}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className="content-area">
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <section className="faq-section">
            <div className="section-header">
              <h2>{categories.find((c) => c.id === activeCategory)?.title}</h2>
              <span className="badge">{categories.find((c) => c.id === activeCategory)?.count}</span>
            </div>

            {items.length > 0 ? (
              items.map((item, idx) => (
                <div key={idx} className="faq-item">
                  <div
                    className="faq-question"
                    onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setExpandedItem(expandedItem === idx ? null : idx)}
                  >
                    {item.question}
                    <ChevronDown
                      size={16}
                      style={{
                        transform: expandedItem === idx ? 'rotate(180deg)' : 'none',
                        transition: '0.2s',
                      }}
                    />
                  </div>
                  {expandedItem === idx && (
                    <div className="faq-answer">{item.answer}</div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                No FAQs in this category yet.
              </p>
            )}
          </section>

          {/* Rosetta Card */}
          <div className="rosetta-card">
            <div className="rosetta-left">
              <h4>Can't find what you need?</h4>
              <p>Raise a query and our team will respond within 48 hours.</p>
            </div>
            <div className="rosetta-right">
              <p>Ask the team →</p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Vicharanashala</h2>
            <p>Lab Internship Hub — crowdsourced knowledge for interns, by interns.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/faq">Browse FAQs</Link></li>
                <li><Link to="/raise-query">Raise a Query</Link></li>
                <li><Link to="/track-query">Track Query</Link></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Guidelines</a></li>
                <li><a href="#">Spark Economy</a></li>
                <li><a href="#">Leaderboard</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Vicharanashala Lab. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default FAQPage