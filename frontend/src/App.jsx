import { useEffect, useState } from 'react'
import { DividerTicks, HeroSection, NextSteps } from './components/index.js'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [apiStatus, setApiStatus] = useState('Checking API...')

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
          setApiStatus(`API: ${data.status}`)
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
    <>
      <HeroSection
        apiStatus={apiStatus}
        count={count}
        onIncrement={() => setCount((currentCount) => currentCount + 1)}
      />
      <DividerTicks />
      <NextSteps />
      <DividerTicks />
      <section id="spacer"></section>
    </>
  )
}

export default App
