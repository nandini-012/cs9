# LoginModal

Full-screen overlay login dialog. Called from `LandingPage`. Handles login form submission and a "forgot password" flow.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `onClose` | `() => void` | Closes the modal (backdrop click or X button) |
| `onLogin` | `(userData: unknown) => void` | Called with the API response on successful login |

## API Endpoint Called

`POST /api/auth/login` with `{ email, password }`.

## Usage

```tsx
import { LoginModal } from '@/components'

const [isLoginOpen, setIsLoginOpen] = useState(false)

<button onClick={() => setIsLoginOpen(true)}>Login</button>

{isLoginOpen && (
  <LoginModal
    onClose={() => setIsLoginOpen(false)}
    onLogin={(user) => {
      setIsLoginOpen(false)
      navigate(getRoleRedirect(user.role))
    }}
  />
)}
```

*Designed to be rendered inside any page — `LandingPage` is the canonical host.*