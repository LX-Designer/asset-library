import { useState, useRef } from 'react'
import SharedActivityModal from '../../components/ActivityModal'
import s from './FranceRepublic.module.css'
import { ACTIVITIES, CHRONOLOGY, REFORMS, CAUSE_FACTORS, TURNING_POINTS, SECTIONS } from './data.js'

const ACT_ORDER = [
  'init', 'act1', 'act2', 'act3', 'act4',
  'act5', 'act6', 'act7', 'act8', 'act9',
  'final', 'reflection',
]

const SECTION_LABEL = Object.fromEntries(SECTIONS.map(s => [s.id, s.label]))

async function getAIFeedback(systemPrompt, userMessage) {
  try {
    const res = await fetch('/api/ai-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: systemPrompt, userMessage }),
    })
    const data = await res.json()
    return data.text ?? 'Feedback unavailable. Try again.'
  } catch {
    return 'Feedback unavailable right now.'
  }
}

const AI_SYSTEM_CAUSE = `You are a history tutor helping AS Level students think about the causes of the French Republic in 1792. The student has rated and ranked causes. Ask one or two Socratic questions that push them to justify their top-ranked cause and consider how it interacted with other causes. Do not provide a model answer. Keep your response to 3–4 sentences. Focus on historical reasoning quality, not factual recall.`

const AI_SYSTEM_FINAL = `You are a history tutor giving feedback on AS Level History essay writing about the French Revolution (1789–1792). The student is writing about how and why France became a republic by 1792. Give brief Socratic feedback (3–5 sentences) that identifies one strength in their reasoning and asks one challenging question about their argument. Do not write a model answer. Focus on: how well they address both 'how' and 'why', whether they weigh rather than list causes, and whether they avoid treating the republic as inevitable.`

// ── Response keys for each activity (used by onClear) ───────────────────────
const ACTIVITY_RESPONSE_KEYS = {
  'init':       ['init-text', 'init-confidence'],
  'act1':       ['act1-selections', 'act1-response'],
  'act2':       ['act2-pathway', 'act2-response'],
  'act3':       ['act3-table', 'act3-response'],
  'act4':       ['act4-tags', 'act4-response'],
  'act5':       ['act5-categories', 'act5-response'],
  'act6':       ['act6-rating', 'act6-response'],
  'act7':       ['act7-factors', 'act7-response'],
  'act8':       ['act8-classifications', 'act8-response'],
  'act9':       ['act9-matrix', 'act9-ranked', 'act9-response'],
  'final':      ['final-response', 'final-confidence', 'final-checklist'],
  'reflection': ['reflection'],
}

// ── Save status component ────────────────────────────────────────────────────
function SaveStatus({ status }) {
  const label = status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'
  return <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>{label}</span>
}

// ── Main modal ───────────────────────────────────────────────────────────────
// onNavigate handles prev/next without closing the FloatingPanel.
// showHeader + onClose are for the mobile fallback (no FloatingPanel).
export default function ActivityModal({ activityId, responses, onSave, onNavigate, onClose, showHeader = false, scrollToSection }) {
  const [clearKey, setClearKey] = useState(0)

  const actIndex = ACT_ORDER.indexOf(activityId)
  const activity = ACTIVITIES.find(a => a.id === activityId)

  if (!activity) return null

  const prevId = actIndex > 0 ? ACT_ORDER[actIndex - 1] : null
  const nextId = actIndex < ACT_ORDER.length - 1 ? ACT_ORDER[actIndex + 1] : null
  const prevActivity = prevId ? ACTIVITIES.find(a => a.id === prevId) : null
  const nextActivity = nextId ? ACTIVITIES.find(a => a.id === nextId) : null

  const handleClear = () => {
    const keys = ACTIVITY_RESPONSE_KEYS[activityId] ?? []
    keys.forEach(k => onSave(k, null))
    setClearKey(k => k + 1)   // remount the form so local state resets
  }

  return (
    <SharedActivityModal
      activityNumber={activity.number}
      activityLabel={activity.label}
      thinkingMove={activity.thinkingMove}
      title={activity.title}
      purpose={activity.purpose}
      prompt={activity.prompt}
      scaffold={activity.scaffold ?? null}
      evidenceSections={activity.evidenceSections.map(id => ({ id, label: SECTION_LABEL[id] ?? id }))}
      prevItem={prevActivity ? { id: prevActivity.id, label: prevActivity.label } : null}
      nextItem={nextActivity ? { id: nextActivity.id, label: nextActivity.label } : null}
      onNavigate={onNavigate}
      onClose={showHeader ? onClose : undefined}
      onScrollTo={scrollToSection}
      onClear={handleClear}
      noHeader={!showHeader}
    >
      <ActivityForm key={clearKey} activityId={activityId} responses={responses} onSave={onSave} />
    </SharedActivityModal>
  )
}

