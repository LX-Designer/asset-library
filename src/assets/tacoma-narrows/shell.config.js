import { DEFAULT_THEME_VARS, defaultGetActivityStatus } from '../../lab-shell/defaults.js'
import Act1 from './activities/Act1.jsx'
import Act2 from './activities/Act2.jsx'
import Act3 from './activities/Act3.jsx'
import Act4 from './activities/Act4.jsx'
import Act5 from './activities/Act5.jsx'
import Act6 from './activities/Act6.jsx'
import { SYSTEM_PROMPT as ACT6_SYSTEM_PROMPT } from './feedbackPrompt.js'
import { toolkitConcepts } from './concepts.js'
import ConceptCard from './ConceptCard.jsx'

// CSS custom properties forwarded through FloatingPanel portals.
// Spreads the standard shell token set and adds Tacoma-specific palette vars
// used by Act1–6 form components inside portals.
const THEME_VARS = [
  ...DEFAULT_THEME_VARS,
  // Tacoma-specific — used by form components (radio groups, textareas, calc boxes, etc.)
  '--tn-ink', '--tn-ink-mid', '--tn-ink-light',
  '--tn-paper', '--tn-paper-dark', '--tn-paper-darker',
  '--tn-accent', '--tn-accent-lt', '--tn-gold', '--tn-green',
  '--tn-border', '--tn-border-s',
  '--tn-mono', '--tn-serif', '--tn-display',
]

