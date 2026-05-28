import React, { useState } from 'react'
import { Camera, Mail, User, BookOpen, Shield, Save } from 'lucide-react'
import './ProfileSettingsView.css'

export const ProfileSettingsView: React.FC = () => {
  const [form, setForm] = useState({
    firstName: 'Amit',
    lastName: 'Sharma',
    email: 'amit.sharma@iitrpr.ac.in',
    phone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    rollNo: 'CSB19001',
    year: '3rd Year',
    bio: 'Research intern focused on embedded systems and IoT.',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="ps-container fade-in">
      <div className="ps-header">
        <h2>Profile Settings</h2>
        <p>Manage your public profile and account preferences.</p>
      </div>

      <div className="ps-card">
        {/* Photo Section */}
        <div className="ps-photo-section">
          <div className="ps-avatar-wrapper">
            <div className="ps-avatar">
              {form.firstName[0]}{form.lastName[0]}
            </div>
            <button className="ps-photo-edit-btn" aria-label="Change photo">
              <Camera size={14} />
            </button>
          </div>
          <div className="ps-photo-text">
            <h3>{form.firstName} {form.lastName}</h3>
            <p>{form.rollNo} · {form.department}</p>
          </div>
        </div>

        {/* Personal Info */}
        <div className="ps-form">
          <h3 className="ps-section-title">
            <User size={16} /> Personal Information
          </h3>
          <div className="ps-field-group">
            <div className="ps-field">
              <label>First Name</label>
              <div className="ps-input-wrap">
                <Mail className="ps-input-icon" size={14} />
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </div>
            </div>
            <div className="ps-field">
              <label>Last Name</label>
              <div className="ps-input-wrap">
                <Mail className="ps-input-icon" size={14} />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="ps-field-group" style={{ marginTop: '20px' }}>
            <div className="ps-field">
              <label>Email Address</label>
              <div className="ps-input-wrap">
                <Mail className="ps-input-icon" size={14} />
                <input type="email" value={form.email} disabled />
              </div>
              <span className="ps-hint">Contact admin to change your institute email.</span>
            </div>
            <div className="ps-field">
              <label>Phone Number</label>
              <div className="ps-input-wrap">
                <Mail className="ps-input-icon" size={14} />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="ps-divider" />

          {/* Academic Info */}
          <h3 className="ps-section-title">
            <BookOpen size={16} /> Academic Information
          </h3>
          <div className="ps-field-group">
            <div className="ps-field">
              <label>
                Roll Number
                <span className="ps-badge-readonly">READ ONLY</span>
              </label>
              <div className="ps-input-wrap disabled">
                <input type="text" value={form.rollNo} disabled />
              </div>
            </div>
            <div className="ps-field">
              <label>Department</label>
              <div className="ps-input-wrap">
                <BookOpen className="ps-input-icon" size={14} />
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="ps-field-group" style={{ marginTop: '20px' }}>
            <div className="ps-field">
              <label>Year</label>
              <div className="ps-input-wrap">
                <BookOpen className="ps-input-icon" size={14} />
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                />
              </div>
            </div>
            <div className="ps-field">
              <label>Bio</label>
              <div className="ps-input-wrap">
                <User className="ps-input-icon" size={14} />
                <input
                  type="text"
                  value={form.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
          </div>

          <div className="ps-divider" />

          {/* Account Security */}
          <h3 className="ps-section-title">
            <Shield size={16} /> Account Security
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 4px' }}>Change Password</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Last changed 30 days ago</p>
              </div>
              <button style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                Update
              </button>
            </div>
            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', margin: '0 0 4px' }}>Two-Factor Authentication</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Add an extra layer of security to your account.</p>
              </div>
              <button style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#16a34a' }}>
                Enable
              </button>
            </div>
          </div>

          <div className="ps-actions">
            <button className="ps-save-btn">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsView