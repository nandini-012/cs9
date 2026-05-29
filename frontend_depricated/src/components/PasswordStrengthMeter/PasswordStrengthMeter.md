# PasswordStrengthMeter

Visual password strength indicator with a colour-coded progress bar and per-criterion checklist.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `strength` | `StrengthResult` | Yes | Result from `usePasswordStrength` hook |

## StrengthResult Shape

```ts
{
  score: number   // 0-100
  label: string   // 'Weak' | 'Fair' | 'Good' | 'Strong'
  checks: { label: string; satisfied: boolean }[]
}
```

## Usage

```tsx
import { usePasswordStrength } from '@/hooks'
import { PasswordStrengthMeter } from '@/components'

const [password, setPassword] = useState('')
const strength = usePasswordStrength(password)

<PasswordStrengthMeter strength={strength} />
```
*Usually rendered inside a Sign Up form — see `LoginModal` for an example.*