# Badge

Status badge / tag. Colour-coded pill for categories, states, and labels.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'muted'` | `'default'` | Colour scheme |
| `size` | `'sm' \| 'md'` | `'md'` | Size |
| `children` | `ReactNode` | — | Label text |
| `className` | `string` | `''` | Extra CSS classes |

## Usage

```tsx
import { Badge } from '@/components/ui'

<Badge variant="success">Resolved</Badge>
<Badge variant="danger" size="sm">URGENT</Badge>
```