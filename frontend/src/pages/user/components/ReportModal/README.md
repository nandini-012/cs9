# ReportModal (`pages/user/components/ReportModal/`)

Modal for reporting inappropriate question content.

## Types

```ts
interface ReportModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { reason: string; description: string }) => void
  submitting: boolean
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Controls visibility |
| `onClose` | `() => void` | Called on Cancel or backdrop click |
| `onSubmit` | `(payload) => void` | Called with `{ reason, description }` on Send Report |
| `submitting` | `boolean` | Disables button while true |

## Components Used

- `Modal` (global) — `position="center"`
- `Select` (global) — reason dropdown
- `Button` (global) — Cancel + Send Report

## Design

- Reason dropdown + optional textarea + Cancel/Send Report buttons
- Submit button is `bg-red-600` to signal destructive action
- Currently a stub — `onSubmit` on the parent side calls `notifyError("Report doesn't supported yet.")`

## Usage

```tsx
import ReportModal from '../../../../pages/user/components/ReportModal/ReportModal'

<ReportModal
  open={isReportOpen}
  onClose={() => setIsReportOpen(false)}
  onSubmit={handleReportSubmit}
  submitting={isSubmitting}
/>
```
