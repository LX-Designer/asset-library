import { useState } from 'react'
import s from './ArchLab.module.css'

// ─── DATA ─────────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'overview',  label: 'System Overview' },
  { id: 'routing',   label: 'Routing' },
  { id: 'assets',    label: 'Asset System' },
  { id: 'dataflow',  label: 'Student Journey' },
  { id: 'wrapper',   label: 'AssetWrapper' },
  { id: 'database',  label: 'Database' },
  { id: 'labshell',  label: 'LabShell' },
  { id: 'auth',      label: 'Teacher Auth' },
]

const LAYERS = [
  {
    id: 'browser', label: 'Browser / Client', sub: 'React SPA + localStorage',
    color: '#A78BFA', tech: 'Browser APIs',
    desc: "The user's browser runs the compiled React app as a Single Page Application. The anonymous student session UUID ('lp_session_id') is stored in localStorage and survives tab closes and restarts. No install, no native app.",
    files: ["localStorage → 'lp_session_id'", 'React 18 + ReactDOM hydration', 'CSS custom properties (design tokens)'],
  },
  {
    id: 'vercel', label: 'Vercel CDN + Serverless', sub: 'Hosting, CDN, API functions',
    color: '#60A5FA', tech: 'Vercel Edge',
    desc: "Vercel hosts the pre-built React bundle and serves it via global CDN. vercel.json configures SPA rewrites — all non-asset paths return index.html so React Router handles them client-side. The /api/ directory provides serverless functions.",
    files: ['vercel.json (SPA rewrites)', 'api/ai-feedback.js', 'api/feedback.js', 'api/socratic-feedback.js'],
  },
  {
    id: 'vite', label: 'Vite + React App', sub: 'Build tool, entry point, globals',
    color: '#34D399', tech: 'Vite 5 + React 18',
    desc: "Vite bundles the React app with fast HMR in dev and optimised chunks for production. src/main.jsx is the entry point — it wraps the app in BrowserRouter and mounts <App />. Global design tokens (colour palette, spacing, typography scale) live in src/index.css as CSS custom properties.",
    files: ['vite.config.js', 'src/main.jsx', 'src/index.css'],
  },
  {
    id: 'router', label: 'React Router v6', sub: 'URL-to-component mapping',
    color: '#FBBF24', tech: 'React Router v6',
    desc: "src/App.jsx defines the full route tree. Layout wraps all routes to provide the shared header/footer shell. Public routes are open to everyone. Protected routes under /dashboard/* use ProtectedRoute — it reads AuthContext and redirects to /login if the user is not authenticated.",
    files: ['src/App.jsx', 'src/components/ProtectedRoute.jsx'],
  },
  {
    id: 'layout', label: 'Layout + AuthContext', sub: 'App shell and teacher auth state',
    color: '#F87171', tech: 'React Context',
    desc: "Layout renders the header (logo, nav links) and footer around <Outlet />. For assets with layout: 'full', it suppresses both — the asset owns its entire screen. AuthContext provides teacher login state: user is undefined while checking, null when logged out, or a user object when authenticated.",
    files: ['src/components/Layout/Layout.jsx', 'src/contexts/AuthContext.jsx', 'src/components/SpeechInput.jsx'],
  },
  {
    id: 'wrapper', label: 'AssetWrapper', sub: 'Orchestrator between platform and labs',
    color: '#F472B6', tech: 'React + Supabase JS',
    desc: "The critical middle layer. Uses Vite's import.meta.glob to dynamically import the asset component on demand. Reads the session ID from localStorage. Fetches saved responses and the completion record from Supabase on mount. Passes onResponse/onComplete callbacks down. Assets never touch Supabase directly.",
    files: ['src/components/AssetWrapper/AssetWrapper.jsx', 'src/lib/session.js', 'src/registry.js'],
  },
  {
    id: 'asset', label: 'Asset Components', sub: 'Individual learning labs (src/assets/*/)',
    color: '#22D3EE', tech: 'React + CSS Modules',
    desc: "Each lab is a self-contained React component in src/assets/<id>/. It receives savedResponses pre-populated from Supabase, calls onResponse() on every answer, and onComplete() when finished. Full-layout assets manage their own header and nav. Labs built with LabShell get nav, sidebars, and activity panels for free.",
    files: ['src/assets/*/index.jsx', 'src/assets/*/meta.js', 'src/lab-shell/'],
  },
  {
    id: 'supabase', label: 'Supabase', sub: 'PostgreSQL + Auth',
    color: '#4ADE80', tech: 'Supabase (PostgreSQL)',
    desc: "Cloud PostgreSQL database managed by Supabase. Stores all student responses (asset_responses), completions (asset_completions), teacher classes, and class memberships. Also provides the authentication system used for teacher login via email/password. RLS policies control access per table.",
    files: ['src/lib/supabase.js', 'supabase/schema.sql', 'supabase/migrations/001_teacher_dashboard.sql'],
  },
]

