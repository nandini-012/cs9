import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen, Users, Zap, ChevronRight, MessageCircle } from 'lucide-react'
import { Navbar } from '../../../components/Navbar'
import { LoginModal } from '../../../components/LoginModal'
import './LandingPage.css'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <Search size={28} />,
    title: 'Smart Search',
    description: 'Find answers instantly across all categories — infrastructure, academics, ethics, and more.',
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Expert Answers',
    description: 'Get verified responses from experienced mentors and administrators.',
  },
  {
    icon: <Users size={28} />,
    title: 'Community-Driven',
    description: 'Vote, comment, and build on collective knowledge.',
  },
  {
    icon: <Zap size={28} />,
    title: 'Earn Sparks',
    description: 'Contribute quality answers and climb the leaderboard.',
  },
]

export const LandingPage: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleLoginOpen = () => setIsLoginOpen(true)
  const handleLoginClose = () => setIsLoginOpen(false)

  const handleLogin = (userData: unknown) => {
    console.log('Logged in:', userData)
    setIsLoginOpen(false)
    // role-based redirect would go here
  }

  return (
    <div className="landing-container">
      <Navbar
        onOpenLogin={handleLoginOpen}
        isAuthenticated={false}
        onLogout={() => {}}
      />

      <main>
        {/* Hero */}
        <section className="hero-section text-center">
          <h1 className="hero-title">
            Your Questions, <span className="text-gradient">Answered</span>
          </h1>
          <p className="hero-subtitle">
            Crowdsourced FAQ for Vicharanashala Lab interns. Ask anything, discover answers, earn sparks.
          </p>
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/faq" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Browse FAQs
            </Link>
            <Link to="/faq" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <MessageCircle size={18} style={{ marginRight: '8px' }} />
              Ask a Question
            </Link>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ marginBottom: '16px', color: '#a07d50' }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', marginTop: '80px', padding: '0 24px' }}>
          <h2 style={{ fontFamily: 'var(--serif-font)', fontSize: '28px', marginBottom: '16px' }}>
            Ready to get involved?
          </h2>
          <Link
            to="/faq"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#a07d50',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Explore the FAQ <ChevronRight size={18} />
          </Link>
        </section>
      </main>

      {isLoginOpen && (
        <LoginModal
          onClose={handleLoginClose}
          onLogin={handleLogin}
        />
      )}
    </div>
  )
}

export default LandingPage