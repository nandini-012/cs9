import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import './LoginModal.css'

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth()

  if (!isOpen) return null
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login({ email, password })
      setEmail('')
      setPassword('')
      onClose()
    } catch (err: unknown) {
      const axiosErr = err as { message?: string }
      setError(axiosErr.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`A password reset link has been sent to ${email || 'your email'}.`)
    setIsForgotPassword(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X strokeWidth={1} />
        </button>

        {!isForgotPassword ? (
          <>
            <h2 className="modal-title">Welcome Back</h2>
            {error && <p className="modal-error">{error}</p>}
            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="modal-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                type="password"
                className="modal-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="modal-forgot"
                onClick={() => setIsForgotPassword(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsForgotPassword(true)}
              >
                Forgot Password?
              </span>
              <button
                type="submit"
                className="modal-submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="modal-title" style={{ marginBottom: '16px' }}>
              Reset Password
            </h2>
            <p className="modal-hint">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            <form className="modal-form" onSubmit={handleForgotSubmit}>
              <input
                type="email"
                className="modal-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="modal-submit" style={{ marginTop: '16px' }}>
                Send Reset Link
              </button>
              <span
                className="modal-forgot"
                style={{ textAlign: 'center', marginTop: '12px' }}
                onClick={() => { setIsForgotPassword(false); setError('') }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (setIsForgotPassword(false), setError(''))}
              >
                Back to Login
              </span>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginModal