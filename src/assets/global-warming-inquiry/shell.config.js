import base from '../global-warming/shell.config.js'
import { EVIDENCE_STARTER_CARDS } from '../global-warming/index.jsx'

import GlossaryTab from '../global-warming/GlossaryTab.jsx'
import UnitsTab    from '../global-warming/UnitsTab.jsx'
import CardsTab      from './CardsTab.jsx'
import ChronologyTab from './ChronologyTab.jsx'
import EvidenceTab   from './EvidenceTab.jsx'
import EvidenceDocs  from './EvidenceDocs.jsx'
import CardStage     from './CardStage.jsx'
import IntroSection  from './IntroSection.jsx'
import activityBackgrounds from './Backgrounds.jsx'

// Evidence documents shown in the right-hand evidence dock.
const EVIDENCE_DOCUMENTS = [
  { id: 'proxy',    label: 'Proxy record',  title: 'Temperature: proxy reconstruction vs instrumental' },
  { id: 'gmst',     label: 'Global temp',   title: 'Global temperature record (1880–2025)' },
  { id: 'co2-temp', label: 'Temp vs CO₂',   title: 'Temperature vs CO₂ and natural forcings' },
  { id: 'budget',   label: 'Energy budget', title: 'Earth’s energy budget' },
  { id: 'ghg',      label: 'GHG table',     title: 'Greenhouse gas comparison' },
  { id: 'co2e',     label: 'CO₂e calc',     title: 'CO₂-equivalent calculator' },
]

// Per-activity "View evidence" links — repurposed to open evidence documents
// in the dock (the standard lab points these at content sections instead).
const EVIDENCE_LINKS = {
  'act-1': [{ id: 'proxy',    label: 'Proxy vs instrumental record' }],
  'act-2': [{ id: 'proxy',    label: 'Proxy reconstruction' }],
  'act-3': [{ id: 'gmst',     label: 'Global temperature record' }],
  'act-4': [{ id: 'co2-temp', label: 'Temperature vs CO₂ & forcings' }],
  'act-5': [
    { id: 'budget', label: 'Energy budget' },
    { id: 'ghg',    label: 'GHG comparison' },
    { id: 'co2e',   label: 'CO₂e calculator' },
  ],
  'act-6': [
    { id: 'gmst',     label: 'Global temperature' },
    { id: 'co2-temp', label: 'Temp vs CO₂ & forcings' },
  ],
  'act-7': [],
}

const activities = base.activities.map(a => ({
  ...a,
  evidenceSections: EVIDENCE_LINKS[a.id] ?? [],
}))

export default {
  labId: 'global-warming-inquiry',

  nav: {
    title:    'Global Warming',
    subtitle: 'Inquiry layout',
    sections: [
      { id: 's-intro',  label: 'Overview'   },
      { id: 's-act-1',  label: 'Activity 1' },
      { id: 's-act-2',  label: 'Activity 2' },
      { id: 's-act-3',  label: 'Activity 3' },
      { id: 's-act-4',  label: 'Activity 4' },
      { id: 's-act-5',  label: 'Activity 5' },
      { id: 's-act-6',  label: 'Activity 6' },
      { id: 's-act-7',  label: 'Activity 7' },
    ],
    showWorkExplore: false,
  },

  sidebar: {
    side:               'left',
    defaultDockedWidth: 300,
    maxDockedWidth:     400,
    defaultTab:         'cards',
    tabs:               ['cards', 'evidence', 'chronology', 'glossary', 'units'],
    header: {
      fpTitle:  'Reference',
      eyebrow:  'Reference',
      title:    'Global Warming',
      subtitle: 'Evidence & reference',
    },
  },

  customTabs: {
    cards:      CardsTab,
    evidence:   EvidenceTab,
    chronology: ChronologyTab,
    glossary:   GlossaryTab,
    units:      UnitsTab,
  },

  // ── Activity-primary layout extras ──────────────────────────────────────────
  introComponent:     IntroSection,
  activityBackgrounds,

  evidence: {
    dockSide:   'right',
    panelWidth: 600,
    documents:  EVIDENCE_DOCUMENTS,
  },
  evidenceComponent: EvidenceDocs,

  cards: {
    documents: EVIDENCE_STARTER_CARDS.map(c => ({ id: c.id, label: c.type, title: c.title })),
  },
  cardComponent: CardStage,

  activities,
  activityForms:     base.activityForms,
  getActivityStatus: base.getActivityStatus,
  themeVars:         base.themeVars,

  content: { maxWidth: '960px' },
}
