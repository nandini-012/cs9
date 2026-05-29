# Card

Base card wrapper. Applies white background, rounded corners, and subtle shadow. Optionally acts as a clickable surface.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Card content |
| `className` | `string` | `''` | Extra CSS classes |
| `onClick` | `() => void` | — | Makes the card clickable |
| `hoverable` | `boolean` | `false` | Adds hover shadow lift |

## Usage

```tsx
import { Card } from '@/components/ui'

<Card hoverable onClick={() => navigate(`/faq/${id}`)}>
  <h3>{title}</h3>
  <p>{excerpt}</p>
</Card>
```