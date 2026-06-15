import Act1 from './activities/Act1.jsx'
import Act2 from './activities/Act2.jsx'
import Act3 from './activities/Act3.jsx'
import Act4 from './activities/Act4.jsx'
import Act5 from './activities/Act5.jsx'
import Act6 from './activities/Act6.jsx'
import Act7 from './activities/Act7.jsx'
import ConceptCard from './ConceptCard.jsx'
import { conceptTools, activities as actData, relevanceRows } from './data.js'
import { DEFAULT_THEME_VARS, defaultGetActivityStatus, defaultGetResponseExcerpt } from '../../lab-shell/defaults.js'

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
// Spreads the standard shell token set and adds the econ-specific palette vars
// used by form components and visuals inside portals.
const THEME_VARS = [
  ...DEFAULT_THEME_VARS,
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
  title: a.title,
  thinkingMove: stagePhase[a.id] ?? '',
  group: a.stage ?? '',
  prompt: a.prompt ?? '',
  task: a.task ?? '',
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
    title: 'Urban Transport and Electric Scooters: Efficiency or Market Failure?',
    subtitle: 'A Level Economics 7.3',
    showWorkExplore: true,
    sections: [
      { id: 'case-overview',       label: 'Case' },
      { id: 'how-to-investigate',  label: 'Guide' },
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
    header: {
      fpTitle:  'Case support',        // shown in the FloatingPanel PanelHeader
      eyebrow:  'Activity Guide',      // shown in the ActivitiesTab header
      title:    'Urban Transport and Electric Scooters: Efficiency or Market Failure?',
      subtitle: '',
    },
    conceptsIntro: 'These economic concepts are the analytical tools you should apply when completing the activities.',
  },

  activityPanel: {
    side: 'right',
    defaultDockedWidth: 520,
    accentHeader: true,
  },

  activities,
  concepts,
  conceptComponent: ConceptCard,
  conceptsLabel: "Economist's Toolkit",

  content: {
    maxWidth: '960px',
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

  getActivityStatus:    defaultGetActivityStatus,
  getResponseExcerpt:  defaultGetResponseExcerpt,
}
