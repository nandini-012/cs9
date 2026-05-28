import React from 'react';
import { Award, Lock, CheckCircle, Play } from 'lucide-react';
import './Badge.css';

export default function Badge({ level, status, title, subtitle, compact }) {
  const getTheme = () => {
    switch (level.toLowerCase()) {
      case 'bronze':
        return {
          gradClass: 'badge-bronze',
          badgeText: '🥉 Bronze',
          phaseText: 'Phase 1'
        };
      case 'silver':
        return {
          gradClass: 'badge-silver',
          badgeText: '🥈 Silver',
          phaseText: 'Phase 2'
        };
      case 'gold':
        return {
          gradClass: 'badge-gold',
          badgeText: '🥇 Gold',
          phaseText: 'Phase 3'
        };
      case 'platinum':
        return {
          gradClass: 'badge-platinum',
          badgeText: '🏆 Platinum',
          phaseText: 'Phase 4'
        };
      default:
        return {
          gradClass: 'badge-bronze',
          badgeText: 'Badge',
          phaseText: 'Phase'
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`badge-card glass-card ${theme.gradClass} ${status} ${compact ? 'compact' : ''}`}>
      <div className="badge-glow-element" />
      
      {/* Top circle icon */}
      <div className="badge-icon-wrap">
        <Award size={compact ? 18 : 22} className="badge-icon" />
      </div>
      
      {/* Title: 🥉 Bronze */}
      <h3 className="badge-title">{theme.badgeText}</h3>
      
      {/* Subtitle: Coursework & Onboarding */}
      <h4 className="badge-subtitle">{title}</h4>
      
      {/* Description: Complete orientation proctored paths & lessons on ViBe. */}
      {!compact && <p className="badge-desc">{subtitle}</p>}
      
      {/* Footer row */}
      <div className="badge-footer">
        <span className="badge-phase">{theme.phaseText}</span>
        <div className={`badge-status-pill ${status}`}>
          {status === 'locked' && <Lock size={compact ? 10 : 12} />}
          {status === 'in-progress' && <Play size={compact ? 10 : 12} className="pulse-icon" />}
          {status === 'completed' && <CheckCircle size={compact ? 10 : 12} />}
          <span className="status-label">
            {status === 'in-progress' ? 'IN PROGRESS' : status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
