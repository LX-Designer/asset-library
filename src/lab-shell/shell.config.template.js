/**
 * shell.config.template.js
 *
 * Copy this file to src/assets/[lab-id]/shell.config.js and fill in your
 * content. Search-replace LAB_ID with your asset folder name (e.g. 'my-lab').
 *
 * Required fields are marked REQUIRED. Everything else has a working default
 * and can be omitted or added only when you need to override the default.
 *
 * Import checklist for a minimal lab (no concepts, no evidence panel):
 *   import { DEFAULT_THEME_VARS, defaultGetActivityStatus } from '../../lab-shell/defaults.js'
 *   import Act1 from './activities/Act1.jsx'
 *   // ... more activity imports
 *
 * Import checklist for a lab with concepts:
 *   import ConceptCard from './ConceptCard.jsx'   ← your own concept renderer
 *
 * Import checklist for a lab with an evidence panel:
 *   import EvidenceDoc from './EvidenceDoc.jsx'   ← your own evidence renderer
 */

import { DEFAULT_THEME_VARS, defaultGetActivityStatus } from '../../lab-shell/defaults.js'

// ── Activity form components ──────────────────────────────────────────────────
// One import per activity. The component receives:
//   initialAnswers  object     — previously saved response data
//   isCompleted     boolean    — whether this activity is already complete
//   onSubmit        (data) => Promise<void>   — save + trigger AI feedback if configured
//   onSave          (data) => void            — save without AI trigger
//   onClose         () => void               — close the activity panel
import Act1 from './activities/Act1.jsx'
// import Act2 from './activities/Act2.jsx'
// import Act3 from './activities/Act3.jsx'

// ── Concept component (omit entire block if this lab has no concepts) ─────────
// A single React component that receives { concept } and renders the concept
// body however you like. The shell owns the FloatingPanel chrome (accent header,
// prev/next footer). Your component owns everything between them.
// import ConceptCard from './ConceptCard.jsx'

// ── Evidence component (omit if no evidence panel) ───────────────────────────
// A single React component that receives { evidenceId } and renders the
// evidence document. The shell owns the FloatingPanel chrome and tab strip.
// import EvidenceDoc from './EvidenceDoc.jsx'

// ── Theme vars ────────────────────────────────────────────────────────────────
// Spread DEFAULT_THEME_VARS (all standard lab + FloatingPanel + ActivityModal
// tokens) then add any custom CSS vars your form components or visuals reference.
const THEME_VARS = [
  ...DEFAULT_THEME_VARS,
  // '--my-custom-colour', '--my-custom-font',
]

