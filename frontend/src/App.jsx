import { useEffect, useState } from 'react'
import { SignupPage, LoginPage } from './components/index.js'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Connecting to API...')

  useEffect(() => {
    let isMounted = true

    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('API request failed')
        }

        return response.json()
      })
      .then((data) => {
        if (isMounted) {
          setApiStatus(`API connected: ${data.status}`)
        }
      })
      .catch(() => {
        if (isMounted) {
          setApiStatus('API unavailable')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <LoginPage apiStatus={apiStatus} />
  )
}

export default App
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
