# FAQ Portal — Design Specification
> Feed this document to a thinking LLM to implement the full product.

---

## 0. Mental Model

This is a **crowdsourced FAQ portal** — users ask questions, the community answers, experts validate, admins moderate. It rewards contribution through a gamified point system ("Spark" points) and a leaderboard. The flow has three distinct actor perspectives: **Guest → Member → Admin**.

---

## 1. Design System

### 1.1 Color Tokens
```
--color-bg:        #FFFFFF
--color-surface:   #F5F6FA
--color-border:    #E2E4EA
--color-primary:   #1A2744   /* Navy — primary actions, headers */
--color-accent:    #E8A020   /* Amber — highlights, points, CTA */
--color-danger:    #D94040   /* Red — flags, errors */
--color-text-1:    #1A2744   /* Headings */
--color-text-2:    #4A5568   /* Body */
--color-text-3:    #9AA3B2   /* Captions, placeholders */
```

### 1.2 Typography
```
Display / Headings : "Sora", sans-serif
Body / UI          : "DM Sans", sans-serif
Mono (code blocks) : "JetBrains Mono", monospace
```

### 1.3 Spacing Scale
Base unit = 4px. Use multiples: 4, 8, 12, 16, 24, 32, 48, 64.

### 1.4 Component Primitives
- **Card**: white bg, 1px `--color-border`, border-radius 10px, shadow `0 1px 4px rgba(0,0,0,0.06)`
- **Button Primary**: `--color-primary` bg, white text, 8px radius, 14px Sora medium
- **Button Ghost**: transparent, `--color-primary` border + text
- **Badge**: pill shape, 6px radius, small caps, used for tags/categories
- **Avatar**: circular, 32px default, initials fallback in navy

---

## 2. Screens & Components

### SCREEN 1 — Landing / Onboarding FAQ Summary
**Route**: `/`  
**Actor**: Guest (unauthenticated)

**Purpose**: Introduce the portal with a collapsible FAQ accordion before the user logs in. Acts as a trust-building preview.

**Layout**:
```
[ Topbar: Logo | Login CTA ]
[ Hero: Title + short description ]
[ Accordion List ]
  ├─ 1. About the University
  ├─ 2. KYC Requirements          ← has a red "Required" badge
  ├─ 3. Course Refund
  ├─ 4. File Platform
  └─ 5. Expert Consultation
[ Footer: Links | Copyright ]
```

**Component rules**:
- Accordion items expand inline; only one open at a time
- "KYC Requirements" item carries a `--color-danger` pill badge labeled "Required"
- Footer is dark navy (`--color-primary`) with white text and two link columns

**State**:
- Default: all collapsed
- Expanded: item shows body text + optional inline CTA button

---

### SCREEN 2 — Login Modal
**Route**: `/login` (or modal overlay)  
**Actor**: Guest

**Purpose**: Email + password authentication.

**Layout**:
```
[ Modal Card 360px wide ]
  ├─ Logo / portal name
  ├─ "Welcome back" heading
  ├─ Email input
  ├─ Password input
  ├─ [ Login Button ] (full width, primary)
  └─ "Forgot password?" link
```

**Behavior**:
- On success → redirect to FAQ Feed
- Inline field-level validation errors below each input

---

### SCREEN 4 — FAQ Feed (Main Dashboard)
**Route**: `/feed`  
**Actor**: Member

**Purpose**: Browse, filter, and vote on questions. The core loop of the product.

**Layout**:
```
[ Topbar ]
  ├─ Logo (left)
  ├─ Global search bar (center)
  └─ [ Ask a Question ] button | Notification bell | Avatar (right)

[ Body: 2-column grid, max-width 1100px centered ]
  ├─ LEFT (70%) — Question list
  │   ├─ Filter tabs: All | Unanswered | My Questions | Trending
  │   └─ [ QuestionCard ] × N  (see below)
  └─ RIGHT (30%) — Sidebar
      ├─ Category filter checklist
      ├─ Top contributors (mini leaderboard, 3 entries)
      └─ "Ask an Expert" promo block
```

**QuestionCard component**:
```
[ Card ]
  ├─ Top row: Author avatar | Name | Timestamp | Category badge
  ├─ Question title (bold, 16px)
  ├─ Preview snippet (2 lines, truncated)
  ├─ Tag pills (up to 3)
  └─ Bottom row:
      ├─ ▲ Upvote  [ count ]
      ├─ 💬 Answers [ count ]
      ├─ 👁 Views  [ count ]
      └─ [ Flag icon ] (right-aligned)
```

**State variations**:
- `answered`: green left border accent
- `unanswered`: amber left border accent
- `pinned`: star icon in top-right corner of card

---

### SCREEN 5 — Question Detail
**Route**: `/questions/:id`  
**Actor**: Member

**Purpose**: Full question view with threaded answers, voting, and commenting.

**Layout**:
```
[ Back link ]
[ Question Block ]
  ├─ Title (h1)
  ├─ Author row + timestamp + category badge
  ├─ Full question body (rich text rendered)
  ├─ Tag pills
  └─ Action row: ▲ Upvote | 💬 Comment | 🚩 Flag | Share

[ Answers Section ]
  ├─ "N Answers" heading + Sort dropdown (Best | Newest | Oldest)
  └─ [ AnswerCard ] × N
      ├─ Author avatar + name + "Expert" badge (conditional)
      ├─ Answer body
      ├─ ▲ Upvote count
      ├─ ✓ Accept answer (only question author sees this)
      └─ [ Comment thread — collapsible ]

[ Answer Editor ]
  ├─ Rich text toolbar (B / I / Link / Code / List)
  ├─ Text area (min 120px)
  ├─ Bonus options row (see Screen 7)
  └─ [ Submit Answer ] button
```

**Accepted answer** state: green checkmark, "Accepted Answer" banner at top of answer card, floated to top of list.

---

### SCREEN 6 — Ask a Question Modal
**Route**: modal over current page  
**Actor**: Member

**Purpose**: Lightweight question submission.

**Layout**:
```
[ Modal 520px ]
  ├─ Heading: "Ask a Question"
  ├─ Title input (single line)
  ├─ Category dropdown
  ├─ Tag input (comma-separated chips)
  ├─ Description textarea (optional, 4 rows)
  └─ [ Cancel ] [ Submit Question ]
```

**Behavior**:
- Title is required; ≥ 10 characters
- Submit triggers optimistic insert, card appears at top of feed
- Modal closes on backdrop click or Escape

---

### SCREEN 7 — Bonus Options (Answer Enhancement)
**Route**: inline within Answer Editor  
**Actor**: Member

**Purpose**: Allow the answerer to attach supplemental value — links, documents, or earn bonus Spark points for quality answers.

**Layout**:
```
[ Collapsible "Bonus Options" section inside Answer Editor ]
  ├─ Toggle row: "Add bonus contributions" [ chevron ]
  Expanded:
  ├─ [ + Add Link ]    — URL input + label
  ├─ [ + Attach File ] — file picker, PDF/image only
  └─ "Adding references earns +5 Spark points" tip text
```

---

### SCREEN 8 — Answer Submission Form (Doctor / Expert Onboarding)
**Route**: `/answer-select/:questionId`  
**Actor**: Expert Member

**Purpose**: Structured multi-field answer form for expert-verified responses.

**Layout**:
```
[ Page header: Question title recap ]
[ Form Card ]
  ├─ "Doctor / Expert Type" dropdown
  ├─ Specialty input
  ├─ Answer body (rich text)
  ├─ Reference URL(s)
  └─ [ Submit Expert Answer ] (primary) | [ Cancel ] (ghost)
```

---

### SCREEN 9 — Flag / Report Modal
**Route**: modal  
**Actor**: Member

**Purpose**: Report inappropriate content.

