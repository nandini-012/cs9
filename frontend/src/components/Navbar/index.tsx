import React from 'react'
import { Link } from 'react-router-dom'
import { User, LogIn, LayoutDashboard } from 'lucide-react'
import './Navbar.css'

export interface User {
  name?: string
  email?: string
  role?: string
}

export interface NavbarProps {
  onOpenLogin: () => void
  isAuthenticated: boolean
  onLogout: () => void
  user?: User | null
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  isAuthenticated,
  onLogout,
  user,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <h1>Vicharanashala</h1>
          <span className="navbar-subtitle">LAB INTERNSHIP HUB</span>
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-secondary">
                <LayoutDashboard size={18} style={{ marginRight: '8px' }} />
                Dashboard
              </Link>
            <span className="navbar-user-name">
              {user?.name || user?.email || 'User'}
            </span>
            <button onClick={onLogout} className="btn-primary" style={{ marginLeft: '12px' }}>
                <User size={18} style={{ marginRight: '8px' }} />
                Logout
              </button>
            </>
          ) : (
            <button onClick={onOpenLogin} className="btn-primary">
              <LogIn size={18} style={{ marginRight: '8px' }} />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar