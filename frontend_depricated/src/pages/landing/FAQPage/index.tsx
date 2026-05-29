import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Globe, BookOpen } from 'lucide-react';
import Accordion from '../../../components/Accordion';
import Navbar from '../../../components/Navbar';
import FloatingChat from '../../../components/FloatingChat';
import { useAuth } from '../../../context/AuthContext';
import './FAQPage.css';

interface FaqSection {
  id: string;
  title: string;
  isNoc?: boolean;
  items: Array<{ id: string; question: string; answer: string }>;
}

const STATIC_SECTIONS: FaqSection[] = [
  {
    id: 'about',
    title: '📋 About ViBe',
    items: [
      {
        id: 'about-1',
        question: 'What is ViBe (Vicharanashala)?',
        answer: `<p>ViBe — short for <strong>Vicharanashala</strong> — is the student internship portal of <strong>IIT Ropar's Hewlett-Packard (HP) Center for Embedded Systems and VLSI Technology (CREST)</strong>. It serves as the central hub for managing the annual undergraduate summer internship program.</p><p>Through ViBe, students can browse and apply for internship opportunities, track their application status, receive updates about selection results, and coordinate essential documentation like NOCs (No-Objection Certificates).</p>`
      },
      {
        id: 'about-2',
        question: 'Who is eligible to apply?',
        answer: `<p>All current undergraduate students (2nd, 3rd, and 4th year BTech) at <strong>IIT Ropar</strong> who meet the specific eligibility criteria for each project are eligible to apply.</p><hr/><p><strong>Important Note:</strong> Students must have their NOC (No-Objection Certificate) approved by the institute before joining. Details about the NOC process are covered in the next section.</p>`
      },
      {
        id: 'about-3',
        question: 'How does the application process work?',
        answer: `<p>1. <strong>Browse Projects</strong> — Explore the available summer internship projects on ViBe.<br/>2. <strong>Submit Application</strong> — Apply through ViBe before the deadline for each project.<br/>3. <strong>Interview/Shortlisting</strong> — Faculty mentors review applications and may conduct interviews.<br/>4. <strong>Selection Result</strong> — Results are announced on ViBe under the "My Queries" section.<br/>5. <strong>NOC Processing</strong> — After selection, coordinate with your institute for NOC approval.<br/>6. <strong>Joining</strong> — Join the lab/project at IIT Ropar as per the decided start date.</p>`
      }
    ]
  },
  {
    id: 'noc',
    title: '🏛️ NOC Process',
    isNoc: true,
    items: [
      {
        id: 'noc-1',
        question: 'What is an NOC and why do I need it?',
        answer: `<p>An <strong>NOC (No-Objection Certificate)</strong> is an official letter issued by your institute (IIT Ropar) stating that the institute has no objection to you interning at the CREST Lab during your summer break.</p><p>It is a <strong>mandatory requirement</strong> before joining as a summer intern, as it establishes an official relationship between you and the host institute.</p>`
      },
      {
        id: 'noc-2',
        question: 'How do I apply for an NOC?',
        answer: `<p>The NOC process is handled through the academic section of IIT Ropar. You will typically need:</p><ul><li>A duly filled NOC application form</li><li>Approval from your department/warden</li><li>Details of the host institute (CREST Lab, IIT Ropar)</li><li>Project duration and description</li></ul><p>For the HP CREST Lab at IIT Ropar, the NOC processing typically takes <strong>2–4 weeks</strong> before your intended joining date.</p>`
      }
    ]
  },
  {
    id: 'logistics',
    title: '🏠 Logistics & Accommodation',
    items: [
      {
        id: 'logistics-1',
        question: 'Will I get accommodation at IIT Ropar?',
        answer: `<p>Yes, the institute provides <strong>summer internship accommodation</strong> for outstation interns in the student hostels. You will need to apply for accommodation separately through the hostel office after receiving your selection confirmation.</p><p>Key points:</p><ul><li>Hostel fees are typically separate from any stipend</li><li>Mess facility is available in the hostel</li><li>Rooms are usually shared (twin-sharing)</li></ul>`
      },
      {
        id: 'logistics-2',
        question: 'What are the approximate living costs?',
        answer: `<p>Here's a rough breakdown of monthly living costs at IIT Ropar:</p><ul><li><strong>Hostel Accommodation:</strong> ₹3,000 – ₹5,000 per month (depending on room type)</li><li><strong>Mess Food:</strong> ₹2,500 – ₹3,500 per month</li><li><strong>Miscellaneous:</strong> ₹1,000 – ₹2,000 per month</li></ul><p><strong>Total estimated monthly cost:</strong> ₹6,500 – ₹10,500 per month</p>`
      }
    ]
  },
  {
    id: 'stipend',
    title: '💰 Stipend & Compensation',
    items: [
      {
        id: 'stipend-1',
        question: 'Is there a stipend for HP CREST Lab interns?',
        answer: `<p>HP CREST Lab at IIT Ropar typically offers a <strong>competitive stipend</strong> for summer interns. The exact amount depends on the project and the student's qualification level. Typically:</p><ul><li><strong>2nd Year Students:</strong> ₹10,000 – ₹15,000 per month</li><li><strong>3rd Year Students:</strong> ₹15,000 – ₹20,000 per month</li><li><strong>4th Year Students (BTP):</strong> ₹20,000 – ₹25,000 per month</li></ul><p>In addition to the stipend, accommodation and mess facilities are provided at subsidized rates.</p>`
      }
    ]
  },
  {
    id: 'projects',
    title: '🛠️ Projects & Work',
    items: [
      {
        id: 'projects-1',
        question: 'What kind of projects are available?',
        answer: `<p>HP CREST Lab focuses on <strong>Embedded Systems, VLSI Design, and Signal Processing</strong>. Summer intern projects typically involve:</p><ul><li>RTL design and verification of digital circuits</li><li>FPGA prototyping and testing</li><li>Embedded firmware development</li><li>Signal processing algorithm development</li><li>Machine learning for embedded applications</li><li>ASIC design flow (synthesis, timing analysis, place & route)</li></ul>`
      },
      {
        id: 'projects-2',
        question: 'What skills are required?',
        answer: `<p>While requirements vary by project, the following skills are generally valued:</p><ul><li><strong>Digital Electronics / VLSI:</strong> Familiarity with Verilog/SystemVerilog, RTL design concepts</li><li><strong>Embedded Systems:</strong> C programming, microcontroller basics</li><li><strong>Signal Processing:</strong> MATLAB/Python, DSP concepts</li><li><strong>FPGA:</strong> Vivado/Quartus experience is a plus</li></ul><p>Even if you don't have all skills, a strong willingness to learn and relevant coursework background is highly valued.</p>`
      }
    ]
  }
];

