import { LayoutGrid, BookOpen, MessageSquare, Award, Settings, X, LogOut } from 'lucide-react';
import './AdminSidebar.css';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail?: string;
  onLogout?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, onLogout, isOpen, onClose }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'queries', label: 'Queries Management', icon: MessageSquare },
    { id: 'leaderboard', label: 'Spurti Leaderboard', icon: Award },
    { id: 'faq', label: 'FAQ Management', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`app-sidebar admin-sidebar-root ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-header">
          <h2 className="brand-name">Vicharanashala</h2>
          <button className="btn-sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>
        <span className="brand-subtitle admin-badge">Admin Control Portal</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <IconComponent size={20} className="menu-icon" />
              <span className="menu-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-menu-item logout-btn-sidebar" onClick={onLogout}>
          <LogOut size={20} className="menu-icon" />
          <span className="menu-label">Log Out</span>
        </button>
      </div>
    </aside>
  );
}