const ROUTES = [
  { id: 'app',         label: 'App.jsx',                      type: 'root',    depth: 0,
    desc: 'Root component. Sets up the route tree. Layout is the parent route that wraps all children, so it renders on every page.' },
  { id: 'layout',      label: '<Layout />',                   type: 'wrapper', depth: 1,
    desc: "Renders header, footer, SpeechInput, and <Outlet />. Checks the current asset's metadata — if layout: 'full', both header and footer are hidden so the asset owns the full viewport." },
  { id: 'home',        url: '/',                comp: 'Home',               type: 'public',  depth: 2,
    desc: 'The lab catalog homepage. Reads assetRegistry from registry.js and renders a card grid. Clicking a card navigates to /asset/:assetId.' },
  { id: 'asset',       url: '/asset/:assetId',  comp: 'AssetPage → AssetWrapper', type: 'public', depth: 2,
    desc: "Resolves assetId via getAssetMeta(). Determines layout mode. Renders AssetWrapper with the assetId and backHref. AssetWrapper handles all data loading and dynamic component import." },
  { id: 'login',       url: '/login',           comp: 'Login',              type: 'public',  depth: 2,
    desc: "Teacher login form. Calls supabase.auth.signInWithPassword(email, password). On success, AuthContext updates to user = { id, email, ... } and the header shows 'Dashboard' and 'Sign out'." },
  { id: 'signup',      url: '/signup',          comp: 'Signup',             type: 'public',  depth: 2,
    desc: 'Teacher registration form. Calls supabase.auth.signUp(). Supabase sends a confirmation email. Teacher can log in after confirming.' },
  { id: 'protected',   label: '<ProtectedRoute />', type: 'guard', depth: 2,
    desc: "Reads useAuth(). user === undefined → loading spinner (auth state not yet known). user === null → redirect to /login. user = object → render children (teacher is authenticated)." },
  { id: 'dashboard',   url: '/dashboard',       comp: 'Dashboard',          type: 'teacher', depth: 3,
    desc: "Teacher's class list. Queries: SELECT * FROM classes WHERE teacher_id = user.id. Create class form auto-generates a 6-char join code using the safe-character alphabet (no 0/O/I/1). Retries up to 5× on unique collision." },
  { id: 'classdetail', url: '/dashboard/classes/:classId', comp: 'ClassDetail', type: 'teacher', depth: 3,
    desc: 'Per-class view. Shows all student sessions that joined the class, with a session × asset response grid. Student responses load lazily on drill-down.' },
]

const ASSETS = [
  { id: 'tacoma-narrows',         title: 'Tacoma Narrows Bridge',  subject: 'Physics',         shell: 'LabShell1', acts: 6 },
  { id: 'econ-73-efficiency',     title: 'Market Efficiency',      subject: 'Economics',        shell: 'LabShell1', acts: 6 },
  { id: 'econ-73-dossier',        title: 'Economic Dossier',       subject: 'Economics',        shell: 'LabShell1', acts: 4 },
  { id: 'france-republic-1792',   title: 'French Republic 1792',   subject: 'History',          shell: 'LabShell1', acts: 6 },
  { id: 'geo-2-3-global-warming', title: 'Global Warming (Guided)',subject: 'Geography',         shell: 'LabShell1', acts: 4 },
  { id: 'global-warming',         title: 'Global Warming',         subject: 'Geography',         shell: 'LabShell1', acts: 6 },
  { id: 'global-warming-inquiry', title: 'GW Inquiry',             subject: 'Geography',         shell: 'LabShell2', acts: 6 },
  { id: 'metacognition-sdl',      title: 'Metacognition & SDL',    subject: 'Learning Science',  shell: 'standard',  acts: 3 },
]

const FLOW_STEPS = [
  {
    n: 1, title: 'Homepage Load', layer: 'router',
    desc: "Student visits the site. React Router matches '/' and renders Home. Home reads assetRegistry (imported from src/registry.js) and renders a card grid of all available labs.",
    code: `// src/App.jsx
<Route path="/" element={<Home />} />

// src/pages/Home.jsx
import { assetRegistry } from '../registry'

assetRegistry.map(asset => (
  <AssetCard key={asset.id} meta={asset} />
))`,
  },
  {
    n: 2, title: 'Navigate to Lab', layer: 'router',
    desc: "Student clicks a card. React Router navigates to /asset/:assetId. AssetPage resolves the metadata object via getAssetMeta(assetId) and passes it to AssetWrapper.",
    code: `// src/pages/AssetPage.jsx
const { assetId } = useParams()
const meta = getAssetMeta(assetId)
// meta.layout === 'full' → asset
// controls its own UI

<AssetWrapper
  assetId={assetId}
  backHref="/"
/>`,
  },
  {
    n: 3, title: 'Session ID', layer: 'wrapper',
    desc: "AssetWrapper mounts and calls getSessionId(). This reads localStorage for an existing UUID, or generates and stores a new one. This is the student's permanent anonymous identity across all labs and visits.",
    code: `// src/lib/session.js
export function getSessionId() {
  let id = localStorage
    .getItem('lp_session_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage
      .setItem('lp_session_id', id)
  }
  return id
}`,
  },
  {
    n: 4, title: 'Dynamic Component Load', layer: 'wrapper',
    desc: "AssetWrapper uses Vite's import.meta.glob to dynamically import the asset's index.jsx. This code-splits each lab into its own bundle — the student only downloads the lab they're actually viewing.",
    code: `// src/components/AssetWrapper
//   /AssetWrapper.jsx
const modules = import.meta.glob(
  '../../assets/*/index.jsx'
)
const key = Object.keys(modules)
  .find(k => k.includes(\`/\${assetId}/\`))

const mod = await modules[key]()
setAssetComponent(() => mod.default)`,
  },
  {
    n: 5, title: 'Fetch Saved Progress', layer: 'supabase',
    desc: "AssetWrapper queries Supabase for any rows in asset_responses and asset_completions for this sessionId + assetId pair. This restores the student's progress if they've visited before.",
    code: `// Fetch responses
const { data: rows } = await supabase
  .from('asset_responses')
  .select('*')
  .eq('session_id', sessionId)
  .eq('asset_id', assetId)

// Build { questionId → response } map
const map = {}
rows.forEach(r => {
  map[r.question_id] = r.response
})
setSavedResponses(map)`,
  },
  {
    n: 6, title: 'Asset Renders', layer: 'asset',
    desc: "The asset component renders with savedResponses, isCompleted, and the callback props. It uses savedResponses to pre-fill already-answered questions and compute the first unanswered activity as the starting point.",
    code: `// AssetWrapper renders:
<AssetComponent
  onResponse={handleResponse}
  onComplete={handleComplete}
  savedResponses={savedResponses}
  isCompleted={!!completion}
  completion={completion}
  // full-layout assets also get:
  onReset={handleReset}
  backHref={backHref}
/>`,
  },
  {
    n: 7, title: 'Student Answers', layer: 'supabase',
    desc: "Student types an answer and the activity saves. The asset calls onResponse(questionId, value). AssetWrapper upserts the row to Supabase and updates savedResponses in local state so the UI reflects immediately.",
    code: `// Asset calls:
onResponse('act-1',
  { text: 'Resonance caused...' })

// AssetWrapper upserts:
await supabase
  .from('asset_responses')
  .upsert({
    session_id, asset_id,
    question_id: 'act-1',
    response: { text: '...' },
    updated_at: new Date().toISOString(),
  }, { onConflict:
    'session_id,asset_id,question_id' })`,
  },
  {
    n: 8, title: 'Student Completes', layer: 'supabase',
    desc: "Student finishes all activities and submits. The asset calls onComplete(score, metadata). AssetWrapper upserts the completion record. isCompleted becomes true and the wrapper shows a completion banner (standard layout).",
    code: `// Asset calls:
onComplete(85, { timeSpent: 420 })

// AssetWrapper upserts:
await supabase
  .from('asset_completions')
  .upsert({
    session_id, asset_id,
    score: 85,
    metadata: { timeSpent: 420 },
    completed_at:
      new Date().toISOString(),
  }, { onConflict:
    'session_id,asset_id' })`,
  },
  {
    n: 9, title: 'Resumption', layer: 'wrapper',
    desc: "Student leaves and returns later. The same session UUID is read from localStorage. AssetWrapper re-fetches the same rows. savedResponses is pre-populated and the asset computes the first unanswered activity as the resume point.",
    code: `// On return: same session ID
// → same rows from Supabase
// → savedResponses pre-populated

// Asset computes resume point:
const first = activities.find(
  act => !savedResponses[act.id]
)
setActive(
  first?.id ?? activities[0].id
)`,
  },
]

