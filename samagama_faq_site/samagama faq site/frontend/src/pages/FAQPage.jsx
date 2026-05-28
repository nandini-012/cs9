import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Globe, 
  Info, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  Asterisk, 
  Activity, 
  Users, 
  ChevronRight, 
  BookOpen, 
  LockKeyhole, 
  Sparkles,
  Wallet,
  DoorOpen,
  ClipboardList,
  FileText,
  GraduationCap
} from 'lucide-react';
import Accordion from '../components/Accordion';
import './FAQPage.css';

export default function FAQPage({ 
  faqs, 
  searchQuery, 
  setSearchQuery, 
  isLoggedIn, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  isSidebarOpen,
  onOpenSidebar
}) {
  const [openAccordions, setOpenAccordions] = useState({});
  const [activeSection, setActiveSection] = useState('1'); // Initially category 1
  const [showSuggest, setShowSuggest] = useState(false);
  const searchInputRef = useRef(null);

  // Mapped categories (unified for both public and logged-in views)
  const categoriesList = useMemo(() => {
    return [
      { index: 1, dbIndices: ['1', '7'], label: 'Internship Info', icon: Info, colorClass: 'info' },
      { index: 2, dbIndices: ['8'], label: 'Stipend & Benefits', icon: Wallet, colorClass: 'stipend' },
      { index: 3, dbIndices: ['3'], label: 'NOC Requirements', icon: ShieldCheck, colorClass: 'noc', isNoc: true },
      { index: 4, dbIndices: ['10', '11', '12'], label: 'Lab Access', icon: DoorOpen, colorClass: 'lab' },
      { index: 5, dbIndices: ['6'], label: 'Work Culture', icon: Users, colorClass: 'work' },
      { index: 6, dbIndices: ['5'], label: 'Project Allocation', icon: ClipboardList, colorClass: 'project' },
      { index: 7, dbIndices: ['9'], label: 'Final Report', icon: FileText, colorClass: 'report', isRosetta: true },
      { index: 8, dbIndices: ['2', '13'], label: 'Academic Credits', icon: GraduationCap, colorClass: 'academic' },
    ];
  }, []);

  // Compute categories dynamically based on database FAQs
  const categories = useMemo(() => {
    return categoriesList.map(cat => {
      const catFaqs = faqs.filter(faq => {
        return cat.dbIndices.includes(String(faq.categoryIndex));
      });

      // Correct numbering dynamically for display
      const finalFaqs = catFaqs.map((faq, idx) => ({
        ...faq,
        question: faq.question.replace(/^\d+\.\d+\s*/, `${cat.index}.${idx + 1} `)
      }));

      return {
        ...cat,
        title: `${cat.index}. ${cat.label}`,
        faqs: finalFaqs
      };
    }).filter(cat => cat.faqs.length > 0);
  }, [faqs, categoriesList]);

  // Flatten active FAQ list for search filtering
  const visibleFaqs = useMemo(() => categories.flatMap(cat => cat.faqs), [categories]);

  const toggleAccordion = (id) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const nextState = {};
    visibleFaqs.forEach(faq => {
      nextState[faq.id] = true;
    });
    setOpenAccordions(nextState);
  };

  const collapseAll = () => {
    setOpenAccordions({});
  };

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return [];
    }
    const q = searchQuery.toLowerCase().trim();
    return visibleFaqs
      .filter(faq => faq.question.toLowerCase().includes(q))
      .slice(0, 5);
  }, [searchQuery, visibleFaqs]);

  // Sidebar Intersection Observer to highlight current active category on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = sectionId.replace('s-', '');
          setActiveSection(index);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    categories.forEach(cat => {
      const el = document.getElementById(`s-${cat.index}`);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories]);

  // Handle search filtration
  const filteredFaqs = searchQuery && searchQuery.trim() !== ''
    ? visibleFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        faq.id.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : visibleFaqs;

  const hasSearchResults = filteredFaqs.length > 0;
  const unlockedCount = visibleFaqs.length;
  const totalCount = faqs.length;

  const renderCategoryLinks = (inDrawer = false) => (
    <ul className="sidebar-links-list">
      {categories.map(item => {
        const IconComp = item.icon;
        return (
          <li key={item.index}>
            <button
              className={`sidebar-link-btn ${activeSection === String(item.index) ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(String(item.index));
                if (inDrawer) setIsMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById(`s-${item.index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
            >
              <span className="sidebar-icon-wrap">
                <IconComp size={16} className="sidebar-icon" />
              </span>
              <span>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="faq-figma-layout">
      <div className="faq-main-grid">
        <aside className="faq-sidebar-nav" aria-label="FAQ categories">
          <div className="sidebar-header-custom">
            <h2 className="sidebar-title-custom">FAQ Categories</h2>
            <p className="sidebar-subtitle-custom">Internship Guide</p>
          </div>
          {renderCategoryLinks()}
        </aside>

        <div className="faq-content-area">
          {/* Rectangular Inline Search Card at the top of content column */}
          <div className="faq-search-card-inline glass-card">
            {isLoggedIn && !isSidebarOpen && (
              <button 
                className="btn-menu-hamburger faq-hamburger" 
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
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSuggest(true);
                }}
                onFocus={() => setShowSuggest(true)}
                onBlur={() => setTimeout(() => setShowSuggest(false), 250)}
                placeholder="Search for questions (e.g., 'stipend', 'selection')..."
                aria-label="Search FAQ"
                autoComplete="off"
              />
              {searchQuery && (
                <button 
                  type="button"
                  className="btn-clear" 
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchQuery('');
                  }}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

              {showSuggest && suggestions.length > 0 && (
                <ul className="search-suggestions-box">
                  {suggestions.map((faq) => (
                    <li key={faq.id}>
                      <button
                        onClick={() => {
                          setSearchQuery(faq.question);
                          setShowSuggest(false);
                          toggleAccordion(faq.id);
                          setTimeout(() => {
                            document.getElementById(faq.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }, 200);
                        }}
                      >
                        {faq.question}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="faq-control-actions-row">
              <button className="faq-control-btn expand-btn" onClick={expandAll}>
                <BookOpen size={14} />
                Expand all
              </button>
              <button className="faq-control-btn collapse-btn" onClick={collapseAll}>
                <LockKeyhole size={14} />
                Collapse all
              </button>
            </div>
          </div>

          {/* Quick Jump Category Cards/Buttons */}
          {isLoggedIn && !searchQuery && (
            <div className="faq-quick-categories-grid">
              {categories.map(cat => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.index}
                    className="faq-quick-cat-btn"
                    onClick={() => {
                      document.getElementById(`s-${cat.index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <span className={`faq-quick-cat-icon-wrap ${cat.colorClass}`}>
                      <IconComp size={16} />
                    </span>
                    <span className="faq-quick-cat-label">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {hasSearchResults ? (
            categories.map(cat => {
              const catFaqs = cat.faqs.filter(faq => filteredFaqs.some(ff => ff.id === faq.id));
              if (catFaqs.length === 0) return null;

              return (
                <section key={cat.index} id={`s-${cat.index}`} className="faq-section-block">
                  <h2 className="faq-section-title">
                    {cat.title}
                    {cat.isNoc && <span className="noc-mandatory-badge">Mandatory</span>}
                  </h2>

                  {/* NOC Info Card Widget with nested accordions */}
                  {cat.isNoc && !searchQuery ? (
                    <div className="noc-info-card">
                      <p className="noc-info-text">
                        A No Objection Certificate from your parent institution is mandatory for all selected interns before they commence their work.
                      </p>
                      <div className="faq-accordions-list">
                        {catFaqs.map(faq => (
                          <Accordion 
                            key={faq.id}
                            faq={faq}
                            isOpen={!!openAccordions[faq.id]}
                            onToggle={() => toggleAccordion(faq.id)}
                            searchQuery={searchQuery}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Rosetta Project Split-Card Widget */}
                      {cat.isRosetta && !searchQuery && (
                        <div className="rosetta-split-card">
                          <div className="rosetta-card-left">
                            <div className="rosetta-left-content">
                              <h4>Rosetta Project</h4>
                              <p>Contribute to our internal research publication during your tenure.</p>
                            </div>
                            <Globe size={48} className="rosetta-globe-icon" />
                          </div>
                          <div className="rosetta-card-right">
                            <p>The Rosetta Journal is a peer-reviewed internal publication where interns document their weekly learnings and breakthroughs.</p>
                          </div>
                        </div>
                      )}

                      <div className="faq-accordions-list">
                        {catFaqs.map(faq => (
                          <Accordion 
                            key={faq.id}
                            faq={faq}
                            isOpen={!!openAccordions[faq.id]}
                            onToggle={() => toggleAccordion(faq.id)}
                            searchQuery={searchQuery}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </section>
              );
            })
          ) : (
            <div className="faq-no-results glass-card">
              <p className="no-results-text">No matching questions found in this view.</p>
              <button className="btn btn-secondary" onClick={() => setSearchQuery('')}>
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Sidebar Drawer overlay (Shared for all screen widths) */}
      <div 
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <aside 
          className="faq-sidebar-drawer"
          onClick={e => e.stopPropagation()}
        >
          <div className="drawer-header">
            <div>
              <h2 className="sidebar-title">FAQ Categories</h2>
              <p className="sidebar-subtitle">Internship Guide</p>
            </div>
            <button 
              className="btn-drawer-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>

          {renderCategoryLinks(true)}
        </aside>
      </div>
    </div>
  );
}
