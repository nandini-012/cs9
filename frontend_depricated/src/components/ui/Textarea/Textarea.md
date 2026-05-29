# Textarea

Base textarea component. Same API pattern as `Input` but for multi-line text.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Turns border red |
| `hint` | `string` | — | Helper text below the field |
| All others | — | — | Passed through to `<textarea>` |

## Usage

```tsx
import { Textarea } from '@/components/ui'

<Textarea rows={6} placeholder="Describe your issue..." error={!!descError} hint={descError} />
```