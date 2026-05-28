import React from 'react'
import './PasswordStrengthMeter.css'

const LEVELS = [
  { threshold: 25, label: 'Weak',   color: '#ef4444' },
  { threshold: 50, label: 'Fair',   color: '#f97316' },
  { threshold: 75, label: 'Good',   color: '#eab308' },
  { threshold: 101, label: 'Strong', color: '#22c55e' },
]

function getLevel(score: number) {
  return LEVELS.find((l) => score <= l.threshold) || LEVELS[LEVELS.length - 1]
}

export interface StrengthResult {
  score: number
  checks: { label: string; satisfied: boolean }[]
  label: string
}

export interface PasswordStrengthMeterProps {
  strength: StrengthResult
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength }) => {
  if (!strength || strength.score === 0) return null

  const level = getLevel(strength.score)

  return (
    <div className="psm-wrapper">
      <div className="psm-bar">
        <div
          className="psm-fill"
          style={{
            width: `${strength.score}%`,
            background: level.color,
          }}
        />
      </div>
      <div className="psm-row">
        <span className="psm-label" style={{ color: level.color }}>
          {level.label}
        </span>
        <div className="psm-checks">
          {strength.checks.map((check, i) => (
            <span
              key={i}
              className={`psm-check ${check.satisfied ? 'satisfied' : ''}`}
            >
              {check.satisfied ? '✓' : '○'} {check.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PasswordStrengthMeter