const DB_TABLES = [
  {
    id: 'asset_responses', label: 'asset_responses', color: '#79C0FF',
    desc: 'One row per question answer. Upserted (not inserted) so re-submissions overwrite cleanly.',
    cols: [
      { name: 'id',          type: 'uuid',        tag: 'pk' },
      { name: 'session_id',  type: 'text',        tag: 'conflict' },
      { name: 'asset_id',    type: 'text',        tag: 'conflict' },
      { name: 'question_id', type: 'text',        tag: 'conflict' },
      { name: 'response',    type: 'jsonb',       tag: null },
      { name: 'updated_at',  type: 'timestamptz', tag: null },
    ],
    conflict: '(session_id, asset_id, question_id)',
    writer: 'AssetWrapper.handleResponse()',
  },
  {
    id: 'asset_completions', label: 'asset_completions', color: '#3FB950',
    desc: 'One row per student+lab. Created when the asset calls onComplete().',
    cols: [
      { name: 'id',           type: 'uuid',        tag: 'pk' },
      { name: 'session_id',   type: 'text',        tag: 'conflict' },
      { name: 'asset_id',     type: 'text',        tag: 'conflict' },
      { name: 'score',        type: 'integer',     tag: null },
      { name: 'metadata',     type: 'jsonb',       tag: null },
      { name: 'completed_at', type: 'timestamptz', tag: null },
    ],
    conflict: '(session_id, asset_id)',
    writer: 'AssetWrapper.handleComplete()',
  },
  {
    id: 'classes', label: 'classes', color: '#E3B341',
    desc: 'Teacher-owned classes. join_code is the access token shared with students.',
    cols: [
      { name: 'id',         type: 'uuid',        tag: 'pk' },
      { name: 'teacher_id', type: 'uuid',        tag: 'fk' },
      { name: 'name',       type: 'text',        tag: null },
      { name: 'join_code',  type: 'text',        tag: 'unique' },
      { name: 'created_at', type: 'timestamptz', tag: null },
    ],
    conflict: 'join_code',
    writer: 'Dashboard (create class)',
  },
  {
    id: 'class_memberships', label: 'class_memberships', color: '#F472B6',
    desc: 'Links an anonymous student session to a class via join code entry.',
    cols: [
      { name: 'id',         type: 'uuid',        tag: 'pk' },
      { name: 'class_id',   type: 'uuid',        tag: 'fk' },
      { name: 'session_id', type: 'text',        tag: null },
      { name: 'joined_at',  type: 'timestamptz', tag: null },
    ],
    conflict: '(class_id, session_id)',
    writer: 'ClassJoinPrompt component',
  },
]

const SHELL_EXPORTS = [
  { name: 'LabShell1',                desc: 'Document-primary shell' },
  { name: 'LabShell2',                desc: 'Activity-primary shell' },
  { name: 'EvidencePanel',            desc: 'Floating evidence viewer' },
  { name: 'useActivityResponse',      desc: 'Draft + save-on-blur hook' },
  { name: 'useAIFeedback',            desc: 'AI feedback request hook' },
  { name: 'useIsDesktop',             desc: 'Viewport breakpoint hook' },
  { name: 'ActivityTextarea',         desc: 'Textarea w/ word count' },
  { name: 'AIFeedbackUI',             desc: 'Feedback display block' },
  { name: 'LabFigure',                desc: 'Lazy image w/ caption' },
  { name: 'LabGallery',               desc: 'Multi-image + lightbox' },
  { name: 'defaultGetActivityStatus', desc: 'Completion check fn' },
  { name: 'DEFAULT_THEME_VARS',       desc: 'CSS var name list' },
]

