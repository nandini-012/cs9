import ApiStatusBadge from '../ApiStatusBadge/ApiStatusBadge.jsx'
import CounterButton from '../CounterButton/CounterButton.jsx'
import HeroGraphic from '../HeroGraphic/HeroGraphic.jsx'

function HeroSection({ apiStatus, count, onIncrement }) {
  return (
    <section id="center">
      <HeroGraphic />
      <div>
        <ApiStatusBadge status={apiStatus} />
        <h1>Get started</h1>
        <p>
          Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
        </p>
      </div>
      <CounterButton count={count} onIncrement={onIncrement} />
    </section>
  )
}

export default HeroSection
