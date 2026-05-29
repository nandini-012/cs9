import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import './LoginModal.css';

const LoginModal = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const attemptLogin = async () => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    attemptLogin();
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    attemptLogin();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X strokeWidth={1} />
        </button>

        {isForgotPassword ? (
          <>
            <h2 style={{ marginBottom: '16px' }}>Reset Password</h2>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginBottom: '32px' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form className="login-form">
              <input 
                type="email" 
                className="login-input" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <button 
                type="button" 
                className="modal-submit-btn" 
                style={{ marginTop: '16px' }}
                onClick={() => {
                  alert(`A password reset link has been sent to ${email || 'your email'}.`);
                  setIsForgotPassword(false);
                }}
              >
                Send Reset Link
              </button>

              <div 
                className="forgot-password" 
                style={{ textAlign: 'center', marginTop: '16px' }}
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>Login !</h2>

            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

            <form className="login-form">
              <input 
                type="email" 
                className="login-input" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input 
                type="password" 
                className="login-input" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <div className="forgot-password" onClick={() => setIsForgotPassword(true)}>Forgot Password?</div>

              <button type="button" className="modal-submit-btn" onClick={handleStudentLogin}>
                Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
