# Leaderboard

Ranks the top contributors in the internship community. Three ranking factors are
available as tabs; the active factor is requested from the backend and rendered as a
**top-3 podium + numbered ranked list**.

## Ranking factors (tabs)

| Tab | API `type` | What it measures |
|-----|------------|------------------|
| **Spark Points** | `spark` | Overall engagement currency (`user.spark_points`) — login, asking, answering, upvotes, accepted answers, bounties. Default tab. |
| **Reputation** | `reputation` | Trust/quality signal (`profile.reputation`) — earned only from answer upvotes, accepted answers, and expert verification. |
| **Accepted Answers** | `acceptedAnswers` | Count of the user's answers that were marked as the accepted solution (live aggregation). |

> See `backend/LEADERBOARD.md` for how each score is computed and maintained.

## Data flow

```
LeaderboardPage
  └─ fetchLeaderboard({ type, limit })   →  GET /api/leaderboard?type=<factor>&limit=20
        ↳ returns [{ userId, displayName, score }]   (already sorted high → low)
```

- On tab change, `type` changes → `useCallback` `load()` re-runs → fresh fetch.
- The list arrives pre-sorted from the backend; the component does **no client-side ranking**.

## Layout

- **Podium** — top 3 entries, displayed in `2nd · 1st · 3rd` order with gold/silver/bronze
  rings and rank badges (`MEDAL` map). The #1 avatar is rendered larger.
- **Ranked list** — entries from rank 4 onward as numbered rows (rank, avatar initials,
  name, score, unit).
- **Current user** is highlighted (brown) and labelled **"You"** in both the podium and list,
  matched via `entry.userId === user.userId` (from the layout's outlet context).
- `unit` label per tab: `pts` (spark), `rep` (reputation), `answers` (accepted answers).

## States

- **Loading** — spinner while fetching.
- **Empty** — "No ranked contributors yet." when the factor returns no rows.

## Routing / navigation

- Route: `/leaderboard` (child of the user layout, so it keeps the sidebar + header).
- The LeftPane **Leaderboard** tab navigates here; its active highlight is derived from the
  current route in `layout.jsx`.

## Props / context

- Reads `user` from `useOutletContext()` (provided by the user layout) to highlight the
  signed-in user's row. No props.
