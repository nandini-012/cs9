# AnswerCard

Displays a single answer / comment within a query thread. Includes upvote controls, solution badge, admin endorsement flag, and an inline reply box.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | — | Unique answer/comment ID |
| `author` | `string` | — | Display name of author |
| `authorInitials` | `string` | — | Used to generate avatar image |
| `authorRole` | `string` | — | Optional role label shown in badge |
| `avatarBg` | `string` | `'#0D8ABC'` | Avatar background colour (hex) |
| `body` | `string` | — | Answer text content |
| `date` | `string` | — | Timestamp string |
| `upvotes` | `number` | — | Net upvote count |
| `voteState` | `'up' \| 'down' \| null` | `null` | Current user's vote |
| `isSolution` | `boolean` | `false` | Marks as accepted solution |
| `isAdminEndorsed` | `boolean` | `false` | Shows admin endorsement badge |
| `attachment` | `{ name: string }` | — | Optional file attachment |
| `canReport` | `boolean` | `true` | Whether the report button shows |
| `isOwn` | `boolean` | `false` | Hides report button if true |
| `onUpvote` | `() => void` | — | | `onDownvote` | `() => void` | — | |
| `onReport` | `() => void` | — | |
| `onSubmitComment` | `(text: string) => void` | — | |

## Usage

```tsx
<AnswerCard
  id="a1"
  author="Alex Rivera"
  authorInitials="AR"
  authorRole="PEER RESOLVER"
  body="The NOC is essentially required to finalize your internship contract..."
  date="commented Oct 13"
  upvotes={42}
  voteState={null}
  isSolution={true}
  isAdminEndorsed={true}
  attachment={{ name: 'NOC_Template_V2.pdf' }}
  onUpvote={() => {}}
  onDownvote={() => {}}
  onReport={() => openReportModal()}
/>
```