// ── Activity form dispatcher ─────────────────────────────────────────────────
function ActivityForm({ activityId, responses, onSave }) {
  switch (activityId) {
    case 'init':      return <FormInit      responses={responses} onSave={onSave} />
    case 'act1':      return <FormAct1      responses={responses} onSave={onSave} />
    case 'act2':      return <FormAct2      responses={responses} onSave={onSave} />
    case 'act3':      return <FormAct3      responses={responses} onSave={onSave} />
    case 'act4':      return <FormAct4      responses={responses} onSave={onSave} />
    case 'act5':      return <FormAct5      responses={responses} onSave={onSave} />
    case 'act6':      return <FormAct6      responses={responses} onSave={onSave} />
    case 'act7':      return <FormAct7      responses={responses} onSave={onSave} />
    case 'act8':      return <FormAct8      responses={responses} onSave={onSave} />
    case 'act9':      return <FormAct9      responses={responses} onSave={onSave} />
    case 'final':     return <FormFinal     responses={responses} onSave={onSave} />
    case 'reflection':return <FormReflection responses={responses} onSave={onSave} />
    default:          return null
  }
}

// ── Shared useResponseState ──────────────────────────────────────────────────
function useResponseState(keys, responses) {
  const [local, setLocal] = useState(() => {
    const init = {}
    keys.forEach(k => { init[k] = responses[k] ?? null })
    return init
  })
  const [saveStatus, setSaveStatus] = useState(() => {
    const allSaved = keys.every(k => responses[k] != null)
    return allSaved ? 'saved' : 'not-started'
  })

  const update = (key, value) => {
    setLocal(prev => ({ ...prev, [key]: value }))
    setSaveStatus('unsaved')
  }

  return { local, update, saveStatus, setSaveStatus }
}

