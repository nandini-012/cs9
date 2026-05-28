import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, ChevronDown, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './FAQManagementView.css';

const FAQManagementView = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'Infrastructure',
    question: '',
    answer: ''
  });

  const API_URL = 'http://localhost:5000/api/faqs';

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({ category: 'Infrastructure', question: '', answer: '' });
    setCurrentFaq(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setFormData({ category: faq.category, question: faq.question, answer: faq.answer });
    setCurrentFaq(faq);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (faq) => {
    setCurrentFaq(faq);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const method = currentFaq ? 'PUT' : 'POST';
      const url = currentFaq ? `${API_URL}/${currentFaq._id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        alert('Failed to save FAQ');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${currentFaq._id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        fetchFaqs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBadgeClass = (category) => {
    if(!category) return 'default';
    const cat = category.toLowerCase();
    if (cat.includes('infra')) return 'infra';
    if (cat.includes('admin')) return 'admin';
    if (cat.includes('ethic')) return 'ethics';
    if (cat.includes('admission')) return 'admissions';
    return 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    if (isNaN(d)) return 'N/A';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="faqm-container">
      {/* Header */}
      <div className="faqm-header-section">
        <div>
          <div className="faqm-super-title">Administration</div>
          <h1 className="faqm-title">FAQ Management</h1>
          <p className="faqm-subtitle">
            Manage scholarly queries and institutional documentation. Maintain clarity and academic rigor for all portal users.
          </p>
        </div>
        <button className="faqm-add-btn" onClick={handleOpenAdd}>
          <Plus size={16} /> Add New FAQ
        </button>
      </div>

      {/* Search & Filter */}
      <div className="faqm-controls">
        <div className="faqm-search-box">
          <Search size={20} color="#9ca3af" />
          <input type="text" placeholder="Search by question or category keywords..." />
        </div>
        <div className="faqm-filter-box">
          <Filter size={20} color="#b45309" />
          <div className="faqm-filter-label">
            <span className="faqm-filter-title">Category Filter</span>
            <span className="faqm-filter-value">All Categories</span>
          </div>
          <ChevronDown size={16} color="#6b7280" />
        </div>
      </div>

      {/* Table Section */}
      <div className="faqm-table-wrap">
        <table className="faqm-table">
          <thead>
            <tr>
              <th>Question & Description</th>
              <th>Category</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading FAQs...</td>
              </tr>
            ) : faqs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No FAQs found. Add one!</td>
              </tr>
            ) : (
              faqs.map(faq => (
                <tr key={faq._id}>
                  <td>
                    <div className="faqm-question">{faq.question}</div>
                    <div className="faqm-desc">
                      {faq.answer && faq.answer.length > 80 ? faq.answer.substring(0, 80) + '...' : faq.answer}
                    </div>
                  </td>
                  <td>
                    <span className={`faqm-badge ${getBadgeClass(faq.category)}`}>
                      {faq.category}
                    </span>
                  </td>
                  <td className="faqm-date">{formatDate(faq.updatedAt || faq.createdAt)}</td>
                  <td>
                    <div className="faqm-actions">
                      <button className="faqm-icon-btn edit" onClick={() => handleOpenEdit(faq)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="faqm-icon-btn delete" onClick={() => handleOpenDelete(faq)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="faqm-pagination">
          <div className="faqm-page-info">Showing {faqs.length} results</div>
          <div className="faqm-page-controls">
            <button className="faqm-page-btn" disabled><ChevronLeft size={16} /></button>
            <button className="faqm-page-btn active">1</button>
            <button className="faqm-page-btn" disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="faqm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="faqm-modal" onClick={e => e.stopPropagation()}>
            <div className="faqm-modal-header">
              <h3 className="faqm-modal-title">{currentFaq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
              <button className="faqm-close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="faqm-modal-body">
              <div className="faqm-form-group">
                <label>Category</label>
                <select 
                  className="faqm-form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Administration">Administration</option>
                  <option value="Ethics">Ethics</option>
                  <option value="Admissions">Admissions</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="faqm-form-group">
                <label>Question</label>
                <input 
                  type="text" 
                  className="faqm-form-input" 
                  placeholder="Enter the FAQ question..."
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                />
              </div>
              <div className="faqm-form-group">
                <label>Answer / Description</label>
                <textarea 
                  className="faqm-form-textarea" 
                  placeholder="Enter the detailed answer..."
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="faqm-modal-footer">
              <button className="faqm-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="faqm-btn-save" onClick={handleSave}>Save FAQ</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="faqm-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="faqm-modal" onClick={e => e.stopPropagation()} style={{ width: '400px' }}>
            <div className="faqm-modal-header">
              <h3 className="faqm-modal-title">Delete FAQ</h3>
              <button className="faqm-close-btn" onClick={() => setIsDeleteModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="faqm-modal-body">
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                Are you sure you want to delete this FAQ? This action cannot be undone.
              </p>
            </div>
            <div className="faqm-modal-footer">
              <button className="faqm-btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="faqm-btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FAQManagementView;
