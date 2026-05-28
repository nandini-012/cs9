# Button

Base button component. Wraps native `<button>` with consistent styling tokens.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size scale |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows a spinner and disables |
| `children` | `ReactNode` | — | Button label / content |

All other props (`onClick`, `type`, `className`, etc.) are passed through to the underlying `<button>` element.

## Usage

```tsx
import { Button } from '@/components/ui'

<Button variant="primary" onClick={() => handleSubmit()}>
  Submit
</Button>

<Button variant="secondary" size="sm" disabled>
  Cancel
</Button>
```