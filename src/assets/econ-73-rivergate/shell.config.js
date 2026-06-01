import Act1 from './activities/Act1InitialJudgement.jsx'
import EvidenceContent from './components/EvidenceModal.jsx'
import Act2 from './activities/Act2EfficiencyClaims.jsx'
import Act3 from './activities/Act3Discontinuity.jsx'
import Act4 from './activities/Act4MarketFailureDiagnosis.jsx'
import Act5 from './activities/Act5ExpertAccounts.jsx'
import Act6 from './activities/Act6JudgementNote.jsx'
import { SYSTEM_PROMPT as ACT6_SYSTEM_PROMPT } from './data/feedbackPrompt.js'

// CSS custom properties forwarded through FloatingPanel portals.
// Must include --fp-* and --modal-* names so portals receive literal values.
const THEME_VARS = [
  '--lab-bg', '--lab-surface', '--lab-surface-mid',
  '--lab-ink', '--lab-ink-mid', '--lab-ink-light',
  '--lab-rule', '--lab-rule-light',
  '--lab-accent', '--lab-accent-hover', '--lab-accent-subtle',
  '--lab-complete', '--lab-complete-subtle', '--lab-complete-muted',
  '--lab-warn', '--lab-warn-subtle', '--lab-warn-muted',
  '--lab-flag', '--lab-font-serif', '--lab-font-mono', '--lab-nav-height', '--lab-transition',
  '--fp-bg', '--fp-border', '--fp-ink', '--fp-ink-mid', '--fp-ink-light',
  '--fp-accent', '--fp-subtle', '--fp-shadow',
  '--fp-tab-bg', '--fp-tab-border', '--fp-tab-ink',
  '--fp-radius', '--fp-transition',
  '--modal-panel-bg', '--modal-border', '--modal-ink', '--modal-ink-mid',
  '--modal-ink-light', '--modal-accent', '--modal-accent-hover',
  '--modal-subtle', '--modal-label', '--modal-serif', '--modal-transition',
]

export default {
  labId: 'econ-73-rivergate',

  nav: {
    title: 'The Rivergate Overflow Inquiry',
    subtitle: 'RG/7.3/NWW/Overflow',
    navCenter: null,
    showWorkExplore: true,
  },

  sidebar: {
    side: 'left',
    defaultDockedWidth: 260,
    maxDockedWidth: 360,
    defaultTab: 'activities',
    tabs: ['activities', 'notes'],
  },

  activityPanel: {
    side: 'right',
    defaultDockedWidth: 480,
  },

  activities: [
    {
      id: 'act-1',
      number: 1,
      label: 'Task 01',
      title: 'Initial Judgement',
      thinkingMove: 'Evaluate',
      purpose: 'Form an initial position before examining the full evidence. This baseline helps you track how your thinking develops across the inquiry.',
      prompt: 'North Wessex Water claims it acted efficiently. Before reviewing the evidence in full, select your initial judgement and give a brief explanation.',
      scaffold: 'Read the Scenario Header and Section 1 before attempting.',
      evidenceSections: [],
      required: true,
    },
    {
      id: 'act-2',
      number: 2,
      label: 'Task 02',
      title: 'What Kind of Efficiency is Being Claimed?',
      thinkingMove: 'Analyse',
      purpose: 'Identify which economic concept of efficiency the company is relying on — and whether that claim is supported by the evidence.',
      prompt: 'For each of the four efficiency claims, decide whether the evidence supports it, contradicts it, or is insufficient to judge.',
      scaffold: 'Read Sections 2 and 3 before attempting.',
      evidenceSections: [],
      required: true,
    },
    {
      id: 'act-3',
      number: 3,
      label: 'Task 03',
      title: 'Where the Simple Efficiency Story Breaks Down',
      thinkingMove: 'Evaluate',
      purpose: 'Identify the point at which a narrow focus on productive efficiency fails to capture the full economic picture.',
      prompt: 'Explain where the company\'s efficiency argument breaks down when you consider external costs and distributional effects.',
      scaffold: 'Read Sections 3, 5 and 6 before attempting.',
      evidenceSections: [],
      required: true,
    },
    {
      id: 'act-4',
      number: 4,
      label: 'Task 04',
      title: 'Diagnose the Reasons for Market Failure',
      thinkingMove: 'Diagnose',
      purpose: 'Apply the standard taxonomy of market failure reasons to this specific case.',
      prompt: 'Select the reasons for market failure that apply to this case and explain how at least two of them are operating here.',
      scaffold: 'Read Sections 4, 5, 6 and the Reference Note before attempting.',
      evidenceSections: [],
      required: true,
    },
    {
      id: 'act-5',
      number: 5,
      label: 'Task 05',
      title: 'Evaluate the Two Expert Accounts',
      thinkingMove: 'Evaluate',
      purpose: 'Weigh competing economic interpretations of the same evidence and reach a supported judgement.',
      prompt: 'Compare Account A and Account B. Which account provides the more persuasive economic analysis of the Rivergate case? Support your answer with evidence.',
      scaffold: 'Read Sections 7A and 7B before attempting.',
      evidenceSections: [],
      required: true,
    },
    {
      id: 'act-6',
      number: 6,
      label: 'Task 06',
      title: 'Economic Judgement Note',
      thinkingMove: 'Synthesise',
      purpose: 'Bring together your analysis from across the inquiry to produce a structured economic judgement for the review panel.',
      prompt: 'Write your economic judgement note. Address whether North Wessex Water acted efficiently in the full economic sense, and what this implies for regulatory oversight.',
      scaffold: 'Use the full case file. Aim for approximately 200 words.',
      evidenceSections: [],
      required: true,
      feedback: {
        systemPrompt: ACT6_SYSTEM_PROMPT,
        buildMessage: (data) => `Here is the student's economic judgement note:\n\n"${data.note}"`,
      },
    },
  ],

  concepts: null,

  content: {
    maxWidth: '980px',
  },

  features: {
    voiceToText: true,
    notes: true,
  },

  evidenceOrder: [
    'reference-note',
    'engineering-memo',
    'committee-minutes',
    'expert-comparison',
  ],

  evidenceMeta: {
    'reference-note':    { title: 'Efficiency Terms',                    label: 'Ref. Note' },
    'engineering-memo':  { title: 'Engineering Memo, March 2021',        label: 'Eng. Memo' },
    'committee-minutes': { title: 'Finance Committee Minutes, June 2021', label: 'Committee Minutes' },
    'expert-comparison': { title: 'Expert Account Comparison',           label: 'Expert Comparison' },
  },

  // Component that receives evidenceId as a prop — no JSX needed in this file
  evidenceComponent: EvidenceContent,

  themeVars: THEME_VARS,

  requiredActivityCount: 6,

  activityForms: {
    'act-1': Act1,
    'act-2': Act2,
    'act-3': Act3,
    'act-4': Act4,
    'act-5': Act5,
    'act-6': Act6,
  },

  getActivityStatus(activityId, responses) {
    return responses[activityId] != null ? 'complete' : 'not-started'
  },
}
