import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

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

export default function Act7({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [factors,    setFactors]    = useState(initialAnswers?.factors   ?? [])
  const [response,   setResponse]   = useState(initialAnswers?.response  ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const state = () => ({ factors, response })
  const ready = factors.length >= 3 && response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const toggleFactor = (f) => {
    const next = factors.includes(f) ? factors.filter(x => x !== f) : [...factors, f]
    setFactors(next)
    setSubmitLocked(false)
    onSave({ response, factors: next })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className={s.selectionHint}>Select at least three factors and explain how they interacted to radicalise the Revolution.</p>
      <div className={s.tagSelector} role="group" aria-label="War radicalisation factors">
        {WAR_FACTORS.map(f => (
          <button
            key={f}
            type="button"
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