export default {
  labId: 'tacoma-narrows',

  nav: {
    title: 'The Bridge That Shouldn\'t Have Failed',
    subtitle: '1940-TN-001 · Inquiry Tribunal',
    navCenter: null,
    showWorkExplore: true,
    sections: [
      { id: 'tn-overview',       label: 'Overview' },
      { id: 'tn-specifications', label: 'Specifications' },
      { id: 'tn-data',           label: 'Data' },
      { id: 'tn-design',         label: 'Design' },
      { id: 'tn-experts',        label: 'Experts' },
      { id: 'tn-investigation',  label: 'Findings' },
    ],
  },

  sidebar: {
    side: 'left',
    defaultDockedWidth: 260,
    maxDockedWidth: 380,
    defaultTab: 'activities',
    tabs: ['activities', 'concepts', 'notes'],
    conceptsIntro: 'Use these concepts as analytical tools when completing activities. They explain the physics — your job is to apply them to the evidence.',
    fpDarkHeader: true,
  },

  activityPanel: {
    side: 'right',
    defaultDockedWidth: 480,
    fpDarkHeader: true,
  },

  activities: [
    {
      id: 'act-1',
      title: 'Initial hypothesis',
      thinkingMove: 'Hypothesise',
      purpose: 'Establish your starting position before examining any evidence. Recording an initial hypothesis lets you track how your thinking changes across the inquiry.',
      prompt: 'Before examining any data, write a single sentence explaining why you think the Tacoma Narrows Bridge collapsed on 7 November 1940.',
      scaffold: 'Read the document header and your role brief first.',
      conceptLinks: [],
      evidenceSections: [],
      required: true,
    },
    {
      id: 'act-2',
      title: 'Frequency analysis',
      thinkingMove: 'Analyse',
      purpose: 'Evaluate a specific quantitative claim using evidence from the data tables. The resonance explanation stands or falls on whether the frequencies match.',
      prompt: 'Use the data in §03 to evaluate whether the resonance explanation is consistent with what was recorded on the day of the collapse.',
      scaffold: 'Read §03 carefully before attempting. Pay attention to all three frequency values.',
      conceptLinks: [
        { id: 'oscillation',     title: 'Oscillation and natural frequency' },
        { id: 'resonance',       title: 'Resonance' },
        { id: 'vortex-shedding', title: 'Vortex shedding' },
      ],
      evidenceSections: [
        { id: 'tn-data', label: '§03 Wind and oscillation data' },
      ],
      required: true,
    },
    {
      id: 'act-3',
      title: 'Timeline reconstruction',
      thinkingMove: 'Analyse',
      purpose: 'Identify the two distinct phases of bridge behaviour and consider whether a single explanation can account for both.',
      prompt: 'The incident data reveals two distinct phases on the day of collapse. Identify what changed between them and consider what this means for how the failure mechanism is explained.',
      scaffold: 'Read the timeline in §03 before attempting.',
      conceptLinks: [
        { id: 'oscillation', title: 'Oscillation and natural frequency' },
        { id: 'torsion',     title: 'Torsional oscillation' },
        { id: 'damping',     title: 'Damping' },
      ],
      evidenceSections: [
        { id: 'tn-data', label: '§03 Wind and oscillation data' },
      ],
      required: true,
    },
    {
      id: 'act-4',
      title: 'Design analysis',
      thinkingMove: 'Diagnose',
      purpose: 'Trace how a specific engineering decision — the solid plate girder — created the aerodynamic conditions that led to collapse.',
      prompt: 'Explain the physical consequences of replacing the 7.6m open-lattice trusses with 2.4m solid plate girders.',
      scaffold: 'Read §02 and §04 before attempting.',
      conceptLinks: [
        { id: 'torsion',  title: 'Torsional oscillation' },
        { id: 'flutter',  title: 'Aeroelastic flutter' },
      ],
      evidenceSections: [
        { id: 'tn-specifications', label: '§02 Bridge specifications' },
        { id: 'tn-design',         label: '§04 Engineering sign-off' },
      ],
      required: true,
    },
    {
      id: 'act-5',
      title: 'Expert evaluation',
      thinkingMove: 'Evaluate',
      purpose: 'Weigh two competing expert accounts using the evidence in the case file. One is correct; the other relies on a claim the data directly contradicts.',
      prompt: 'Evaluate the statements of Dr. Brandt and Dr. Osei-Mensah. Which account is better supported by the evidence? Identify the specific claim that undermines the weaker argument.',
      scaffold: 'Read §05 alongside the data in §03 before attempting.',
      conceptLinks: [
        { id: 'resonance',       title: 'Resonance' },
        { id: 'vortex-shedding', title: 'Vortex shedding' },
        { id: 'flutter',         title: 'Aeroelastic flutter' },
        { id: 'damping',         title: 'Damping' },
      ],
      evidenceSections: [
        { id: 'tn-data',    label: '§03 Wind and oscillation data' },
        { id: 'tn-experts', label: '§05 Expert witness statements' },
      ],
      required: true,
    },
    {
      id: 'act-6',
      title: 'Tribunal report',
      thinkingMove: 'Synthesise',
      purpose: 'Bring together your analysis into a structured written finding for the inquiry tribunal. Aim for approximately 200 words.',
      prompt: 'Write your tribunal report. Address the actual failure mechanism, identify where the engineers\' model was incomplete, and recommend one design change that would have prevented a recurrence.',
      scaffold: 'Use the full case file. Draw on all previous activities.',
      conceptLinks: [
        { id: 'oscillation',     title: 'Oscillation and natural frequency' },
        { id: 'resonance',       title: 'Resonance' },
        { id: 'vortex-shedding', title: 'Vortex shedding' },
        { id: 'damping',         title: 'Damping' },
        { id: 'torsion',         title: 'Torsional oscillation' },
        { id: 'flutter',         title: 'Aeroelastic flutter' },
      ],
      evidenceSections: [
        { id: 'tn-overview',       label: '§01 Incident overview' },
        { id: 'tn-specifications', label: '§02 Bridge specifications' },
        { id: 'tn-data',           label: '§03 Wind and oscillation data' },
        { id: 'tn-design',         label: '§04 Engineering sign-off' },
        { id: 'tn-experts',        label: '§05 Expert witness statements' },
      ],
      required: true,
      feedback: {
        systemPrompt: ACT6_SYSTEM_PROMPT,
        buildMessage: (data) => `Here is the student's tribunal report:\n\n"${data.report}"`,
      },
    },
  ],

  concepts: toolkitConcepts,
  conceptComponent: ConceptCard,
  conceptsLabel: 'Physics Toolkit',

  content: {
    maxWidth: '1100px',
  },

  features: {
    voiceToText: true,
    notes: true,
  },

  // Tacoma has no separate evidence panel — evidence is embedded in the case document
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
  },

  getActivityStatus: defaultGetActivityStatus,
}
