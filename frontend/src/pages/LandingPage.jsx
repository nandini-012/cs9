import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container container animate-fade-in">
      <div className="hero-section text-center">
        <h1 className="hero-title">
          Welcome to <span className="text-gradient">Vicharanashala</span>
        </h1>
        <p className="hero-subtitle">
          Your centralized hub for laboratory internships, queries, and FAQs.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card glass-panel">
          <h3>Top FAQs</h3>
          <p>Find answers to common questions about selection, NOC, and projects.</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>Raise Queries</h3>
          <p>Have an issue? Submit a query and track its resolution progress.</p>
        </div>
        <div className="feature-card glass-panel">
          <h3>Peer Support</h3>
          <p>Contribute to the community by helping resolve queries from peers.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
