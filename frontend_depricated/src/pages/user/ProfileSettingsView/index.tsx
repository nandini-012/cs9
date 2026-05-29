import React, { useEffect, useState, useCallback } from 'react'
import { Camera, Mail, User, BookOpen, Shield, Save, Loader, CheckCircle, Star, Sparkles, MapPin, Globe, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import publicAxios from '@/api/axios'
import './ProfileSettingsView.css'

interface Profile {
  userId: string
  displayName: string
  bio: string
  avatarUrl: string
  expertise: string[]
  location: string
  socialLinks: { linkedin?: string; github?: string; twitter?: string }
  sparkBalance: number
  reputation: number
}

type Tab = 'profile' | 'security' | 'activity'

export const ProfileSettingsView: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    linkedin: '',
    github: '',
    twitter: '',
    phone: '',
    department: '',
    rollNo: '',
  })

  const fetchProfile = useCallback(async () => {
    try {
      setError(null)
      const res = await publicAxios.get('/api/profile/me')
      const p: Profile = res.data.profile
      setProfile(p)
      setForm((prev) => ({
        ...prev,
        displayName: p.displayName ?? '',
        bio: p.bio ?? '',
        location: p.location ?? '',
        linkedin: p.socialLinks?.linkedin ?? '',
        github: p.socialLinks?.github ?? '',
        twitter: p.socialLinks?.twitter ?? '',
      }))
    } catch {
      setError('Failed to load profile. Please refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await publicAxios.patch('/api/profile/me', {
        displayName: form.displayName,
        bio: form.bio,
        location: form.location,
        socialLinks: {
          linkedin: form.linkedin,
          github: form.github,
          twitter: form.twitter,
        },
      })
      setProfile(res.data.profile)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    // TODO: wire to /api/auth/change-password when implemented
    setError('Password change not implemented yet — coming soon.')
  }

  const avatarColor = (name: string) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31
    return colors[Math.abs(hash) % colors.length]
  }

  const userName = profile?.displayName ?? user?.name ?? 'Student'
  const initials = userName.slice(0, 2).toUpperCase()
  const email = user?.email ?? ''

  if (loading) {
    return (
      <div className="ps-container">
        <div className="ps-loading">
          <div className="ps-spinner" />
          <p>Loading profile…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="ps-container fade-in">
      {/* Profile Header Card */}
      <div className="ps-hero-card">
        <div className="ps-hero-avatar">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={userName} />
          ) : (
            <div style={{ background: avatarColor(userName) }}>{initials}</div>
          )}
          <button className="ps-photo-edit-btn" aria-label="Change photo">
            <Camera size={14} />
          </button>
        </div>
        <div className="ps-hero-info">
          <h2>{userName}</h2>
          <p>{email}</p>
          {profile?.location && (
            <span className="ps-hero-meta">
              <MapPin size={12} /> {profile.location}
            </span>
          )}
        </div>
        <div className="ps-hero-stats">
          <div className="ps-stat">
            <div className="ps-stat-value">
              <Sparkles size={16} />
              {profile?.sparkBalance?.toLocaleString() ?? 0}
            </div>
            <div className="ps-stat-label">Spark Balance</div>
          </div>
          <div className="ps-stat-divider" />
          <div className="ps-stat">
            <div className="ps-stat-value">
              <Star size={16} />
              {profile?.reputation ?? 0}
            </div>
            <div className="ps-stat-label">Reputation</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="ps-tabs">
        {([
          { id: 'profile', label: 'Profile Info', icon: <User size={15} /> },
          { id: 'security', label: 'Security', icon: <Shield size={15} /> },
          { id: 'activity', label: 'My Activity', icon: <BookOpen size={15} /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
          <button
            key={tab.id}
            className={`ps-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="ps-error-banner">
          <AlertCircle size={14} />
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Tab: Profile Info */}
      {activeTab === 'profile' && (
        <div className="ps-card">
          <div className="ps-form">
            <h3 className="ps-section-title">
              <User size={16} /> Personal Information
            </h3>
            <div className="ps-field-group">
              <div className="ps-field">
                <label>Display Name</label>
                <div className="ps-input-wrap">
                  <User className="ps-input-icon" size={14} />
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    placeholder="How should we address you?"
                  />
                </div>
              </div>
              <div className="ps-field">
                <label>Email Address</label>
                <div className="ps-input-wrap disabled">
                  <Mail className="ps-input-icon" size={14} />
                  <input type="email" value={email} disabled />
                </div>
                <span className="ps-hint">Contact admin to change your institute email.</span>
              </div>
            </div>

            <div className="ps-field-group" style={{ marginTop: '20px' }}>
              <div className="ps-field" style={{ gridColumn: '1 / -1' }}>
                <label>Bio</label>
                <div className="ps-input-wrap">
                  <BookOpen className="ps-input-icon" size={14} />
                  <textarea
                    className="ps-textarea"
                    value={form.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Tell us about yourself…"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="ps-field-group" style={{ marginTop: '20px' }}>
              <div className="ps-field">
                <label>Location</label>
                <div className="ps-input-wrap">
                  <MapPin className="ps-input-icon" size={14} />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g. IIT Ropar, Punjab"
                  />
                </div>
              </div>
            </div>

            <div className="ps-divider" />

            <h3 className="ps-section-title">
              <Globe size={16} /> Social Links
            </h3>
            <div className="ps-field-group">
              <div className="ps-field">
                <label>LinkedIn</label>
                <div className="ps-input-wrap">
                  <Globe className="ps-input-icon" size={14} />
                  <input
                    type="url"
                    value={form.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/yourhandle"
                  />
                </div>
              </div>
              <div className="ps-field">
                <label>GitHub</label>
                <div className="ps-input-wrap">
                  <Globe className="ps-input-icon" size={14} />
                  <input
                    type="url"
                    value={form.github}
                    onChange={(e) => handleChange('github', e.target.value)}
                    placeholder="github.com/yourhandle"
                  />
                </div>
              </div>
            </div>
            <div className="ps-field-group" style={{ marginTop: '20px' }}>
              <div className="ps-field">
                <label>Twitter / X</label>
                <div className="ps-input-wrap">
                  <Globe className="ps-input-icon" size={14} />
                  <input
                    type="url"
                    value={form.twitter}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    placeholder="x.com/yourhandle"
                  />
                </div>
              </div>
            </div>

            <div className="ps-actions">
              {saved && (
                <span className="ps-saved-msg">
                  <CheckCircle size={15} /> Changes saved
                </span>
              )}
              <button className="ps-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader size={15} className="ps-spinning" /> Saving…</> : <><Save size={15} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className="ps-card">
          <div className="ps-form">
            <h3 className="ps-section-title">
              <Shield size={16} /> Account Security
            </h3>

            <div className="ps-security-item">
              <div className="ps-security-info">
                <div className="ps-security-icon-wrap" style={{ background: '#dcfce7', color: '#16a34a' }}>
                  <Shield size={18} />
                </div>
                <div>
                  <p className="ps-security-title">Change Password</p>
                  <p className="ps-security-desc">Use a strong password with a mix of letters, numbers, and symbols.</p>
                </div>
              </div>
              <button
                className="ps-security-btn"
                onClick={handlePasswordChange}
              >
                Update
              </button>
            </div>

            <div className="ps-security-item">
              <div className="ps-security-info">
                <div className="ps-security-icon-wrap" style={{ background: '#fef9c3', color: '#854d0e' }}>
                  <Shield size={18} />
                </div>
                <div>
                  <p className="ps-security-title">Two-Factor Authentication</p>
                  <p className="ps-security-desc">Add an extra layer of security via an authenticator app.</p>
                </div>
              </div>
              <button
                className="ps-security-btn"
                style={{ color: '#16a34a', borderColor: '#16a34a' }}
                onClick={() => setError('2FA setup is coming soon.')}
              >
                Enable
              </button>
            </div>

            <div className="ps-security-item">
              <div className="ps-security-info">
                <div className="ps-security-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}>
                  <AlertCircle size={18} />
                </div>
                <div>
                  <p className="ps-security-title">Active Sessions</p>
                  <p className="ps-security-desc">You're logged in on this device. Review your active sessions.</p>
                </div>
              </div>
              <button
                className="ps-security-btn"
                style={{ color: '#dc2626', borderColor: '#dc2626' }}
                onClick={() => setError('Session management is coming soon.')}
              >
                Manage
              </button>
            </div>

            <div className="ps-security-notice">
              <AlertCircle size={13} />
              For account deletion or other sensitive requests, contact <strong>admin@iitr.ac.in</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab: My Activity */}
      {activeTab === 'activity' && (
        <div className="ps-card">
          <div className="ps-form">
            <h3 className="ps-section-title">
              <BookOpen size={16} /> Your Activity Summary
            </h3>

            <div className="ps-activity-grid">
              <div className="ps-activity-stat">
                <div className="ps-activity-num">
                  <Sparkles size={18} style={{ color: '#f59e0b' }} />
                  {profile?.sparkBalance?.toLocaleString() ?? 0}
                </div>
                <div className="ps-activity-label">Spark Balance</div>
                <p className="ps-activity-desc">Earned by contributing helpful answers and getting upvoted.</p>
              </div>
              <div className="ps-activity-stat">
                <div className="ps-activity-num">
                  <Star size={18} style={{ color: '#8b5cf6' }} />
                  {profile?.reputation ?? 0}
                </div>
                <div className="ps-activity-label">Reputation</div>
                <p className="ps-activity-desc">Trust score based on your contributions and community standing.</p>
              </div>
              <div className="ps-activity-stat">
                <div className="ps-activity-num">
                  <User size={18} style={{ color: '#3b82f6' }} />
                  {userName}
                </div>
                <div className="ps-activity-label">Display Name</div>
                <p className="ps-activity-desc">Shown on your public profile and contributions.</p>
              </div>
              <div className="ps-activity-stat">
                <div className="ps-activity-num">
                  <BookOpen size={18} style={{ color: '#10b981' }} />
                  {profile?.expertise?.length ?? 0}
                </div>
                <div className="ps-activity-label">Expertise Tags</div>
                <p className="ps-activity-desc">Topics you're tagged as an expert in (set by admins).</p>
              </div>
            </div>

            <div className="ps-divider" />

            <h3 className="ps-section-title" style={{ marginBottom: '16px' }}>
              Recent Contributions
            </h3>
            <div className="ps-empty-state">
              <BookOpen size={28} style={{ opacity: 0.3, margin: '0 auto 12px', display: 'block' }} />
              <p>Your questions and answers will appear here.</p>
              <a href="/raise-query" style={{
                display: 'inline-block', marginTop: '12px', color: '#0b1528',
                fontWeight: 600, fontSize: '13px', textDecoration: 'none',
              }}>
                Raise your first query →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileSettingsView