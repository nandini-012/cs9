import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import LoginModal from '@/components/LoginModal'
import {
  Search, X, Info, Wallet, ShieldCheck, DoorOpen,
  Users, ClipboardList, FileText, GraduationCap,
  BookOpen, LockKeyhole, ChevronRight
} from 'lucide-react'
import './LandingPage.css'

const categoriesList = [
  { index: 1, label: 'Internship Info', icon: Info, colorClass: 'info' },
  { index: 2, label: 'Stipend & Benefits', icon: Wallet, colorClass: 'stipend' },
  { index: 3, label: 'NOC Requirements', icon: ShieldCheck, colorClass: 'noc' },
  { index: 4, label: 'Lab Access', icon: DoorOpen, colorClass: 'lab' },
  { index: 5, label: 'Work Culture', icon: Users, colorClass: 'work' },
  { index: 6, label: 'Project Allocation', icon: ClipboardList, colorClass: 'project' },
  { index: 7, label: 'Final Report', icon: FileText, colorClass: 'report' },
  { index: 8, label: 'Academic Credits', icon: GraduationCap, colorClass: 'academic' },
]

const LandingPage = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCloseLogin = () => setIsLoginOpen(false)

  return (
    <div className="landing-wrapper">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      <div className="landing-container">
        <div className="container">

          {/* Hero */}
          <div className="faq-hero glass-panel">
            <div className="faq-hero-copy">
              <span className="hero-kicker">
                <span className="kicker-dot" />
                Vicharanashala Lab Internship Program
              </span>
              <h1>
                Find answers to all your<br />
                <span className="text-gradient">internship questions</span>
              </h1>
              <p>
                Everything you need to know about the IIT Ropar summer internship —
                from selection and NOC to lab access and final reports.
              </p>
              <div className="hero-stats">
                <span><strong>8</strong> categories</span>
                <span><strong>50+</strong> questions answered</span>
                <span><strong>Updated</strong> every season</span>
              </div>
            </div>
          </div>

          {/* Search card */}
          <div className="faq-search-card glass-card">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., 'stipend', 'selection', 'NOC')..."
                aria-label="Search FAQ"
              />
              {searchQuery && (
                <button
                  className="btn-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="faq-control-actions-row">
              <button className="faq-control-btn expand-btn">
                <BookOpen size={14} />
                Expand all
              </button>
              <button className="faq-control-btn collapse-btn">
                <LockKeyhole size={14} />
                Collapse all
              </button>
            </div>
          </div>

          {/* Quick category grid */}
          <div className="faq-quick-categories-grid">
            {categoriesList.map((cat) => {
              const IconComp = cat.icon
              return (
                <button key={cat.index} className="faq-quick-cat-btn">
                  <span className={`faq-quick-cat-icon-wrap ${cat.colorClass}`}>
                    <IconComp size={16} />
                  </span>
                  <span className="faq-quick-cat-label">{cat.label}</span>
                  <ChevronRight size={14} className="cat-arrow" />
                </button>
              )
            })}
          </div>

          {/* FAQ sections */}
          {categoriesList.map((cat) => {
            const IconComp = cat.icon
            return (
              <section key={cat.index} className="faq-section-block">
                <h2 className="faq-section-title">
                  {cat.index}. {cat.label}
                  {cat.index === 3 && (
                    <span className="noc-mandatory-badge">Mandatory</span>
                  )}
                </h2>

                {/* NOC info card */}
                {cat.index === 3 && (
                  <div className="noc-info-card">
                    <p className="noc-info-text">
                      A No Objection Certificate from your parent institution is{' '}
                      <strong>mandatory</strong> for all selected interns before commencing work.
                    </p>
                    <div className="faq-accordions-list">
                      <div className="faq-accordion">
                        <div className="faq-accordion-question">
                          <span className="faq-q-num">3.1</span>
                          <span>When should I submit the NOC?</span>
                        </div>
                        <div className="faq-accordion-answer">
                          The NOC must be submitted within 7 days of receiving your selection offer,
                          before your internship start date.
                        </div>
                      </div>
                      <div className="faq-accordion">
                        <div className="faq-accordion-question">
                          <span className="faq-q-num">3.2</span>
                          <span>What should the NOC include?</span>
                        </div>
                        <div className="faq-accordion-answer">
                          The NOC must be on official letterhead, signed by the Head of Department,
                          confirming no objection to your internship at IIT Ropar.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {cat.index === 7 && (
                  <div className="rosetta-split-card">
                    <div className="rosetta-card-left">
                      <div className="rosetta-left-content">
                        <h4>Rosetta Project</h4>
                        <p>Document your weekly learnings in our internal research publication.</p>
                      </div>
                    </div>
                    <div className="rosetta-card-right">
                      <p>
                        The Rosetta Journal is a peer-reviewed internal publication where interns
                        document their weekly learnings and breakthroughs throughout the tenure.
                      </p>
                    </div>
                  </div>
                )}

                <div className="faq-accordions-list">
                  <div className="faq-accordion">
                    <div className="faq-accordion-question">
                      <span className="faq-q-num">{cat.index}.1</span>
                      <span>Sample question for {cat.label}</span>
                    </div>
                    <div className="faq-accordion-answer">
                      This is a placeholder answer. Connect to the backend API to populate real FAQ data
                      for this category.
                    </div>
                  </div>
                </div>
              </section>
            )
          })}

        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} />
    </div>
  )
}

export default LandingPage