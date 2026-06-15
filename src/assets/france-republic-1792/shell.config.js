import { DEFAULT_THEME_VARS } from '../../lab-shell/defaults.js'
import ActInit       from './activities/ActInit.jsx'
import Act1          from './activities/Act1.jsx'
import Act2          from './activities/Act2.jsx'
import Act3          from './activities/Act3.jsx'
import Act4          from './activities/Act4.jsx'
import Act5          from './activities/Act5.jsx'
import Act6          from './activities/Act6.jsx'
import Act7          from './activities/Act7.jsx'
import Act8          from './activities/Act8.jsx'
import Act9          from './activities/Act9.jsx'
import ActFinal      from './activities/ActFinal.jsx'
import ActReflection from './activities/ActReflection.jsx'

// ── Theme vars ────────────────────────────────────────────────────────────────
// Spread DEFAULT_THEME_VARS then add --fr-* aliases so FloatingPanel portals
// (guide sidebar, activity panel, concepts modal) receive resolved literal values.
const THEME_VARS = [
  ...DEFAULT_THEME_VARS,
  '--fr-parchment', '--fr-parchment-mid', '--fr-paper', '--fr-paper-raised',
  '--fr-ink', '--fr-ink-mid', '--fr-ink-light',
  '--fr-rule', '--fr-rule-light',
  '--fr-accent', '--fr-accent-hover', '--fr-accent-subtle',
  '--fr-seal', '--fr-seal-subtle', '--fr-seal-muted',
  '--fr-complete', '--fr-complete-subtle', '--fr-complete-muted',
  '--fr-inprogress', '--fr-inprogress-subtle',
  '--fr-serif', '--fr-sans', '--fr-transition',
]

// ── Activity completion status ─────────────────────────────────────────────────
// Custom logic: activities with multiple response keys use 'inprogress' states.
// Reads from consolidated response objects (e.g. responses['act1'] = { selections, response }).
function getActivityStatus(id, responses) {
  const val = responses[id]
  if (!val) return 'not-started'

  const has = (key) => {
    const v = val[key]
    if (v == null) return false
    if (typeof v === 'string') return v.trim().length > 0
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object') return Object.keys(v).length > 0
    return v != null
  }
  const arr = (key, n) => Array.isArray(val[key]) && val[key].length >= n
  const obj = (key, n) => typeof val[key] === 'object' && val[key] != null && Object.keys(val[key]).length >= n
  const str = (key, n = 1) => typeof val[key] === 'string' && val[key].trim().length >= n

  switch (id) {
    case 'init':
      if (str('text') || val.confidence != null) return 'complete'
      return 'not-started'
    case 'act1':
      if (arr('selections', 3) && str('response')) return 'complete'
      if (has('selections') || has('response')) return 'inprogress'
      return 'not-started'
    case 'act2':
      if (has('pathway') && str('response')) return 'complete'
      if (has('pathway') || has('response')) return 'inprogress'
      return 'not-started'
    case 'act3':
      if (obj('table', 1) && str('response')) return 'complete'
      if (has('table') || has('response')) return 'inprogress'
      return 'not-started'
    case 'act4':
      if (arr('tags', 2) && str('response')) return 'complete'
      if (has('tags') || has('response')) return 'inprogress'
      return 'not-started'
    case 'act5':
      if (obj('categories', 3) && str('response')) return 'complete'
      if (has('categories') || has('response')) return 'inprogress'
      return 'not-started'
    case 'act6':
      if (val.rating != null && str('response')) return 'complete'
      if (val.rating != null || has('response')) return 'inprogress'
      return 'not-started'
    case 'act7':
      if (arr('factors', 3) && str('response')) return 'complete'
      if (has('factors') || has('response')) return 'inprogress'
      return 'not-started'
    case 'act8': {
      const c8 = val.classifications
      const classified = c8 ? Object.keys(c8).filter(k => c8[k]).length : 0
      if (classified >= 4 && str('response')) return 'complete'
      if (classified > 0 || has('response')) return 'inprogress'
      return 'not-started'
    }
    case 'act9': {
      const m = val.matrix
      const rated = m ? Object.keys(m).filter(k => Object.keys(m[k] ?? {}).length >= 3).length : 0
      const ranked = Array.isArray(val.ranked) && val.ranked.filter(Boolean).length >= 3
      if (rated >= 5 && ranked && str('response')) return 'complete'
      if (rated > 0 || has('ranked') || has('response')) return 'inprogress'
      return 'not-started'
    }
    case 'final':
      if (str('response', 50)) return 'complete'
      if (has('response')) return 'inprogress'
      return 'not-started'
    case 'reflection':
      if (str('text')) return 'complete'
      if (has('text')) return 'inprogress'
      return 'not-started'
    default: return 'not-started'
  }
}

