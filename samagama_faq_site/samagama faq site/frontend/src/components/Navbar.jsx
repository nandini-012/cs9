import React from 'react';
import { LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activeTab, setActiveTab, userEmail, onLogout, onLoginClick, onMenuClick }) {
  return (
    <header className="site-header">
      <div className="header-brand-wrap">
        {activeTab === 'faq' && (
          <button className="btn-menu-hamburger" onClick={onMenuClick} aria-label="Toggle categories menu">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        )}
        <div className="header-brand">
          <h1 className="brand-title">Vicharanashala Lab</h1>
        </div>
      </div>

      <nav className="header-nav">
        {userEmail && (
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        )}
        <button 
          className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </button>
      </nav>

      <div className="header-user">
        {userEmail ? (
          <div className="user-profile">
            <span className="user-email" title={userEmail}>
              {userEmail}
            </span>
            <button className="btn-logout" onClick={onLogout} title="Log Out">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button className="btn-login-rounded" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}
