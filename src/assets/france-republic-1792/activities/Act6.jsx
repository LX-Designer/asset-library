import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const RATING_LABELS = ['Not at all', 'Very difficult', 'Possible but unlikely', 'Possible', 'Fully recoverable']

export default function Act6({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [rating,     setRating]     = useState(initialAnswers?.rating   ?? null)
  const [response,   setResponse]   = useState(initialAnswers?.response ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const state = () => ({ rating, response })
  const ready = rating != null && response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const handleRating = (n) => {
    setRating(n)
    setSubmitLocked(false)
    onSave({ response, rating: n })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fr-ink-mid)', marginBottom: 6 }}>
          How recoverable was trust in Louis XVI after Varennes? (1 = not at all, 5 = fully recoverable)
        </div>
        <div className={s.ratingRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              className={`${s.ratingBtn} ${rating === n ? s.selected : ''}`}
              onClick={() => handleRating(n)}
              aria-pressed={rating === n}
              aria-label={`${n} — ${RATING_LABELS[n - 1]}`}
              title={RATING_LABELS[n - 1]}
            >
              {n}
            </button>
          ))}
        </div>
        {rating && (
          <div style={{ fontSize: 11, color: 'var(--fr-ink-light)', marginTop: 4 }}>{RATING_LABELS[rating - 1]}</div>
        )}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My judgement about royal trust</label>
        <StarterChips starters={sentenceStarters} onInsert={appendStarter} />
        <textarea
          ref={textRef}
          className={s.responseTextarea}
          value={response}
          onChange={e => { setResponse(e.target.value); setSubmitLocked(false) }}
          onBlur={() => onSave(state())}
        />
      </div>
      <div className={s.saveRow}>
        <button type="submit" className={s.saveBtn} disabled={!ready || submitLocked}>
          {submitLocked ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