// ── FormInit ─────────────────────────────────────────────────────────────────
function FormInit({ responses, onSave }) {
  const { local, update, saveStatus, setSaveStatus } = useResponseState(['init-text', 'init-confidence'], responses)

  const doSave = () => {
    onSave('init-text', local['init-text'])
    onSave('init-confidence', local['init-confidence'])
    setSaveStatus('saved')
  }

  return (
    <div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My starting judgement</label>
        <textarea
          className={s.responseTextarea}
          value={local['init-text'] ?? ''}
          onChange={e => update('init-text', e.target.value)}
          onBlur={() => { onSave('init-text', local['init-text']); setSaveStatus('saved') }}
          placeholder="Before examining the evidence, what do you think was the main reason France became a republic by 1792?"
          aria-label="Starting judgement"
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <div className={s.ratingLabel} style={{ fontSize: 12, color: 'var(--fr-ink-mid)', marginBottom: 6 }}>
          Confidence in this judgement (1 = low, 5 = high)
        </div>
        <div className={s.ratingRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className={`${s.ratingBtn} ${local['init-confidence'] === n ? s.selected : ''}`}
              onClick={() => { update('init-confidence', n); onSave('init-confidence', n); setSaveStatus('saved') }}
              aria-pressed={local['init-confidence'] === n}
              aria-label={`Confidence ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave}>Save response</button>
      </div>
    </div>
  )
}

// ── FormAct1 ─────────────────────────────────────────────────────────────────
const ACT1_DEVELOPMENTS = [
  { id: 'd1', text: 'Estates-General opens and sovereignty is contested (May 1789)' },
  { id: 'd2', text: 'Declaration of the Rights of Man establishes new standards (August 1789)' },
  { id: 'd3', text: 'Feudal privileges abolished — old social order dismantled (August 1789)' },
  { id: 'd4', text: 'Church lands nationalised and assignats introduced (1789)' },
  { id: 'd5', text: 'Administrative reform creates departments — old provincial structures dissolved (1790)' },
  { id: 'd6', text: 'Civil Constitution of the Clergy splits religious and political loyalties (1790)' },
  { id: 'd7', text: 'Flight to Varennes — trust in Louis XVI collapses (June 1791)' },
  { id: 'd8', text: 'Champ de Mars — division inside the Revolution becomes violent (July 1791)' },
  { id: 'd9', text: 'War with Austria — military emergency and treason fears (April 1792)' },
  { id: 'd10', text: 'Brunswick Manifesto — counter-revolutionary threat strengthens radical pressure (July 1792)' },
]

function FormAct1({ responses, onSave }) {
  const [selected, setSelected] = useState(() => responses['act1-selections'] ?? [])
  const [text, setText] = useState(responses['act1-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act1-response'] ? 'saved' : 'not-started')

  const toggleItem = (id) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]
    setSelected(next)
    onSave('act1-selections', next)
    setSaveStatus('unsaved')
  }

  const doSave = () => {
    onSave('act1-selections', selected)
    onSave('act1-response', text)
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className={s.selectionHint}>Choose 3–5 developments that made constitutional monarchy harder to sustain.</p>
      <div className={s.checkList} role="group" aria-label="Developments to select">
        {ACT1_DEVELOPMENTS.map(d => (
          <label key={d.id} className={`${s.checkItem} ${selected.includes(d.id) ? s.checked : ''}`}>
            <input
              type="checkbox"
              checked={selected.includes(d.id)}
              onChange={() => toggleItem(d.id)}
            />
            <span className={s.checkItemText}>{d.text}</span>
          </label>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My explanation — what changed and why it mattered</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act1-response', text); setSaveStatus('saved') }}
          placeholder="For each development you chose, briefly explain what changed and why it weakened constitutional monarchy…"
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave} disabled={selected.length < 3}>
          {selected.length < 3 ? `Select ${3 - selected.length} more` : 'Save response'}
        </button>
      </div>
    </div>
  )
}

// ── FormAct2 ─────────────────────────────────────────────────────────────────
const PATHWAY_STEPS = [
  { id: 'ps1', text: 'Constitution of 1791 creates constitutional monarchy with royal veto' },
  { id: 'ps2', text: 'Legislative Assembly begins — new, more radical deputies' },
  { id: 'ps3', text: 'War declared; military defeats deepen suspicion of the king' },
  { id: 'ps4', text: 'Royal vetoes on war measures intensify treason fears' },
  { id: 'ps5', text: 'Popular pressure on the Tuileries (20 June 1792)' },
  { id: 'ps6', text: 'Insurrection and fall of the Tuileries (10 August 1792)' },
  { id: 'ps7', text: 'King suspended; National Convention called' },
  { id: 'ps8', text: 'Convention abolishes monarchy and declares the republic (21–22 September 1792)' },
]

function FormAct2({ responses, onSave }) {
  const [checked, setChecked] = useState(() => responses['act2-pathway'] ?? [])
  const [text, setText] = useState(responses['act2-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act2-response'] ? 'saved' : 'not-started')

  const toggle = (id) => {
    const next = checked.includes(id) ? checked.filter(x => x !== id) : [...checked, id]
    setChecked(next)
    onSave('act2-pathway', next)
    setSaveStatus('unsaved')
  }

  const doSave = () => {
    onSave('act2-pathway', checked)
    onSave('act2-response', text)
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className={s.selectionHint}>Check the pathway steps that best explain the mechanism of change.</p>
      <div className={s.checkList} role="group" aria-label="Pathway steps">
        {PATHWAY_STEPS.map(p => (
          <label key={p.id} className={`${s.checkItem} ${checked.includes(p.id) ? s.checked : ''}`}>
            <input type="checkbox" checked={checked.includes(p.id)} onChange={() => toggle(p.id)} />
            <span className={s.checkItemText}>{p.text}</span>
          </label>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My explanation of how monarchy collapsed</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act2-response', text); setSaveStatus('saved') }}
          placeholder="Explain the political pathway from constitutional monarchy to republic. Focus on institutions, events, and decisions…"
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave}>Save response</button>
      </div>
    </div>
  )
}

// ── FormAct3 ─────────────────────────────────────────────────────────────────
const GROUPS3 = ['Jacobins', 'Feuillants', 'Girondins']
const COLS3 = ['Aims', 'Attitude to monarchy', 'Social / political base', 'Key significance']

function FormAct3({ responses, onSave }) {
  const initTable = () => {
    const saved = responses['act3-table']
    if (saved) return saved
    const t = {}
    GROUPS3.forEach(g => { t[g] = {}; COLS3.forEach(c => { t[g][c] = '' }) })
    return t
  }
  const [table, setTable] = useState(initTable)
  const [text, setText] = useState(responses['act3-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act3-response'] ? 'saved' : 'not-started')

  const updateCell = (group, col, value) => {
    const next = { ...table, [group]: { ...table[group], [col]: value } }
    setTable(next)
    onSave('act3-table', next)
    setSaveStatus('unsaved')
  }

  const doSave = () => {
    onSave('act3-table', table)
    onSave('act3-response', text)
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className={s.selectionHint}>Complete the comparison table using the Groups section of the dossier, then write your judgement below.</p>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table className={s.comparisonTable}>
          <thead>
            <tr>
              <th>Group</th>
              {COLS3.map(c => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {GROUPS3.map(g => (
              <tr key={g}>
                <td>{g}</td>
                {COLS3.map(c => (
                  <td key={c}>
                    <textarea
                      className={s.comparisonCell}
                      value={table[g]?.[c] ?? ''}
                      onChange={e => updateCell(g, c, e.target.value)}
                      onBlur={() => { onSave('act3-table', table); setSaveStatus('saved') }}
                      aria-label={`${g} — ${c}`}
                      rows={3}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My group comparison and judgement</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act3-response', text); setSaveStatus('saved') }}
          placeholder="How did disagreement between revolutionary groups make a stable constitutional monarchy harder to maintain?"
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave}>Save response</button>
      </div>
    </div>
  )
}

// ── FormAct4 ─────────────────────────────────────────────────────────────────
const OPPOSITION_TAGS = [
  'Émigré nobles',
  'Refractory clergy',
  'Foreign powers (Austria, Prussia)',
  'Domestic royalists',
  'Royal officers and court',
  'Counter-revolutionary press and pamphlets',
]

function FormAct4({ responses, onSave }) {
  const [tags, setTags] = useState(() => responses['act4-tags'] ?? [])
  const [text, setText] = useState(responses['act4-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act4-response'] ? 'saved' : 'not-started')

  const toggleTag = (t) => {
    const next = tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t]
    setTags(next)
    onSave('act4-tags', next)
    setSaveStatus('unsaved')
  }

  const doSave = () => {
    onSave('act4-tags', tags)
    onSave('act4-response', text)
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className={s.selectionHint}>Select the groups that opposed the Revolution (choose all that apply).</p>
      <div className={s.tagSelector} role="group" aria-label="Opposition groups">
        {OPPOSITION_TAGS.map(t => (
          <button
            key={t}
            className={`${s.tagBtn} ${tags.includes(t) ? s.tagSelected : ''}`}
            onClick={() => toggleTag(t)}
            aria-pressed={tags.includes(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>Why counter-revolution failed</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act4-response', text); setSaveStatus('saved') }}
          placeholder="For each group you selected, explain why they opposed the Revolution and why they failed to stop the move toward republic…"
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave} disabled={tags.length < 2}>
          {tags.length < 2 ? 'Select at least 2 groups' : 'Save response'}
        </button>
      </div>
    </div>
  )
}

// ── FormAct5 ─────────────────────────────────────────────────────────────────
const CAT_LABELS = { S: 'Stabilised', D: 'Destabilised', B: 'Both' }

function FormAct5({ responses, onSave }) {
  const [cats, setCats] = useState(() => responses['act5-categories'] ?? {})
  const [text, setText] = useState(responses['act5-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act5-response'] ? 'saved' : 'not-started')

  const setCategory = (reformId, cat) => {
    const next = { ...cats, [reformId]: cat }
    setCats(next)
    onSave('act5-categories', next)
    setSaveStatus('unsaved')
  }

  const categorisedCount = Object.keys(cats).length
  const doSave = () => {
    onSave('act5-categories', cats)
    onSave('act5-response', text)
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className={s.selectionHint}>Categorise each reform: did it stabilise France, destabilise it, or both? Categorise at least three.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {REFORMS.map(r => (
          <div key={r.id} className={s.reformSource}>
            <div style={{ marginBottom: 4 }}>
              <span className={s.reformType}>{r.type}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fr-ink)', marginLeft: 6, fontFamily: 'var(--fr-serif)' }}>{r.name}</span>
              <span style={{ fontSize: 11, color: 'var(--fr-ink-light)', marginLeft: 6 }}>{r.date}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--fr-ink-mid)', fontFamily: 'var(--fr-serif)', marginBottom: 7, lineHeight: 1.5 }}>{r.summary}</div>
            <div className={s.reformSortBtns}>
              {['S', 'D', 'B'].map(cat => (
                <button
                  key={cat}
                  className={`${s.reformSortBtn} ${s[cat.toLowerCase()]} ${cats[r.id] === cat ? s.active : ''}`}
                  onClick={() => setCategory(r.id, cat)}
                  aria-pressed={cats[r.id] === cat}
                >
                  {CAT_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My reform judgement</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act5-response', text); setSaveStatus('saved') }}
          placeholder="Explain your categorisations. How did the reforms you chose affect the survival of constitutional monarchy?"
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave} disabled={categorisedCount < 3}>
          {categorisedCount < 3 ? `Categorise ${3 - categorisedCount} more` : 'Save response'}
        </button>
      </div>
    </div>
  )
}

// ── FormAct6 ─────────────────────────────────────────────────────────────────
function FormAct6({ responses, onSave }) {
  const [rating, setRating] = useState(responses['act6-rating'] ?? null)
  const [text, setText] = useState(responses['act6-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act6-response'] ? 'saved' : 'not-started')

  const setR = (n) => { setRating(n); onSave('act6-rating', n); setSaveStatus('unsaved') }

  const doSave = () => {
    onSave('act6-rating', rating)
    onSave('act6-response', text)
    setSaveStatus('saved')
  }

  const ratingLabels = ['Not at all', 'Very difficult', 'Possible but unlikely', 'Possible', 'Fully recoverable']

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fr-ink-mid)', marginBottom: 6 }}>
          How recoverable was trust in Louis XVI after Varennes? (1 = not at all, 5 = fully recoverable)
        </div>
        <div className={s.ratingRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className={`${s.ratingBtn} ${rating === n ? s.selected : ''}`}
              onClick={() => setR(n)}
              aria-pressed={rating === n}
              aria-label={`${n} — ${ratingLabels[n - 1]}`}
              title={ratingLabels[n - 1]}
            >
              {n}
            </button>
          ))}
        </div>
        {rating && (
          <div style={{ fontSize: 11, color: 'var(--fr-ink-light)', marginTop: 4 }}>{ratingLabels[rating - 1]}</div>
        )}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My judgement about royal trust</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act6-response', text); setSaveStatus('saved') }}
          placeholder="After Varennes and Champ de Mars, was trust in Louis XVI recoverable? Explain your rating using evidence from the dossier…"
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave} disabled={!rating}>
          {!rating ? 'Select a rating first' : 'Save response'}
        </button>
      </div>
    </div>
  )
}

// ── FormAct7 ─────────────────────────────────────────────────────────────────
const WAR_FACTORS = [
  'War with Austria declared (April 1792)',
  'Early military defeats and invasion fear',
  'Royal vetoes on war measures',
  '"La Patrie en danger" — emergency mobilisation',
  'Brunswick Manifesto — counter-revolutionary threat',
  'Parisian sections radicalised by invasion anxiety',
  'Provincial fédérés arrive in Paris',
  'September Massacres — breakdown of authority',
]

function FormAct7({ responses, onSave }) {
  const [factors, setFactors] = useState(() => responses['act7-factors'] ?? [])
  const [text, setText] = useState(responses['act7-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act7-response'] ? 'saved' : 'not-started')

  const toggleFactor = (f) => {
    const next = factors.includes(f) ? factors.filter(x => x !== f) : [...factors, f]
    setFactors(next)
    onSave('act7-factors', next)
    setSaveStatus('unsaved')
  }

  const doSave = () => {
    onSave('act7-factors', factors)
    onSave('act7-response', text)
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className={s.selectionHint}>Select at least three factors and explain how they interacted to radicalise the Revolution.</p>
      <div className={s.tagSelector} role="group" aria-label="War radicalisation factors">
        {WAR_FACTORS.map(f => (
          <button
            key={f}
            className={`${s.tagBtn} ${factors.includes(f) ? s.tagSelected : ''}`}
            onClick={() => toggleFactor(f)}
            aria-pressed={factors.includes(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My explanation of war and radicalisation</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act7-response', text); setSaveStatus('saved') }}
          placeholder="Explain how war connected with suspicion, popular pressure, counter-revolution, and the collapse of monarchy…"
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave} disabled={factors.length < 3}>
          {factors.length < 3 ? `Select ${3 - factors.length} more factor${factors.length === 2 ? '' : 's'}` : 'Save response'}
        </button>
      </div>
    </div>
  )
}

// ── FormAct8 ─────────────────────────────────────────────────────────────────
const TP_TYPES = ['Trigger', 'Accelerator', 'Symptom', 'Legitimacy turning point', 'Decisive break']

function FormAct8({ responses, onSave }) {
  const [classifications, setClassifications] = useState(() => responses['act8-classifications'] ?? {})
  const [text, setText] = useState(responses['act8-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act8-response'] ? 'saved' : 'not-started')

  const setClass = (id, val) => {
    const next = { ...classifications, [id]: val }
    setClassifications(next)
    onSave('act8-classifications', next)
    setSaveStatus('unsaved')
  }

  const classified = Object.keys(classifications).filter(k => classifications[k]).length
  const doSave = () => {
    onSave('act8-classifications', classifications)
    onSave('act8-response', text)
    setSaveStatus('saved')
  }

  return (
    <div>
      <p className={s.selectionHint}>Classify each event. Classify at least four before writing your judgement.</p>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table className={s.classifyTable}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Classification</th>
            </tr>
          </thead>
          <tbody>
            {TURNING_POINTS.map(tp => (
              <tr key={tp.id}>
                <td>{tp.event}</td>
                <td>
                  <select
                    className={s.classifySelect}
                    value={classifications[tp.id] ?? ''}
                    onChange={e => setClass(tp.id, e.target.value)}
                    aria-label={`Classification for ${tp.event}`}
                  >
                    <option value="">— choose —</option>
                    {TP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My turning-point judgement</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act8-response', text); setSaveStatus('saved') }}
          placeholder="Was there one decisive turning point, or did monarchy collapse through accumulated pressures? Justify your classifications…"
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave} disabled={classified < 4}>
          {classified < 4 ? `Classify ${4 - classified} more event${classified === 3 ? '' : 's'}` : 'Save response'}
        </button>
      </div>
    </div>
  )
}

// ── FormAct9 ─────────────────────────────────────────────────────────────────
const MATRIX_COLS = [
  { key: 'pressure', label: 'Background\npressure' },
  { key: 'trigger', label: 'Immediate\ntrigger' },
  { key: 'monarchy', label: 'Damaged\ntrust in monarchy' },
  { key: 'radical', label: 'Increased\nradicalisation' },
  { key: 'republic', label: 'Made republic\nmore likely' },
]

function FormAct9({ responses, onSave }) {
  const [matrix, setMatrix] = useState(() => responses['act9-matrix'] ?? {})
  const [ranked, setRanked] = useState(() => responses['act9-ranked'] ?? ['', '', ''])
  const [text, setText] = useState(responses['act9-response'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['act9-response'] ? 'saved' : 'not-started')
  const [aiFeedback, setAiFeedback] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  const setCell = (factorId, col, val) => {
    const next = { ...matrix, [factorId]: { ...(matrix[factorId] ?? {}), [col]: val } }
    setMatrix(next)
    onSave('act9-matrix', next)
    setSaveStatus('unsaved')
  }

  const setRank = (idx, val) => {
    const next = [...ranked]; next[idx] = val; setRanked(next)
    onSave('act9-ranked', next)
    setSaveStatus('unsaved')
  }

  const ratedCount = Object.keys(matrix).filter(k => Object.keys(matrix[k] ?? {}).length >= 3).length
  const doSave = () => {
    onSave('act9-matrix', matrix)
    onSave('act9-ranked', ranked)
    onSave('act9-response', text)
    setSaveStatus('saved')
  }

  const handleAI = async () => {
    if (!text.trim()) return
    setAiLoading(true)
    const userMsg = `My top 3 causes: ${ranked.filter(Boolean).join(', ')}.\n\nMy analysis: ${text}`
    const fb = await getAIFeedback(AI_SYSTEM_CAUSE, userMsg)
    setAiFeedback(fb)
    setAiLoading(false)
  }

  return (
    <div>
      <p className={s.selectionHint}>Rate each cause across all five dimensions, then rank your top three.</p>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table className={s.causeMatrix}>
          <thead>
            <tr>
              <th style={{ minWidth: 160, textAlign: 'left' }}>Factor</th>
              {MATRIX_COLS.map(c => (
                <th key={c.key} style={{ minWidth: 80, whiteSpace: 'pre-line' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAUSE_FACTORS.map(cf => (
              <tr key={cf.id}>
                <td>{cf.factor}</td>
                {MATRIX_COLS.map(c => (
                  <td key={c.key} style={{ textAlign: 'center' }}>
                    <select
                      className={s.lmhSelect}
                      value={matrix[cf.id]?.[c.key] ?? ''}
                      onChange={e => setCell(cf.id, c.key, e.target.value)}
                      aria-label={`${cf.factor} — ${c.label}`}
                    >
                      <option value="">—</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className={s.synthSectionTitle}>Rank your top three causes</div>
        {[0, 1, 2].map(i => (
          <div key={i} className={s.rankRow}>
            <label className={s.rankLabel} htmlFor={`rank-${i}`}>Rank {i + 1}</label>
            <select id={`rank-${i}`} className={s.rankSelect} value={ranked[i] ?? ''} onChange={e => setRank(i, e.target.value)}>
              <option value="">— select a cause —</option>
              {CAUSE_FACTORS.map(cf => (
                <option key={cf.id} value={cf.factor} disabled={ranked.includes(cf.factor) && ranked[i] !== cf.factor}>
                  {cf.factor}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My ranked cause judgement</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('act9-response', text); setSaveStatus('saved') }}
          placeholder="Explain why you ranked these causes as most significant. How did they interact? Why are they more decisive than the others?"
        />
      </div>

      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave} disabled={ratedCount < 5}>
          {ratedCount < 5 ? `Rate ${5 - ratedCount} more cause${ratedCount === 4 ? '' : 's'}` : 'Save response'}
        </button>
        <button
          className={s.aiFeedbackBtn}
          onClick={handleAI}
          disabled={aiLoading || !text.trim()}
          title="Get Socratic feedback on your cause analysis"
        >
          {aiLoading ? 'Getting feedback…' : 'Get feedback'}
        </button>
      </div>

      {aiFeedback && (
        <div className={s.aiFeedbackBox}>
          <div className={s.aiFeedbackLabel}>Tutor feedback</div>
          <div className={s.aiFeedbackText}>{aiFeedback}</div>
        </div>
      )}
    </div>
  )
}

// ── FormFinal ────────────────────────────────────────────────────────────────
const SENTENCE_STARTERS = [
  'In 1789, France did not immediately become a republic because…',
  'The political pathway from constitutional monarchy to republic involved…',
  'Constitutional monarchy became harder to sustain because…',
  'One important factor was…',
  'This interacted with…',
  'A major turning point was…',
  'However, this was / was not decisive by itself because…',
  'Overall, France became a republic by 1792 because…',
]

const EVIDENCE_CHECK_ITEMS = [
  'Revolutionary groups', 'Counter-revolution', 'Reforms', 'Distrust of the King / Varennes',
  'Champ de Mars', 'War and Brunswick Manifesto', 'Popular pressure / Tuileries',
  'September Massacres', 'National Convention and abolition of monarchy',
]

function FormFinal({ responses, onSave }) {
  const [text, setText] = useState(responses['final-response'] ?? '')
  const [confidence, setConfidence] = useState(responses['final-confidence'] ?? null)
  const [checked, setChecked] = useState(() => responses['final-checklist'] ?? [])
  const [saveStatus, setSaveStatus] = useState(responses['final-response'] ? 'saved' : 'not-started')
  const [aiFeedback, setAiFeedback] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const textRef = useRef(null)

  const appendStarter = (starter) => {
    const next = text ? `${text}\n\n${starter}` : starter
    setText(next)
    onSave('final-response', next)
    setSaveStatus('unsaved')
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const toggleCheck = (item) => {
    const next = checked.includes(item) ? checked.filter(x => x !== item) : [...checked, item]
    setChecked(next)
    onSave('final-checklist', next)
  }

  const doSave = () => {
    onSave('final-response', text)
    onSave('final-confidence', confidence)
    onSave('final-checklist', checked)
    setSaveStatus('saved')
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { /* clipboard unavailable */ }
  }

  const handleAI = async () => {
    if (!text.trim()) return
    setAiLoading(true)
    const fb = await getAIFeedback(AI_SYSTEM_FINAL, text)
    setAiFeedback(fb)
    setAiLoading(false)
  }

  const prevResponses = [
    { label: 'Activity 2 — How monarchy collapsed', key: 'act2-response' },
    { label: 'Activity 6 — Royal trust', key: 'act6-response' },
    { label: 'Activity 7 — War and radicalisation', key: 'act7-response' },
    { label: 'Activity 8 — Turning-point judgement', key: 'act8-response' },
    { label: 'Activity 9 — Ranked causes', key: 'act9-response' },
  ]

  return (
    <div>
      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Your previous responses</div>
        {prevResponses.map(pr => (
          <div key={pr.key}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fr-ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
              {pr.label}
            </div>
            <div className={s.prevResponseBox}>
              {responses[pr.key]
                ? (typeof responses[pr.key] === 'string' ? responses[pr.key] : JSON.stringify(responses[pr.key]))
                : <span className={s.prevResponseEmpty}>Not yet completed</span>
              }
            </div>
          </div>
        ))}
      </div>

      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Evidence I will refer to</div>
        <div className={s.evidenceChecklist}>
          {EVIDENCE_CHECK_ITEMS.map(item => (
            <label key={item} className={s.evidenceCheckItem}>
              <input
                type="checkbox"
                checked={checked.includes(item)}
                onChange={() => toggleCheck(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Sentence starters — click to add</div>
        <div className={s.starterChips}>
          {SENTENCE_STARTERS.map(st => (
            <button key={st} className={s.starterChip} onClick={() => appendStarter(st)}>
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My final historical briefing</label>
        <textarea
          ref={textRef}
          className={`${s.responseTextarea} ${s.responseLargeTextarea}`}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('final-response', text); setSaveStatus('saved') }}
          placeholder="How and why did France become a republic by 1792? Write your developed historical judgement here…"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fr-ink-mid)', marginBottom: 6 }}>
          Final confidence in your judgement (1 = low, 5 = high)
        </div>
        <div className={s.ratingRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} className={`${s.ratingBtn} ${confidence === n ? s.selected : ''}`}
              onClick={() => { setConfidence(n); onSave('final-confidence', n) }}
              aria-pressed={confidence === n} aria-label={`Final confidence ${n}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave} disabled={text.length < 50}>
          {text.length < 50 ? 'Write more to save' : 'Save response'}
        </button>
        <button className={s.aiFeedbackBtn} onClick={handleAI} disabled={aiLoading || text.length < 50}>
          {aiLoading ? 'Getting feedback…' : 'Get feedback'}
        </button>
        <button className={s.copyBtn} onClick={handleCopy} disabled={!text.trim()}>
          Copy response {copied && <span className={s.copySuccess}>✓ Copied</span>}
        </button>
      </div>

      {aiFeedback && (
        <div className={s.aiFeedbackBox}>
          <div className={s.aiFeedbackLabel}>Tutor feedback</div>
          <div className={s.aiFeedbackText}>{aiFeedback}</div>
        </div>
      )}
    </div>
  )
}

// ── FormReflection ───────────────────────────────────────────────────────────
function FormReflection({ responses, onSave }) {
  const [text, setText] = useState(responses['reflection'] ?? '')
  const [saveStatus, setSaveStatus] = useState(responses['reflection'] ? 'saved' : 'not-started')

  const initText = responses['init-text']
  const finalText = responses['final-response']

  const doSave = () => { onSave('reflection', text); setSaveStatus('saved') }

  return (
    <div>
      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Your starting judgement</div>
        <div className={s.prevResponseBox}>
          {initText ?? <span className={s.prevResponseEmpty}>Not recorded</span>}
        </div>
      </div>
      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Your final historical briefing</div>
        <div className={s.prevResponseBox}>
          {finalText ?? <span className={s.prevResponseEmpty}>Not yet completed</span>}
        </div>
      </div>

      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My reflection</label>
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={() => { onSave('reflection', text); setSaveStatus('saved') }}
          placeholder="Compare your starting judgement with your final answer. What changed, what stayed the same, and which evidence most affected your thinking?"
        />
      </div>

      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button className={s.saveBtn} onClick={doSave}>Save reflection</button>
      </div>
    </div>
  )
}
