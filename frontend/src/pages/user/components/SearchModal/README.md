# SearchModal (`pages/user/components/SearchModal/`)

Full-screen search overlay for the student dashboard. Combines keyword input with multi-select category chips.

## Types

```ts
interface CategoryTag {
  tag: string
  count: number
}

interface SearchModalProps {
  open: boolean
  categories?: CategoryTag[]
  initialSearch?: string     // pre-fill the text input when opened
  initialTags?: string[]    // pre-selected chips when opened
  onApply?: (search: string, tags: string[]) => void  // called on Enter or "search"
  onClose?: () => void
}
```

## Features

- **Keyword input** — pre-filled from `initialSearch` when opened; `Enter` triggers `onApply`
- **Multi-select category chips** — click to toggle; count badge shows how many selected
- **Draft state** — edits inside the modal are held in local state until `apply()` is called; closing without applying discards them
- **Clear button** — appears when tags are selected; clears all tag selections
- **Backdrop click** — closes modal (Headless UI `Dialog` default)
- **Auto-focus** — input focuses automatically on open

## Data Flow

```
onApply(searchInput.trim(), pendingTags)
        ↓
Dashboard: submitSearch(text, tags)
        ↓
setSearchQuery(combined)
        ↓
useEffect([searchQuery]) → loadQuestions({ search })
```

## Usage

```tsx
import SearchModal from '../../../../pages/user/components/SearchModal/SearchModal'

{searchModalOpen && (
  <SearchModal
    open={searchModalOpen}
    categories={tagCounts}
    initialSearch={searchQuery}
    initialTags={selectedCategories}
    onApply={submitSearch}
    onClose={() => setSearchModalOpen(false)}
  />
)}
```

## Notes

- `onClose` is optional — the Dialog's default behavior handles backdrop/Escape close
- `initialSearch` and `initialTags` seed the draft state each time the modal opens
- Category data comes from `fetchQuestionTags()` → `tagCounts` array
