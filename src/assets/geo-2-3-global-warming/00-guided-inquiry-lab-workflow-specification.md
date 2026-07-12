# Guided Inquiry Lab — Content Production Workflow

---

## Core principle

**Content presents evidence. Activities are where learners reach conclusions.**

This principle is baked into every prompt below. You do not audit for it separately — if Phase 3 is followed correctly, it is enforced at the point of writing.

Two registers exist in every lab. They must never appear in the same learner-facing content:

- **Evidence register** — what learners see. Describes what evidence is and what it shows observationally. No interpretation, no conclusions.
- **Explanatory register** — what teachers see. Interprets evidence, states significance, draws conclusions. Teacher notes only.

---

## Overview

```
Phase 1 — Design          (AI + your expertise, no research)
        ↓
Phase 2 — Content brief   (AI, no research)
        ↓
Phase 3 — Content         (AI sources and writes everything)
        ↓
Image sourcing            (Cowork only — if photography needed)
        ↓
Phase 4 — Build spec      (AI)
        ↓
Claude Code build
```

Each phase takes the output of the previous phase as input. Phases 1–4 are prompts you can use with any AI — Claude, ChatGPT, Gemini, or any other capable model. Image sourcing requires an AI with web fetch and shell access (Claude Cowork works for this; other agentic setups may also work). The build step uses Claude Code specifically.

**You do not source anything manually.** Data, charts, diagrams, and prose are all produced by the AI in Phase 3. Photography is the only content type that may require sourcing — and that is handled automatically in the image sourcing step below.

---

## Phase 1 — Design

**Input:** Learning outcomes, topic, level, subject
**Output:** Lab Design Brief — cognitive arc + activity specifications

This is the creative phase. Draw on your pedagogical expertise and the AI's ability to structure the design. No research needed.

---

### Phase 1 Prompt

```
You are a learning designer. I need you to design a guided inquiry lab.

Subject: [SUBJECT]
Topic: [TOPIC]  
Level / cohort: [e.g. Cambridge AS & A Level]
Syllabus reference: [optional]
Context: [WHERE THIS SITS IN THE COURSE — optional]

Learning outcomes:
[PASTE LEARNING OUTCOMES]

Produce a Lab Design Brief with three parts.

---

## Part 1 — Central inquiry question

Write one central inquiry question that drives the lab. It should:
- Be genuinely open — not have an obvious or single-step answer
- Require learners to examine evidence and build a reasoned case
- Be answerable by a learner at this level given the right evidence

---

## Part 2 — Cognitive arc

Design the sequence of thinking moves learners will make, from encountering the inquiry question to building a justified conclusion. This is NOT a list of content topics — it is a map of how understanding develops.

| Stage | Thinking move | Learner's question at this stage | Purpose |
|---|---|---|---|

Aim for 5–7 stages. Each stage should represent a distinct cognitive shift — not just a new topic, but a new kind of thinking the learner is doing.

---

## Part 3 — Activity specifications

For each stage of the arc, define one activity.

For each activity:

**Title:** [short name]
**Thinking move:** [from Part 2]
**Learner prompt:** [exactly what the learner is asked to do — 2–4 sentences, written as if addressed to the learner]
**Response format:** [what the learner produces: a paragraph / ranked list / completed table / annotated diagram / etc.]
**What the learner must discover:** [the conclusion or insight this activity leads to — stated precisely here, because this is the do-not-include constraint on all content that feeds this activity]

---

Do not write any content yet. This phase is design only.
```

---

## Phase 2 — Content brief

**Input:** Lab Design Brief (Phase 1 output)
**Output:** Content Brief — specification of what content is needed and in what form

Run this in the same conversation as Phase 1, with the same AI. This phase decides what to build — not the building itself. No research needed.

---

### Phase 2 Prompt

```
I have a Lab Design Brief for a guided inquiry lab. I need to specify the content required to support each activity.

## Lab Design Brief
[PASTE PHASE 1 OUTPUT]

---

For each activity in the design brief, identify what content learners need to engage with that activity — without the content answering it for them.

For each content item, specify:

**Title:** [content section name]
**Feeds activity:** [which activity number/title this supports]
**Evidence presented:** [what data, record, measurement, event, or source material learners will examine]
**Content type:** [choose: prose explanation / data table / graph or chart / diagram or illustration / primary source extract / photograph / interactive element / combination]
**Do-not-include constraint:** [copy exactly the "what the learner must discover" entry from the linked activity — this is what this content must never state or imply]
**What Claude needs to produce this:** [the data, values, or source material required — e.g. "temperature anomaly data 1850–2023", "a diagram of the water cycle", "photograph of the Dust Bowl". Claude will source or generate this in Phase 3 — flag it here so nothing is missed]

For any graph, diagram, or interactive element, also specify:
- What it shows: variables, axes, time period, scale, units
- What a learner can observe from it
- If interactive: what the learner manipulates, what changes, and what question that raises

---

After all activity-linked content, identify any content that serves the whole lab rather than a specific activity: overview context, glossary, chronology, reference tables. Specify these separately.

Output the full content brief. Do not write the content itself yet.
```

---

## Phase 3 — Content production

**Input:** Content Brief (Phase 2 output)
**Output:** All learner-facing content + teacher notes

Start a new conversation for Phase 3 — use whichever AI you prefer. Paste in both Phase 1 and Phase 2 outputs.

**The AI handles all data sourcing and research in this phase.** For graphs and charts, the AI provides the actual data values and a component specification — these are built as React components by Claude Code, not as image files. For diagrams, the AI produces an SVG or JSX specification. For primary source extracts and factual prose, the AI draws on its training knowledge and web search. The only content type the AI cannot produce is photography — those are flagged here and handled in the Image sourcing step that follows.

---

### Phase 3 Prompt

```
I need you to write the learner-facing content for a guided inquiry lab.

## Lab Design Brief
[PASTE PHASE 1 OUTPUT]

## Content Brief
[PASTE PHASE 2 OUTPUT]

---

Write the learner-facing content for each item in the content brief. You are responsible for sourcing and producing all content — do not ask me to provide data or source material. Use your training knowledge and web search to find what you need. If you are uncertain about a specific data value, state the uncertainty and use the best available estimate.

BEFORE writing each content item, read its do-not-include constraint. That constraint defines the hard boundary of what this content may say. Content that crosses the boundary pre-answers the linked activity and defeats the inquiry design.

REGISTER RULE — for all learner-facing content: describe what evidence is and what it shows observationally. Do not interpret, evaluate, conclude, or state significance. If you find yourself writing a sentence that begins "This shows that...", "This means...", "This proves...", or "This is significant because..." — stop. That sentence belongs in teacher notes, not learner content.

For each content item, produce:

---
**[Content title]**
Do-not-include constraint: [restate it from the brief]

Learner-facing text:
[Write the full text in the evidence register]

For graphs / charts:
- Provide the actual data as a JavaScript array or object suitable for use in a React chart component (recharts or similar)
- Axis labels, units, data source and date
- Caption [observational only — describes what the graph is, not what it shows]
- Do NOT reference an external image file — this will be rendered as a React component

For diagrams:
- Produce an SVG specification or describe the component structure in enough detail for Claude Code to build it
- Do NOT reference an external image file unless it is a photograph

For photographs:
- Flag the image needed: what it should show, approximate date/period, any known source
- Do not attempt to produce or link an image — these are sourced separately in the Image sourcing step

For interactive elements:
- Interaction specification: what the learner manipulates, what they observe, what question it raises
- All data / values the element uses

Observable features: [bullet list of what a learner can notice here]
Question this raises: [one genuinely open question the linked activity will pursue — not leading, not pre-framing the answer]

---

AFTER all content items, produce two things:

## Photography needed
List every photograph flagged above:
- Content section it belongs to
- What it should show
- Approximate period/date
- Suggested search terms for Wikimedia Commons or similar open repositories

## Teacher Notes
[This section is NOT for the learner-facing asset. Do not include it in any file handed to developers.]

For each content item:
- Interpretive conclusion: what the evidence actually shows and why it matters
- Common misreading to anticipate

Model responses for each activity: what a well-reasoned learner should produce

Sentence starters: if you are tempted to include a sentence starter that names a specific finding, key concept, or conclusion — write it here instead, labelled "teacher-facing only". Only generic structural starters (ones a learner could use to write either a right or wrong answer) go in the learner-facing asset.
```

---

## Image sourcing (Cowork only — skip if no photography needed)

**Input:** "Photography needed" list from Phase 3
**Output:** Images downloaded into `src/assets/[lab-id]/images/` + a manifest

Run this step with an AI that has web fetch and shell access — Claude Cowork is the recommended tool. Other agentic setups with equivalent capabilities will also work. Standard chat interfaces (ChatGPT, Gemini web) cannot download files and are not suitable for this step.

