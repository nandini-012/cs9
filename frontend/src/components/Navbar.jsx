import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { User, LogIn, LayoutDashboard } from 'lucide-react';

const Navbar = ({ onOpenLogin, isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-content">
        <Link to="/" className="brand">
          <h1>Vicharanashala</h1>
          <span className="subtitle">LAB INTERNSHIP HUB</span>
        </Link>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-secondary">
                <LayoutDashboard size={18} style={{ marginRight: '8px' }}/>
                Dashboard
              </Link>
              <button onClick={onLogout} className="btn-primary" style={{ marginLeft: '12px' }}>
                <User size={18} style={{ marginRight: '8px' }}/>
                Logout
              </button>
            </>
          ) : (
            <button onClick={onOpenLogin} className="btn-primary">
              <LogIn size={18} style={{ marginRight: '8px' }}/>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
