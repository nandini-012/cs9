# Input

Base text input component. Wraps native `<input>` with consistent border, focus ring, and error states.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Turns border red |
| `hint` | `string` | — | Helper text shown below the field |
| All others | — | — | Passed through to `<input>` |

## Usage

```tsx
import { Input } from '@/components/ui'

<Input type="email" placeholder="your@email.com" error={!!emailError} hint={emailError} />
```