import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info, Clock, ShieldCheck, CheckSquare, Globe, Users, ChevronDown, ChevronUp } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import './FAQPage.css';

const categories = [
  { id: 'about', label: 'About the internship', icon: Info },
  { id: 'timing', label: 'Timing and dates', icon: Clock },
  { id: 'noc', label: 'NOC Requirements', icon: ShieldCheck },
  { id: 'selection', label: 'Selection & Offer', icon: CheckSquare },
  { id: 'rosetta', label: 'Rosetta Project', icon: Globe },
  { id: 'vibe', label: 'ViBe Platform', icon: Globe },
  { id: 'team', label: 'Team Formation', icon: Users },
];

const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const faqData = {
  about: [
    { 
      title: '1. About the internship', 
      questions: [
        { id: 'about_q1', q: 'What is the Vicharanashala Lab Internship?' },
        { id: 'about_q2', q: 'Who is eligible to apply?' }
      ] 
    }
  ],
  timing: [
    { 
      title: '2. Timing and dates', 
      questions: [
        { id: 'timing_q1', q: 'What is the typical duration of the internship?' },
        { id: 'timing_q2', q: 'Can the internship be done remotely?' }
      ] 
    }
  ],
  noc: [
    { 
      title: '3. NOC Requirements', 
      badge: 'Mandatory', 
      desc: 'A No Objection Certificate from your parent Institution is mandatory for all selected Interns before they commence their work.',
      questions: [
        { id: 'noc_q1', q: 'When should I submit the NOC?' }
      ] 
    }
  ],
  selection: [
    { 
      title: '4. Selection & Offer', 
      questions: [
        { id: 'sel_q1', q: 'Lorem ipsum dolor sit amet selection process?' },
        { id: 'sel_q2', q: 'Consectetur adipiscing elit offer letter?' }
      ] 
    }
  ],
  rosetta: [
    { 
      title: '9. Rosetta Journal', 
      rosettaCard: true,
      questions: [
        { id: 'ros_q1', q: 'Is it compulsory to write for Rosetta?' }
      ] 
    }
  ],
  vibe: [
    { 
      title: '12. ViBe Platform', 
      questions: [
        { id: 'vibe_q1', q: 'How do I access the ViBe Platform?' },
        { id: 'vibe_q2', q: 'What if I forget my ViBe credentials?' }
      ] 
    }
  ],
  team: [
    { 
      title: '13. Team Formation', 
      questions: [
        { id: 'team_q1', q: 'How are project teams formed?' }
      ] 
    }
  ]
};

const FAQPage = ({ onLogin }) => {
  const [activeCategory, setActiveCategory] = useState('about');
  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    setIsLoginOpen(false);
    if (onLogin) onLogin(userData);
    
    // Role-based routing
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const toggle = (id) => {
    if (expanded === id) setExpanded(null);
    else setExpanded(id);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setExpanded(null); // Close any open accordion when switching categories
    setSearchQuery(''); // Clear search when a category is explicitly clicked
  };

  let displayedSections = faqData[activeCategory] || [];

  // If there's a search query, search globally across all categories
  if (searchQuery.trim().length > 0) {
    const lowerQuery = searchQuery.toLowerCase();
    const searchResults = [];

    Object.keys(faqData).forEach((catKey) => {
      faqData[catKey].forEach((section) => {
        const matchingQuestions = section.questions.filter((qItem) => 
          qItem.q.toLowerCase().includes(lowerQuery)
        );

        if (matchingQuestions.length > 0) {
          // Push a copy of the section but only with the matching questions
          searchResults.push({
            ...section,
            questions: matchingQuestions,
            desc: null, // Hide section descriptions during search for cleaner UI
            rosettaCard: false // Hide big info cards during search
          });
        }
      });
    });

    displayedSections = searchResults;
  }

  return (
    <div className="faq-page-wrapper">
      {/* Header */}
      <header className="header">
        <div 
          className="header-logo" 
          style={{ cursor: 'pointer' }} 
          onClick={() => handleCategoryClick('about')}
        >
          Vicharanashala Lab
        </div>
        <button className="login-btn" onClick={() => setIsLoginOpen(true)}>Login</button>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-title">
            <h3>FAQ Categories</h3>
            <p>Internship Guide</p>
          </div>
          <ul className="sidebar-nav">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <li 
                  key={cat.id}
                  className={`sidebar-item ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <IconComponent /> {cat.label}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          <div className="search-bar">
            <Search />
            <input 
              type="text" 
              placeholder="Search for questions (e.g., 'stipend', 'selection')..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery.trim().length > 0 && displayedSections.length === 0 && (
            <div style={{ color: 'var(--text-light)', marginTop: '20px' }}>
              No matching questions found for "{searchQuery}".
            </div>
          )}

          {displayedSections.map((section, index) => (
            <div key={index} className="faq-section">
              <div className="section-header">
                <h2>{section.title}</h2>
                {section.badge && <span className="badge">{section.badge}</span>}
              </div>
              
              {section.desc && (
                <div className="section-desc">
                  {section.desc}
                </div>
              )}

              {section.rosettaCard && (
                <div className="rosetta-card">
                  <div className="rosetta-left">
                    <h4>Rosetta Project</h4>
                    <p>Contribute to our internal research publication during your tenure.</p>
                    <Globe />
                  </div>
                  <div className="rosetta-right">
                    <p>The Rosetta Journal is a peer-reviewed internal publication where interns document their weekly learnings and breakthroughs.</p>
                  </div>
                </div>
              )}

              {section.questions.map((qItem) => (
                <div key={qItem.id} className="faq-item" onClick={() => toggle(qItem.id)}>
                  <div className="faq-question">
                    {qItem.q}
                    {expanded === qItem.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  {expanded === qItem.id && (
                    <div className="faq-answer">
                      <p>{loremText}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Vicharanashala Lab</h2>
            <p>Pioneering excellence in technology and social innovation at IIT Ropar.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>EXPLORE</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>INSTITUTION</h4>
              <ul>
                <li><a href="#">IIT Ropar Main Site</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© Rahul Prasad RCOEM Nagpur. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} onLogin={handleLoginSuccess} />}
    </div>
  );
};

export default FAQPage;
