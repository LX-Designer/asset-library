# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Vite, port 5173)
npm run build    # production build → dist/
npm run preview  # serve dist/ locally
```

No test runner or linter is configured.

Local env: copy `.env.example` → `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The Supabase client warns but won't crash without them.

## Architecture

**Stack:** React 18, Vite 5, React Router v6, Supabase JS v2. Deployed on Vercel. Serverless functions live in `/api/` (Vercel format — `export default async function handler(req, res)`).

**Two user types:**
- **Students** — anonymous. Identity is a UUID generated on first visit and stored in `localStorage` under `lp_session_id` (`src/lib/session.js`). No login required.
- **Teachers** — Supabase email/password auth. Auth state is provided via `AuthContext` (`src/contexts/AuthContext.jsx`) and accessed with `useAuth()`. Teacher routes are wrapped in `ProtectedRoute` which redirects unauthenticated users to `/login`.

**Styling:** CSS Modules throughout — no Tailwind, no component libraries. Global design tokens (colours, spacing, typography) are CSS custom properties in `src/index.css`. Individual assets define their own tokens inside their root class. Never add UI libraries.

---

## Asset system

Assets are self-contained interactive labs. Each asset lives in `src/assets/<asset-id>/` and must have:

| file | purpose |
|---|---|
| `index.jsx` | the React component — receives `onResponse`, `onComplete`, `savedResponses`, `isCompleted`, `completion` as props. Full-layout assets also receive `onReset` (wired to a Start Again control — the platform handles DB wipe and re-mount). |
| `meta.js` | metadata object with `id`, `title`, `inquiryType`, `estimatedTime`, `audience`, `layout` (`'full'` or default) |

**Registration:** import the meta in `src/registry.js` and add it to `assetRegistry`. Vite picks up the component automatically via `import.meta.glob('../../assets/*/index.jsx')` in `AssetWrapper`.

**AssetWrapper** (`src/components/AssetWrapper/AssetWrapper.jsx`) handles everything the asset shouldn't need to think about:
- Dynamically loads the asset component
- Fetches all saved responses and completion record from Supabase on mount
- Provides `onResponse(questionId, response)` — upserts a row to `asset_responses`
- Provides `onComplete(score, metadata)` — upserts a row to `asset_completions`
- Renders `ClassJoinPrompt` above the asset (student class join flow)
- Shows a completion banner if the asset has been finished

**Resume position** is not stored explicitly. Assets compute which screen to start on by walking their step order and returning the first step with no saved response.

---

## Database (Supabase)

| table | key columns | notes |
|---|---|---|
| `asset_responses` | `session_id, asset_id, question_id, response (jsonb)` | upsert on `(session_id, asset_id, question_id)` |
| `asset_completions` | `session_id, asset_id, score, metadata, completed_at` | upsert on `(session_id, asset_id)` |
| `classes` | `id, teacher_id, name, join_code` | teacher-owned; RLS enforced |
| `class_memberships` | `class_id, session_id` | links anonymous student sessions to classes |

RLS: `classes` requires authenticated teacher ownership for writes. `class_memberships` allows anon insert/select (join codes are the access control). `asset_responses` and `asset_completions` are publicly readable (session IDs act as unguessable tokens).

Migrations are in `supabase/migrations/`. Apply via Supabase MCP (`apply_migration`) or the Supabase SQL Editor.

---

## Teacher dashboard

Routes under `/dashboard` and `/dashboard/classes/:classId` are protected by `ProtectedRoute`. `Dashboard.jsx` lets teachers create classes (6-char join codes from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, retries up to 5× on unique collision). `ClassDetail.jsx` shows a session × asset grid with lazy-loaded response drill-down.

## AI feedback

`/api/ai-feedback.js` is a Vercel serverless proxy to the Gemini 2.0 Flash API. Accepts `{ system, userMessage }`, returns `{ text }`. Requires `GEMINI_API_KEY` in Vercel environment variables. Assets call it via `fetch('/api/ai-feedback', ...)` — they own their own system prompts.
