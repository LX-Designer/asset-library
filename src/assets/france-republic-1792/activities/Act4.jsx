import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const OPPOSITION_TAGS = [
  'Émigré nobles',
  'Refractory clergy',
  'Foreign powers (Austria, Prussia)',
  'Domestic royalists',
  'Royal officers and court',
  'Counter-revolutionary press and pamphlets',
]

export default function Act4({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [tags,       setTags]       = useState(initialAnswers?.tags     ?? [])
  const [response,   setResponse]   = useState(initialAnswers?.response ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const state = () => ({ tags, response })
  const ready = tags.length >= 2 && response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const toggleTag = (t) => {
    const next = tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t]
    setTags(next)
    setSubmitLocked(false)
    onSave({ response, tags: next })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className={s.selectionHint}>Select the groups that opposed the Revolution (choose all that apply).</p>
      <div className={s.tagSelector} role="group" aria-label="Opposition groups">
        {OPPOSITION_TAGS.map(t => (
          <button
            key={t}
            type="button"
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
