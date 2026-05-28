import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import LoginModal from '@/components/LoginModal'
import Accordion from '@/components/Accordion'
import publicAxios from '@/api/axios'
import {
  Search, X, Info, Wallet, ShieldCheck, DoorOpen,
  Users, ClipboardList, FileText, GraduationCap,
  BookOpen, LockKeyhole, ChevronRight, Loader2
} from 'lucide-react'
import './LandingPage.css'

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

interface FaqGroup {
  [category: string]: FaqItem[]
}

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; colorClass: string }> = {
  internship: { label: 'Internship Info', icon: Info, colorClass: 'info' },
  stipend: { label: 'Stipend & Benefits', icon: Wallet, colorClass: 'stipend' },
  noc: { label: 'NOC Requirements', icon: ShieldCheck, colorClass: 'noc' },
  lab: { label: 'Lab Access', icon: DoorOpen, colorClass: 'lab' },
  culture: { label: 'Work Culture', icon: Users, colorClass: 'work' },
  project: { label: 'Project Allocation', icon: ClipboardList, colorClass: 'project' },
  report: { label: 'Final Report', icon: FileText, colorClass: 'report' },
  academic: { label: 'Academic Credits', icon: GraduationCap, colorClass: 'academic' },
}

const FALLBACK_CATEGORIES = [
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
  const [faqGroups, setFaqGroups] = useState<FaqGroup>({})
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch FAQs from public endpoint
  useEffect(() => {
    publicAxios.get('/api/faqs')
      .then(res => {
        setFaqGroups(res.data.faqs || {})
        setLoading(false)
      })
      .catch(() => {
        // Fallback: try /api/questions with no auth (will fail gracefully)
        setError('Could not load FAQs. Showing sample content.')
        setLoading(false)
      })
  }, [])

  // Derive active categories from loaded FAQ groups, fallback to static list
  const activeCategories = Object.keys(faqGroups).length > 0
    ? Object.keys(faqGroups).map((cat, i) => ({
        index: i + 1,
        key: cat,
        label: CATEGORY_META[cat]?.label || cat.charAt(0).toUpperCase() + cat.slice(1),
        icon: CATEGORY_META[cat]?.icon || Info,
        colorClass: CATEGORY_META[cat]?.colorClass || 'info',
      }))
    : FALLBACK_CATEGORIES.map((c, i) => ({ ...c, key: Object.keys(CATEGORY_META)[i] || c.label.toLowerCase().replace(/\s+/g, '') }))

  // Filter FAQ items by search query
  const getFilteredGroups = useCallback(() => {
    if (!searchQuery.trim()) return faqGroups
    const q = searchQuery.toLowerCase()
    const filtered: FaqGroup = {}
    for (const [cat, items] of Object.entries(faqGroups)) {
      const matches = items.filter(faq =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.replace(/<[^>]*>/g, '').toLowerCase().includes(q) ||
        faq.tags.some(tag => tag.toLowerCase().includes(q))
      )
      if (matches.length > 0) filtered[cat] = matches
    }
    return filtered
  }, [faqGroups, searchQuery])

  const filteredGroups = getFilteredGroups()

  // Toggle single FAQ
  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Expand all
  const expandAll = () => {
    const allIds = Object.values(faqGroups).flatMap(items => items.map(f => f.id))
    setOpenFaqIds(new Set(allIds))
  }

  // Collapse all
  const collapseAll = () => setOpenFaqIds(new Set())

  const handleCloseLogin = () => setIsLoginOpen(false)

  const totalFaqs = Object.values(faqGroups).reduce((sum, items) => sum + items.length, 0)

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
                <span><strong>{Object.keys(faqGroups).length || 8}</strong> categories</span>
                <span><strong>{totalFaqs || '50+'}</strong> questions answered</span>
                <span><strong>Updated</strong> every season</span>
              </div>
            </div>
          </div>

          {/* Search + controls */}
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
                <button className="btn-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="faq-control-actions-row">
              <button
                className="faq-control-btn expand-btn"
                onClick={expandAll}
                disabled={totalFaqs === 0}
                aria-label="Expand all FAQ items"
              >
                <BookOpen size={14} />
                Expand all
              </button>
              <button
                className="faq-control-btn collapse-btn"
                onClick={collapseAll}
                disabled={openFaqIds.size === 0}
                aria-label="Collapse all FAQ items"
              >
                <LockKeyhole size={14} />
                Collapse all
              </button>
            </div>
          </div>

          {/* Quick category grid */}
          <div className="faq-quick-categories-grid">
            {activeCategories.map((cat) => {
              const IconComp = cat.icon
              const count = faqGroups[cat.key]?.length || 0
              return (
                <button key={cat.key || cat.index} className="faq-quick-cat-btn">
                  <span className={`faq-quick-cat-icon-wrap ${cat.colorClass}`}>
                    <IconComp size={16} />
                  </span>
                  <span className="faq-quick-cat-label">{cat.label}</span>
                  {count > 0 && <span className="faq-cat-count">{count}</span>}
                  <ChevronRight size={14} className="cat-arrow" />
                </button>
              )
            })}
          </div>

          {/* FAQ sections — live data */}
          {loading ? (
            <div className="faq-loading-state">
              <Loader2 size={28} className="animate-spin" />
              <span>Loading FAQs…</span>
            </div>
          ) : error ? (
            <div className="faq-error-state">
              <p>{error}</p>
            </div>
          ) : (
            Object.entries(filteredGroups).map(([catKey, faqs]) => {
              const meta = CATEGORY_META[catKey]
              const catLabel = meta?.label || catKey.charAt(0).toUpperCase() + catKey.slice(1)
              const catIndex = activeCategories.findIndex(c => c.key === catKey) + 1

              return (
                <section key={catKey} className="faq-section-block">
                  <h2 className="faq-section-title">
                    {catIndex}. {catLabel}
                    {catKey === 'noc' && (
                      <span className="noc-mandatory-badge">Mandatory</span>
                    )}
                  </h2>

                  {/* NOC info card */}
                  {catKey === 'noc' && (
                    <div className="noc-info-card">
                      <p className="noc-info-text">
                        A No Objection Certificate from your parent institution is{' '}
                        <strong>mandatory</strong> for all selected interns before commencing work.
                      </p>
                      <div className="faq-accordions-list">
                        {faqs.map((faq, i) => (
                          <Accordion
                            key={faq.id}
                            faq={faq}
                            isOpen={openFaqIds.has(faq.id)}
                            onToggle={() => toggleFaq(faq.id)}
                            searchQuery={searchQuery}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rosetta card for report section */}
                  {catKey === 'report' && (
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
                    {faqs.length > 0 ? (
                      faqs.map((faq) => (
                        <Accordion
                          key={faq.id}
                          faq={faq}
                          isOpen={openFaqIds.has(faq.id)}
                          onToggle={() => toggleFaq(faq.id)}
                          searchQuery={searchQuery}
                        />
                      ))
                    ) : (
                      <p className="faq-empty-category">
                        No FAQs in this category yet. Check back soon!
                      </p>
                    )}
                  </div>
                </section>
              )
            })
          )}

          {/* Fallback static sections if no live data */}
          {!loading && Object.keys(faqGroups).length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
              No FAQs published yet. Run the seed script or publish FAQs from the admin panel.
            </p>
          )}

        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} />
    </div>
  )
}

export default LandingPage