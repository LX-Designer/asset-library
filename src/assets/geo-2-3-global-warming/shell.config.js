import { DEFAULT_THEME_VARS } from '../../lab-shell/defaults.js'
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

// ── Activity status ───────────────────────────────────────────────────────────
function getActivityStatus(id, responses) {
  const val = responses[id]
  if (!val) return 'not-started'

  const str = (key, n = 1) => typeof val[key] === 'string' && val[key].trim().length >= n
  const has = (key) => {
    if (val[key] == null) return false
    if (typeof val[key] === 'string') return val[key].trim().length > 0
    return val[key] != null
  }

  switch (id) {
    case 'act-1':
    case 'act-2':
      if (str('response')) return 'complete'
      if (has('response')) return 'inprogress'
      return 'not-started'

    case 'act-3': {
      const keys = ['solar', 'volcanic', 'enso', 'overall']
      const hasAll = keys.every(k => str(k))
      const hasAny = keys.some(k => has(k))
      if (hasAll) return 'complete'
      if (hasAny) return 'inprogress'
      return 'not-started'
    }

    case 'act-4':
      if (str('partA') && str('partB')) return 'complete'
      if (has('partA') || has('partB')) return 'inprogress'
      return 'not-started'

    case 'act-5':
      if (str('comparison') && str('verdict')) return 'complete'
      if (has('comparison') || has('verdict')) return 'inprogress'
      return 'not-started'

    case 'act-6':
      if (str('response', 50)) return 'complete'
      if (has('response')) return 'inprogress'
      return 'not-started'

    case 'act-7': {
      const keys = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6']
      const hasAll = keys.every(k => str(k))
      const hasAny = keys.some(k => has(k))
      if (hasAll) return 'complete'
      if (hasAny) return 'inprogress'
      return 'not-started'
    }

    default: return 'not-started'
  }
}

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
    tabs:               ['activities', 'notes'],
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
    notes:       true,
    voiceToText: false,
  },

  themeVars: THEME_VARS,
  getActivityStatus,
}
