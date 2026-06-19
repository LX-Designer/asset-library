import { DEFAULT_THEME_VARS } from '../../lab-shell/defaults.js'

import Act1 from './activities/Act1.jsx'
import Act2 from './activities/Act2.jsx'
import Act3 from './activities/Act3.jsx'
import Act4 from './activities/Act4.jsx'
import Act5 from './activities/Act5.jsx'
import Act6 from './activities/Act6.jsx'
import ReferenceTab from './ReferenceTab.jsx'

const THEME_VARS = [...DEFAULT_THEME_VARS]

export default {

  labId: 'cambridge-as-1-1-data-rep',

  nav: {
    title:    'Data Representation',
    subtitle: 'Cambridge AS Level · Topic 1.1',
    sections: [
      { id: 'section-prefixes',      label: 'Prefixes'     },
      { id: 'section-number-systems', label: 'Number Systems' },
      { id: 'section-signed',         label: 'Signed Binary' },
      { id: 'section-arithmetic',     label: 'Arithmetic'   },
      { id: 'section-applications',   label: 'Applications' },
      { id: 'section-encoding',       label: 'Encoding'     },
    ],
    showWorkExplore: true,
    exploreLabel:    'Read',
    workLabel:       'Practise',
  },

  sidebar: {
    side:               'left',
    defaultDockedWidth: 300,
    maxDockedWidth:     380,
    defaultTab:         'activities',
    tabs:               ['activities', 'reference'],
    fpAccentHeader: false,
    accentHeader:   false,
    header: {
      fpTitle:  'Activity Guide',
      eyebrow:  'Topic 1.1',
      title:    'Data Representation',
      subtitle: 'Cambridge AS Level Computer Science',
    },
    statusLabels: {},
    conceptsIntro: '',
  },

  activityPanel: {
    defaultDockedWidth: 500,
    accentHeader: false,
  },

  evidenceSectionsLabel: 'See in the lab',

  activities: [
    {
      id:           'act-1',
      title:        'Binary and decimal prefixes',
      thinkingMove: 'Recall',
      purpose:      'Test your understanding of binary magnitude notation.',
      prompt:       'A manufacturer advertises a hard drive as "1 TB". A computer scientist says it holds "931 GiB". Explain why these two figures describe the same device and show the calculation that connects them.',
      scaffold:     'Use exact prefix values: 1 TB = 10¹² bytes; 1 GiB = 2³⁰ bytes.',
      evidenceSections: [{ id: 'section-prefixes', label: 'Binary Prefixes' }],
      required: true,
    },
    {
      id:           'act-2',
      title:        'Number base conversions',
      thinkingMove: 'Apply',
      purpose:      'Practise converting between binary, denary, hexadecimal, and BCD.',
      prompt:       'Convert the denary value 173 into (a) binary, (b) hexadecimal, and (c) BCD. Show your working for each.',
      scaffold:     'For BCD, encode each decimal digit independently as a 4-bit group.',
      evidenceSections: [{ id: 'section-number-systems', label: 'Number Systems' }],
      required: true,
    },
    {
      id:           'act-3',
      title:        'Signed binary representation',
      thinkingMove: 'Apply',
      purpose:      'Represent negative integers using one\'s and two\'s complement.',
      prompt:       'Using 8-bit representation, express −46 in (a) one\'s complement and (b) two\'s complement. State the range of integers representable in 8-bit two\'s complement.',
      scaffold:     'Start from the positive binary form of 46, then apply the complement rule.',
      evidenceSections: [{ id: 'section-signed', label: 'Signed Binary' }],
      required: true,
    },
    {
      id:           'act-4',
      title:        'Binary addition and subtraction',
      thinkingMove: 'Apply',
      purpose:      'Perform binary arithmetic and identify overflow.',
      prompt:       'Using 8-bit arithmetic: (a) add the two values shown below and record each carry bit; (b) subtract the second value from the first using two\'s complement; (c) construct your own example of 8-bit signed addition that causes overflow and explain how to detect it.',
      scaffold:     'For subtraction, negate the subtrahend via two\'s complement, then add.',
      evidenceSections: [{ id: 'section-arithmetic', label: 'Binary Arithmetic' }],
      required: true,
    },
    {
      id:           'act-5',
      title:        'Real-world applications of BCD and hex',
      thinkingMove: 'Evaluate',
      purpose:      'Understand why specific number representations are chosen in practice.',
      prompt:       'For each representation, describe one practical application and explain why that representation is preferred over pure binary in that context: (a) Binary Coded Decimal (BCD), (b) Hexadecimal.',
      scaffold:     'Think about display hardware, memory addressing, and financial calculations.',
      evidenceSections: [{ id: 'section-applications', label: 'Applications' }],
      required: true,
    },
    {
      id:           'act-6',
      title:        'Character encoding',
      thinkingMove: 'Analyse',
      purpose:      'Understand how text is stored in binary using character sets.',
      prompt:       'The byte sequence 72 101 108 108 111 (decimal) is stored in a file. (a) Decode this ASCII sequence into a word. (b) Explain why ASCII alone is insufficient for a global application. (c) Describe how Unicode and UTF-8 solve this problem.',
      scaffold:     'ASCII codes: 65=A, 97=a. Count up from there, or refer to the Reference tab.',
      evidenceSections: [{ id: 'section-encoding', label: 'Character Encoding' }],
      required: true,
    },
  ],

  customTabs: {
    reference: ReferenceTab,
  },

  activityForms: {
    'act-1': Act1,
    'act-2': Act2,
    'act-3': Act3,
    'act-4': Act4,
    'act-5': Act5,
    'act-6': Act6,
  },

  evidenceOrder:     [],
  evidenceComponent: null,

  content: { maxWidth: '900px' },

  features: {
    notes:       true,
    voiceToText: false,
  },

  themeVars: THEME_VARS,

  // Multi-part activities auto-save partial data as objects.
  // Use _submitted flag (set on onSubmit) to distinguish submitted from in-progress.
  getActivityStatus: (activityId, responses) => {
    const val = responses[activityId]
    if (!val) return 'not-started'
    if (typeof val === 'string') return val.trim() ? 'complete' : 'not-started'
    if (val._submitted) return 'complete'
    const hasContent = Object.entries(val).some(
      ([k, v]) => !k.startsWith('_') && typeof v === 'string' && v.trim()
    )
    return hasContent ? 'inprogress' : 'not-started'
  },

  getResponseExcerpt: (activityId, responses) => {
    const val = responses[activityId]
    if (!val) return null
    if (typeof val === 'string') return val.trim() || null
    const first = Object.entries(val)
      .filter(([k]) => !k.startsWith('_'))
      .map(([, v]) => v)
      .find(v => typeof v === 'string' && v.trim())
    return first?.trim() || null
  },
}
