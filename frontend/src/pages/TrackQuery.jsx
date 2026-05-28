import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import './TrackQuery.css';

const TrackQuery = () => {
  return (
    <div className="track-container container animate-fade-in">
      <div className="track-header">
        <span className="badge-academics">ACADEMICS</span>
        <span className="query-id">ID: #4829</span>
        <h2>When do I submit the NOC?</h2>
      </div>

      <div className="track-content">
        <div className="query-details glass-panel">
          <div className="user-profile">
            <div className="avatar"></div>
            <div>
              <h4>Student #1234</h4>
              <span className="timestamp" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Oct 12, 10:45 AM</span>
            </div>
          </div>
          <p className="query-text">
            I'm currently finalizing my internship paperwork and need clarity on the No Objection Certificate (NOC) submission. Is there a specific deadline?
          </p>
        </div>

        <div className="resolution-timeline glass-panel">
          <h3>Query Timeline</h3>
          
          <div className="timeline-item">
            <div className="timeline-icon success"><CheckCircle2 size={16} /></div>
            <div className="timeline-content">
              <h4>Submitted</h4>
              <span>Oct 12, 10:45 AM</span>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-icon warning"><Clock size={16} /></div>
            <div className="timeline-content">
              <h4>Peer Resolving</h4>
              <span>Peers are reviewing...</span>
            </div>
          </div>
          
          <div className="timeline-item pending">
            <div className="timeline-icon"><AlertCircle size={16} /></div>
            <div className="timeline-content">
              <h4>Escalated to Admin</h4>
              <span>Auto-escalation after 48h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackQuery;
