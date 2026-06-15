import { useState, useRef, useContext } from 'react'
import s from '../FranceRepublic.module.css'
import { FranceCtx } from '../FranceContext.js'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

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

export default function ActFinal({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const { responses } = useContext(FranceCtx)

  const [response,   setResponse]   = useState(initialAnswers?.response   ?? '')
  const [confidence, setConfidence] = useState(initialAnswers?.confidence ?? null)
  const [checklist,  setChecklist]  = useState(initialAnswers?.checklist  ?? [])
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const [everSubmitted, setEverSubmitted] = useState(!!initialAnswers?._submitted || !!initialAnswers?.feedback)
  const [copied, setCopied] = useState(false)
  const textRef = useRef(null)

  const state = () => ({ response, confidence, checklist })
  const ready = response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const toggleCheck = (item) => {
    const next = checklist.includes(item) ? checklist.filter(x => x !== item) : [...checklist, item]
    setChecklist(next)
    setSubmitLocked(false)
    onSave({ ...state(), checklist: next })
  }

  const handleConfidence = (n) => {
    setConfidence(n)
    setSubmitLocked(false)
    onSave({ ...state(), confidence: n })
  }

  // onSubmit triggers AI feedback via ActivityBody (feedback config in shell.config.js)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
    setEverSubmitted(true)
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { /* clipboard unavailable */ }
  }

  const label = submitLocked ? 'Submitted ✓' : everSubmitted ? 'Resubmit for feedback' : 'Submit for feedback'

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
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <StarterChips starters={sentenceStarters} onInsert={appendStarter} />

      {/* ── Main response ── */}
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My final historical briefing</label>
        <textarea
          ref={textRef}
          className={`${s.responseTextarea} ${s.responseLargeTextarea}`}
          value={response}
          onChange={e => { setResponse(e.target.value); setSubmitLocked(false) }}
          onBlur={() => onSave(state())}
          placeholder="How and why did France become a republic by 1792? Write your developed historical judgement here…"
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
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={s.saveRow}>
        <button type="submit" className={s.saveBtn} disabled={!ready || submitLocked}>
          {label}
        </button>
        <button type="button" className={s.copyBtn} onClick={handleCopy} disabled={!response.trim()}>
          Copy {copied && <span className={s.copySuccess}>✓ Copied</span>}
        </button>
      </div>

    </form>
  )
}
