# Navbar

Top navigation bar. Sticky, blurred-glass style. Adapts to auth state — shows a Login button or Dashboard + Logout when authenticated.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `onOpenLogin` | `() => void` | Opens the `LoginModal` |
| `isAuthenticated` | `boolean` | Toggles between public and auth states |
| `onLogout` | `() => void` | Clears auth state and redirects |

## Usage

```tsx
import { Navbar } from '@/components'

<Navbar
  onOpenLogin={() => setIsLoginOpen(true)}
  isAuthenticated={!!user}
  onLogout={logout}
/>
```