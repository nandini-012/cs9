import { useEffect, useState } from 'react'
import { publicAxios } from './api/axios.js'
import { LoginPage } from './components/index.js'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Connecting to API...')

  useEffect(() => {
    let isMounted = true

    publicAxios
      .get('/health')
      .then(({ data }) => {
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
