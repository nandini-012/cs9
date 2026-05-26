# Threaded Comments — DB Design Amendment
> Amends `DB_DESIGN.md` · Affects: `answers`, `flags`, `notifications`, `spark_transactions`  
> Adds: new `comments` collection

---

## 0. The Problem with the Current Design

`DB_DESIGN.md §2.4` embeds comments as a flat sub-document array inside `answers`:

```js
// ❌ Current — flat, embedded, not extendable
answers.comments: [{
  comment_id: String,
  author_id:  String,
  body:       String,
  created_at: Date
}]
```

This breaks down the moment threading is required:

| Constraint | Embedded flat array | Why it fails |
|---|---|---|
| Replies to comments | ✗ | No way to point to a parent comment |
| Paginate comments independently | ✗ | Must load entire answer document |
| Upvote individual comments | ✗ | Can't hold `upvoted_by` per subdoc efficiently |
| Flag a comment | ✗ | `flags.target_type` has no `'comment'` entry |
| Notify on reply | ✗ | No `parent_id` to trace back the recipient |
| Soft-delete a comment | ✗ | Removal rewrites the embedded array |
| Scale past ~50 comments | ✗ | Document size grows unbounded |

**Decision: extract comments into their own collection** using an **adjacency list** with a hard depth cap of 2 levels.

---

## 1. Thread Hierarchy

```
Question
  └─── Answer          ← replies to the question (already in answers collection)
         └─── Comment  ← depth 0 — top-level reply to an answer
                └─── Reply  ← depth 1 — reply to a comment (MAX DEPTH)
```

Depth cap at 1 (like Stack Overflow / GitHub PR comments) keeps the UI and queries simple.  
Replies-to-replies are rejected at the API layer with HTTP 422.

---

## 2. New Collection — `comments`

```js
{
  _id:          ObjectId,
  comment_id:   String (UUID v4),       // immutable, unique

  // ── ownership ─────────────────────────────────────────────────
  question_id:      String,             // FK → questions.question_id
                                        // stored here to support cascade-remove
                                        // and question-level comment feeds
  answer_id:        String,             // FK → answers.answer_id
                                        // the root answer this comment thread lives on

  // ── adjacency list ────────────────────────────────────────────
  parent_id:        String | null,      // null  → depth-0 comment (reply to answer)
                                        // UUID  → depth-1 reply (reply to a comment)
  root_comment_id:  String | null,      // null  → depth-0
                                        // UUID  → ID of the depth-0 ancestor
                                        //         (allows fetching a whole sub-thread in 1 query)
  depth:            Number,             // 0 or 1 — enforced at write time

  // ── content ───────────────────────────────────────────────────
  author_id:    String,                 // FK → users.user_id
  body:         String,                 // max 2000 chars; light markdown allowed
  mentions:     [String],               // user_ids extracted from @name tokens in body

  // ── engagement ────────────────────────────────────────────────
  upvotes:      Number (default 0),
  upvoted_by:   [String],               // user_ids; toggle logic same as answers
  reply_count:  Number (default 0),     // cached count of direct replies (depth+1 children)

  // ── moderation / soft-delete ──────────────────────────────────
  is_deleted:        Boolean (default false),
                                        // soft delete → body replaced with "[comment removed]"
                                        //               in API response; children preserved
  moderation_status: String,            // enum: 'approved' | 'pending' | 'rejected'

  created_at:   Date,
  updated_at:   Date
}
```

### Indexes

```
comments.comment_id                                   → unique

comments.answer_id  + parent_id + created_at ASC     → compound
  // primary read: "load top-level comments for answer X, sorted oldest first"
  // query: { answer_id, parent_id: null }

comments.root_comment_id + depth + created_at ASC    → compound
  // load all replies in a sub-thread: { root_comment_id: 'abc', depth: 1 }

comments.parent_id                                    → single-field
  // lazy-load replies for a specific comment: { parent_id: 'xyz' }

comments.author_id                                    → single-field
  // user profile: all comments made by a user

comments.question_id                                  → single-field
  // cascade: delete all comments when a question is removed
```

---

## 3. Changes to `answers` Collection

**Remove** the embedded `comments` array.  
**Add** two cached counter fields.

```js
// ✂️  DELETE this entire block from answers schema:
comments: [{
  comment_id: String,
  author_id:  String,
  body:       String,
  created_at: Date
}],

// ✅  ADD these two fields:
comment_count:        Number (default 0),
  // incremented on new comment, decremented on hard-delete
  // NOT decremented on soft-delete (thread slot still exists)

top_level_comment_count: Number (default 0),
  // count of depth-0 comments only
  // used to show "X comments" in the AnswerCard without loading replies
```

### Updated `answers` schema (diff view)

```js
{
  _id:          ObjectId,
  answer_id:    String (UUID v4),
  question_id:  String,
  author_id:    String,
  body:         String,
  references:   [{ url, label }],
  attachments:  [{ file_url, file_name, mime_type }],
  is_expert:    Boolean,
  expert_type:  String,
  specialty:    String,
  is_accepted:  Boolean,
  upvotes:      Number,
  upvoted_by:   [String],

  // 🆕 replaced embedded comments array
  comment_count:           Number (default 0),
  top_level_comment_count: Number (default 0),

  // ❌ REMOVED: comments: [{ ... }]

  moderation_status: String,
  created_at: Date,
  updated_at: Date
}
```

---

## 4. Changes to `flags` Collection

Add `'comment'` to the `target_type` enum so individual comments can be reported.

```js
// Before
target_type: String  // enum: 'question' | 'answer'

// After
target_type: String  // enum: 'question' | 'answer' | 'comment'
```

No other structural change. `target_id` already accepts any UUID, so it naturally holds a `comment_id`.

---

## 5. Changes to `notifications` Collection

Two additions:

### 5a — New `type` values

```js
// Before
type: String  // enum: 'answer' | 'upvote' | 'badge' | 'mention' | 'accepted' | 'flag_resolved'

// After — add:
//   'comment'  → someone commented on your answer
//   'reply'    → someone replied to your comment
//   'mention'  → already existed; now also fires for @mentions in comments
type: String  // enum: 'answer' | 'upvote' | 'badge' | 'mention' | 'accepted'
              //       | 'flag_resolved' | 'comment' | 'reply'
```

### 5b — Expanded `reference_type`

```js
// Before
reference_type: String  // 'question' | 'answer'

// After
reference_type: String  // 'question' | 'answer' | 'comment'
```

### 5c — Add `thread_anchor` field (new)

When a `reply` notification deep-links into the UI, the client needs to know which **answer** to scroll to and which **root comment** to expand — a `comment_id` alone is not enough.

```js
// Add to notifications schema:
thread_anchor: {
  answer_id:        String,   // which answer to scroll to
  root_comment_id:  String    // which comment thread to expand (null if depth-0)
}
```

---

## 6. Changes to `spark_transactions` Collection

The original spec (design.md §5) does not assign Spark points for comments.  
Two options — **pick one before implementation**:

| Option | Action added | Points | Rationale |
|---|---|---|---|
| A — No comment points | *(none)* | — | Keeps incentives focused on answers, not noise |
| B — Reward engagement | `SUBMIT_COMMENT` | +1 | Encourages discussion; small enough not to game |

**Recommendation: Option A** (no points for comments).  
If chosen, no schema change needed in `spark_transactions`.

If Option B is chosen later, add one row to the enum:

```js
// spark_transactions.action enum — add if Option B adopted:
'SUBMIT_COMMENT'   // +1
```

And extend the `reference_type` to include `'comment'` for the `reference_id` context field.

---

## 7. Tree Rendering Strategy (Application Layer)

MongoDB does not do recursive joins. The tree is assembled in the Node.js layer.

### Strategy: Two-query load per AnswerCard

```
Step 1 — Load top-level comments (depth=0) for a given answer, paginated
  db.comments.find({ answer_id, parent_id: null })
             .sort({ created_at: 1 })
             .limit(10)         ← first page; "Load more" fetches next 10

Step 2 — Eagerly load first N replies for each top-level comment
  db.comments.find({
    root_comment_id: { $in: topLevelIds },
    depth: 1
  }).sort({ created_at: 1 })
  → group by root_comment_id in application layer
```

This gives you:
- 1 query for top-level comments
- 1 query for all their first-level replies (batched, not N+1)
- Total: **2 queries** to render a fully expanded comment thread

### Rendered tree shape (API response)

```json
[
  {
    "comment_id": "c1",
    "depth": 0,
    "author": { "name": "Priya Das", "avatarInitials": "PD" },
    "body": "Can you clarify what '200 DPI' means here?",
    "upvotes": 3,
    "reply_count": 2,
    "created_at": "2025-05-22T10:30:00Z",
    "replies": [
      {
        "comment_id": "c2",
        "depth": 1,
        "parent_id": "c1",
        "root_comment_id": "c1",
        "author": { "name": "Arjun Mehta", "avatarInitials": "AM" },
        "body": "@Priya Das 200 dots per inch — most phone cameras exceed this.",
        "upvotes": 1,
        "reply_count": 0,
        "created_at": "2025-05-22T10:45:00Z",
        "replies": []           // always empty — depth cap enforced
      }
    ]
  }
]
```

---

## 8. Data Flow — New Comment Workflows

### Flow H — Post a Top-Level Comment (depth 0)

```
POST /api/comments
Body: { answer_id, body }

  → validate: answer exists, body ≥ 1 char
  → insert comment { depth: 0, parent_id: null, root_comment_id: null }
  → answers.comment_count += 1
  → answers.top_level_comment_count += 1
  → extract @mentions from body → mentions: [user_ids]
  → for each mention: insert notification (type: 'mention', reference_type: 'comment')
  → insert notification for answer.author_id (type: 'comment')
      skip if commenter === answer author
```

### Flow I — Post a Reply to a Comment (depth 1)

```
POST /api/comments
Body: { answer_id, parent_id, body }

  → fetch parent comment
  → validate: parent.depth === 0  (reject 422 if depth > 0 — max depth enforced)
  → insert comment {
      depth: 1,
      parent_id: parent.comment_id,
      root_comment_id: parent.comment_id   // parent IS the root at depth=0
    }
  → parent_comment.reply_count += 1
  → answers.comment_count += 1
  → extract @mentions from body
  → insert notification for parent.author_id (type: 'reply',
      thread_anchor: { answer_id, root_comment_id: parent.comment_id })
      skip if replier === parent author
  → for each new @mention: insert notification (type: 'mention')
```

### Flow J — Soft-Delete a Comment

```
DELETE /api/comments/:id   (author or admin only)

  → comments.is_deleted = true
  → comments.body = "[comment removed]"   ← overwrite content
  → do NOT decrement answer.comment_count  (slot preserved, thread integrity kept)
  → if comment had replies: replies remain visible under "[comment removed]" parent
  → if comment had 0 replies: can optionally hard-delete
      → if hard-delete: answer.comment_count -= 1, answer.top_level_comment_count -= 1
```

### Flow K — Upvote a Comment (toggle)

```
POST /api/comments/:id/upvote

  → if user_id in upvoted_by → $pull, upvotes -= 1
  → else → $addToSet, upvotes += 1
  → no Spark points for comment upvotes (Option A decision)
```

### Flow L — Flag a Comment

```
POST /api/flags
Body: { target_type: 'comment', target_id: comment_id, reason, notes? }

  → insert flag (same flow as question/answer flags)
  → comment.moderation_status = 'pending'
  → lands in admin moderation queue (same table — target_type column shows 'comment')
```

---

## 9. API Endpoints (New + Changed)

### New endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/comments` | USER+ | Create comment or reply |
| `GET` | `/api/answers/:id/comments` | USER+ | Paginated top-level comments + replies |
| `GET` | `/api/comments/:id/replies` | USER+ | Lazy-load replies for a comment |
| `PATCH` | `/api/comments/:id` | Author / ADMIN | Edit comment body |
| `DELETE` | `/api/comments/:id` | Author / ADMIN | Soft-delete comment |
| `POST` | `/api/comments/:id/upvote` | USER+ | Toggle upvote |

### Changed endpoints