export default {

  labId: 'france-republic-1792',

  nav: {
    sections: [
      { id: 'intro',               label: 'Inquiry'        },
      { id: 'chronology',          label: 'Chronology'     },
      { id: 'pathway',             label: 'Pathway'        },
      { id: 'groups',              label: 'Groups'         },
      { id: 'counter-revolution',  label: 'Opposition'     },
      { id: 'reforms',             label: 'Reforms'        },
      { id: 'king-trust',          label: 'Royal Trust'    },
      { id: 'war-radicalisation',  label: 'War'            },
      { id: 'turning-points',      label: 'Turning Points' },
      { id: 'cause-map',           label: 'Causes'         },
      { id: 'glossary',            label: 'Glossary'       },
      { id: 'synthesis',           label: 'Synthesis'      },
    ],
    showWorkExplore: true,
  },

  sidebar: {
    side:              'left',
    defaultDockedWidth: 260,
    maxDockedWidth:     360,
    defaultTab:        'activities',
    tabs:              ['activities', 'notes'],
    fpAccentHeader:    false,
    accentHeader:      false,
    header: {
      fpTitle:  'Activity Guide',
      eyebrow:  'Activity Guide',
      title:    'From Monarchy to Republic',
      subtitle: '',
    },
    statusLabels: {
      complete:      'Complete',
      inprogress:    'In progress',
      'not-started': 'Not started',
    },
  },

  activityPanel: {
    defaultDockedWidth: 480,
    accentHeader: false,
  },

  activities: [
    {
      id:           'init',
      title:        'What do you think before you investigate?',
      thinkingMove: 'Orientation / initial judgement',
      purpose:      'Surface your prior assumptions — especially the idea that the republic was inevitable.',
      prompt:       'Before you examine the dossier, what do you think was the main reason France became a republic by 1792? Make a starting judgement. You can change your view later.',
      scaffold:     'This is a starting hypothesis, not a final answer. There are no wrong answers here.',
      sentenceStarters: [
        'Before examining the evidence, I think France became a republic mainly because…',
      ],
      evidenceSections: [{ id: 'intro', label: 'Inquiry' }],
      required:     false,
    },
    {
      id:           'act1',
      title:        'What changed?',
      thinkingMove: 'Orientation and chronological grounding',
      purpose:      'Establish the puzzle of why constitutional monarchy failed and disrupt the assumption that republic was inevitable.',
      prompt:       'France did not automatically become a republic in 1789. From the chronology and overview evidence, choose three to five developments that made the old monarchy harder to sustain. For each one, briefly explain what changed.',
      scaffold:     'Focus on changes that weakened the existing political settlement — not just dramatic events.',
      sentenceStarters: [
        'One development that made constitutional monarchy harder to sustain was… because…',
        'This change mattered because it meant that…',
      ],
      evidenceSections: [
        { id: 'intro',      label: 'Inquiry'    },
        { id: 'chronology', label: 'Chronology' },
        { id: 'reforms',    label: 'Reforms'    },
        { id: 'glossary',   label: 'Glossary'   },
      ],
    },
    {
      id:           'act2',
      title:        'How did monarchy actually collapse?',
      thinkingMove: 'Mechanism of change',
      purpose:      'Make the "how" of the topic explicit so you explain the political pathway, not only causes.',
      prompt:       'Explain the political pathway by which France moved from constitutional monarchy to republic. Focus on institutions, events, and decisions: the Constitution of 1791, the Legislative Assembly, the fall of the Tuileries, the suspension of the king, the National Convention, and the abolition of monarchy.',
      scaffold:     'Think about sequence and mechanism, not just causes. How did one stage lead to the next?',
      sentenceStarters: [
        'The process began with… which meant that…',
        'A crucial turning point came when… because…',
        'This sequence of events led to the end of monarchy because…',
      ],
      evidenceSections: [
        { id: 'chronology',         label: 'Chronology'  },
        { id: 'pathway',            label: 'Pathway'     },
        { id: 'king-trust',         label: 'Royal Trust' },
        { id: 'war-radicalisation', label: 'War'         },
      ],
    },
    {
      id:           'act3',
      title:        'Which revolutionary groups pulled France in different directions?',
      thinkingMove: 'Comparison',
      purpose:      'Clarify political divisions inside the Revolution — the Jacobins, Feuillants, and Girondins were not interchangeable.',
      prompt:       'Compare the Jacobins, Feuillants, and Girondins. What did each group want, and how did disagreement between revolutionary groups make a stable constitutional monarchy harder to maintain?',
      scaffold:     'Consider: aims, attitude to monarchy, social base, and why they failed to reach a lasting compromise.',
      sentenceStarters: [
        'The most significant difference between the Jacobins and the Girondins was…',
        'Disagreement between revolutionary groups made constitutional monarchy harder to maintain because…',
      ],
      evidenceSections: [
        { id: 'groups',    label: 'Groups'  },
        { id: 'glossary',  label: 'Glossary' },
        { id: 'cause-map', label: 'Causes'  },
      ],
    },
    {
      id:           'act4',
      title:        'Why did counter-revolution fail to stop the Revolution?',
      thinkingMove: 'Opposition and failure analysis',
      purpose:      'Give counter-revolution a clear causal role, while showing that opposition often strengthened republican arguments rather than halting them.',
      prompt:       'Counter-revolutionaries wanted to halt or reverse the Revolution, but they failed to prevent the republic. Identify who opposed the Revolution, why they opposed it, and why their actions did not save monarchy.',
      scaffold:     'Think about how each form of opposition actually affected revolutionary politics — did it weaken the Revolution, or intensify it?',
      sentenceStarters: [
        'Counter-revolutionary actions, such as…, ultimately [strengthened / failed to weaken] the Revolution because…',
        'The main reason opposition failed to preserve the monarchy was…',
      ],
      evidenceSections: [
        { id: 'counter-revolution', label: 'Opposition' },
        { id: 'war-radicalisation', label: 'War'        },
        { id: 'reforms',            label: 'Reforms'    },
        { id: 'glossary',           label: 'Glossary'   },
      ],
    },
    {
      id:           'act5',
      title:        'Did reform stabilise or destabilise France?',
      thinkingMove: 'Causal analysis',
      purpose:      'Analyse reforms as double-edged: they rebuilt revolutionary France but also disrupted institutions and created resistance.',
      prompt:       'Revolutionary reforms aimed to rebuild France. But did they make France more stable, less stable, or both? Choose at least three reforms and explain how they affected the survival of constitutional monarchy.',
      scaffold:     'A reform can do both at once: strengthen state authority while also creating new enemies or conflicts.',
      sentenceStarters: [
        'The [reform] aimed to… but also destabilised France by…',
        'Overall, revolutionary reforms [did / did not] help constitutional monarchy survive because…',
      ],
      evidenceSections: [
        { id: 'reforms',            label: 'Reforms'    },
        { id: 'chronology',         label: 'Chronology' },
        { id: 'counter-revolution', label: 'Opposition' },
        { id: 'cause-map',          label: 'Causes'     },
      ],
    },
    {
      id:           'act6',
      title:        'Was trust in the King recoverable?',
      thinkingMove: 'Turning-point analysis',
      purpose:      'Examine why legitimacy and trust were central to constitutional monarchy — and why losing them was so damaging.',
      prompt:       'Constitutional monarchy depended on the belief that Louis XVI could be trusted to work within the Revolution. After Varennes and Champ de Mars, was that trust recoverable? Explain your judgement using evidence.',
      scaffold:     'Consider: could Louis have rebuilt trust after Varennes? What would that have required? Why did it not happen?',
      sentenceStarters: [
        'After Varennes, trust in Louis XVI [was / was not] recoverable because…',
        'Even if Louis had… this would not have been enough because…',
      ],
      evidenceSections: [
        { id: 'king-trust',     label: 'Royal Trust'    },
        { id: 'chronology',     label: 'Chronology'     },
        { id: 'turning-points', label: 'Turning Points' },
        { id: 'pathway',        label: 'Pathway'        },
      ],
    },
    {
      id:           'act7',
      title:        'How did war radicalise the Revolution?',
      thinkingMove: 'Interaction analysis',
      purpose:      'Connect external war to internal fear, suspicion, popular pressure, and political change.',
      prompt:       'War did not just add another event to the sequence. It changed the political atmosphere. Explain how war connected with suspicion, popular pressure, counter-revolution, and the collapse of monarchy.',
      scaffold:     'Think about how each factor interacted with the others — what did war make worse, or make possible, that would not otherwise have happened?',
      sentenceStarters: [
        'War radicalised the Revolution by…',
        'The connection between war and [suspicion / popular pressure / counter-revolution] was that…',
        'Without the pressure of war, it is possible that… because…',
      ],
      evidenceSections: [
        { id: 'war-radicalisation', label: 'War'        },
        { id: 'counter-revolution', label: 'Opposition' },
        { id: 'pathway',            label: 'Pathway'    },
        { id: 'chronology',         label: 'Chronology' },
      ],
    },
    {
      id:           'act8',
      title:        'Turning point or cumulative collapse?',
      thinkingMove: 'Turning point versus process',
      purpose:      'Prevent over-reliance on one dramatic event — help you distinguish trigger, turning point, accelerator, and cumulative process.',
      prompt:       'Was there one decisive turning point, or did monarchy collapse through accumulated pressures? Compare at least four possible turning points and decide whether each was a trigger, accelerator, symptom, or decisive break.',
      scaffold:     'A "decisive break" should be an event without which the republic could not have come about. A "symptom" is something that reflects deeper processes rather than causing them.',
      sentenceStarters: [
        'The [event] was a [trigger / accelerator / symptom / decisive break] because…',
        'Without [event], the republic would / would not have come about because…',
        'The collapse of monarchy was ultimately [a single turning point / a cumulative process] because…',
      ],
      evidenceSections: [
        { id: 'turning-points',     label: 'Turning Points' },
        { id: 'chronology',         label: 'Chronology'     },
        { id: 'king-trust',         label: 'Royal Trust'    },
        { id: 'war-radicalisation', label: 'War'            },
        { id: 'cause-map',          label: 'Causes'         },
      ],
    },
    {
      id:           'act9',
      title:        'Which causes mattered most?',
      thinkingMove: 'Significance judgement',
      purpose:      'Prepare for your final judgement by weighing significance rather than just listing causes.',
      prompt:       'Use the cause-weighing matrix to decide which causes mattered most. Do not simply choose the most dramatic event. Think about whether each factor was a background pressure, immediate trigger, accelerator, decisive break, or necessary condition.',
      scaffold:     'Ask of each factor: would the republic have happened without it? If yes, it may be less decisive than it seems.',
      sentenceStarters: [
        'The most significant cause was… because without it…',
        'This factor was more decisive than… because…',
        'The interaction between [X] and [Y] mattered because…',
      ],
      evidenceSections: [
        { id: 'cause-map',          label: 'Causes'     },
        { id: 'groups',             label: 'Groups'     },
        { id: 'counter-revolution', label: 'Opposition' },
        { id: 'reforms',            label: 'Reforms'    },
        { id: 'king-trust',         label: 'Royal Trust' },
        { id: 'war-radicalisation', label: 'War'        },
      ],
      feedback: {
        systemPrompt: `You are a history tutor helping AS Level students think about the causes of the French Republic in 1792. The student has rated and ranked causes. Ask one or two Socratic questions that push them to justify their top-ranked cause and consider how it interacted with other causes. Do not provide a model answer. Keep your response to 3–4 sentences. Focus on historical reasoning quality, not factual recall.`,
        buildMessage: (data) =>
          `My top 3 causes: ${(data.ranked ?? []).filter(Boolean).join(', ')}.\n\nMy analysis: ${data.response ?? ''}`,
      },
    },
    {
      id:           'final',
      title:        'AS History judgement',
      thinkingMove: 'Synthesis and argument',
      purpose:      'Synthesise your investigation into a supported historical explanation.',
      prompt:       'How and why did France become a republic by 1792?\n\nIn your answer, explain the political process by which monarchy collapsed, then judge which causes were most significant. Refer to at least three factors, such as revolutionary groups, counter-revolution, reforms, distrust of the King, war, popular pressure, and the National Convention.',
      scaffold:     'Address both parts: HOW (the political pathway) and WHY (the most significant causes). A strong answer weighs causes and avoids treating the republic as inevitable.',
      sentenceStarters: [
        'France became a republic through a process in which…',
        'The most significant cause of this outcome was… because without it…',
        'While [factor] played an important role, the more decisive cause was… because…',
        'The collapse of monarchy was not inevitable — it was the result of…',
      ],
      evidenceSections: [
        { id: 'pathway',        label: 'Pathway'        },
        { id: 'cause-map',      label: 'Causes'         },
        { id: 'turning-points', label: 'Turning Points' },
        { id: 'synthesis',      label: 'Synthesis'      },
      ],
      feedback: {
        systemPrompt: `You are a history tutor giving feedback on AS Level History essay writing about the French Revolution (1789–1792). The student is writing about how and why France became a republic by 1792. Give brief Socratic feedback (3–5 sentences) that identifies one strength in their reasoning and asks one challenging question about their argument. Do not write a model answer. Focus on: how well they address both 'how' and 'why', whether they weigh rather than list causes, and whether they avoid treating the republic as inevitable.`,
        buildMessage: (data) => data.response ?? '',
      },
    },
    {
      id:           'reflection',
      title:        'How did your thinking change?',
      thinkingMove: 'Reflection',
      purpose:      'Develop your historical reasoning by comparing your starting and final judgements.',
      prompt:       'Compare your starting judgement with your final answer. What changed, what stayed the same, and which evidence most affected your thinking?',
      scaffold:     'Be honest: historical understanding often involves revising confident first assumptions.',
      sentenceStarters: [
        'My initial judgement was… but having examined the evidence, I now think…',
        'The evidence that most changed my thinking was… because…',
      ],
      evidenceSections: [],
      required:     false,
    },
  ],

  activityForms: {
    'init':       ActInit,
    'act1':       Act1,
    'act2':       Act2,
    'act3':       Act3,
    'act4':       Act4,
    'act5':       Act5,
    'act6':       Act6,
    'act7':       Act7,
    'act8':       Act8,
    'act9':       Act9,
    'final':      ActFinal,
    'reflection': ActReflection,
  },

  content: { maxWidth: '960px' },

  features: {
    notes:       true,
    voiceToText: false,
  },

  themeVars:          THEME_VARS,
  getActivityStatus,
}