**Layout**:
```
[ Modal 400px ]
  ├─ "Report this content" heading
  ├─ Radio options:
  │   ○ Spam
  │   ○ Misinformation
  │   ○ Offensive language
  │   ○ Other
  ├─ Optional notes textarea (visible when "Other" selected)
  └─ [ Cancel ] [ Submit Report ] (danger style)
```

---

### SCREEN 10 — Admin Dashboard
**Route**: `/admin`  
**Actor**: Admin

**Purpose**: Oversight of platform activity — moderation queue, stats, user management.

**Layout**:
```
[ Sidebar nav: Dashboard | Questions | Users | Reports | Settings ]

[ Main content ]
  ├─ Stat cards row (4 cards):
  │   ├─ Total Questions
  │   ├─ Pending Moderation
  │   ├─ Active Users (today)
  │   └─ Answers This Week
  │
  ├─ "Moderation Queue" table
  │   Columns: Question | Category | Reported By | Date | [ Approve ] [ Reject ]
  │
  └─ "Recent Activity" feed (right sidebar)
      — latest questions and answers in chronological order
```

**Table row states**:
- Default: white row
- Flagged: amber left border
- Auto-removed: red left border + strikethrough text

---

### SCREEN 11 — Spark Achievement Leaderboard
**Route**: `/leaderboard`  
**Actor**: Member / Admin

**Purpose**: Gamification — display top contributors ranked by Spark points.

**Layout**:
```
[ Page header: "Spark Achievement Leaderboard" + subtitle ]

[ Top 3 Podium ] (visual: 2nd | 1st | 3rd with avatar + point badge)

[ Full Rankings Table ]
  Columns: Rank | Avatar + Name | Spark Points | Answers Given | Accepted Answers | Badge
  ├─ Row 1–3: amber background tint
  └─ "Your rank" row: navy highlight (always visible, sticky to bottom of viewport)
```

**Badge tiers** (shown as icon + label):
```
0–99 pts     → Newcomer   (grey)
100–499 pts  → Contributor (blue)
500–999 pts  → Expert     (amber)
1000+ pts    → Champion   (navy + star)
```

---

### SCREEN 12 — Notification Panel
**Route**: overlay/popover (bell icon trigger)  
**Actor**: Member

**Layout**:
```
[ Popover 320px, right-aligned to bell icon ]
  ├─ Header: "Notifications" | "Mark all read"
  └─ [ NotificationItem ] × N
      ├─ Icon (answer / upvote / badge / mention)
      ├─ Text: "{Actor} {action} on your question"
      ├─ Timestamp (relative: "2h ago")
      └─ Unread indicator: blue dot (left edge)
```

---

### SCREEN 13 — Coming Soon Placeholder
**Route**: `/coming-soon` (or behind feature flag)

**Layout**:
```
[ Centered full-page ]
  ├─ Logo
  ├─ Large text: "Coming Soon"
  └─ Subtext: "This feature is under development."
```

---

### SCREEN 14 — Personal Info Onboarding (Mobile)
**Route**: `/onboarding`  
**Actor**: New Member (mobile)

**Purpose**: Multi-step form to collect user profile data post-registration.

**Steps** (progress bar at top, N of 5):
```
Step 1 — About You
  ├─ Full name
  ├─ Email (prefilled, readonly)
  └─ Phone number

Step 2 — KYC / Verification
  ├─ ID type dropdown (National ID / Passport / Driver's License)
  └─ ID number input

Step 3 — Course & Refund Info
  ├─ Enrolled course dropdown
  ├─ Enrollment date
  └─ Refund eligibility toggle (Yes / No)

Step 4 — File Platform
  ├─ Upload profile photo
  └─ Upload supporting document (PDF, max 5MB)

Step 5 — Expert Consultation
  ├─ "Are you an expert?" toggle
  ├─ IF YES → Specialty input + credentials upload
  └─ Confirm & Submit
```

**Navigation**: [ Back ] [ Next ] buttons pinned to bottom of screen. Progress bar updates per step.

---

