import { useState, useRef, useContext } from 'react'
import s from '../FranceRepublic.module.css'
import { FranceCtx } from '../FranceContext.js'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

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

// Previous response labels and their keys in the consolidated response schema
const PREV_RESPONSES = [
  { label: 'Activity 2 — How monarchy collapsed',   actId: 'act2', key: 'response' },
  { label: 'Activity 6 — Royal trust',              actId: 'act6', key: 'response' },
  { label: 'Activity 7 — War and radicalisation',   actId: 'act7', key: 'response' },
  { label: 'Activity 8 — Turning-point judgement',  actId: 'act8', key: 'response' },
  { label: 'Activity 9 — Ranked causes',            actId: 'act9', key: 'response' },
]

export default function ActFinal({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const { responses } = useContext(FranceCtx)

  const [response,   setResponse]   = useState(initialAnswers?.response   ?? '')
  const [confidence, setConfidence] = useState(initialAnswers?.confidence ?? null)
  const [checklist,  setChecklist]  = useState(initialAnswers?.checklist  ?? [])
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )
  const [copied, setCopied] = useState(false)
  const textRef = useRef(null)

  const state = () => ({ response, confidence, checklist })

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    onSave({ ...state(), response: next })
    setSaveStatus('unsaved')
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const toggleCheck = (item) => {
    const next = checklist.includes(item) ? checklist.filter(x => x !== item) : [...checklist, item]
    setChecklist(next)
    onSave({ ...state(), checklist: next })
  }

  const handleConfidence = (n) => {
    setConfidence(n)
    onSave({ ...state(), confidence: n })
    setSaveStatus('unsaved')
  }

  const handleBlur = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  // onSubmit triggers AI feedback via ActivityBody (feedback config in shell.config.js)
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state())
    setSaveStatus('saved')
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { /* clipboard unavailable */ }
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* ── Previous responses ── */}
      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Your previous responses</div>
        {PREV_RESPONSES.map(pr => {
          const val = responses?.[pr.actId]?.[pr.key]
          return (
            <div key={pr.actId}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fr-ink-light)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>
                {pr.label}
              </div>
              <div className={s.prevResponseBox}>
                {val
                  ? (typeof val === 'string' ? val : JSON.stringify(val))
                  : <span className={s.prevResponseEmpty}>Not yet completed</span>
                }
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Evidence checklist ── */}
      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Evidence I will refer to</div>
        <div className={s.evidenceChecklist}>
          {EVIDENCE_CHECK_ITEMS.map(item => (
            <label key={item} className={s.evidenceCheckItem}>
              <input
                type="checkbox"
                checked={checklist.includes(item)}
                onChange={() => toggleCheck(item)}
                disabled={isCompleted}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* ── Sentence starters ── */}
      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Sentence starters — click to add</div>
        <div className={s.starterChips}>
          {SENTENCE_STARTERS.map(st => (
            <button key={st} type="button" className={s.starterChip} onClick={() => appendStarter(st)} disabled={isCompleted}>
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main response ── */}
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My final historical briefing</label>
        <textarea
          ref={textRef}
          className={`${s.responseTextarea} ${s.responseLargeTextarea}`}
          value={response}
          onChange={e => { setResponse(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
          placeholder="How and why did France become a republic by 1792? Write your developed historical judgement here…"
          disabled={isCompleted}
        />
      </div>

      {/* ── Confidence rating ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fr-ink-mid)', marginBottom: 6 }}>
          Final confidence in your judgement (1 = low, 5 = high)
        </div>
        <div className={s.ratingRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              className={`${s.ratingBtn} ${confidence === n ? s.selected : ''}`}
              onClick={() => handleConfidence(n)}
              aria-pressed={confidence === n}
              aria-label={`Final confidence ${n}`}
              disabled={isCompleted}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button
          type="button"
          className={s.saveBtn}
          onClick={() => { onSave(state()); setSaveStatus('saved') }}
          disabled={isCompleted || response.length < 50}
          style={{ background: 'var(--fr-parchment-mid)', color: 'var(--fr-ink-mid)', border: '1px solid var(--fr-rule)' }}
        >
          Save
        </button>
        <button type="submit" className={s.saveBtn} disabled={isCompleted || response.length < 50}>
          {response.length < 50 ? 'Write more first' : 'Submit for feedback'}
        </button>
        <button type="button" className={s.copyBtn} onClick={handleCopy} disabled={!response.trim()}>
          Copy {copied && <span className={s.copySuccess}>✓ Copied</span>}
        </button>
      </div>

    </form>
  )
}
