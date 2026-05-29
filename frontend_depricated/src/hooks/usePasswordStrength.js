import { useMemo } from 'react'

/**
 * Evaluates password strength on a 0–100 scale.
 *
 * Each satisfied criterion earns 20 points:
 *   0 – length ≥ 8
 *   1 – contains uppercase
 *   2 – contains lowercase
 *   3 – contains digit
 *   4 – contains special character
 */
export function usePasswordStrength(password) {
  return useMemo(() => {
    if (!password || password.length === 0) {
      return { score: 0, checks: [], label: 'None' }
    }

    const checks = [
      {
        label: 'At least 8 characters',
        satisfied: password.length >= 8,
      },
      {
        label: 'Contains uppercase letter',
        satisfied: /[A-Z]/.test(password),
      },
      {
        label: 'Contains lowercase letter',
        satisfied: /[a-z]/.test(password),
      },
      {
        label: 'Contains a number',
        satisfied: /\d/.test(password),
      },
      {
        label: 'Contains special character (!@#$%^&*...)',
        satisfied: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      },
    ]

    const score = checks.filter((c) => c.satisfied).length * 20

    let label
    if (score === 0) label = 'None'
    else if (score <= 25) label = 'Weak'
    else if (score <= 50) label = 'Fair'
    else if (score <= 75) label = 'Good'
    else label = 'Strong'

    return { score, checks, label }
  }, [password])
}