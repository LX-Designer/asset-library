import { useState } from 'react'
import s from '../FranceRepublic.module.css'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

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

export default function Act7({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [factors,    setFactors]    = useState(initialAnswers?.factors   ?? [])
  const [response,   setResponse]   = useState(initialAnswers?.response  ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )

  const state = () => ({ factors, response })

  const toggleFactor = (f) => {
    const next = factors.includes(f) ? factors.filter(x => x !== f) : [...factors, f]
    setFactors(next)
    onSave({ response, factors: next })
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
      <p className={s.selectionHint}>Select at least three factors and explain how they interacted to radicalise the Revolution.</p>
      <div className={s.tagSelector} role="group" aria-label="War radicalisation factors">
        {WAR_FACTORS.map(f => (
          <button
            key={f}
            type="button"
            className={`${s.tagBtn} ${factors.includes(f) ? s.tagSelected : ''}`}
            onClick={() => toggleFactor(f)}
            aria-pressed={factors.includes(f)}
            disabled={isCompleted}
          >
            {f}
          </button>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My explanation of war and radicalisation</label>
        <textarea
          className={s.responseTextarea}
          value={response}
          onChange={e => { setResponse(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
          placeholder="Explain how war connected with suspicion, popular pressure, counter-revolution, and the collapse of monarchy…"
          disabled={isCompleted}
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button type="submit" className={s.saveBtn} disabled={isCompleted || factors.length < 3}>
          {factors.length < 3 ? `Select ${3 - factors.length} more factor${factors.length === 2 ? '' : 's'}` : 'Save response'}
        </button>
      </div>
    </form>
  )
}