export default {

  // ── Identity ────────────────────────────────────────────────────────────────
  labId: 'LAB_ID',  // REQUIRED — must match src/assets/[lab-id]/ folder name


  // ── Nav bar ─────────────────────────────────────────────────────────────────
  nav: {
    // When sections are defined, the nav centre shows section scroll buttons.
    // When sections is empty, title + subtitle are shown instead.
    title:    'Lab Title',      // shown when sections is empty
    subtitle: 'Course / Unit',  // shown below title when sections is empty

    // Section links — each id must match an element id in your main content.
    // The shell uses IntersectionObserver to highlight the active section.
    sections: [
      // { id: 'section-overview',  label: 'Overview'  },
      // { id: 'section-evidence',  label: 'Evidence'  },
      // { id: 'section-decision',  label: 'Decision'  },
    ],

    // Show the Explore / Work mode buttons in the nav bar.
    // Explore docks the guide sidebar; Work opens the activity panel to the
    // lowest in-progress (or first not-started) activity.
    showWorkExplore: true,
  },


  // ── Guide sidebar ────────────────────────────────────────────────────────────
  sidebar: {
    side:              'left',   // 'left' | 'right'
    defaultDockedWidth: 280,
    maxDockedWidth:     380,
    defaultTab:        'activities',  // which tab is active on first open
    tabs:              ['activities'],
    // Add 'concepts' if this lab has concepts, 'notes' if features.notes is true.
    // tabs: ['activities', 'concepts', 'notes'],

    // Set fpAccentHeader: true to give the sidebar FloatingPanel header the
    // lab accent colour (e.g. red for the dossier). The Activities tab header
    // inside the panel stays neutral unless you also set accentHeader: true.
    fpAccentHeader: false,
    accentHeader:   false,

    // Text shown in the Activities tab header area.
    header: {
      fpTitle:  'Activity Guide',  // FloatingPanel PanelHeader title
      eyebrow:  'Activity Guide',  // small uppercase line in the ActivitiesTab header
      title:    'Lab Title',       // main title in the ActivitiesTab header
      subtitle: '',                // optional subtitle line
    },

    // Override the status labels shown under each activity in the list.
    // Defaults: { complete: 'Complete', inprogress: 'In progress', 'not-started': 'Not started' }
    statusLabels: {},

    // Intro paragraph shown at the top of the Toolkit (concepts) tab.
    // Only relevant when tabs includes 'concepts'.
    conceptsIntro: 'Use these concepts as analytical tools when completing activities.',
  },


  // ── Activity panel (right-side task panel) ───────────────────────────────────
  activityPanel: {
    defaultDockedWidth: 480,

    // Set accentHeader: true to give the activity panel FloatingPanel header the
    // lab accent colour (the "Activity N of M / Title" bar will be coloured).
    accentHeader: false,
  },


  // ── Activities ───────────────────────────────────────────────────────────────
  // Each activity maps to one entry in the sidebar list and one form component.
  // The shell auto-derives position labels ("Activity 1", "Activity 2") from the
  // array index — do not add a number or label field.
  activities: [
    {
      id:    'act-1',   // REQUIRED — unique string; matches activityForms key and DB response key
      title: 'Activity title or question',  // REQUIRED

      // thinkingMove — brief cognitive label shown in the mobile activity header subtitle.
      // e.g. 'Hypothesise', 'Analyse', 'Evaluate', 'Synthesise'
      thinkingMove: 'Analyse',

      // group — optional phase label shown above the title in the sidebar.
      // Use for labs with distinct stages: 'Stage 1 · Build the evidence base'
      // Omit for labs where activities are not grouped.
      // group: 'Stage 1 · Explore the evidence',

      // purpose — optional "Why this matters" context block shown above the form.
      // Omit if the form component is self-contained and explains the task itself.
      purpose: '',

      // prompt — optional task question rendered above the form.
      // Omit if the question lives inside the form component (most common).
      prompt: '',

      // scaffold — optional italic hint shown below the prompt.
      scaffold: null,

      // evidenceSections — scroll-to buttons shown in the activity panel.
      // Each id must match an element id in the main content.
      evidenceSections: [
        // { id: 'section-evidence', label: 'Evidence cards' },
      ],

      // conceptLinks — toolkit links shown in the activity panel.
      // Each id must match a concept id in the concepts array.
      conceptLinks: [
        // { id: 'concept-id', title: 'Concept Title' },
      ],

      // clearKeys — response keys cleared when the learner clicks "Clear this response".
      // Defaults to [activity.id]. Set explicitly if the activity saves to multiple keys.
      // clearKeys: ['act-1', 'act-1-supplementary'],

      // required — whether this activity counts toward lab completion. Default: true.
      required: true,

      // feedback — optional AI feedback config. Omit if this activity has no AI feedback.
      // feedback: {
      //   systemPrompt: MY_SYSTEM_PROMPT,
      //   buildMessage: (data) => `The student wrote: ${data.response}`,
      // },
    },

    // {
    //   id: 'act-2',
    //   title: 'Second activity',
    //   thinkingMove: 'Evaluate',
    //   required: true,
    // },
  ],


  // ── Activity form components ──────────────────────────────────────────────────
  // Map each activity id to its form component.
  activityForms: {
    'act-1': Act1,
    // 'act-2': Act2,
  },


  // ── Concepts (omit entire block if this lab has no concepts) ─────────────────
  // concepts:         array of concept objects — shape is up to you (the shell only
  //                   reads id and title; everything else is passed to conceptComponent)
  // conceptComponent: the React component that renders a concept body
  // conceptsLabel:    label for the "open concept" section in the activity panel
  //
  // concepts: [
  //   { id: 'concept-1', title: 'Concept Title', /* ...your fields */ },
  // ],
  // conceptComponent: ConceptCard,
  // conceptsLabel: 'Key Concepts',


  // ── Evidence panel (omit if this lab has no floating evidence documents) ──────
  // evidenceOrder:    array of evidence ids — defines tab order when length > 1
  // evidenceMeta:     { [id]: { title, label? } } — tab labels and panel title
  // evidenceComponent: the React component that renders an evidence document;
  //                    receives { evidenceId } prop
  //
  // evidenceOrder: ['doc-a', 'doc-b'],
  // evidenceMeta: {
  //   'doc-a': { title: 'Primary Source A', label: 'Source A' },
  //   'doc-b': { title: 'Primary Source B', label: 'Source B' },
  // },
  // evidenceComponent: EvidenceDoc,
  evidenceOrder:     [],
  evidenceComponent: null,


  // ── Content area ─────────────────────────────────────────────────────────────
  content: {
    maxWidth: '960px',  // CSS max-width for the main content column
  },


  // ── Optional features ─────────────────────────────────────────────────────────
  features: {
    notes:       false,  // adds a Notes tab to the sidebar
    voiceToText: false,  // adds a floating speech-to-text button
  },


  // ── Theme vars ────────────────────────────────────────────────────────────────
  // Do not change this unless your form components or visuals reference custom
  // CSS variables that need to be forwarded through FloatingPanel portals.
  themeVars: THEME_VARS,


  // ── Activity status ───────────────────────────────────────────────────────────
  // defaultGetActivityStatus handles the common case:
  //   null/undefined or empty string → 'not-started'
  //   non-empty string               → 'complete'
  //   any object/array               → 'complete'
  //
  // Override with a custom function if your lab needs 'inprogress' states or
  // checks multiple response keys to determine completion.
  getActivityStatus: defaultGetActivityStatus,
}
