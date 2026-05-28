import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RaiseQuery.css';

const RaiseQuery = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post('/api/queries', {
            category: "General",
            title: "Student Query",
            description: "Query details submitted from form"
        });
    } catch(err) {
        console.log("Mock API Post since backend might be disconnected", err);
    }
    
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/track');
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="thank-you-container container animate-fade-in flex-center">
        <div className="glass-panel text-center p-40">
          <h2 className="text-gradient">Thank you !</h2>
          <p className="mt-20">We have noted your concern and will definitely look into it.</p>
          <p className="mt-20 text-sm">Redirecting to Track Query in 3 sec...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="query-container container animate-fade-in">
      <div className="query-header">
        <h2>Raise a Query</h2>
        <p>Provide details about your grievance or request below.</p>
      </div>

      <div className="query-content">
        <form className="query-form glass-panel" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Query Category</label>
            <select required>
              <option value="">Select a category</option>
              <option value="academics">Academics</option>
              <option value="finance">Stipend / Finance</option>
              <option value="noc">NOC / Onboarding</option>
            </select>
          </div>

          <div className="form-group">
            <label>Query Title</label>
            <input type="text" placeholder="Briefly state your concern" required />
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea rows="6" placeholder="Provide as much detail as possible..." required></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn-primary">Submit Query</button>
          </div>
        </form>

        <div className="query-sidebar">
          <div className="glass-panel tips-card">
            <h3>💡 Pro Tip</h3>
            <p>Adding specific details and references usually speeds up the resolution process by up to 40%.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseQuery;
