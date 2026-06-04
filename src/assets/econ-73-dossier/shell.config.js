import Act1 from './activities/Act1.jsx'
import Act2 from './activities/Act2.jsx'
import Act3 from './activities/Act3.jsx'
import Act4 from './activities/Act4.jsx'
import Act5 from './activities/Act5.jsx'
import Act6 from './activities/Act6.jsx'
import Act7 from './activities/Act7.jsx'
import { VisualProductive, VisualSocialCost, VisualTradeoff, VisualInnovation } from './visuals.jsx'
import { conceptTools, activities as actData, relevanceRows } from './data.js'

// ── Stage phase labels ────────────────────────────────────────────────────────
const stagePhase = {
  '1': 'Build the evidence base',
  '2': 'Test the efficiency claim',
  '3': 'Test for possible market failure',
  '4': 'Weigh policy trade-offs',
  '5': 'Weigh policy trade-offs',
  '6': 'Make and reflect on your judgement',
  '7': 'Make and reflect on your judgement',
}

// ── CSS custom properties forwarded through FloatingPanel portals ─────────────
// Includes --lab-chrome-* so portals pick up warm paper surface and type scale;
// includes --econ-* so form components and visuals resolve their palette vars.
// Nav tokens are NOT forwarded — the nav bar is not a portal.
const THEME_VARS = [
  '--lab-bg', '--lab-surface', '--lab-surface-mid',
  '--lab-ink', '--lab-ink-mid', '--lab-ink-light', '--lab-tab-ink',
  '--lab-rule', '--lab-rule-light',
  '--lab-accent', '--lab-accent-hover', '--lab-accent-subtle',
  '--lab-complete', '--lab-complete-subtle', '--lab-complete-muted',
  '--lab-warn', '--lab-warn-subtle', '--lab-warn-muted',
  '--lab-flag', '--lab-font-serif', '--lab-font-mono', '--lab-nav-height', '--lab-transition',
  // Chrome register — forward so portals inherit warm paper surface, type scale, and border width
  '--lab-chrome-surface', '--lab-chrome-font-size', '--lab-chrome-heading-weight',
  '--lab-chrome-label-size', '--lab-chrome-radius', '--lab-chrome-border-width',
  // FloatingPanel
  '--fp-bg', '--fp-border', '--fp-ink', '--fp-ink-mid', '--fp-ink-light',
  '--fp-accent', '--fp-subtle', '--fp-shadow',
  '--fp-tab-bg', '--fp-tab-border', '--fp-tab-ink',
  '--fp-border-width', '--fp-radius', '--fp-transition',
  // ActivityModal
  '--modal-panel-bg', '--modal-border', '--modal-ink', '--modal-ink-mid',
  '--modal-ink-light', '--modal-accent', '--modal-accent-hover',
  '--modal-subtle', '--modal-label', '--modal-serif', '--modal-heading-weight', '--modal-transition',
  // Econ palette — used by form components and visuals inside portals
  '--econ-red', '--econ-red-dark', '--econ-navy', '--econ-paper', '--econ-paper-warm',
  '--econ-mint', '--econ-blue', '--ink', '--muted', '--soft', '--line', '--radius', '--radius-sm',
]

// ── Concept tools mapped to shell format ──────────────────────────────────────
const concepts = conceptTools.map(t => ({
  id: t.id,
  title: t.title,
  summary: t.summary,
  chips: t.chips,
  cards: t.cards,
  reasons: t.reasons,
  visual: t.visual,
  // Relevance table shown inside the Reasons concept
  table: t.id === 'reasons' ? {
    headers: ['Reason', 'Case relevance', 'How to use it'],
    rows: relevanceRows,
  } : undefined,
}))

// ── Activities mapped to shell format ─────────────────────────────────────────
// IDs use the 'act-N' prefix that existing DB rows were written with, preserving
// all student response data across the migration.
const activities = actData.map(a => ({
  id: `act-${a.id}`,
  number: parseInt(a.id),
  label: `Task ${a.id.padStart(2, '0')}`,
  title: a.title,
  // thinkingMove — brief phrase shown in the activity panel header subtitle
  thinkingMove: stagePhase[a.id] ?? '',
  // stageLabel — full stage string shown in the sidebar activity list
  stageLabel: a.stage ?? '',
  purpose: '',
  // prompt and task are rendered inside ActivityForm (with box styling);
  // passing empty here prevents ActivityModal duplicating the question above the form.
  prompt: '',
  scaffold: null,
  evidenceSections: a.review.map(r => ({ id: r.target, label: r.label })),
  conceptLinks: (a.tools ?? []).map(toolId => {
    const tool = conceptTools.find(t => t.id === toolId)
    return tool ? { id: toolId, title: tool.title } : null
  }).filter(Boolean),
  required: true,
}))

export default {
  labId: 'econ-73-dossier',

  nav: {
    title: 'Market Investigation Dossier',
    subtitle: 'A Level Economics 7.3',
    showWorkExplore: true,
    sections: [
      { id: 'case-overview',       label: 'Case' },
      { id: 'how-to-investigate',  label: 'Investigate' },
      { id: 'market-data',         label: 'Data' },
      { id: 'stakeholders',        label: 'Stakeholders' },
      { id: 'policy-options',      label: 'Policy' },
      { id: 'evidence',            label: 'Evidence' },
      { id: 'final-decision',      label: 'Briefing' },
    ],
  },

  sidebar: {
    side: 'left',
    defaultDockedWidth: 300,
    maxDockedWidth: 400,
    defaultTab: 'activities',
    tabs: ['activities', 'concepts'],
    accentHeader: false,   // ActivitiesTab header stays cream — only the FP PanelHeader is red
    fpAccentHeader: true,  // FloatingPanel PanelHeader: red with standard dock/close controls
    statusLabels: {
      complete:      'Response saved',
      'not-started': 'Not yet saved',
      inprogress:    'In progress',
    },
    header: {
      fpTitle:  'Case support',        // shown in the FloatingPanel PanelHeader
      eyebrow:  'Activity Guide',      // shown in the ActivitiesTab header
      title:    'Market Investigation Dossier',
      subtitle: '',
    },
  },

  activityPanel: {
    side: 'right',
    defaultDockedWidth: 520,
    accentHeader: true,
  },

  activities,
  concepts,

  conceptVisuals: {
    productive:   VisualProductive,
    'social-cost': VisualSocialCost,
    tradeoff:     VisualTradeoff,
    innovation:   VisualInnovation,
  },

  content: {
    maxWidth: '1100px',
  },

  features: {
    voiceToText: false,
    notes: false,
  },

  evidenceOrder: [],
  evidenceComponent: null,

  themeVars: THEME_VARS,

  activityForms: {
    'act-1': Act1,
    'act-2': Act2,
    'act-3': Act3,
    'act-4': Act4,
    'act-5': Act5,
    'act-6': Act6,
    'act-7': Act7,
  },

  getActivityStatus(activityId, responses) {
    const val = responses[activityId]
    return (typeof val === 'string' && val.trim()) ? 'complete' : 'not-started'
  },
}
