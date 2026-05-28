import React from 'react';
import { LayoutGrid, BookOpen, MessageSquare, MessageCircle, Settings, X } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab, userEmail, onLogout, isOpen, onClose }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'faq', label: 'FAQ Library', icon: BookOpen },
    { id: 'resolve', label: 'Resolve Query', icon: MessageSquare },
    { id: 'myqueries', label: 'My Queries', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-header">
          <h2 className="brand-name">Vicharanashala</h2>
          <button className="btn-sidebar-close" onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>
        <span className="brand-subtitle">Lab Internship Hub</span>
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
    </aside>
  );
}
