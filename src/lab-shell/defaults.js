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
 * defaultGetActivityStatus
 *
 * Standard completion check for labs where each activity stores a single
 * response value. Handles the common response shapes:
 *
 *   null / undefined  → 'not-started'
 *   ''  (empty string)→ 'not-started'
 *   non-empty string  → 'complete'
 *   object / array    → 'complete'  (any saved structured response counts)
 *
 * Labs with more complex rules (e.g. partial completion, multi-key responses)
 * should override this with their own getActivityStatus in shell.config.js.
 */
export function defaultGetActivityStatus(activityId, responses) {
  const val = responses[activityId]
  if (val == null) return 'not-started'
  if (typeof val === 'string') return val.trim() ? 'complete' : 'not-started'
  return 'complete'
}