## 3. User Flows

### Flow A — Guest to Answered Question
```
Landing (Screen 1)
  → Login (Screen 2)
  → FAQ Feed (Screen 4)
  → Question Detail (Screen 5)
```

### Flow B — Ask & Answer
```
FAQ Feed (Screen 4)
  → [ Ask a Question ] → Ask Modal (Screen 6)
  → Question posted → appears in Feed
  → Another user opens Question Detail (Screen 5)
  → Writes answer → expands Bonus Options (Screen 7)
  → Submits → Spark points awarded
```

### Flow C — Expert Answer
```
Question Detail (Screen 5)
  → [ Expert Answer ] → Expert Form (Screen 8)
  → Submitted → tagged "Expert Verified" badge on answer card
```

### Flow D — Moderation
```
Member flags content → Flag Modal (Screen 9)
  → Lands in Admin Dashboard queue (Screen 10)
  → Admin Approves / Rejects
  → Member notified via Notification Panel (Screen 12)
```

### Flow E — New Member Onboarding (Mobile)
```
Post-registration redirect
  → Onboarding Step 1–5 (Screen 14)
  → On complete → FAQ Feed (Screen 4)
```

---

## 4. Interaction & Behavior Rules

| Interaction | Behavior |
|---|---|
| Upvote | Optimistic UI update; toggle off on second click |
| Accept Answer | Only question author; only one accepted per question |
| Submit Question | Optimistic insert at top of feed; rollback on API error |
| Flag | Confirmation modal before submission |
| Leaderboard rank | Current user's row always visible (sticky) |
| Notifications | Unread count badge on bell; clears on panel open |
| Accordion (Landing) | Single open at a time |
| Answer editor | Minimum 20 characters to enable Submit |

---

## 5. Gamification Logic (Spark Points)

| Action | Points |
|---|---|
| Submit a question | +2 |
| Submit an answer | +5 |
| Answer gets upvoted | +3 per upvote |
| Answer accepted | +15 |
| Add a reference/link | +5 |
| Daily login | +1 |
| Answer marked Expert Verified | +20 |

Badge tiers defined in Screen 11.

---

## 6. "Coming Soon" Features (Placeholders)

The following screens exist as placeholders (`--color-surface` bg, centered text only):
- Advanced analytics for admins
- Direct messaging between members
- Course-specific FAQ sub-channels

---

## 7. Implementation Notes for LLM

When implementing this spec, follow this priority order:

1. **Data model first** — define entities: `User`, `Question`, `Answer`, `Comment`, `Flag`, `SparkTransaction`, `Badge`
2. **Auth flow** — Login → OTP → session token → role-based routing (`guest | member | admin | expert`)
3. **Feed + Detail** — the core read loop; must work before write flows
4. **Write flows** — Ask, Answer, Upvote, Flag (all need optimistic UI)
5. **Admin layer** — read-only dashboard first, then moderation actions
6. **Gamification** — point ledger as append-only event log; derive totals on read
7. **Leaderboard** — computed view over SparkTransaction log; cache-friendly
8. **Notifications** — webhook or polling; mark-read is a batch PATCH

### Component Reuse Map
```
QuestionCard       used in: Feed, Admin queue, Leaderboard (linked)
AnswerCard         used in: Question Detail, Admin queue
AuthorRow          used in: QuestionCard, AnswerCard
TagPill            used in: QuestionCard, Detail, Ask Modal, Filter sidebar
SparkBadge         used in: Leaderboard, Profile, AnswerCard (Expert badge)
RichTextEditor     used in: AnswerEditor, ExpertForm
Modal              used in: Login, OTP, AskQuestion, Flag, BonusOptions
NotificationItem   used in: NotificationPanel
```

### Ambiguities / Decisions Needed
- Does "Expert" status require admin approval or self-declaration?
- Can admins delete questions, or only hide/reject them?
- Are comments on answers threaded (reply-to-comment) or flat?
- Is the leaderboard global or scoped per category/course?
