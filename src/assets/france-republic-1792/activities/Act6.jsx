import { useState } from 'react'
import s from '../FranceRepublic.module.css'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

const RATING_LABELS = ['Not at all', 'Very difficult', 'Possible but unlikely', 'Possible', 'Fully recoverable']

export default function Act6({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [rating,     setRating]     = useState(initialAnswers?.rating   ?? null)
  const [response,   setResponse]   = useState(initialAnswers?.response ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )

  const state = () => ({ rating, response })

  const handleRating = (n) => {
    setRating(n)
    onSave({ response, rating: n })
    setSaveStatus('unsaved')
  }

  const handleBlur = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state())
    setSaveStatus('saved')
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
              disabled={isCompleted}
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
        <textarea
          className={s.responseTextarea}
          value={response}
          onChange={e => { setResponse(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
          placeholder="After Varennes and Champ de Mars, was trust in Louis XVI recoverable? Explain your rating using evidence from the dossier…"
          disabled={isCompleted}
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button type="submit" className={s.saveBtn} disabled={isCompleted || !rating}>
          {!rating ? 'Select a rating first' : 'Save response'}
        </button>
      </div>
    </form>
  )
}