const AUTH_NODES = {
  visit: {
    id: 'visit',
    label: 'Student/teacher visits /dashboard',
    detail: {
      h: 'Route hit',
      body: "The browser navigates to /dashboard. React Router matches the route, but before rendering Dashboard it evaluates the ProtectedRoute guard component.",
    },
  },
  protected: {
    id: 'protected',
    label: '<ProtectedRoute> checks useAuth()',
    detail: {
      h: 'ProtectedRoute guard',
      body: "ProtectedRoute calls useAuth() which reads from AuthContext. AuthContext is initialized in main.jsx and runs supabase.auth.getSession() on mount. While that's in flight, user is undefined.",
    },
  },
  loading: {
    id: 'loading',
    label: 'user = undefined',
    detail: {
      h: 'Auth state loading',
      body: "AuthContext hasn't finished checking the session yet (supabase.auth.getSession() is async). ProtectedRoute renders a loading spinner and waits.",
    },
  },
  nouser: {
    id: 'nouser',
    label: 'user = null',
    detail: {
      h: 'Not authenticated',
      body: "No active session. ProtectedRoute renders <Navigate to='/login' /> which redirects the browser to the login page.",
    },
  },
  hasuser: {
    id: 'hasuser',
    label: 'user = { id, email, … }',
    detail: {
      h: 'Authenticated teacher',
      body: "Valid Supabase session found. ProtectedRoute renders its children — the Dashboard component. Layout also picks up the user object and shows 'Dashboard' and 'Sign out' in the header nav.",
    },
  },
  login: {
    id: 'login',
    label: 'Teacher submits /login form',
    detail: {
      h: 'Login form submit',
      body: "Login calls supabase.auth.signInWithPassword({ email, password }). On success, Supabase fires onAuthStateChange('SIGNED_IN', session). AuthContext updates user to the session's user object.",
    },
  },
  dashboard: {
    id: 'dashboard',
    label: '→ Dashboard renders',
    detail: {
      h: 'Access granted',
      body: "Dashboard queries classes WHERE teacher_id = user.id. Teachers see their class list and can create new classes. ClassDetail shows per-class student response grids.",
    },
  },
}

// ─── SECTION COMPONENTS ───────────────────────────────────────────────────────

