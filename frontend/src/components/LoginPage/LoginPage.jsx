import { useState } from 'react'
import { publicAxios } from '../../api/axios.js'

const initialForm = {
  email: '',
  password: '',
}

function LoginPage({ apiStatus }) {
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


    setRequestState({
      status: 'loading',
      message: '',
    })

    try {
      const { data } = await publicAxios.post('/auth/login', {
        email: form.email,
        password: form.password,
      })

      setRequestState({
        status: 'success',
        message: `Welcome back, ${data.name}. Login successful!`,
      })
      setForm(initialForm)
    } catch (error) {
      setRequestState({
        status: 'error',
        message:
          error.response?.data?.message ||
          'Login failed. Please check your credentials and try again.',
      })
    }
  }

  const isSubmitting = requestState.status === 'loading'

  return (
    <main className="login-page">
      <section className="signup-intro">
        <p className="eyebrow">FAQ Baseline</p>
        <h1>Welcome back!</h1>
        <p className="signup-description">
         Sign in to access your workspace, 
         manage reliable answers, 
         collaborate with your team, 
         and continue building a trusted knowledge base.
        </p>
        <p className="api-pill" aria-live="polite">
          {apiStatus}
        </p>
      </section>

      <section className="signup-card" aria-label="Login">
        <div className="signup-card-header">
          <p className="eyebrow">Login</p>
          <h2>Login</h2>
          <p>Use your existing account to continue.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
         
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
              autoComplete="current-password"
              minLength={8}
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
              type="password"
              value={form.password}
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
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
