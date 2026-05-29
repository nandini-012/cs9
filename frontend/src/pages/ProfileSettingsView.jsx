import React, { useState } from 'react';
import { Camera, Save, Lock, Mail, User, Shield } from 'lucide-react';
import './ProfileSettingsView.css';

const ProfileSettingsView = () => {
  const [name, setName] = useState('Rahul Prasad');
  const [email] = useState('rahul.prasad@student.iitr.ac.in');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    if (!name) {
      alert("Name cannot be empty!");
      return;
    }
    alert(`Profile updated successfully for ${name}!`);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="ps-container fade-in">
      <div className="ps-header">
        <h2>Profile Settings</h2>
        <p>Manage your account preferences, security, and personal information.</p>
      </div>

      <div className="ps-content">
        <div className="ps-card">
          <div className="ps-photo-section">
            <div className="ps-avatar-wrapper">
              <div className="ps-avatar">RP</div>
              <button 
                className="ps-photo-edit-btn" 
                title="Upload new photo"
                onClick={() => alert("Simulating file browser to upload photo...")}
              >
                <Camera size={14} />
              </button>
            </div>
            <div className="ps-photo-text">
              <h3>Profile Photo</h3>
              <p>Update your dashboard avatar. Recommended size: 256x256px.</p>
            </div>
          </div>

          <div className="ps-form">
            <div className="ps-field-group">
              <div className="ps-field">
                <label>Full Name</label>
                <div className="ps-input-wrap">
                  <User size={16} className="ps-input-icon" />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              <div className="ps-field">
                <label>Email Address <span className="ps-badge-readonly">READ-ONLY</span></label>
                <div className="ps-input-wrap disabled">
                  <Mail size={16} className="ps-input-icon" />
                  <input 
                    type="email" 
                    value={email} 
                    disabled 
                  />
                </div>
                <p className="ps-hint">Your email is tied to your institutional ID and cannot be changed.</p>
              </div>
            </div>

            <div className="ps-divider"></div>

            <div className="ps-section-title">
              <Shield size={18} />
              Password & Security
            </div>
            
            <div className="ps-field-group">
              <div className="ps-field">
                <label>Current Password</label>
                <div className="ps-input-wrap">
                  <Lock size={16} className="ps-input-icon" />
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    placeholder="Enter current password" 
                  />
                </div>
              </div>
              <div className="ps-field">
                <label>New Password</label>
                <div className="ps-input-wrap">
                  <Lock size={16} className="ps-input-icon" />
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Enter new password" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="ps-actions">
            <button className="ps-save-btn" onClick={handleSave}>
              <Save size={16} /> 
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsView;
