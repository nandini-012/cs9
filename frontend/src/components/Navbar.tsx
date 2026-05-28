import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, LogIn, LayoutDashboard, LogOut } from 'lucide-react'
import './Navbar.css'

export interface User {
  name?: string
  email?: string
  role?: string
}

export interface NavbarProps {
  // New ANSH-V interface (used by FAQPage, StudentDashboard, etc.)
  activeTab?: string
  setActiveTab?: (tab: string) => void
  onLoginClick?: () => void
  onMenuClick?: () => void
  onLogout?: () => void
  userEmail?: string | null
  user?: User | null
  // Legacy interface (used by LandingPage)
  onOpenLogin?: () => void
  isAuthenticated?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onLoginClick,
  onMenuClick,
  onLogout,
  userEmail,
  user,
  onOpenLogin,
  isAuthenticated,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLoginClick = () => {
    if (onLoginClick) onLoginClick()
    else if (onOpenLogin) onOpenLogin()
  }

  const handleLogout = () => {
    if (onLogout) onLogout()
  }

  const isAuth = !!isAuthenticated || !!user || !!userEmail

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => {
            if (onMenuClick) onMenuClick()
            else setMenuOpen(!menuOpen)
          }}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <h1>Vicharanashala</h1>
          <span className="navbar-subtitle">LAB INTERNSHIP HUB</span>
        </Link>

        {/* Nav tabs (ANSH-V style) */}
        {setActiveTab && (
          <div className="navbar-tabs">
            {['faq', 'dashboard', 'myqueries'].map(tab => (
              <button
                key={tab}
                className={`navbar-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Auth actions */}
        <div className="navbar-links">
          {isAuth ? (
            <>
              <Link to="/dashboard" className="btn-secondary">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <span className="navbar-user-name">
                {user?.name || userEmail || 'User'}
              </span>
              <button onClick={handleLogout} className="btn-logout-nav">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLoginClick} className="btn-login-nav">
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {setActiveTab && ['faq', 'dashboard', 'myqueries'].map(tab => (
            <button
              key={tab}
              className={`navbar-mobile-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setMenuOpen(false) }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar