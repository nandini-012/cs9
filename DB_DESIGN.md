# Database Design Plan — FAQ Portal
> Stack: **MongoDB** + **Mongoose** · DB name: `helpdesk`  
> Built on top of the existing auth foundation (`users`, `roles`, `user_role_mappers` collections).

---

## 0. Audit of Existing Models

The codebase currently has **two conflicting User model files**:

| File | Role strategy | ID type | Status |
|---|---|---|---|
| `src/models/User.js` | Inline `role` enum on document | MongoDB `_id` | Legacy / WIP |
| `src/models/user.model.js` | Separate `user_role_mappers` table | UUID `user_id` | Newer, cleaner |

**Decision → adopt `user.model.js` as canonical.** Delete `User.js` once auth is unified.  
Add a denormalised `role` string on the user document (populated from the mapper at login time) so the JWT can carry it without an extra lookup on every request.

---

## 1. Collections Overview

```
helpdesk/
├── users                 ← identity + cached spark total + expert flag
├── user_profiles         ← KYC / onboarding data (Screen 14)
├── roles                 ← role registry (existing)
├── user_role_mappers     ← user ↔ role junction (existing)
├── questions             ← core content
├── answers               ← replies to questions
├── comments              ← threaded comment tree (depth ≤ 1) — see THREADING_DESIGN.md
├── flags                 ← moderation reports (covers questions, answers, comments)
├── spark_transactions    ← append-only points ledger
└── notifications         ← in-app notification feed
```

---

## 2. Schema Definitions

---

### 2.1 `users`

**Extends the existing `user.model.js`.** Adds expert profile fields and a cached spark balance.

```js
{
  // ── identity ──────────────────────────────────────────────
  _id:            ObjectId,                 // Mongoose default
  user_id:        String (UUID v4),         // immutable, unique — used as FK everywhere
  name:           String,                   // max 100 chars
  email:          String,                   // unique, lowercase
  passwordHash:   String,                   // bcrypt 12 rounds, select:false

  // ── role (denormalised for JWT speed) ────────────────────
  role:           String,                   // enum: 'USER' | 'RESOLVER' | 'ADMIN'
                                            // mirrors user_role_mappers, updated on role change

  // ── expert profile (populated on onboarding Step 5) ──────
  is_expert:            Boolean,            // self-declared
  is_verified_expert:   Boolean,            // admin-approved
  expert_type:          String,             // 'Academic Advisor', 'Medical Professional' …
  specialty:            String,             // free text

  // ── gamification cache ───────────────────────────────────
  spark_points:   Number (default 0),       // derived total — updated on each SparkTransaction
  last_login_at:  Date,                     // used for daily-login +1 point check

  // ── optional profile ─────────────────────────────────────
  avatar_url:     String,                   // null = use initials avatar

  // ── Mongoose auto-fields ─────────────────────────────────
  created_at:     Date,
  updated_at:     Date
}
```

**Indexes**
```
users.email        → unique
users.user_id      → unique
users.spark_points → descending  (leaderboard sort)
users.role         → (admin user management filter)
```

---

### 2.2 `user_profiles`
> Holds KYC and onboarding form data from Screen 14. Kept separate to avoid bloating the auth document and to allow partial completion tracking.

```js
{
  _id:          ObjectId,
  profile_id:   String (UUID v4),
  user_id:      String,             // FK → users.user_id (1-to-1)

  // Step 1 — About You
  phone:        String,

  // Step 2 — KYC / Verification
  kyc: {
    id_type:    String,             // enum: 'National ID' | 'Passport' | "Driver's License"
    id_number:  String,
    verified:   Boolean,
    verified_at: Date
  },

  // Step 3 — Course & Refund
  course: {
    name:             String,       // dropdown value
    enrolled_on:      Date,
    refund_eligible:  Boolean
  },

  // Step 4 — File Platform
  files: {
    profile_photo_url:      String, // object-storage path
    supporting_doc_url:     String
  },

  // Step 5 — Expert Consultation
  credentials_url:          String, // uploaded expert credentials

  // ── progress tracking ─────────────────────────────────────
  onboarding_completed: Boolean (default false),
  onboarding_step:      Number,   // 1–5, last completed step

  created_at: Date,
  updated_at: Date
}
```

**Indexes**
```
user_profiles.user_id → unique  (one profile per user)
```

---

### 2.3 `questions`
> Core content entity. Tags, upvote list, and cached counters live on the document.

```js
{
  _id:          ObjectId,
  question_id:  String (UUID v4),

  // ── content ───────────────────────────────────────────────
  title:        String,             // required, min 10 chars
  body:         String,             // markdown / rich text
  category:     String,             // from CATEGORIES enum
  tags:         [String],           // max 5, used as multikey index

  // ── authorship ────────────────────────────────────────────
  author_id:    String,             // FK → users.user_id

  // ── status ────────────────────────────────────────────────
  status:       String,             // enum: 'unanswered' | 'answered' | 'closed' | 'removed'
  is_pinned:    Boolean,

  // ── engagement (cached counters) ──────────────────────────
  upvotes:      Number (default 0),
  upvoted_by:   [String],           // array of user_ids (capped concern — see note below)
  view_count:   Number (default 0),
  answer_count: Number (default 0), // incremented on answer insert

  // ── expert flag ───────────────────────────────────────────
  has_expert_answer: Boolean (default false),

  // ── moderation ────────────────────────────────────────────
  moderation_status: String,        // enum: 'approved' | 'pending' | 'rejected'
                                    // default: 'approved' (goes to 'pending' on flag)
  created_at:  Date,
  updated_at:  Date
}
```

**Indexes**
```
questions.question_id            → unique
questions.author_id              → (my questions filter)
questions.category + status      → compound  (sidebar category filter)
questions.tags                   → multikey  (tag filter)
questions.created_at DESC        → (default feed sort)
questions.upvotes DESC           → (trending sort)
questions.moderation_status      → (admin moderation queue)
questions.title + body + tags    → text index  (global search)
```

> **Note on `upvoted_by` array**: At scale, storing all voter IDs on the document becomes problematic (16MB BSON limit). For a portal of this size it is fine; if vote counts exceed ~50k, move votes to a separate `question_votes` collection.

---

### 2.4 `answers`
> Replies to a question. Comments are **embedded** as a sub-document array (bounded, read together with the answer).

```js
{
  _id:          ObjectId,
  answer_id:    String (UUID v4),

  // ── relationships ─────────────────────────────────────────
  question_id:  String,             // FK → questions.question_id
  author_id:    String,             // FK → users.user_id

  // ── content ───────────────────────────────────────────────
  body:         String,             // rich text, min 20 chars
  references: [{                    // bonus options (Screen 7)
    url:   String,
    label: String
  }],
  attachments: [{                   // bonus options file attach
    file_url:   String,
    file_name:  String,
    mime_type:  String
  }],

  // ── expert fields (Screen 8) ──────────────────────────────
  is_expert:    Boolean,
  expert_type:  String,
  specialty:    String,

  // ── acceptance ────────────────────────────────────────────
  is_accepted:  Boolean (default false),

  // ── voting ────────────────────────────────────────────────
  upvotes:      Number (default 0),
  upvoted_by:   [String],

  // ── comment counters (replaces embedded array) ───────────
  // ⚠️  Embedded comments removed — see THREADING_DESIGN.md
  comment_count:           Number (default 0),  // all comments + replies
  top_level_comment_count: Number (default 0),  // depth-0 comments only

  // ── moderation ────────────────────────────────────────────
  moderation_status: String,        // enum: 'approved' | 'pending' | 'rejected'

  created_at: Date,
  updated_at: Date
}
```

**Indexes**
```
answers.answer_id                         → unique
answers.question_id                       → (fetch all answers for a question)
answers.question_id + is_accepted         → compound  (find accepted answer fast)
answers.question_id + upvotes DESC        → compound  ("Best" sort)
answers.question_id + created_at DESC     → compound  ("Newest" sort)
answers.author_id                         → (my answers)
```

---

### 2.5 `flags`
> Moderation reports from Screen 9. One report per user per target.

```js
{
  _id:          ObjectId,
  flag_id:      String (UUID v4),

  // ── target (polymorphic reference) ────────────────────────
  target_type:  String,             // enum: 'question' | 'answer' | 'comment'
  target_id:    String,             // UUID of the flagged question or answer

  // ── reporter ──────────────────────────────────────────────
  reported_by:  String,             // FK → users.user_id

  // ── reason ────────────────────────────────────────────────
  reason: String,                   // enum: 'Spam' | 'Misinformation' | 'Offensive language' | 'Other'
  notes:  String,                   // optional, only when reason = 'Other'

  // ── admin review ──────────────────────────────────────────
  status:       String,             // enum: 'pending' | 'approved' | 'rejected'
  reviewed_by:  String,             // FK → users.user_id (admin)
  reviewed_at:  Date,

  created_at:   Date,
  updated_at:   Date
}
```

**Indexes**
```
flags.flag_id                                 → unique
flags.target_type + target_id + reported_by  → unique compound  (no duplicate reports)
flags.status + created_at DESC               → compound  (admin moderation queue)
flags.reported_by                            → (user's own reports)
```

---

### 2.6 `spark_transactions`
> **Append-only** event ledger — never update, never delete. Totals are derived by aggregation and cached on `users.spark_points`.

```js
{
  _id:              ObjectId,
  transaction_id:   String (UUID v4),

  // ── who earned points ─────────────────────────────────────
  user_id:          String,         // FK → users.user_id

  // ── what happened ─────────────────────────────────────────
  action: String,                   // enum — see table below
  points: Number,                   // signed integer (+/-)

  // ── context ───────────────────────────────────────────────
  reference_id:   String,           // question_id or answer_id (nullable)
  reference_type: String,           // enum: 'question' | 'answer' (nullable)

  created_at: Date                  // immutable — no updated_at on this collection
}
```

**Action → Points table** (from design.md §5)

| `action` value      | Points |
|---|---|
| `SUBMIT_QUESTION`   | +2     |
| `SUBMIT_ANSWER`     | +5     |
| `ANSWER_UPVOTED`    | +3     |
| `ANSWER_ACCEPTED`   | +15    |
| `ADD_REFERENCE`     | +5     |
| `DAILY_LOGIN`       | +1     |
| `EXPERT_VERIFIED`   | +20    |

**Indexes**
```
spark_transactions.transaction_id      → unique
spark_transactions.user_id             → (aggregate total per user)
spark_transactions.user_id + created_at DESC → compound  (user history timeline)
spark_transactions.action              → (analytics breakdown)
```

**Cache invalidation rule**: After every insert, run:
```js
// Increment cached total — O(1) write
User.findOneAndUpdate({ user_id }, { $inc: { spark_points: points } })
```
Full recompute via aggregation is the fallback if the cache drifts.

---

### 2.7 `notifications`
> Powers Screen 12 (Notification Panel). Written when events happen; marked read in batch.

```js
{
  _id:               ObjectId,
  notification_id:   String (UUID v4),

  // ── recipient ─────────────────────────────────────────────
  recipient_id:  String,            // FK → users.user_id (who sees it)

  // ── actor ─────────────────────────────────────────────────
  actor_id:      String,            // FK → users.user_id (who triggered it)

  // ── type & message ────────────────────────────────────────
  type: String,                     // enum: 'answer' | 'upvote' | 'badge' | 'mention'
                                    //       | 'accepted' | 'flag_resolved'
                                    //       | 'comment' | 'reply'    ← added by threading
  title: String,                    // short push-style title
  body:  String,                    // "{Actor} answered your question about KYC"

  // ── deep link ─────────────────────────────────────────────
  reference_id:   String,           // question_id, answer_id, or comment_id
  reference_type: String,           // 'question' | 'answer' | 'comment'

  // ── thread anchor (added by threading — for comment/reply types) ──
  thread_anchor: {
    answer_id:       String,        // which answer to scroll to
    root_comment_id: String         // which thread to expand (null if depth-0)
  },

  // ── read state ────────────────────────────────────────────
  is_read:   Boolean (default false),

  created_at: Date                  // no updated_at needed
}
```

**Indexes**
```
notifications.notification_id                      → unique
notifications.recipient_id + is_read              → compound  (unread count badge)
notifications.recipient_id + created_at DESC      → compound  (notification feed)
```

**Mark-all-read** is a single bulk write:
```js
Notification.updateMany(
  { recipient_id: userId, is_read: false },
  { $set: { is_read: true } }
)
```

---

## 3. Relationship Map

```
users ──────────────────────────────────────────────────────────────┐
 │  1:1  user_profiles                                              │
 │  1:N  questions (author_id)                                      │
 │  1:N  answers (author_id)                                        │
 │  1:N  flags (reported_by)                                        │
 │  1:N  spark_transactions (user_id)                               │
 │  1:N  notifications (recipient_id, actor_id)                     │
 │                                                                  │
 ├──through user_role_mappers──── roles                             │
 │                                                                  │
questions ──────────────────────────────────────────────────────────┤
 │  1:N  answers (question_id)                                      │
 │  1:N  flags (target_id where target_type='question')            │
 │                                                                  │
answers ─────────────────────────────────────────────────────────── ┤
 │  1:N  comments (answer_id) ← extracted from embedded array      │
 │  1:N  flags (target_id where target_type='answer')              │
 │                                                                  │
comments ────────────────────────────────────────────────────────── ┤
 │  self  parent_id → comments.comment_id  (adjacency list)        │
 │  1:N   flags (target_id where target_type='comment')  ← new     │
 └───────────────────────────────────────────────────────────────── ┘
 See THREADING_DESIGN.md for full schema and data flows.
```

---

## 4. Role → Permission Matrix

| Action | USER | RESOLVER (Expert) | ADMIN |
|---|:---:|:---:|:---:|
| Browse feed / read questions | ✓ | ✓ | ✓ |
| Submit question | ✓ | ✓ | ✓ |
| Submit answer | ✓ | ✓ | ✓ |
| Submit expert answer (Screen 8) | ✗ | ✓ | ✓ |
| Accept answer (own question) | ✓ | ✓ | ✓ |
| Upvote question / answer | ✓ | ✓ | ✓ |
| Flag / report content | ✓ | ✓ | ✓ |
| View leaderboard | ✓ | ✓ | ✓ |
| View admin dashboard | ✗ | ✗ | ✓ |
| Approve / reject flags | ✗ | ✗ | ✓ |
| Pin / close questions | ✗ | ✗ | ✓ |
| Manage users (promote to RESOLVER) | ✗ | ✗ | ✓ |

> **Mapping**: `RESOLVER` in the backend = `expert` in the UI and design spec.

---

## 5. Data Flow for Key Workflows

### Flow A — Ask a Question
```
POST /api/questions
  → insert questions document (status: 'unanswered')
  → insert spark_transactions (+2 SUBMIT_QUESTION)
  → users.spark_points += 2
```

### Flow B — Submit an Answer
```
POST /api/answers
  → insert answers document
  → questions.answer_count += 1
  → if answer_count was 0 → questions.status = 'answered'
  → insert spark_transactions (+5 SUBMIT_ANSWER)
  → users.spark_points += 5
  → if references[] non-empty → spark_transactions (+5 ADD_REFERENCE)
  → insert notification for question author (type: 'answer')
```

### Flow C — Accept Answer
```
PATCH /api/answers/:id/accept   (only question author)
  → answers.is_accepted = true
  → if was previously accepted answer → unset it first (only one at a time)
  → questions.status = 'answered'
  → insert spark_transactions (+15 ANSWER_ACCEPTED) for answer author
  → users.spark_points += 15
  → insert notification for answer author (type: 'accepted')
```

### Flow D — Upvote
```
POST /api/questions/:id/upvote  (toggle)
  → if user_id already in upvoted_by → remove, questions.upvotes -= 1
  → else → add, questions.upvotes += 1, spark_transactions (+3 ANSWER_UPVOTED)
  (same pattern for answers)
```

### Flow E — Flag → Moderation
```
POST /api/flags
  → insert flags (status: 'pending')
  → questions/answers.moderation_status = 'pending'

PATCH /api/flags/:id  (admin only)
  → flags.status = 'approved' | 'rejected'
  → if approved → questions.status = 'removed' (or answers hidden)
  → insert notification for original reporter (type: 'flag_resolved')
```

### Flow F — Daily Login Spark
```
POST /auth/login (or /auth/me)
  → check users.last_login_at
  → if last_login_at.date < today → insert spark_transactions (+1 DAILY_LOGIN)
  → users.last_login_at = now, users.spark_points += 1
```

### Flow G — Leaderboard
```
GET /api/leaderboard
  → User.find().sort({ spark_points: -1 }).limit(100)
  → cached result (TTL: 5 minutes) — leaderboard doesn't need real-time precision
```

---

## 6. Issues to Resolve Before Implementation

| # | Issue | Current state | Recommendation |
|---|---|---|---|
| 1 | Two User model files | `User.js` vs `user.model.js` | Delete `User.js`, use `user.model.js` as canonical; add `role` field to it |
| 2 | `authController.js` references `User.js` | Bug: `user.findOne().select('+passwordHash')` but `User.js` uses `password` field | Rewrite controller to use `user.model.js` + `passwordHash` |
| 3 | `authRoutes.js` vs `auth.routes.js` | Both exist, different controllers | Consolidate into `auth.routes.js` with the newer controller |
| 4 | Login does not set JWT cookie | `user.controller.js` returns raw JSON, no cookie | Add cookie-based JWT to `loginUser` in `user.controller.js` |
| 5 | `role` field missing from `user.model.js` | Roles are in separate mapper, but JWT needs role | Add denormalised `role` String to user document |
| 6 | Expert approval flow undefined | Design.md lists it as an ambiguity | **Decision**: self-declaration on onboarding → admin promotes to verified via `/admin` |

---

## 7. Files to Create (Mongoose Models)

| File | Collection | Priority |
|---|---|---|
| `src/models/user.model.js` | `users` | ✏️ Update existing (add role, spark, expert fields) |
| `src/models/user-profile.model.js` | `user_profiles` | 🆕 New |
| `src/models/question.model.js` | `questions` | 🆕 New |
| `src/models/answer.model.js` | `answers` | 🆕 New (no embedded comments — see THREADING_DESIGN.md) |
| `src/models/comment.model.js` | `comments` | 🆕 New (adjacency list — see THREADING_DESIGN.md) |
| `src/models/flag.model.js` | `flags` | 🆕 New |
| `src/models/spark-transaction.model.js` | `spark_transactions` | 🆕 New |
| `src/models/notification.model.js` | `notifications` | 🆕 New (with thread_anchor — see THREADING_DESIGN.md) |
| `src/models/role.model.js` | `roles` | ✅ Keep as-is |
| `src/models/user-role-mapper.model.js` | `user_role_mappers` | ✅ Keep as-is |

---

## 8. Seed Data Required

```js
// Roles (roles collection)
[
  { name: 'user',     role_id: '<uuid>' },
  { name: 'resolver', role_id: '<uuid>' },  // = Expert in UI
  { name: 'admin',    role_id: '<uuid>' }
]

// Default admin user
{
  name: 'Portal Admin',
  email: 'admin@university.edu',
  role: 'ADMIN',
  spark_points: 0
}

// Seed FAQ categories as part of app config (not DB — static list in constants)
```

---

*This plan is based on: `backend/.env.example` (MongoDB `helpdesk` db), `User.js`, `user.model.js`, `role.model.js`, `user-role-mapper.model.js`, `authController.js`, `user.controller.js`, `authMiddleware.js`, and the full `design.md` specification.*
