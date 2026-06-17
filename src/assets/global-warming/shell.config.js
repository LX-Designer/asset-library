import { DEFAULT_THEME_VARS, defaultGetActivityStatus } from '../../lab-shell/defaults.js'

import Act1 from './activities/Act1.jsx'
import Act2 from './activities/Act2.jsx'
import Act3 from './activities/Act3.jsx'
import Act4 from './activities/Act4.jsx'
import Act5 from './activities/Act5.jsx'
import Act6 from './activities/Act6.jsx'
import Act7 from './activities/Act7.jsx'
import GlossaryTab from './GlossaryTab.jsx'
import UnitsTab from './UnitsTab.jsx'

const THEME_VARS = [
  ...DEFAULT_THEME_VARS,
]

export default {

  labId: 'global-warming',

  nav: {
    title:    'Global Warming',
    subtitle: 'Cambridge AS Level Geography',

    sections: [
      { id: 's-intro',     label: 'Overview'    },
      { id: 's-act1',      label: 'Activity 1'  },
      { id: 's-act2',      label: 'Activity 2'  },
      { id: 's-act3',      label: 'Activity 3'  },
      { id: 's-act4',      label: 'Activity 4'  },
      { id: 's-act5',      label: 'Activity 5'  },
      { id: 's-act6',      label: 'Activity 6'  },
      { id: 's-act7',      label: 'Activity 7'  },
      { id: 's-reference', label: 'Reference'   },
    ],

    showWorkExplore: true,
  },

  sidebar: {
    side:               'left',
    defaultDockedWidth: 280,
    maxDockedWidth:     380,
    defaultTab:         'activities',
    tabs:               ['activities', 'glossary', 'units'],
    fpAccentHeader:     false,
    accentHeader:       false,
    header: {
      fpTitle:  'Activity Guide',
      eyebrow:  'Activity Guide',
      title:    'Global Warming',
      subtitle: 'Cambridge AS Level Geography',
    },
    statusLabels: {},
    conceptsIntro: '',
  },

  activityPanel: {
    defaultDockedWidth: 480,
    accentHeader:       false,
  },

  customTabs: {
    glossary: GlossaryTab,
    units:    UnitsTab,
  },

  activities: [
    {
      id:           'act-1',
      title:        'What Would Count as Proof?',
      thinkingMove: 'Establish the evidential burden',
      purpose:      'Deciding what counts as evidence before you examine any data protects your reasoning from confirmation bias. Investigators in science, law, and geography all separate evidence that something is happening from evidence that explains why it is happening.',
      prompt:       'Before looking at the evidence, decide what kinds of evidence would be needed to make a convincing case. Separate your ideas into evidence that would show warming is happening and evidence that would help explain why it is happening.',
      evidenceSections: [
        { id: 's-act1', label: 'Evidence Starter Pack' },
      ],
      required: true,
    },
    {
      id:           'act-2',
      title:        'Reading the Climate Archive',
      thinkingMove: 'Build a long-term climate context',
      purpose:      'To interpret recent temperature records you need to know what the climate was doing before those records began. Proxy evidence extends the record back thousands of years, but each type of proxy has limitations that affect how much weight it can carry.',
      prompt:       'Examine the climate evidence sources. Identify what each source can and cannot tell us about past climate conditions. Then use Figure 2.1 to complete the evidence table.',
      evidenceSections: [
        { id: 's-act2', label: 'Climate Archive' },
      ],
      required: true,
    },
    {
      id:           'act-3',
      title:        'Do the Indicators Agree?',
      thinkingMove: 'Triangulate independent evidence',
      purpose:      'A single indicator could be unreliable or misleading. When several independent indicators — each measured by different instruments and research groups — all point in the same direction, the cumulative case becomes harder to dismiss.',
      prompt:       'Examine the six climate indicators. For each one, decide whether the evidence it provides supports, weakens, or complicates the claim that global warming is occurring. Then write a summary judgement across all six.',
      evidenceSections: [
        { id: 's-act3', label: 'The Six Indicators' },
      ],
      required: true,
    },
    {
      id:           'act-4',
      title:        'Matching Causes to Patterns',
      thinkingMove: 'Connect patterns with possible drivers',
      purpose:      'Observing that the climate is changing does not tell us why it is changing. To move from description to explanation, a proposed cause must match the pattern of change in direction, timing, duration, and scale.',
      prompt:       'Compare the timing of five potential climate drivers against the temperature record. For each driver, describe how well its pattern matches the observed long-term trend, then rank all five from strongest to weakest match.',
      evidenceSections: [
        { id: 's-act4', label: 'The Five Drivers' },
      ],
      required: true,
    },
    {
      id:           'act-5',
      title:        'Inside the Greenhouse Effect',
      thinkingMove: 'Examine the greenhouse mechanism',
      purpose:      'Understanding how the greenhouse effect works — and why different gases have different warming impacts — is essential for evaluating competing explanations. A gas present in tiny concentrations can still have a large effect if its GWP and atmospheric lifetime are high.',
      prompt:       'Use Figure 5.1 to annotate the six stages of the energy budget. Then study the greenhouse gas data table and answer the four Part B questions. Show your working for any calculations.',
      evidenceSections: [
        { id: 's-act5', label: 'Greenhouse Mechanism' },
      ],
      required: true,
    },
    {
      id:           'act-6',
      title:        'Natural Causes or Enhanced Greenhouse Effect?',
      thinkingMove: 'Weigh natural and human explanations',
      purpose:      'Both natural variability and human enhancement of the greenhouse effect can influence climate. Your task is not to pick a side but to weigh each piece of evidence against each explanation and assess how well each framework accounts for the full observed pattern.',
      prompt:       'Place each evidence tile into the weighing board. Then complete the evaluation table and write a comparative judgement of 5–8 sentences.',
      evidenceSections: [
        { id: 's-act6', label: 'Evidence A–G' },
      ],
      required: true,
    },
    {
      id:           'act-7',
      title:        'The Evidence Brief',
      thinkingMove: 'Construct a justified judgement',
      purpose:      'A geographical judgement is not a summary of evidence — it is a weighted conclusion. It makes an explicit claim, links evidence to that claim through reasoning, engages with alternative explanations, and acknowledges genuine uncertainty.',
      prompt:       'Write a final evidence brief of 250–350 words answering the central inquiry question. Use the writing frame as a structural guide. Write in continuous prose, not bullet points.',
      evidenceSections: [
        { id: 's-act7',      label: 'Writing Guide'  },
        { id: 's-reference', label: 'Reference'      },
      ],
      required: true,
    },
  ],

  activityForms: {
    'act-1': Act1,
    'act-2': Act2,
    'act-3': Act3,
    'act-4': Act4,
    'act-5': Act5,
    'act-6': Act6,
    'act-7': Act7,
  },

  evidenceOrder:     [],
  evidenceComponent: null,

  content: {
    maxWidth: '960px',
  },

  features: {
    notes:       false,
    voiceToText: false,
  },

  themeVars: THEME_VARS,

  getActivityStatus: defaultGetActivityStatus,
}
