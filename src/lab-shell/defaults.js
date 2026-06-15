/**
 * DEFAULT_THEME_VARS
 *
 * The complete set of CSS custom property names that must be forwarded through
 * FloatingPanel portals so that the sidebar, activity panel, and concept modal
 * receive resolved values (hex / font stacks) rather than unresolved var() refs.
 *
 * Usage in shell.config.js:
 *   import { DEFAULT_THEME_VARS } from '../../lab-shell/defaults.js'
 *   ...
 *   themeVars: [...DEFAULT_THEME_VARS, '--my-custom-var', '--another-var'],
 *
 * Labs only need to list their own additions. If a lab uses no custom properties
 * beyond the standard token set, themeVars: DEFAULT_THEME_VARS is sufficient.
 */
export const DEFAULT_THEME_VARS = [
  // Core lab tokens
  '--lab-bg', '--lab-surface', '--lab-surface-mid',
  '--lab-ink', '--lab-ink-mid', '--lab-ink-light', '--lab-tab-ink',
  '--lab-rule', '--lab-rule-light',
  '--lab-accent', '--lab-accent-hover', '--lab-accent-subtle',
  '--lab-complete', '--lab-complete-subtle', '--lab-complete-muted',
  '--lab-warn', '--lab-warn-subtle', '--lab-warn-muted',
  '--lab-flag', '--lab-font-serif', '--lab-font-mono', '--lab-nav-height', '--lab-transition',
  // Chrome register
  '--lab-chrome-surface', '--lab-chrome-font-size', '--lab-chrome-heading-weight',
  '--lab-chrome-label-size', '--lab-chrome-radius', '--lab-chrome-border-width',
  // FloatingPanel namespace
  '--fp-bg', '--fp-border', '--fp-ink', '--fp-ink-mid', '--fp-ink-light',
  '--fp-accent', '--fp-subtle', '--fp-shadow',
  '--fp-tab-bg', '--fp-tab-border', '--fp-tab-ink',
  '--fp-border-width', '--fp-radius', '--fp-transition',
  // ActivityModal namespace
  '--modal-panel-bg', '--modal-border', '--modal-ink', '--modal-ink-mid',
  '--modal-ink-light', '--modal-accent', '--modal-accent-hover',
  '--modal-subtle', '--modal-label', '--modal-serif', '--modal-heading-weight', '--modal-transition',
]

/**
 * defaultGetResponseExcerpt
 *
 * Extracts the primary text from a saved activity response for display as an
 * excerpt in the Activities tab sidebar. Handles the common response shapes:
 *
 *   string              → the string itself
 *   { response: "..." } → val.response  (most activity forms)
 *   { text: "..." }     → val.text      (init / reflection style forms)
 *   null / undefined    → null (no excerpt shown)
 *
 * Override in shell.config.js with a custom getResponseExcerpt if your lab
 * stores the primary response text under a different key.
 */
export function defaultGetResponseExcerpt(activityId, responses) {
  const val = responses[activityId]
  if (!val) return null
  if (typeof val === 'string') return val.trim() || null
  if (typeof val === 'object') {
    const text = val.response ?? val.text ?? null
    if (typeof text === 'string') return text.trim() || null
  }
  return null
}

// Meta keys stored alongside student content. They do not count as content when
// deciding between 'not-started' and 'inprogress'.
//   _submitted → set true by ActivityBody when the student clicks Submit
//   feedback   → AI feedback text attached after submission
const META_KEYS = new Set(['_submitted', 'feedback'])

// True if a response object holds any student-entered content (ignoring meta keys).
function responseHasContent(val) {
  return Object.keys(val).some((k) => {
    if (META_KEYS.has(k)) return false
    const v = val[k]
    if (v == null) return false
    if (typeof v === 'string') return v.trim().length > 0
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object') return Object.keys(v).length > 0
    return true
  })
}

/**
 * defaultGetActivityStatus
 *
 * Standard, submit-based status model shared by every LabShell lab:
 *
 *   no response / empty            → 'not-started'
 *   content saved, not submitted   → 'inprogress'   (autosaved as the student works)
 *   response carries _submitted    → 'complete'      (student clicked Submit)
 *
 * The activity form autosaves draft content (producing 'inprogress'), and
 * ActivityBody stamps `_submitted: true` on the response when the student
 * submits (producing 'complete'). Plain-string responses written before this
 * model existed are treated as 'complete' for backward compatibility.
 *
 * Because the model is uniform, labs no longer need a custom getActivityStatus
 * unless they want non-standard behaviour.
 */
export function defaultGetActivityStatus(activityId, responses) {
  const val = responses[activityId]
  if (val == null) return 'not-started'
  if (typeof val === 'string') return val.trim() ? 'complete' : 'not-started'
  if (typeof val === 'object') {
    if (val._submitted) return 'complete'
    return responseHasContent(val) ? 'inprogress' : 'not-started'
  }
  return 'not-started'
}
