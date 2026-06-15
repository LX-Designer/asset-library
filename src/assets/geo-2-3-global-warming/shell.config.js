import { DEFAULT_THEME_VARS, defaultGetActivityStatus } from '../../lab-shell/defaults.js'
import EvidenceArchiveTab  from './EvidenceArchiveTab.jsx'
import EvidenceCardOverlay from './EvidenceCardOverlay.jsx'
import { EVIDENCE_CARDS }  from './data.js'
import Act1          from './activities/Act1.jsx'
import Act2          from './activities/Act2.jsx'
import Act3          from './activities/Act3.jsx'
import Act4          from './activities/Act4.jsx'
import Act5          from './activities/Act5.jsx'
import ActSynthesis  from './activities/ActSynthesis.jsx'
import ActReflection from './activities/ActReflection.jsx'

// ── Theme vars ────────────────────────────────────────────────────────────────
const THEME_VARS = [
  ...DEFAULT_THEME_VARS,
  '--fp-header-bg',
  '--gw-bg', '--gw-surface', '--gw-surface-mid',
  '--gw-ink', '--gw-ink-mid', '--gw-ink-light',
  '--gw-rule', '--gw-rule-light',
  '--gw-accent', '--gw-accent-hover', '--gw-accent-subtle', '--gw-accent-mid',
  '--gw-proxy', '--gw-proxy-subtle',
  '--gw-instrumental', '--gw-instrumental-subtle',
  '--gw-physical', '--gw-physical-subtle',
  '--gw-synthesis', '--gw-synthesis-subtle',
  '--gw-inquiry', '--gw-inquiry-subtle',
  '--gw-warn', '--gw-warn-subtle', '--gw-warn-border',
  '--gw-sans', '--gw-mono', '--gw-transition',
]

