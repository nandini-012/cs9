import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldAlert, 
  Check, 
  X, 
  Pencil, 
  Save, 
  Activity, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import Button from '../components/Button';
import './AdminSpurtiPage.css';

export default function AdminSpurtiPage({ isSidebarOpen, onOpenSidebar, apiBaseUrl, token }) {
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly', 'yearly'
  const [statusMessage, setStatusMessage] = useState('');
  const [flaggedItems, setFlaggedItems] = useState([]);

  // Fetch flagged items on load
  useEffect(() => {
    const fetchFlagged = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/flagged`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Ensure every item has editText initialized to responseText
          const mapped = data.map(item => ({
            ...item,
            editText: item.editText || item.responseText,
            isEditing: false
          }));
          setFlaggedItems(mapped);
        }
      } catch (e) {
        console.error("Failed to load flagged items:", e);
      }
    };
    fetchFlagged();
  }, [apiBaseUrl]);

  // Mock leaderboard list
  const leaderboardItems = {
    monthly: [
      { rank: '01', name: 'Rahul Prasad', resolved: 143, upvotes: 832, points: 2680, avatarInitials: 'RP', colorClass: 'user' },
      { rank: '02', name: 'Shreya Chaudhari', resolved: 125, upvotes: 753, points: 2120, avatarInitials: 'SH', colorClass: 'shreya' },
      { rank: '03', name: 'Udharsh Goyal', resolved: 110, upvotes: 642, points: 1980, avatarInitials: 'UD', colorClass: 'udharsh' },
      { rank: '04', name: 'Samad', resolved: 95, upvotes: 540, points: 1750, avatarInitials: 'SA', colorClass: 'samad' },
      { rank: '05', name: 'ROY', resolved: 82, upvotes: 420, points: 1420, avatarInitials: 'RY', colorClass: 'roy' }
    ],
    yearly: [
      { rank: '01', name: 'Rahul Prasad', resolved: 650, upvotes: 4120, points: 12800, avatarInitials: 'RP', colorClass: 'user' },
      { rank: '02', name: 'Shreya Chaudhari', resolved: 580, upvotes: 3410, points: 10450, avatarInitials: 'SH', colorClass: 'shreya' },
      { rank: '03', name: 'Udharsh Goyal', resolved: 512, upvotes: 2980, points: 9280, avatarInitials: 'UD', colorClass: 'udharsh' },
      { rank: '04', name: 'Samad', resolved: 490, upvotes: 2450, points: 8400, avatarInitials: 'SA', colorClass: 'samad' },
      { rank: '05', name: 'ROY', resolved: 410, upvotes: 1820, points: 7100, avatarInitials: 'RY', colorClass: 'roy' }
    ]
  };

  const handleApprove = (id) => {
    setFlaggedItems(prev => prev.filter(item => item.id !== id));
    fetch(`${apiBaseUrl}/api/flagged/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(err => console.error("Failed to approve flagged item:", err));

    setStatusMessage('✅ Response approved and kept.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleDeleteResponse = (id) => {
    setFlaggedItems(prev => prev.filter(item => item.id !== id));
    fetch(`${apiBaseUrl}/api/flagged/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(err => console.error("Failed to delete flagged response:", err));

    setStatusMessage('🗑️ Flagged response deleted.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const startEditing = (id) => {
    setFlaggedItems(prev => prev.map(item => 
      item.id === id ? { ...item, isEditing: true } : item
    ));
  };

  const saveEdit = (id) => {
    let nextItem = null;
    setFlaggedItems(prev => prev.map(item => {
      if (item.id === id) {
        nextItem = { 
          ...item, 
          isEditing: false, 
          responseText: item.editText 
        };
        return nextItem;
      }
      return item;
    }));

    if (nextItem) {
      fetch(`${apiBaseUrl}/api/flagged/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          responseText: nextItem.responseText,
          editText: nextItem.editText,
          isEditing: false
        })
      }).catch(err => console.error("Failed to save flagged response edit:", err));
    }

    setStatusMessage('✏️ Response updated and saved.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleEditChange = (id, text) => {
    setFlaggedItems(prev => prev.map(item => 
      item.id === id ? { ...item, editText: text } : item
    ));
  };

  return (
    <div className="admin-spurti-root">
      {/* Top Header */}
      <header className="admin-spurti-header glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <h2 className="admin-title-text">Spurti Leaderboard</h2>
            <p className="admin-subtitle-text">Recognizing academic rigor and community contribution. Top researchers are ranked based on points resolved.</p>
          </div>
        </div>
      </header>

      {statusMessage && (
        <div className="resolve-success-banner glass-card animate-slide-down">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Leaderboard Section */}
      <section className="spurti-leaderboard-section glass-card">
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} className="icon-star" />
            <h3 className="widget-title">Top Contributors</h3>
          </div>
          <div className="timeframe-toggles">
            <button 
              className={`toggle-btn ${timeframe === 'monthly' ? 'active' : ''}`}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`toggle-btn ${timeframe === 'yearly' ? 'active' : ''}`}
              onClick={() => setTimeframe('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Scholar</th>
                <th>Resolved</th>
                <th>Upvotes</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardItems[timeframe].map(item => (
                <tr key={item.name}>
                  <td className="rank-cell">#{item.rank}</td>
                  <td>
                    <div className="scholar-profile">
                      <div className={`scholar-avatar ${item.colorClass}`}>
                        {item.avatarInitials}
                      </div>
                      <span className="scholar-name">{item.name}</span>
                    </div>
                  </td>
                  <td>{item.resolved} resolved</td>
                  <td>{item.upvotes} upvotes</td>
                  <td className="points-cell">{item.points} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Two Column Layout below */}
      <div className="spurti-grid-layout">
        
        {/* Left Widget: Flagged Content Moderation */}
        <div className="admin-widget-card glass-card flagged-content-widget">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.50rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <ShieldAlert size={18} className="icon-red" />
            <h3 className="widget-title">Flagged Content Review</h3>
          </div>
          <p className="widget-subtitle">Review moderation feedback for student peer responses.</p>
          
          <div className="flagged-list">
            {flaggedItems.length > 0 ? (
              flaggedItems.map(item => (
                <div key={item.id} className="flagged-card glass-card">
                  <div className="flagged-card-header">
                    <span className="flagged-meta">
                      Flagged by <strong>{item.flaggedBy}</strong> on Query #{item.queryId}
                    </span>
                    <span className="flagged-time">{item.date}</span>
                  </div>
                  
                  <div className="flagged-reason-box">
                    <strong>Report:</strong> "{item.reason}"
                  </div>

                  <div className="flagged-response-preview">
                    <div className="response-author-tag">Response by {item.responseAuthor}:</div>
                    {item.isEditing ? (
                      <textarea
                        className="flagged-edit-textarea"
                        value={item.editText}
                        onChange={e => handleEditChange(item.id, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="response-text">"{item.responseText}"</p>
                    )}
                  </div>

                  <div className="flagged-card-actions">
                    {item.isEditing ? (
                      <Button variant="primary" style={{ height: '30px', padding: '0 0.85rem', fontSize: '0.74rem', borderRadius: '6px' }} onClick={() => saveEdit(item.id)}>
                        <Save size={12} style={{ marginRight: '0.3rem' }} />
                        Save Changes
                      </Button>
                    ) : (
                      <button 
                        className="btn-flagged-action edit"
                        onClick={() => startEditing(item.id)}
                        title="Edit response content"
                      >
                        <Pencil size={14} />
                      </button>
                    )}

                    <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto' }}>
                      <button 
                        className="btn-flagged-action approve"
                        onClick={() => handleApprove(item.id)}
                        title="Approve & Dismiss Flag"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        className="btn-flagged-action reject"
                        onClick={() => handleDeleteResponse(item.id)}
                        title="Delete Response"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flagged-empty-state">
                <Check size={28} className="icon-green" />
                <p>All reviews clear! No flagged content to moderate.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Widget: Live Activity Ticker */}
        <div className="admin-widget-card glass-card activity-ticker-widget">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.50rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <Activity size={18} className="icon-blue" />
            <h3 className="widget-title">Live Activity</h3>
          </div>
          
          <div className="ticker-feed">
            <div className="ticker-item">
              <span className="ticker-dot green"></span>
              <div className="ticker-content">
                <p><strong>Rahul Prasad</strong> earned +100 pts for <em>Super Scholar</em></p>
                <span className="ticker-time">10 mins ago</span>
              </div>
            </div>
            <div className="ticker-item">
              <span className="ticker-dot red"></span>
              <div className="ticker-content">
                <p><strong>Kartik</strong> flagged response in <em>NOC Verification Group</em></p>
                <span className="ticker-time">2 hours ago</span>
              </div>
            </div>
            <div className="ticker-item">
              <span className="ticker-dot blue"></span>
              <div className="ticker-content">
                <p>New Leaderboard Leader: <strong>Rohan M.</strong> moved to Rank #1</p>
                <span className="ticker-time">4 hours ago</span>
              </div>
            </div>
            <div className="ticker-item">
              <span className="ticker-dot green"></span>
              <div className="ticker-content">
                <p><strong>Ananya</strong> submitted response for <em>Stipend-NOC Link Query</em></p>
                <span className="ticker-time">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
