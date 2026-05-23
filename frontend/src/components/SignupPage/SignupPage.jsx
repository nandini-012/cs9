import { useState } from 'react'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function SignupPage({ apiStatus }) {
  const [form, setForm] = useState(initialForm)
  const [requestState, setRequestState] = useState({
    status: 'idle',
    message: '',
  })

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      setRequestState({
        status: 'error',
        message: 'Passwords do not match.',
      })
      return
    }

    setRequestState({
      status: 'loading',
      message: '',
    })

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create your account.')
      }

      setRequestState({
        status: 'success',
        message: `Welcome, ${data.name}. Your account is ready.`,
      })
      setForm(initialForm)
    } catch (error) {
      setRequestState({
        status: 'error',
        message: error.message || 'Unable to create your account.',
      })
    }
  }

  const isSubmitting = requestState.status === 'loading'

  return (
    <main className="signup-page">
      <section className="signup-intro">
        <p className="eyebrow">FAQ Baseline</p>
        <h1>Start answering with confidence.</h1>
        <p className="signup-description">
          Create an account to manage reliable answers, organize roles, and
          build a knowledge base your team can trust.
        </p>
        <p className="api-pill" aria-live="polite">
          {apiStatus}
        </p>
      </section>

      <section className="signup-card" aria-label="Sign up">
        <div className="signup-card-header">
          <p className="eyebrow">Create Account</p>
          <h2>Sign up</h2>
          <p>Use your work email to get started.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              autoComplete="name"
              name="name"
              onChange={handleChange}
              placeholder="Samya Roy"
              required
              type="text"
              value={form.name}
            />
          </label>

          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={handleChange}
              placeholder="you@company.com"
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="new-password"
              minLength={8}
              name="password"
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              required
              type="password"
              value={form.password}
            />
          </label>

          <label>
            Confirm password
            <input
              autoComplete="new-password"
              minLength={8}
              name="confirmPassword"
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              type="password"
              value={form.confirmPassword}
            />
          </label>

          {requestState.message && (
            <p
              className={`form-message ${requestState.status}`}
              role={requestState.status === 'error' ? 'alert' : 'status'}
            >
              {requestState.message}
            </p>
          )}

          <button className="signup-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default SignupPage
