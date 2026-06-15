import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

export default function ActInit({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const [text,       setText]       = useState(initialAnswers?.text       ?? '')
  const [confidence, setConfidence] = useState(initialAnswers?.confidence ?? null)
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.text?.trim() || initialAnswers?.confidence != null) ? 'saved' : 'not-started'
  )
  const textRef = useRef(null)

  const state = () => ({ text, confidence })

  const appendStarter = (starter) => {
    const next = text ? `${text}\n\n${starter}` : starter
    setText(next)
    setSaveStatus('unsaved')
    onSave({ confidence, text: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const handleTextBlur = () => {
    onSave({ ...state(), text })
    setSaveStatus('saved')
  }

  const handleConfidence = (n) => {
    setConfidence(n)
    onSave({ text, confidence: n })
    setSaveStatus('saved')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state())
    setSaveStatus('saved')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My starting judgement</label>
        <StarterChips starters={sentenceStarters} onInsert={appendStarter} disabled={isCompleted} />
        <textarea
          ref={textRef}
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleTextBlur}
          aria-label="Starting judgement"
          disabled={isCompleted}
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
              disabled={isCompleted}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button type="submit" className={s.saveBtn} disabled={isCompleted}>
          Save response
        </button>
      </div>
    </form>
  )
}
