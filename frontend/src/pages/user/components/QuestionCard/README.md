# QuestionCard (`pages/user/components/QuestionCard/`)

Displays a single question as a card with upvote, tags, meta, and action buttons.

## Types

```ts
export interface QuestionTag {
  label: string
  type: 'dark'
}

export interface NormalizedQuestion {
  id: string
  upvotes: number
  hasUpvoted: boolean
  author: 'self' | 'other'
  authorName: string
  timestamp: number
  tags: QuestionTag[]
  meta: string           // e.g. "2 hours ago"
  title: string
  desc: string           // raw HTML (rendered with dangerouslySetInnerHTML)
  comments: number
  status: 'Active' | 'In Progress' | 'Resolved' | 'Closed'
}

interface QuestionCardProps {
  query: NormalizedQuestion
  onUpvote: (id: string) => void
  onClick?: (id: string) => void
}
```

`NormalizedQuestion` is produced by `normalizeQuestion()` in `pages/user/service.js`.

## Features

- **Upvote button** — styled pill with count, toggles between `#8c6a40` (active) and `#d1d5db` (inactive)
- **Tags** — up to 2, black chips, capitalized
- **Author + time** — right-aligned meta line
- **Reply / View** — "View" for resolved questions (`status === 'Resolved'`), "Reply" otherwise
- **Report** — stub, calls `notifyError("Report doesn't supported yet.")`
- **Status badge** — colored icon + label (`Active`, `In Progress`, `Resolved`, `Closed`)

## Usage

```tsx
import QuestionCard from '../../../../pages/user/components/QuestionCard/QuestionCard'

<QuestionCard
  query={normalizeQuestion(q, currentUserId)}
  onUpvote={handleUpvote}
  onClick={handleCardClick}
/>
```