function OverviewSection() {
  const [sel, setSel] = useState(null)

  return (
    <div className={s.section}>
      <div className={s.hdr}>
        <h1 className={s.h1}>System Architecture</h1>
        <p className={s.lead}>InquiryLabs is 8 layers from browser to database. Click any layer to explore its role, key files, and technology.</p>
      </div>
      <div className={s.stackLayout}>
        <div className={s.layerList}>
          {LAYERS.map(layer => (
            <div
              key={layer.id}
              className={`${s.layerItem} ${sel?.id === layer.id ? s.layerSel : ''}`}
              style={{ '--lc': layer.color }}
              onClick={() => setSel(sel?.id === layer.id ? null : layer)}
            >
              <span className={s.layerName}>{layer.label}</span>
              <span className={s.layerSub}>{layer.sub}</span>
            </div>
          ))}
        </div>
        <div className={s.detailArea}>
          {sel ? (
            <div key={sel.id} className={s.detailCard}>
              <h3 className={s.detailH} style={{ color: sel.color }}>{sel.label}</h3>
              <p className={s.detailP}>{sel.desc}</p>
              <span className={s.pill}>{sel.tech}</span>
              <h4 className={s.detailFilesH}>Key files</h4>
              <ul className={s.fileList}>
                {sel.files.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
          ) : (
            <div className={s.detailEmpty}>
              <span className={s.detailEmptyIcon}>◈</span>
              <span>Click a layer to explore it</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RoutingSection() {
  const [sel, setSel] = useState(null)

  const tagClass = { public: s.tagPublic, teacher: s.tagTeacher, guard: s.tagGuard, wrapper: s.tagWrapper, root: s.tagRoot }
  const tagLabel = { public: 'public', teacher: 'teacher only', guard: 'guard', wrapper: 'wrapper', root: 'root' }

  return (
    <div className={s.section}>
      <div className={s.hdr}>
        <h1 className={s.h1}>Routing</h1>
        <p className={s.lead}>All routes are defined in src/App.jsx. Click any node to see what it renders and why.</p>
      </div>
      <div className={s.routeTree}>
        {ROUTES.map(route => (
          <div
            key={route.id}
            className={`${s.routeRow} ${sel?.id === route.id ? s.routeRowSel : ''}`}
            style={{ paddingLeft: `${10 + route.depth * 24}px` }}
            onClick={() => setSel(sel?.id === route.id ? null : route)}
          >
            <span className={`${s.tag} ${s.routeTag} ${tagClass[route.type]}`}>
              {tagLabel[route.type]}
            </span>
            {route.url
              ? <span className={s.routeUrl}>{route.url}</span>
              : <span className={s.routeUrl}>{route.label}</span>
            }
            {route.comp && <span className={s.routeComp}>→ {route.comp}</span>}
          </div>
        ))}
      </div>
      {sel && (
        <div key={sel.id} className={s.routeDetailBox}>
          {sel.desc}
        </div>
      )}
    </div>
  )
}

function AssetsSection() {
  const [pipeStep, setPipeStep] = useState(null)

  const pipeData = [
    {
      id: 'registry',
      label: 'registry.js',
      file: 'src/registry.js',
      desc: 'Central list of all labs',
      detail: "registry.js imports every asset's meta.js and exports assetRegistry[]. The Home page reads this array to build the catalog. Registering a new lab is just one import + one array entry.",
    },
    {
      id: 'wrapper',
      label: 'AssetWrapper',
      file: 'AssetWrapper.jsx',
      desc: 'Dynamically loads component',
      detail: "AssetWrapper uses Vite's import.meta.glob('../../assets/*/index.jsx') to capture all asset components at build time as lazy imports. It resolves assetId → matching import key → dynamic import. This gives automatic code splitting: each lab is a separate bundle downloaded only when visited.",
    },
    {
      id: 'component',
      label: 'Asset Component',
      file: 'src/assets/<id>/index.jsx',
      desc: 'Renders the lab UI',
      detail: "Each asset's index.jsx exports a default React component. It receives onResponse, onComplete, savedResponses, isCompleted, completion, and (for full-layout) onReset + backHref. Assets never import Supabase — all persistence goes through the wrapper callbacks.",
    },
  ]

  return (
    <div className={s.section}>
      <div className={s.hdr}>
        <h1 className={s.h1}>Asset System</h1>
        <p className={s.lead}>Each lab is a self-contained module. The platform handles persistence. Click a stage to understand the pipeline.</p>
      </div>

      <div className={s.pipeline}>
        {pipeData.map((stage, i) => (
          <div key={stage.id} style={{ display: 'contents' }}>
            <div
              className={`${s.pipeStage} ${pipeStep === stage.id ? s.pipeStageActive : ''}`}
              onClick={() => setPipeStep(pipeStep === stage.id ? null : stage.id)}
            >
              <div className={s.pipeLabel}>{stage.label}</div>
              <div className={s.pipeFile}>{stage.file}</div>
              <div className={s.pipeDesc}>{stage.desc}</div>
            </div>
            {i < pipeData.length - 1 && <div className={s.pipeArrow}>→</div>}
          </div>
        ))}
      </div>

      {pipeStep && (
        <div key={pipeStep} className={s.pipeDetailBox}>
          {pipeData.find(p => p.id === pipeStep)?.detail}
        </div>
      )}

      <p className={s.subh}>Registered assets ({ASSETS.length})</p>
      <div className={s.assetGrid}>
        {ASSETS.map(asset => (
          <div key={asset.id} className={s.assetCard}>
            <div className={s.assetSubject}>{asset.subject}</div>
            <div className={s.assetTitle}>{asset.title}</div>
            <div className={s.assetMeta}>
              <span className={s.assetId}>{asset.id}</span>
              <span className={s.assetShell}>{asset.shell} · {asset.acts} acts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DataFlowSection() {
  const [step, setStep] = useState(0)
  const [visited, setVisited] = useState(new Set([0]))

  const go = (n) => {
    setStep(n)
    setVisited(v => new Set([...v, n]))
  }

  const current = FLOW_STEPS[step]

  const layerColors = { browser: '#A78BFA', router: '#FBBF24', wrapper: '#F472B6', asset: '#22D3EE', supabase: '#4ADE80' }
  const miniLayers = [
    { id: 'router',   label: 'Router' },
    { id: 'wrapper',  label: 'AssetWrapper' },
    { id: 'asset',    label: 'Asset' },
    { id: 'supabase', label: 'Supabase' },
  ]

  return (
    <div className={s.section}>
      <div className={s.hdr}>
        <h1 className={s.h1}>Student Journey</h1>
        <p className={s.lead}>Walk through every step from the homepage visit to completion and resumption. Click a step dot or use the arrows.</p>
      </div>

      <div className={s.stepTrack}>
        {FLOW_STEPS.map((st, i) => (
          <div key={st.n} style={{ display: 'contents' }}>
            <div
              className={[
                s.stepDot,
                i === step ? s.stepDotActive : '',
                visited.has(i) && i !== step ? s.stepDotDone : '',
              ].join(' ')}
              onClick={() => go(i)}
            >
              {st.n}
            </div>
            {i < FLOW_STEPS.length - 1 && <div className={s.stepDash} />}
          </div>
        ))}
      </div>

      <div className={s.miniLayers}>
        {miniLayers.map(ml => (
          <span
            key={ml.id}
            className={`${s.miniLayer} ${current.layer === ml.id ? s.miniLayerActive : ''}`}
            style={{ '--lc': layerColors[ml.id] }}
          >
            {ml.label}
          </span>
        ))}
      </div>

      <div key={step} className={s.stepCard}>
        <div className={s.stepCardHead}>
          <span className={s.stepN}>Step {current.n} of {FLOW_STEPS.length}</span>
          <h2 className={s.stepTitle}>{current.title}</h2>
        </div>
        <div className={s.stepBody}>
          <p className={s.stepDesc}>{current.desc}</p>
          <pre className={s.codeBlock}>{current.code}</pre>
        </div>
        <div className={s.stepNav}>
          <button
            className={s.stepNavBtn}
            onClick={() => go(step - 1)}
            disabled={step === 0}
          >
            ← Previous
          </button>
          <span className={s.stepCounter}>{step + 1} / {FLOW_STEPS.length}</span>
          <button
            className={s.stepNavBtn}
            onClick={() => go(step + 1)}
            disabled={step === FLOW_STEPS.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

function WrapperSection() {
  const STATES = [
    {
      AssetComponent: null,
      savedResponses: {},
      completion: null,
      dataLoading: true,
      resetting: false,
    },
    {
      AssetComponent: '<LabComponent />',
      savedResponses: {},
      completion: null,
      dataLoading: true,
      resetting: false,
      _new: 'AssetComponent',
    },
    {
      AssetComponent: '<LabComponent />',
      savedResponses: { 'act-1': { text: 'The bridge oscillated...' } },
      completion: null,
      dataLoading: false,
      resetting: false,
      _new: 'savedResponses',
    },
    {
      AssetComponent: '<LabComponent />',
      savedResponses: {
        'act-1': { text: 'The bridge oscillated...' },
        'act-2': { text: 'Vortex shedding at 1 Hz...' },
      },
      completion: null,
      dataLoading: false,
      resetting: false,
      _new: 'act-2',
    },
    {
      AssetComponent: '<LabComponent />',
      savedResponses: {
        'act-1': { text: 'The bridge oscillated...' },
        'act-2': { text: 'Vortex shedding at 1 Hz...' },
      },
      completion: { score: 85, completed_at: '2026-06-19' },
      dataLoading: false,
      resetting: false,
      _new: 'completion',
    },
  ]

  const ACTIONS = [
    { label: '1. Load asset component', hint: '→ dynamic import via Vite glob',     minStep: 0, targetStep: 1 },
    { label: '2. Fetch saved progress',  hint: '→ Supabase query on mount',           minStep: 1, targetStep: 2 },
    { label: '3. Student answers',       hint: '→ onResponse("act-2", { text: … })',  minStep: 2, targetStep: 3 },
    { label: '4. Student completes',     hint: '→ onComplete(85, { … })',             minStep: 3, targetStep: 4 },
  ]

  const [simStep, setSimStep] = useState(0)
  const st = STATES[simStep]

  const renderVal = (key, val, isNew) => {
    const cls = isNew ? s.snew : ''
    if (val === null) return <span className={`${s.snull} ${cls}`}>null</span>
    if (val === true || val === false) return <span className={`${s.sbool} ${cls}`}>{String(val)}</span>
    if (typeof val === 'string') return <span className={`${s.sv} ${cls}`}>'{val}'</span>
    if (typeof val === 'object' && !Array.isArray(val)) {
      const keys = Object.keys(val)
      if (keys.length === 0) return <span className={`${s.sbrace} ${cls}`}>&#123;&#125;</span>
      return (
        <span className={cls}>
          <span className={s.sbrace}>&#123; </span>
          {keys.map((k, i) => (
            <span key={k}>
              <span className={`${s.sk} ${key === '_new_responses' && k === st._new ? s.snew : ''}`}>"{k}"</span>
              <span className={s.sbrace}>: </span>
              <span className={s.sv}>&#123;…&#125;</span>
              {i < keys.length - 1 && <span className={s.sbrace}>, </span>}
            </span>
          ))}
          <span className={s.sbrace}> &#125;</span>
        </span>
      )
    }
    return <span className={cls}>{String(val)}</span>
  }

  const PROPS = [
    { name: 'onResponse',    type: '(id, val) => void',  always: true },
    { name: 'onComplete',    type: '(score, meta) => void', always: true },
    { name: 'savedResponses',type: '{ [id]: response }', always: true },
    { name: 'isCompleted',   type: 'boolean',             always: true },
    { name: 'completion',    type: 'object | null',       always: true },
    { name: 'onReset',       type: '() => void',          fullOnly: true },
    { name: 'backHref',      type: 'string',              fullOnly: true },
  ]

  return (
    <div className={s.section}>
      <div className={s.hdr}>
        <h1 className={s.h1}>AssetWrapper</h1>
        <p className={s.lead}>The orchestrator between the platform and every lab. Simulate its lifecycle to see how internal state changes.</p>
      </div>
      <div className={s.wrapLayout}>
        <div>
          <p className={s.subh} style={{ marginTop: 0 }}>Internal state</p>
          <div className={s.stateBox}>
            <span className={s.sk}>AssetWrapper</span>
            <span className={s.sbrace}> &#123;</span>
            {'\n'}
            {[
              ['AssetComponent', st.AssetComponent, st._new === 'AssetComponent'],
              ['savedResponses',  st.savedResponses,  st._new === 'savedResponses' || st._new === 'act-2'],
              ['completion',      st.completion,      st._new === 'completion'],
              ['dataLoading',     st.dataLoading,     false],
              ['resetting',       st.resetting,       false],
            ].map(([key, val, isNew]) => (
              <span key={key}>
                {'  '}
                <span className={s.sk}>{key}</span>
                <span className={s.sbrace}>: </span>
                {renderVal(key, val, isNew)}
                {'\n'}
              </span>
            ))}
            <span className={s.sbrace}>&#125;</span>
          </div>
        </div>

        <div>
          <p className={s.subh} style={{ marginTop: 0 }}>Simulate lifecycle</p>
          <div className={s.actionList}>
            {ACTIONS.map(action => {
              const done = simStep > action.targetStep - 1
              return (
                <button
                  key={action.label}
                  className={`${s.actionBtn} ${done ? s.actionBtnDone : ''}`}
                  onClick={() => !done && setSimStep(action.targetStep)}
                  disabled={done || simStep < action.minStep}
                >
                  <span className={s.actionBtnLabel}>{action.label}</span>
                  <span className={s.actionBtnHint}>{action.hint}</span>
                </button>
              )
            })}
            <button
              className={`${s.actionBtn} ${s.actionBtnReset}`}
              onClick={() => setSimStep(0)}
            >
              <span className={s.actionBtnLabel}>↺ Reset simulation</span>
            </button>
          </div>

          <div className={s.propsBox}>
            <p className={s.propsTitle}>Props passed to &lt;AssetComponent&gt;</p>
            {PROPS.map(prop => (
              <div key={prop.name} className={s.propRow}>
                <span className={s.propName}>{prop.name}</span>
                <span className={s.propType}>{prop.type}</span>
                {prop.fullOnly
                  ? <span className={s.propCheck} style={{ color: '#E3B341' }}>full only</span>
                  : <span className={s.propCheck}>✓</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DatabaseSection() {
  const [sel, setSel] = useState(null)

  const tagClass = { pk: s.colTagPk, conflict: s.colTagConflict, fk: s.colTagFk, unique: s.colTagUnique }
  const tagLabel = { pk: 'PK', conflict: 'conflict', fk: 'FK', unique: 'unique' }

  return (
    <div className={s.section}>
      <div className={s.hdr}>
        <h1 className={s.h1}>Database Schema</h1>
        <p className={s.lead}>Four Supabase tables. Rows highlighted in amber are the upsert conflict keys — they define uniqueness. Click a table for details.</p>
      </div>
      <div className={s.dbGrid}>
        {DB_TABLES.map(table => (
          <div
            key={table.id}
            className={`${s.tableCard} ${sel?.id === table.id ? s.tableCardSel : ''}`}
            style={{ '--tc': table.color }}
            onClick={() => setSel(sel?.id === table.id ? null : table)}
          >
            <div className={s.tableHead}>
              <span className={s.tableName}>{table.label}</span>
              <span className={s.tableDot} />
            </div>
            <div className={s.tableBody}>
              <p className={s.tableDesc}>{table.desc}</p>
              <ul className={s.colList}>
                {table.cols.map(col => (
                  <li
                    key={col.name}
                    className={`${s.colRow} ${col.tag === 'conflict' ? s.colRowHighlight : ''}`}
                  >
                    <span className={s.colName}>{col.name}</span>
                    <span className={s.colType}>{col.type}</span>
                    {col.tag && (
                      <span className={tagClass[col.tag]}>{tagLabel[col.tag]}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {sel?.id === table.id && (
              <div className={s.tableFooter}>
                <span>onConflict: </span>
                <span className={s.tableFooterKey}>{table.conflict}</span>
                {'  ·  written by: '}
                <span className={s.tableFooterWriter}>{table.writer}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function LabShellSection() {
  const [shell, setShell] = useState('LabShell1')

  return (
    <div className={s.section}>
      <div className={s.hdr}>
        <h1 className={s.h1}>LabShell System</h1>
        <p className={s.lead}>Two reusable shell variants in src/lab-shell/. They differ in how content and activities are laid out. Toggle to compare.</p>
      </div>

      <div className={s.shellToggle}>
        <button className={`${s.shellBtn} ${shell === 'LabShell1' ? s.shellBtnActive : ''}`} onClick={() => setShell('LabShell1')}>LabShell1</button>
        <button className={`${s.shellBtn} ${shell === 'LabShell2' ? s.shellBtnActive : ''}`} onClick={() => setShell('LabShell2')}>LabShell2</button>
      </div>

      {shell === 'LabShell1' ? (
        <div key="s1" className={s.wireframe}>
          <div className={s.wfNav}>
            <span className={s.wfNavItem}>Section 1</span>
            <span className={s.wfNavItem}>Section 2</span>
            <span className={s.wfNavItem}>Section 3</span>
            <span className={s.wfNavMuted} style={{ marginLeft: 'auto' }}>Work ↔ Explore</span>
          </div>
          <div className={s.wfContent}>
            <div className={s.wfLeft}>
              <div className={s.wfLabel}>LabSidebar (left)</div>
              <div className={`${s.wfBlock} ${s.wfBlockBlue}`}>Activities list</div>
              <div className={`${s.wfBlock} ${s.wfBlockBlue}`}>Concepts tab</div>
              <div className={`${s.wfBlock} ${s.wfBlockBlue}`}>Notes tab</div>
            </div>
            <div className={s.wfMain}>
              <div className={s.wfLabel}>Document Content (main column, scrollable)</div>
              <div className={`${s.wfBlock} ${s.wfBlockGreen}`}>Section heading</div>
              <div className={`${s.wfBlock} ${s.wfBlockGreen}`}>Evidence / narrative</div>
              <div className={`${s.wfBlock} ${s.wfBlockGreen}`}>Figures, charts</div>
              <div className={`${s.wfBlock} ${s.wfBlockGreen}`}>Source documents</div>
            </div>
            <div className={s.wfRight}>
              <div className={s.wfLabel}>ActivityPanel (right, floats)</div>
              <div className={`${s.wfBlock} ${s.wfBlockAmber}`}>Activity form</div>
              <div className={`${s.wfBlock} ${s.wfBlockAmber}`}>Textarea + feedback</div>
              <div className={`${s.wfBlock} ${s.wfBlockAmber}`}>Submit button</div>
            </div>
          </div>
        </div>
      ) : (
        <div key="s2" className={s.wireframe}>
          <div className={s.wfNav}>
            <span className={s.wfNavItem}>Overview</span>
            <span className={s.wfNavItem}>Evidence</span>
            <span className={s.wfNavMuted} style={{ marginLeft: 'auto' }}>hideNav mode</span>
          </div>
          <div className={s.wfContent}>
            <div className={s.wfLeft}>
              <div className={s.wfLabel}>LabRail (left)</div>
              <div className={`${s.wfBlock} ${s.wfBlockBlue}`}>Cards / context</div>
              <div className={`${s.wfBlock} ${s.wfBlockBlue}`}>Timeline</div>
              <div className={`${s.wfBlock} ${s.wfBlockBlue}`}>Glossary</div>
            </div>
            <div className={s.wfMain}>
              <div className={s.wfLabel}>Stacked Activities (main, scrollable)</div>
              <div className={`${s.wfBlock} ${s.wfBlockAmber}`}>Act 1 — full width form</div>
              <div className={`${s.wfBlock} ${s.wfBlockAmber}`}>Act 2 — full width form</div>
              <div className={`${s.wfBlock} ${s.wfBlockAmber}`}>Act 3 — table / drag-drop</div>
            </div>
            <div className={s.wfRight}>
              <div className={s.wfLabel}>EvidenceDock (right)</div>
              <div className={`${s.wfBlock} ${s.wfBlockPink}`}>Charts</div>
              <div className={`${s.wfBlock} ${s.wfBlockPink}`}>Data viz</div>
            </div>
          </div>
        </div>
      )}

      <p className={s.subh}>Use when…</p>
      <div className={s.pipeDetailBox} style={{ marginBottom: 24 }}>
        {shell === 'LabShell1'
          ? "LabShell1 is the default for most labs. Use it when the main learning experience is reading and annotating a document, case study, or evidence base. The document is the star; activities respond to it. Students scroll through the document and pop open activity forms as they go."
          : "LabShell2 (LabShellInquiry) inverts the model — the activities ARE the experience. Use it when students need to work through a structured sequence of tasks (especially tables, drag-and-drop, or multi-field forms) with evidence as supporting material. Cramped activity panels are eliminated."
        }
      </div>

      <p className={s.subh}>Shared exports (src/lab-shell/index.js)</p>
      <div className={s.shellExports}>
        {SHELL_EXPORTS.map(exp => (
          <div key={exp.name} className={s.exportRow}>
            <div className={s.exportName}>{exp.name}</div>
            <div className={s.exportDesc}>{exp.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AuthSection() {
  const [sel, setSel] = useState(null)

  const AUTH_FLOW = [
    { type: 'box',    nodeId: 'visit',     label: 'Teacher navigates to /dashboard' },
    { type: 'vert' },
    { type: 'box',    nodeId: 'protected', label: '<ProtectedRoute> reads useAuth()' },
    { type: 'vert' },
    {
      type: 'branch',
      arms: [
        { label: 'user = undefined', outcomeId: 'loading',   outcomeLabel: 'Loading…',        cls: s.flowOutcomeLoading },
        { label: 'user = null',      outcomeId: 'nouser',    outcomeLabel: '→ redirect /login',cls: s.flowOutcomeRedirect },
        { label: 'user = { … }',     outcomeId: 'hasuser',   outcomeLabel: '→ Dashboard',      cls: s.flowOutcomeRender },
      ],
    },
    { type: 'vert' },
    { type: 'box',    nodeId: 'login',     label: 'supabase.auth.signInWithPassword()' },
    { type: 'vert' },
    { type: 'box',    nodeId: 'dashboard', label: 'AuthContext updates → Dashboard renders' },
  ]

  return (
    <div className={s.section}>
      <div className={s.hdr}>
        <h1 className={s.h1}>Teacher Auth</h1>
        <p className={s.lead}>Teacher login uses Supabase Auth. AuthContext provides the user state to ProtectedRoute and the Layout header. Click any node to see what's happening.</p>
      </div>
      <div className={s.authLayout}>
        <div className={s.authFlow}>
          {AUTH_FLOW.map((item, i) => {
            if (item.type === 'vert') return <div key={i} className={s.flowVert} />
            if (item.type === 'box') return (
              <button
                key={item.nodeId}
                className={`${s.flowBox} ${sel === item.nodeId ? s.flowBoxActive : ''}`}
                onClick={() => setSel(sel === item.nodeId ? null : item.nodeId)}
              >
                {item.label}
              </button>
            )
            if (item.type === 'branch') return (
              <div key={i} className={s.flowBranch}>
                {item.arms.map(arm => (
                  <div key={arm.outcomeId} className={s.flowBranchArm}>
                    <div className={s.flowBranchLabel}>{arm.label}</div>
                    <button
                      className={`${s.flowOutcome} ${arm.cls} ${sel === arm.outcomeId ? s.flowBoxActive : ''}`}
                      onClick={() => setSel(sel === arm.outcomeId ? null : arm.outcomeId)}
                    >
                      {arm.outcomeLabel}
                    </button>
                  </div>
                ))}
              </div>
            )
            return null
          })}
        </div>

        <div>
          {sel && AUTH_NODES[sel] ? (
            <div key={sel} className={s.authDetailBox}>
              <h3 className={s.authDetailH}>{AUTH_NODES[sel].detail.h}</h3>
              <p style={{ margin: 0 }}>{AUTH_NODES[sel].detail.body}</p>
            </div>
          ) : (
            <div className={s.detailEmpty} style={{ minHeight: 200 }}>
              <span className={s.detailEmptyIcon}>◉</span>
              <span>Click a node to see what runs</span>
            </div>
          )}

          <div className={s.propsBox} style={{ marginTop: 20 }}>
            <p className={s.propsTitle}>AuthContext shape</p>
            {[
              ['user = undefined', 'Supabase session check in flight'],
              ['user = null',      'No active session (logged out)'],
              ['user = { id, email, … }', 'Authenticated teacher'],
            ].map(([val, desc]) => (
              <div key={val} className={s.propRow}>
                <span className={s.propName} style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.75rem' }}>{val}</span>
                <span className={s.propType}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const SECTION_MAP = {
  overview: OverviewSection,
  routing:  RoutingSection,
  assets:   AssetsSection,
  dataflow: DataFlowSection,
  wrapper:  WrapperSection,
  database: DatabaseSection,
  labshell: LabShellSection,
  auth:     AuthSection,
}

export default function ArchLab({ backHref }) {
  const [section, setSection] = useState('overview')
  const Section = SECTION_MAP[section]

  return (
    <div className={s.lab}>
      <div className={s.topbar}>
        {backHref && (
          <a href={backHref} className={s.backLink}>← Labs</a>
        )}
        {backHref && <span className={s.topSep}>|</span>}
        <span className={s.topTitle}>App Architecture</span>
        <span className={s.topSep}>—</span>
        <span className={s.topSub}>InquiryLabs codebase guide</span>
        <span className={s.topBadge}>Developer reference</span>
      </div>
      <div className={s.body}>
        <nav className={s.sidebar}>
          {NAV.map((item, i) => (
            <button
              key={item.id}
              className={`${s.navBtn} ${section === item.id ? s.navBtnActive : ''}`}
              onClick={() => setSection(item.id)}
            >
              <span className={s.navNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>
        <main className={s.main}>
          <Section key={section} />
        </main>
      </div>
    </div>
  )
}