const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  about: { icon: '📋', color: 'info' },
  stipend: { icon: '💰', color: 'stipend' },
  noc: { icon: '🏛️', color: 'noc' },
  lab: { icon: '🔬', color: 'lab' },
  work: { icon: '🛠️', color: 'work' },
  project: { icon: '🗂️', color: 'project' },
  report: { icon: '📝', color: 'report' },
  academic: { icon: '📚', color: 'academic' },
  timing: { icon: '⏰', color: 'timing' },
  selection: { icon: '✅', color: 'selection' },
};

export function FAQPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set());
  const [loginOpen, setLoginOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allFaqs = STATIC_SECTIONS.flatMap(s => s.items.map(i => ({ ...i, sectionTitle: s.title })));
  const filteredBySearch = searchQuery
    ? allFaqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const getSuggestions = (query: string) => {
    if (!query) return setSuggestions([]);
    const q = query.toLowerCase();
    const matches = allFaqs.filter(f => f.question.toLowerCase().includes(q)).map(f => f.question);
    setSuggestions(matches.slice(0, 6));
    setShowSuggestions(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    getSuggestions(value);
  };

  const selectSuggestion = (text: string) => {
    setSearchQuery(text);
    setShowSuggestions(false);
    const el = allFaqs.find(f => f.question === text);
    if (el) setOpenFaqIds(prev => new Set([...prev, el.id]));
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenFaqIds(new Set(allFaqs.map(f => f.id)));
  const collapseAll = () => setOpenFaqIds(new Set());

  if (activeTab === 'dashboard' && user) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={user?.email}
        onLogout={logout}
        onLoginClick={() => setLoginOpen(true)}
        onMenuClick={() => setDrawerOpen(true)}
      />

      <main className="main-content">
        {/* Hero */}
        <div className="faq-hero glass-card">
          <div className="faq-hero-copy">
            <div className="hero-kicker"><BookOpen size={13} /> ViBe — Vicharanashala FAQ</div>
            <h1>Everything you need to know about IIT Ropar's Summer Internship</h1>
            <p>From NOC deadlines to stipend details — get instant answers to your ViBe internship questions. No more email threads.</p>
            <div className="hero-stats">
              <span><strong>5</strong> topic areas</span>
              <span><strong>{allFaqs.length}</strong> questions answered</span>
              <span><strong>HP CREST Lab</strong> official guide</span>
            </div>
          </div>
          <div className="faq-hero-graphic">
            <div className="hero-icon-cluster">
              <div className="hero-icon-main">🏛️</div>
              <div className="hero-icon-ring" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="faq-search-card-inline glass-card">
          <button className="faq-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Browse categories">
            <span className="hamburger-line" /><span className="hamburger-line" /><span className="hamburger-line" />
          </button>
          <div className="faq-search-block" ref={searchRef}>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search questions — e.g. 'NOC date', 'stipend', 'when does it start'..."
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
              />
              {searchQuery && (
                <button className="btn-clear" onClick={() => { setSearchQuery(''); setSuggestions([]); }}>✕</button>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions-box">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => selectSuggestion(s)}>{s}</button>
                  ))}
                </div>
              )}
            </div>
            {searchQuery && !filteredBySearch && (
              <div className="search-suggestions-box">
                <button disabled style={{ opacity: 0.5, cursor: 'default' }}>No results found for "{searchQuery}"</button>
              </div>
            )}
          </div>
          <div className="search-actions-row-inline">
            <button className="mini-action-btn expand-btn" onClick={expandAll}>
              <ChevronDown size={13} /> Expand All
            </button>
            <button className="mini-action-btn collapse-btn" onClick={collapseAll}>
              <ChevronDown size={13} style={{ transform: 'rotate(180deg)' }} /> Collapse All
            </button>
          </div>
        </div>

        {/* Search Results Mode */}
        {filteredBySearch ? (
          <div className="faq-main-grid">
            <p className="faq-no-results" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>
              Showing {filteredBySearch.length} result{filteredBySearch.length !== 1 ? 's' : ''} for "<strong>{searchQuery}</strong>"
            </p>
            <div className="faq-accordions-list">
              {filteredBySearch.map(faq => (
                <Accordion
                  key={faq.id}
                  faq={{ id: faq.id, question: faq.question, answer: faq.answer }}
                  isOpen={openFaqIds.has(faq.id)}
                  onToggle={() => toggleFaq(faq.id)}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Category Quick Links */
          <>
            <div className="faq-quick-categories-grid">
              {STATIC_SECTIONS.map(sec => {
                const iconInfo = CATEGORY_ICONS[sec.id] || { icon: '📄', color: 'info' };
                return (
                  <button key={sec.id} className="faq-quick-cat-btn" onClick={() => {
                    const el = document.getElementById(`section-${sec.id}`);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    <div className={`faq-quick-cat-icon-wrap ${iconInfo.color}`}>{iconInfo.icon}</div>
                    <span className="faq-quick-cat-label">{sec.title.replace(/^[^\s]+\s/, '')}</span>
                  </button>
                );
              })}
            </div>

            {/* NOC Mandatory Info Card */}
            <div className="noc-info-card glass-card">
              <p className="noc-info-text">
                ⚠️ <strong>NOC is mandatory</strong> — All selected interns must obtain a No-Objection Certificate from their institute before joining. Start the process early to avoid delays.
              </p>
              <div className="faq-control-actions-row">
                <button className="faq-control-btn expand-btn" onClick={expandAll}><ChevronDown size={13} /> Expand All NOC Info</button>
                <button className="faq-control-btn collapse-btn" onClick={collapseAll}><ChevronDown size={13} style={{ transform: 'rotate(180deg)' }} /> Collapse All</button>
              </div>
            </div>

            {/* Rosetta Split Card */}
            <div className="rosetta-split-card glass-card">
              <div className="rosetta-card-left">
                <div className="rosetta-left-content">
                  <h4>🌍 HP CREST Lab</h4>
                  <p>Hewlett-Packard Center for Embedded Systems and VLSI Technology at IIT Ropar</p>
                </div>
                <Globe size={72} className="rosetta-globe-icon" />
              </div>
              <div className="rosetta-card-right">
                <p>The HP CREST Lab at IIT Ropar focuses on cutting-edge research in embedded systems, VLSI design, and signal processing. The summer internship program offers students hands-on research experience under faculty mentorship.</p>
              </div>
            </div>

            {/* FAQ Sections */}
            <div className="faq-main-grid">
              {STATIC_SECTIONS.map(section => (
                <div key={section.id} className="faq-section-block" id={`section-${section.id}`}>
                  <h2 className="faq-section-title">
                    {section.title}
                    {section.isNoc && <span className="noc-mandatory-badge">NOC REQUIRED</span>}
                  </h2>
                  <div className="faq-accordions-list">
                    {section.items.map(faq => (
                      <Accordion
                        key={faq.id}
                        faq={{ id: faq.id, question: faq.question, answer: faq.answer }}
                        isOpen={openFaqIds.has(faq.id)}
                        onToggle={() => toggleFaq(faq.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Mobile Category Drawer */}
      <div className={`mobile-drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)}>
        <div className="faq-sidebar-drawer" onClick={e => e.stopPropagation()}>
          <div className="drawer-header">
            <div>
              <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Browse Topics</h2>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>Jump to any section</p>
            </div>
            <button className="btn-drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
          </div>
          <nav className="sidebar-links-list">
            {STATIC_SECTIONS.map(sec => (
              <button key={sec.id} className="sidebar-link-btn" onClick={() => {
                setDrawerOpen(false);
                const el = document.getElementById(`section-${sec.id}`);
                el?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <span>{sec.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Yaksha-mini Chat */}
      <FloatingChat userEmail={user?.email} apiBaseUrl={apiBaseUrl} />

      <footer className="site-footer-navy">
        <div className="footer-content-wrap">
          <div className="footer-brand-sec">
            <div className="footer-logo">Vicharanashala Lab</div>
            <p className="footer-desc">Official FAQ and query management portal for the HP CREST Lab summer internship program at IIT Ropar.</p>
          </div>
        </div>
        <div className="footer-bottom-sec">
          <p>© 2025 Vicharanashala Lab, IIT Ropar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