---

### Image sourcing prompt (use in Cowork)

```
I need you to source photographs for a guided inquiry lab.

Lab ID: [lab-id]
Images folder: src/assets/[lab-id]/images/

## Photography needed
[PASTE THE "PHOTOGRAPHY NEEDED" LIST FROM PHASE 3]

For each image:
1. Search Wikimedia Commons first (https://commons.wikimedia.org). Also check the Library of Congress (loc.gov), Europeana (europeana.eu), and the Internet Archive (archive.org) if needed.
2. Find the most appropriate public domain or Creative Commons licensed image.
3. Download it directly into src/assets/[lab-id]/images/ using the filename format: [section-id]-[short-description].[ext]
4. If you cannot download an image, record the URL and licence so I can download it manually.

After processing all images, produce a manifest:

| Section | Filename | Source URL | Licence | Status |
|---|---|---|---|---|
| [section] | [filename] | [url] | [licence] | Downloaded / URL only — manual download needed |

I will review the manifest and replace any images that are not right before proceeding to Phase 4.
```

Review the manifest after Cowork completes it. Swap out any images that are the wrong thing — this is the one step that requires a human judgement call.

---

## Phase 4 — Build specification

**Input:** All outputs from Phases 1–3 + image manifest (if applicable)
**Output:** A structured build spec document that Claude Code turns directly into files

Start a new conversation — any AI works here. This phase translates the design and content into the exact file structure the LabShell expects.

Attach the following files to your message:
- Phase 1 output (Lab Design Brief)
- Phase 2 output (Content Brief)
- Phase 3 output (Content + Teacher Notes)
- `reference docs/shell.config.template.js`
- Image manifest (if you have one)

Then paste the Phase 4 prompt below and send.

---

### Shell context (fixed — update if shell changes)

The canonical config structure is in `reference docs/shell.config.template.js`. That file is the source of truth for field names and structure. The summary below is for orientation only — always use the template when producing `shell.config.js`.

The LabShell provides:
- Layout — nav bar, guide sidebar, activity panel, evidence panel, concepts modal, mobile drawer
- Persistence — `onSave(key, value)` writes to Supabase; `savedResponses` rehydrates on load
- Completion tracking — shell calls `onComplete` when all required activities pass `getActivityStatus`
- `ActivityPanel` — wraps each activity form component
- `EvidencePanel` — floating doc viewer; lab wires up `openEvidence(id)` calls from content
- `StarterChips` — takes `starters` array and `onInsert` callback
- `useActivityResponse` — draft state + save-on-blur
- `ActivityTextarea` — textarea with word count + save status
- `AIFeedbackUI`, `LabFigure`, `LabGallery`

The lab author builds: `shell.config.js`, `index.jsx`, `index.module.css`, activity form components, chart/diagram components, any custom interactive elements.

---

### Phase 4 Prompt

```
I need you to produce a build specification for a guided inquiry lab. Claude Code will use this document to write all lab files.

## Lab metadata
Lab ID: [lab-id — lowercase, hyphenated, e.g. geo-2-3-global-warming]
Title: [display title]
Accent colour: [hex — choose to suit the topic]

I have attached the following files to this message:
- Lab Design Brief (Phase 1 output)
- Content Brief (Phase 2 output)
- Content and Teacher Notes (Phase 3 output)
- Shell config template (shell.config.template.js)
- Image manifest (if applicable)

Read all attached files before producing the build specification.

---

Produce a build specification with clearly delimited sections per file. Each section should contain everything Claude Code needs to write that file without asking questions.

---

## shell.config.js

Follow the structure in `reference docs/shell.config.template.js` exactly. Do not invent field names or structure — copy the template and fill in values from the design and content.

Key fields to populate from the lab design:

- `labId` — the lab ID
- `nav.sections` — one entry per content section in index.jsx; id must match the element id
- `activities` — one entry per activity. For each:
  - `id` — e.g. `'act-1'`
  - `title` — activity title from Phase 1
  - `thinkingMove` — the cognitive verb for this stage (e.g. 'Observe', 'Analyse', 'Evaluate', 'Synthesise')
  - `purpose` — the "why this matters" context, 1–2 sentences
  - `prompt` — the learner-facing task question from Phase 1 (if not inside the form component)
  - `evidenceSections` — scroll-to buttons pointing at relevant content sections
- `activityForms` — map of activity id to imported component
- `getActivityStatus` — use `defaultGetActivityStatus