export default {

  labId: 'geo-2-3-global-warming',

  nav: {
    showWorkExplore: true,
    sections: [
      { id: 's-anomaly',       label: 'The Anomaly'     },
      { id: 's-proxy',         label: 'Proxy Evidence'  },
      { id: 's-instrumental',  label: 'Instrumental'    },
      { id: 's-chronology',    label: 'Chronology'      },
      { id: 's-greenhouse',    label: 'Greenhouse Gases' },
      { id: 's-natural',       label: 'Natural Factors' },
      { id: 's-anthropogenic', label: 'Anthropogenic'   },
      { id: 's-comparison',    label: 'Comparison'      },
      { id: 's-glossary',      label: 'Glossary'        },
    ],
  },

  sidebar: {
    side:               'left',
    defaultDockedWidth: 260,
    maxDockedWidth:     360,
    defaultTab:         'activities',
    tabs:               ['activities', 'evidence'],
    fpAccentHeader:     false,
    fpDarkHeader:       true,
    accentHeader:       false,
    header: {
      fpTitle:  'Activity Guide',
      eyebrow:  'Activity Guide',
      title:    'Who Changed the Climate?',
      subtitle: 'Global Warming Lab',
    },
    statusLabels: {
      complete:      'Complete',
      inprogress:    'In progress',
      'not-started': 'Not started',
    },
  },

  activityPanel: {
    defaultDockedWidth: 480,
    accentHeader:  false,
    fpDarkHeader:  true,
  },

  activities: [
    {
      id:           'act-1',
      title:        'What does the temperature record show?',
      thinkingMove: 'Observe',
      group:        'Stage 1 · Notice the problem',
      purpose:      'Establish the inquiry problem from data before any explanation is offered. You cannot explain something you have not first carefully observed.',
      task:         'Look at the temperature anomaly record in The Anomaly section. In your own words: what pattern do you see? When does something unusual appear to happen? Write 3–6 sentences describing what you observe — without yet explaining it. Then ask yourself: is this within the range of normal climate variability, or does it suggest something else is happening? How would you even begin to investigate that question?',
      sentenceStarters: [
        'The temperature record shows a clear pattern of…',
        'Something unusual appears to happen around… — specifically…',
        'This raises the question of whether…',
      ],
      evidenceSections: [
        { id: 's-anomaly',    label: 'The Anomaly'  },
        { id: 's-chronology', label: 'Chronology'   },
      ],
      required: true,
    },
    {
      id:           'act-2',
      title:        'What does the evidence archive tell us — and what does it not?',
      thinkingMove: 'Evaluate evidence',
      group:        'Stage 2 · Build the evidence base',
      purpose:      'Build an empirical foundation before any causal framework is introduced. Practise the essential distinction between detecting a warming signal and attributing it to a cause.',
      task:         'Explore the evidence archive — Proxy Evidence and Instrumental and Physical Observations. Choose at least three types of evidence and for each, record: (1) what the evidence shows, (2) the timescale it covers, and (3) what it does NOT tell you on its own. Pay particular attention to the difference between detecting a warming signal and attributing it to a cause. When you\'re done, write a short summary: what is the strongest evidence that warming is happening, and what question does the evidence leave unanswered?',
      sentenceStarters: [
        'This evidence shows… It covers the timescale… On its own, it does NOT prove…',
        'The most significant limitation of this evidence is that it cannot tell us…',
        'The strongest evidence that warming is happening is… but the question it leaves unanswered is…',
      ],
      evidenceSections: [
        { id: 's-proxy',         label: 'Proxy Evidence'  },
        { id: 's-instrumental',  label: 'Instrumental'    },
        { id: 's-chronology',    label: 'Chronology'      },
      ],
      required: true,
    },
    {
      id:           'act-3',
      title:        'Can natural factors explain the post-1950 warming?',
      thinkingMove: 'Test a hypothesis',
      group:        'Stage 3 · Test the natural-cause hypothesis',
      purpose:      'Take the natural-cause explanation seriously before testing it. The attribution argument requires showing that natural factors are insufficient — not that they are irrelevant.',
      task:         'Examine each of the three natural factors in the Natural Factors section. For each one: describe the mechanism (how it would affect temperature), assess whether its timing and magnitude match the post-1950 warming acceleration, and reach a verdict — can this factor account for what we observe? Then write an overall conclusion: can natural factors, taken together, fully explain the warming since approximately 1950?',
      sentenceStarters: [
        'The mechanism by which [this factor] could warm the climate is… however…',
        'The timing of this factor [matches / does not match] the post-1950 acceleration because…',
        'Taken together, natural factors can account for… but cannot explain… because…',
      ],
      evidenceSections: [
        { id: 's-natural',    label: 'Natural Factors' },
        { id: 's-anomaly',    label: 'The Anomaly'     },
        { id: 's-chronology', label: 'Chronology'      },
      ],
      required: true,
    },
    {
      id:           'act-4',
      title:        'What is the human case — mechanism and fingerprint?',
      thinkingMove: 'Trace causation',
      group:        'Stage 4 · Build the anthropogenic case',
      purpose:      'Build the positive case for anthropogenic attribution. Understanding the mechanism — not just the correlation — is what makes the attribution argument defensible.',
      evidenceSections: [
        { id: 's-greenhouse',    label: 'Greenhouse Gases' },
        { id: 's-anthropogenic', label: 'Anthropogenic'   },
      ],
      required: true,
    },
    {
      id:           'act-5',
      title:        'Which explanation fits the evidence better — and why?',
      thinkingMove: 'Attribute',
      group:        'Stage 5 · Make the attribution move',
      purpose:      'This is the core intellectual work of the inquiry. Hold both causal systems against the same evidence simultaneously. The post-1950 divergence is the decisive test.',
      evidenceSections: [
        { id: 's-comparison',    label: 'Comparison'       },
        { id: 's-natural',       label: 'Natural Factors'  },
        { id: 's-anthropogenic', label: 'Anthropogenic'    },
        { id: 's-anomaly',       label: 'The Anomaly'      },
      ],
      required: true,
    },
    {
      id:           'act-6',
      title:        'Write your attribution argument',
      thinkingMove: 'Synthesise',
      group:        'Stage 6 · Synthesis',
      purpose:      'Produce the primary transferable output: an evidence-based causal argument that assigns relative significance to natural and anthropogenic factors, names mechanisms, and acknowledges uncertainty.',
      sentenceStarters: [
        'The temperature record since 1850 shows…',
        'Natural factors — including solar variability, volcanic eruptions, and ENSO — can account for…',
        'However, natural factors cannot explain…',
        'The enhanced greenhouse effect, driven by…',
        'The post-1950 divergence between solar irradiance and temperature shows…',
        'The GHG fingerprint (tropospheric warming + stratospheric cooling) distinguishes…',
        'The most significant factor is… because…',
        'Natural variability remains… but the anthropogenic signal…',
        'Uncertainty remains in… but the qualitative conclusion…',
      ],
      evidenceSections: [
        { id: 's-comparison',    label: 'Comparison'      },
        { id: 's-greenhouse',    label: 'Greenhouse Gases' },
        { id: 's-natural',       label: 'Natural Factors'  },
        { id: 's-anthropogenic', label: 'Anthropogenic'    },
      ],
      required: true,
    },
    {
      id:           'act-7',
      title:        'How did your thinking change?',
      thinkingMove: 'Reflect',
      group:        'Stage 7 · Reflection',
      purpose:      'Make your reasoning visible. Convert tacit understanding into explicit self-knowledge about how you think — and where uncertainty remains.',
      task:         'These six prompts ask you to reflect on what you thought before the inquiry, what the evidence showed you, and where uncertainty remains. Each prompt has its own response field.',
      evidenceSections: [],
      required: false,
    },
  ],

  activityForms: {
    'act-1': Act1,
    'act-2': Act2,
    'act-3': Act3,
    'act-4': Act4,
    'act-5': Act5,
    'act-6': ActSynthesis,
    'act-7': ActReflection,
  },

  content: { maxWidth: '960px' },

  features: {
    voiceToText: false,
  },

  customTabs: {
    evidence: EvidenceArchiveTab,
  },

  evidenceCards: EVIDENCE_CARDS,
  cardOverlayComponent: EvidenceCardOverlay,

  themeVars: THEME_VARS,
  getActivityStatus: defaultGetActivityStatus,

  getResponseExcerpt: (id, responses) => {
    const val = responses[id]
    if (!val) return null
    // act-1/2/6 use response; act-3 uses overall; act-4 uses partA; act-5 uses comparison
    const text = val.response ?? val.overall ?? val.comparison ?? val.partA ?? null
    return typeof text === 'string' ? text.trim() || null : null
  },
}
