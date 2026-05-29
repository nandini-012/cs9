# Select

Base select / dropdown. Wraps `<select>` with consistent styling and a custom chevron icon.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `{value: string, label: string}[]` | — | Dropdown options (required) |
| `placeholder` | `string` | — | First blank option text |
| `error` | `boolean` | `false` | Turns border red |
| `hint` | `string` | — | Helper text below the field |
| All others | — | — | Passed through to `<select>` |

## Usage

```tsx
import { Select } from '@/components/ui'

<Select
  options={[
    { value: 'academics', label: 'Academics' },
    { value: 'finance',   label: 'Stipend / Finance' },
    { value: 'noc',       label: 'NOC / Onboarding' },
  ]}
  placeholder="Select a category"
  error={!!categoryError}
/>
```