| Method | Path | Change |
|---|---|---|
| `GET` | `/api/answers/:id` | Response no longer includes embedded `comments` array |
| `POST` | `/api/flags` | `target_type` now accepts `'comment'` |
| `GET` | `/api/admin/flags` | Moderation table rows may now have `target_type = 'comment'` |
| `GET` | `/api/notifications` | New types: `'comment'`, `'reply'`; new field: `thread_anchor` |

---

## 10. Updated Relationship Map

```
users
 │  1:N  comments (author_id)
 │  1:N  notifications (recipient_id, actor_id)
 │  ...  (all prior relationships unchanged)
 │
questions
 │  1:N  answers (question_id)
 │  1:N  comments (question_id)    ← new link for cascade delete
 │  1:N  flags
 │
answers
 │  1:N  comments (answer_id)      ← replaces embedded sub-documents
 │  1:N  flags
 │
comments ──────────────────────────────── self-referential via parent_id
 │  parent_id  → comments.comment_id     (null for depth-0)
 │  1:N  flags (target_type='comment')   ← new
 │  1:N  notifications (reference_type='comment')  ← new
```

---

## 11. Migration Plan (Existing Data)

The current production state is pre-launch (no live comments data), so migration is simple:

```
Step 1  Run schema update: remove comments[] from answers documents
        db.answers.updateMany({}, { $unset: { comments: "" } })

Step 2  Add new counter fields with default 0
        db.answers.updateMany({},
          { $set: { comment_count: 0, top_level_comment_count: 0 } }
        )

Step 3  Create comments collection (empty — Mongoose creates on first insert)

Step 4  Create indexes (run once on deploy)
        See §2 Indexes above

Step 5  Deploy new comment model + endpoints
        Old endpoints still work — no breaking changes to answers API shape
        except removal of the (currently empty) comments[] field
```

If there is any embedded comment data to preserve:

```js
// One-time migration script: lift embedded → collection
const answers = await Answer.find({ 'comments.0': { $exists: true } })

for (const answer of answers) {
  for (const c of answer.comments) {
    await Comment.create({
      comment_id:      c.comment_id || randomUUID(),
      question_id:     answer.question_id,
      answer_id:       answer.answer_id,
      parent_id:       null,
      root_comment_id: null,
      depth:           0,
      author_id:       c.author_id,
      body:            c.body,
      created_at:      c.created_at,
    })
  }
  await Answer.updateOne(
    { answer_id: answer.answer_id },
    {
      $unset: { comments: '' },
      $set: {
        comment_count:           answer.comments.length,
        top_level_comment_count: answer.comments.length,
      }
    }
  )
}
```

---

## 12. New Model File Required

```
backend/src/models/comment.model.js    ← 🆕 New
```

Existing model files affected:

| File | Change |
|---|---|
| `src/models/answer.model.js` | Remove `comments` sub-schema; add `comment_count`, `top_level_comment_count` |
| `src/models/flag.model.js` | `target_type` enum: add `'comment'` |
| `src/models/notification.model.js` | `type` enum: add `'comment'`, `'reply'`; `reference_type`: add `'comment'`; add `thread_anchor` field |

---

## 13. Updated `DB_DESIGN.md` Diff Summary

| Section | Before | After |
|---|---|---|
| §1 Collections overview | 9 collections | 10 collections (+ `comments`) |
| §2.4 `answers` schema | `comments: [{ ... }]` embedded | `comment_count`, `top_level_comment_count` |
| §2.5 `flags` target_type | `'question' \| 'answer'` | `+ 'comment'` |
| §2.7 `notifications` type | 6 types | `+ 'comment' \| 'reply'` |
| §2.7 `notifications` reference_type | `'question' \| 'answer'` | `+ 'comment'` |
| §2.7 `notifications` fields | — | `+ thread_anchor: { answer_id, root_comment_id }` |
| §3 Relationship map | comments embedded in answers | comments as independent collection, self-referential |
| §7 Files to create | 7 new model files | `+ comment.model.js` → 8 new files |

---

*Designed against: `DB_DESIGN.md` (base), `design.md §SCREEN 5` (collapsible comment thread UI), design.md §4 interaction rules (comments are flat or threaded — answered here as threaded, max depth 2).*
