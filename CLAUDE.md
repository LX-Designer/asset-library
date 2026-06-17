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

---

## Lab shells — building new labs

Two shell variants live in `src/lab-shell/`. Both handle navigation, response persistence, and completion tracking — they differ in how content and activities are laid out.

| Shell | File | Use when… |
|---|---|---|
| `LabShell1` | `LabShell1.jsx` | Scrollable document is the main column; activities pop out in a right panel; reference in left sidebar. **Default for most labs.** |
| `LabShell2` | `LabShell2.jsx` | Activities ARE the main scrollable column (stacked full-width); evidence/reference in left sidebar tabs and right `EvidenceDock`. Use for inquiry labs where students work through activities in order. |

### File structure for a LabShell1 lab

```
src/assets/[lab-id]/
  meta.js               ← card metadata (title, level, discipline, labType, etc.)
  shell.config.js       ← all lab configuration (copy from shell.config.template.js)
  index.jsx             ← exports the lab component; wires LabShell1 + content
  index.module.css      ← lab-specific CSS tokens and theme overrides
  activities/
    Act1.jsx            ← one file per activity form component
    Act2.jsx
    ...
  ConceptCard.jsx       ← concept body renderer (only if lab has concepts)
  ConceptCard.module.css
```

Images and SVGs go in `public/[lab-id]/` and are referenced as `/[lab-id]/filename`.

### index.jsx pattern (LabShell1)

```jsx
import LabShell1 from '../../lab-shell/LabShell1.jsx'
import config    from './shell.config.js'
import styles    from './index.module.css'

function LabContent({ responses, onSave, openActivity, openEvidence, openConcept }) {
  // All your JSX here — sections, diagrams, evidence cards, etc.
  // Call openActivity(id), openEvidence(id), openConcept(id) from buttons/links.
}

export default function MyLab({ onResponse, onComplete, savedResponses, isCompleted, onReset, backHref }) {
  return (
    <LabShell1 config={config} onResponse={onResponse} onComplete={onComplete}
               savedResponses={savedResponses} isCompleted={isCompleted}
               onReset={onReset} backHref={backHref} className={styles.labShell}>
      {({ openActivity, openEvidence, openConcept, responses, onSave, scrollToSection }) => (
        <LabContent responses={responses} onSave={onSave}
                    openActivity={openActivity} openEvidence={openEvidence}
                    openConcept={openConcept} />
      )}
    </LabShell1>
  )
}
```

### Activity form component pattern

```jsx
import { useActivityResponse } from '../../lab-shell/index.js'
import { ActivityTextarea }    from '../../lab-shell/index.js'

export default function Act1({ initialAnswers, isCompleted, onSubmit, onSave, onClose }) {
  const { draft, saveStatus, handleChange, handleBlur, handleSave } =
    useActivityResponse(initialAnswers?.response ?? '', val => onSave({ response: val }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ response: draft }) }}>
      <ActivityTextarea
        value={draft}
        onChange={handleChange}
        onBlur={handleBlur}
        showWordCount
        minWords={80}
        saveStatus={saveStatus}
      />
      <button type="submit" disabled={isCompleted}>Submit</button>
    </form>
  )
}
```

### index.module.css token override pattern

Override `--lab-*` tokens on your root class to theme the entire shell:

```css
.labShell {
  /* Surfaces */
  --lab-bg:      #f5f0e8;
  --lab-surface: #faf7f2;

  /* Accent colour — drives buttons, badges, active states */
  --lab-accent:       #b91c1c;
  --lab-accent-hover: #991b1b;
  --lab-accent-subtle: #fef2f2;

  /* Progress bar */
  --lab-progress-fill:  #1e3a5f;
  --lab-progress-track: rgba(30, 58, 95, 0.12);
}
```

All `--lab-*` defaults are in `src/lab-shell/tokens.css`. Override only what differs.

### Shell exports (`src/lab-shell/index.js`)

| Export | Purpose |
|---|---|
| `LabShell1` | Content-primary shell (scrollable doc + activity panel) |
| `LabShell2` | Activity-primary shell (stacked activities + evidence dock) |
| `EvidencePanel` | Floating evidence document panel (if used outside a shell) |
| `DEFAULT_THEME_VARS` | Standard CSS var list for `themeVars` in shell.config.js |
| `defaultGetActivityStatus` | Standard completion check for text-response activities |
| `useActivityResponse` | Hook: draft state + save-on-blur for activity forms |
| `useAIFeedback` | Hook: request/loading/error state for AI feedback calls |
| `useIsDesktop` | Hook: `true` when viewport ≥ 900px |
| `ActivityTextarea` | Textarea with word count and save status indicator |
| `AIFeedbackUI` | Feedback display block (loading / text / error states) |
| `LabFigure` | Single image with optional caption; lazy-loads |
| `LabGallery` | Multi-image gallery with lightbox and zoom |

### Config template

`src/lab-shell/shell.config.template.js` — fully annotated, copy to your lab folder and fill in. Every field is documented inline with its type, default, and when to use it.
