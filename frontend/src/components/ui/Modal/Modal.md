# Modal

Base overlay modal. Renders a centred dialog with a backdrop blur. Content-driven — no fixed header/footer.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controls visibility (required) |
| `onClose` | `() => void` | — | Called when backdrop is clicked |
| `children` | `ReactNode` | — | Modal body content |
| `width` | `string` | `'440px'` | Max-width of the modal box |

## Usage

```tsx
import { Modal } from '@/components/ui'

<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Confirm Action</h2>
  <p>Are you sure?</p>
  <button onClick={() => setIsOpen(false)}>Cancel</button>
</Modal>
```