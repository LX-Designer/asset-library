import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function ActInit({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [text,       setText]       = useState(initialAnswers?.text       ?? '')
  const [confidence, setConfidence] = useState(initialAnswers?.confidence ?? null)
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const state = () => ({ text, confidence })
  const ready = text.trim().length > 0

  const appendStarter = (starter) => {
    const next = text ? `${text}\n\n${starter}` : starter
    setText(next)
    setSubmitLocked(false)
    onSave({ confidence, text: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const handleConfidence = (n) => {
    setConfidence(n)
    setSubmitLocked(false)
    onSave({ text, confidence: n })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My starting judgement</label>
        <StarterChips starters={sentenceStarters} onInsert={appendStarter} />
        <textarea
          ref={textRef}
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSubmitLocked(false) }}
          onBlur={() => onSave(state())}
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
              type="button"
              className={`${s.ratingBtn} ${confidence === n ? s.selected : ''}`}
              onClick={() => handleConfidence(n)}
              aria-pressed={confidence === n}
              aria-label={`Confidence ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={s.saveRow}>
        <button type="submit" className={s.saveBtn} disabled={!ready || submitLocked}>
          {submitLocked ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
