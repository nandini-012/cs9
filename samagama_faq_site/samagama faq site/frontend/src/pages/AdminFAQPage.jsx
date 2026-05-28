import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  HelpCircle, 
  X, 
  Save,
  ChevronDown,
  ChevronUp,
  Folder,
  FolderOpen,
  BookOpen,
  Info,
  Layers,
  Database
} from 'lucide-react';
import Button from '../components/Button';
import './AdminFAQPage.css';

const OFFICIAL_CATEGORIES = [
  { index: '1', name: 'About the internship' },
  { index: '2', name: 'Timing and dates' },
  { index: '3', name: 'NOC (No Objection Certificate)' },
  { index: '4', name: 'Selection, offer letter, and certificate' },
  { index: '5', name: 'Work, mentorship, and projects' },
  { index: '6', name: 'Code of conduct — communication channels' },
  { index: '7', name: 'Interviews Related' },
  { index: '8', name: 'Certificate' },
  { index: '9', name: 'Rosetta — your internship journal' },
  { index: '10', name: 'Phase 1 — coursework, Vibe LMS, and live sessions' },
  { index: '11', name: 'Yaksha Chat Related' },
  { index: '12', name: 'ViBe Platform' },
  { index: '13', name: 'Team Formation' }
];

export default function AdminFAQPage({ 
  faqs = [], 
  setFaqs, 
  apiBaseUrl, 
  isSidebarOpen, 
  onOpenSidebar,
  token
}) {
  const [searchVal, setSearchVal] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [statusMessage, setStatusMessage] = useState('');
  const [openAccordions, setOpenAccordions] = useState({});

  // Form Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null); // null if adding new
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  
  const [faqForm, setFaqForm] = useState({
    question: '',
    category: 'About the internship',
    categoryIndex: '1',
    answer: ''
  });

  // Extract all categories dynamically from data, preserving the official 13 first
  const allCategories = useMemo(() => {
    const list = [...OFFICIAL_CATEGORIES];
    faqs.forEach(f => {
      if (f.category && !list.some(c => c.name.toLowerCase() === f.category.toLowerCase())) {
        const nextIndex = String(list.length + 1);
        list.push({ index: nextIndex, name: f.category });
      }
    });
    return list;
  }, [faqs]);

  // Compute count of FAQs for each category
  const faqCountsByCategory = useMemo(() => {
    const counts = {};
    faqs.forEach(f => {
      const matched = allCategories.find(c => 
        c.index === f.categoryIndex || 
        c.name.toLowerCase() === f.category?.toLowerCase()
      );
      if (matched) {
        counts[matched.index] = (counts[matched.index] || 0) + 1;
      }
    });
    return counts;
  }, [faqs, allCategories]);

  // Filtered FAQs list based on search and selected category filter
  const filteredFaqs = useMemo(() => {
    return faqs.filter(f => {
      if (activeCategory !== 'all') {
        const catObj = allCategories.find(c => c.index === activeCategory);
        if (!catObj) return false;
        if (f.categoryIndex !== catObj.index && f.category?.toLowerCase() !== catObj.name.toLowerCase()) {
          return false;
        }
      }
      if (searchVal.trim() !== '') {
        const keyword = searchVal.toLowerCase();
        return (
          f.question.toLowerCase().includes(keyword) ||
          f.answer.toLowerCase().includes(keyword) ||
          (f.category || '').toLowerCase().includes(keyword) ||
          (f.id || '').toLowerCase().includes(keyword)
        );
      }
      return true;
    });
  }, [faqs, activeCategory, searchVal, allCategories]);

  // Group filtered faqs by categoryIndex for section rendering
  const groupedFaqs = useMemo(() => {
    const groups = {};
    filteredFaqs.forEach(f => {
      const catIndex = f.categoryIndex || '9';
      if (!groups[catIndex]) {
        groups[catIndex] = [];
      }
      groups[catIndex].push(f);
    });
    return groups;
  }, [filteredFaqs]);

  const toggleAccordion = (id) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const nextState = {};
    filteredFaqs.forEach(faq => {
      nextState[faq.id] = true;
    });
    setOpenAccordions(nextState);
  };

  const collapseAll = () => {
    setOpenAccordions({});
  };

  const openAddModal = () => {
    setEditingFaq(null);
    setShowCustomCategory(false);
    setCustomCategory('');
    setFaqForm({
      question: '',
      category: allCategories[0]?.name || 'About the internship',
      categoryIndex: allCategories[0]?.index || '1',
      answer: ''
    });
    setShowModal(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setShowCustomCategory(false);
    setCustomCategory('');
    setFaqForm({
      question: faq.question,
      category: faq.category || 'About the internship',
      categoryIndex: faq.categoryIndex || '1',
      answer: faq.answer
    });
    setShowModal(true);
  };

  // Submit Add/Edit Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    try {
      const payload = {
        question: faqForm.question,
        category: faqForm.category,
        categoryIndex: faqForm.categoryIndex,
        answer: faqForm.answer
      };

      if (editingFaq) {
        // Edit mode (PUT /api/faqs/:id)
        const res = await fetch(`${apiBaseUrl}/api/faqs/${editingFaq.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const updated = await res.json();
          setFaqs(prev => prev.map(f => f.id === editingFaq.id ? updated : f));
          setStatusMessage('✏️ FAQ updated successfully!');
        } else {
          console.error("Failed to update FAQ");
        }
      } else {
        // Add mode (POST /api/faqs)
        const res = await fetch(`${apiBaseUrl}/api/faqs`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const created = await res.json();
          setFaqs(prev => [...prev, created]);
          setStatusMessage('✅ New FAQ added successfully!');
        } else {
          console.error("Failed to add FAQ");
        }
      }
    } catch (err) {
      console.error("Error saving FAQ:", err);
    }

    setShowModal(false);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Delete Action
  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ permanently?")) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setFaqs(prev => prev.filter(f => f.id !== id));
        setStatusMessage('🗑️ FAQ deleted successfully!');
      } else {
        console.error("Failed to delete FAQ");
      }
    } catch (err) {
      console.error("Error deleting FAQ:", err);
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="admin-faq-root">
      {/* Top Header Card */}
      <header className="admin-faq-header glass-card">
        <div className="header-text-block">
          {!isSidebarOpen && (
            <button 
              className="btn-menu-hamburger" 
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
          <div>
            <h2 className="admin-title-text">FAQ Library Management</h2>
            <p className="admin-subtitle-text">
              Maintain institutional guides, verify document timelines, and manage scholarly student FAQs.
            </p>
          </div>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={openAddModal}>
            <Plus size={16} style={{ marginRight: '0.45rem' }} />
            ADD NEW FAQ
          </Button>
        </div>
      </header>

      {statusMessage && (
        <div className="resolve-success-banner glass-card animate-slide-down">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Stats Board */}
      <div className="faq-stats-grid">
        <div className="faq-stat-card glass-card">
          <div className="stat-icon-wrap info">
            <BookOpen size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{faqs.length}</span>
            <span className="stat-label">Total Seeded FAQs</span>
          </div>
        </div>
        <div className="faq-stat-card glass-card">
          <div className="stat-icon-wrap categories">
            <Layers size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{allCategories.length}</span>
            <span className="stat-label">FAQ Categories</span>
          </div>
        </div>
        <div className="faq-stat-card glass-card">
          <div className="stat-icon-wrap matching">
            <Database size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{filteredFaqs.length}</span>
            <span className="stat-label">Matching Filters</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Layout */}
      <div className="faq-controls-card glass-card">
        <div className="search-row-controls">
          <div className="search-box-row">
            <Search size={18} className="search-bar-icon" />
            <input 
              type="text" 
              placeholder="Search by ID, keywords, categories, or answers..." 
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            {searchVal && (
              <button 
                type="button" 
                className="clear-search-btn" 
                onClick={() => setSearchVal('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="global-list-actions">
            <button className="list-action-btn" onClick={expandAll} title="Expand all currently visible accordions">
              Expand All
            </button>
            <button className="list-action-btn" onClick={collapseAll} title="Collapse all currently visible accordions">
              Collapse All
            </button>
          </div>
        </div>

        {/* Dynamic Category Pill Filters */}
        <div className="category-filter-scroll-wrapper">
          <div className="category-filter-pills">
            <button
              className={`pill-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Categories ({faqs.length})
            </button>
            {allCategories.map(cat => {
              const count = faqCountsByCategory[cat.index] || 0;
              return (
                <button
                  key={cat.index}
                  className={`pill-btn ${activeCategory === cat.index ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.index)}
                >
                  {cat.index}. {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Accordions Display Column */}
      <section className="faq-accordion-section">
        {filteredFaqs.length > 0 ? (
          allCategories.map(cat => {
            const items = groupedFaqs[cat.index] || [];
            if (items.length === 0) return null;

            return (
              <div key={cat.index} className="admin-faq-category-group glass-card">
                <div className="category-group-header">
                  <div className="category-header-title">
                    <FolderOpen size={18} className="category-folder-icon" />
                    <h3>{cat.index}. {cat.name}</h3>
                  </div>
                  <span className="category-header-badge">{items.length} FAQs</span>
                </div>

                <div className="category-faq-cards-list">
                  {items.map(faq => {
                    const isExpanded = !!openAccordions[faq.id];
                    return (
                      <div 
                        key={faq.id} 
                        className={`admin-faq-card ${isExpanded ? 'expanded' : 'collapsed'}`}
                      >
                        {/* Header Panel */}
                        <div 
                          className="admin-faq-card-header" 
                          onClick={() => toggleAccordion(faq.id)}
                        >
                          <div className="faq-header-left">
                            <span className="faq-id-badge">{faq.id}</span>
                            <span className="faq-q-text">{faq.question}</span>
                          </div>
                          
                          <div className="faq-header-right" onClick={e => e.stopPropagation()}>
                            <span className={`category-tag-badge index-${faq.categoryIndex || '9'}`}>
                              {faq.category || 'General'}
                            </span>
                            <div className="faq-actions-buttons">
                              <button 
                                className="btn-faq-action edit"
                                onClick={() => openEditModal(faq)}
                                title="Edit FAQ"
                              >
                                <Pencil size={13} />
                              </button>
                              <button 
                                className="btn-faq-action delete"
                                onClick={() => handleDeleteFaq(faq.id)}
                                title="Delete FAQ"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <span className={`accordion-trigger-icon ${isExpanded ? 'open' : ''}`}>
                              <ChevronDown size={16} />
                            </span>
                          </div>
                        </div>

                        {/* Collapsible content with smooth entry */}
                        {isExpanded && (
                          <div className="admin-faq-card-body animate-slide-down">
                            <div className="body-inner-content">
                              <div className="answer-section-label">Official Documentation / Detailed Description:</div>
                              <div 
                                className="faq-answer-rich-content"
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                              />
                              <div className="faq-card-footer">
                                <span className="faq-footer-meta">Category ID: {faq.categoryIndex || '9'}</span>
                                <span className="faq-footer-meta">Updated: Real-time Database</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="admin-faq-empty-state glass-card">
            <HelpCircle size={44} className="empty-state-icon" />
            <h3>No FAQ entries found</h3>
            <p>We couldn't find any FAQs matching your search query or selected category filter.</p>
            <Button variant="secondary" onClick={() => { setSearchVal(''); setActiveCategory('all'); }}>
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* Add/Edit Modal Dialog */}
      {showModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowModal(false)}>
          <div 
            className="faq-form-modal-card glass-card animate-scale-up" 
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{editingFaq ? 'Edit FAQ Entry' : 'Add New FAQ Entry'}</h3>
              <button className="btn-modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="faq-input-form">
              <div className="form-group">
                <label>Question / Description</label>
                <input 
                  type="text" 
                  placeholder="Enter the FAQ question..." 
                  value={faqForm.question}
                  onChange={e => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Category Group</label>
                <span className="form-field-hint">Assign this FAQ to an official or custom category index:</span>
                <div className="modal-category-grid">
                  {allCategories.map(cat => {
                    const isSelected = !showCustomCategory && String(faqForm.categoryIndex) === String(cat.index);
                    return (
                      <button 
                        key={cat.index} 
                        type="button"
                        className={`modal-category-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setShowCustomCategory(false);
                          setFaqForm(prev => ({ 
                            ...prev, 
                            category: cat.name,
                            categoryIndex: cat.index
                          }));
                        }}
                      >
                        <span className="cat-card-index">{cat.index}</span>
                        <span className="cat-card-name">{cat.name}</span>
                      </button>
                    );
                  })}
                  <button 
                    type="button"
                    className={`modal-category-card custom-trigger ${showCustomCategory ? 'selected' : ''}`}
                    onClick={() => {
                      setShowCustomCategory(true);
                      setFaqForm(prev => ({ 
                        ...prev, 
                        category: '', 
                        categoryIndex: String(allCategories.length + 1) 
                      }));
                    }}
                  >
                    <Plus size={13} className="custom-trigger-plus" />
                    <span className="cat-card-name">Custom Category</span>
                  </button>
                </div>
              </div>

              {showCustomCategory && (
                <div className="form-group animate-slide-down">
                  <label>Custom Category Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter the name for the new category..." 
                    value={customCategory}
                    onChange={e => {
                      setCustomCategory(e.target.value);
                      setFaqForm(prev => ({ ...prev, category: e.target.value }));
                    }}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Answer / Detailed Description</label>
                <span className="form-field-hint">
                  Supports automatic formatting. Use double newlines for new paragraphs. Start lines with "-" or "*" for bullet lists, or "1." for numbered lists. Wrap words in "**" for bold (e.g., **bold**). URLs become active links automatically.
                </span>
                <textarea 
                  placeholder="Enter detailed answer here in plain text. Format it with bullet points, numbered lists, or bold highlights as desired. The backend will automatically convert it to clean HTML..." 
                  value={faqForm.answer}
                  onChange={e => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                  rows={8}
                  required
                />
              </div>

              <div className="modal-actions-row">
                <Button variant="cancel" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <Save size={14} style={{ marginRight: '0.45rem' }} />
                  Save FAQ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
