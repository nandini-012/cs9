# QuestionCard

Displays a single FAQ / query summary card with upvote control, tags, metadata, and status.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `number` | — | Unique query ID |
| `title` | `string` | — | Query title |
| `desc` | `string` | — | Query body excerpt |
| `upvotes` | `number` | — | Current upvote count |
| `hasUpvoted` | `boolean` | `false` | Whether current user has upvoted |
| `author` | `'self' \| 'other'` | — | Whether this is the user's own query |
| `tags` | `Tag[]` | — | Label pills to show |
| `meta` | `string` | — | Secondary meta text (time, category…) |
| `comments` | `number` | — | Number of comments |
| `status` | `'Active' \| 'In Progress' \| 'Resolved'` | — | Status badge |
| `onUpvote` | `(id: number) => void` | — | Called when upvote is clicked |
| `onClick` | `(id: number) => void` | — | Called when card body is clicked |

## Tag Shape

```ts
{ label: string; type?: 'dark' | 'light' | 'custom'; customStyle?: React.CSSProperties }
```

## Usage

```tsx
<QuestionCard
  id={1}
  title="When do I submit the NOC?"
  desc="Lorem ipsum dolor sit amet..."
  upvotes={42}
  tags={[{ label: 'NOC', type: 'custom', customStyle: { background: '#e5ccb3', color: '#8c6a40' } }]}
  meta="5 hours ago • Administration"
  comments={18}
  status="In Progress"
  onUpvote={(id) => handleUpvote(id)}
  onClick={(id) => navigate(`/faq/${id}`)}
/>
```