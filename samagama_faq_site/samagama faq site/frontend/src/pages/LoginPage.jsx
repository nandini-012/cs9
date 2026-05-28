import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../components/Button';
import './LoginPage.css';

export default function LoginPage({ onLogin, onClose, apiBaseUrl }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data.token, data.email, data.role, data.name);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError('Connection failed. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="login-modal-header">
          <h2>Login !</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-modal-form">
          <div className="modal-input-group">
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="modal-input-group">
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          <div className="forgot-password-wrap">
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Mock Forgot Password triggered!"); }} className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {error && <span className="modal-error-message">{error}</span>}

          <Button variant="modal-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
