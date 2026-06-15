import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

const OPPOSITION_TAGS = [
  'Émigré nobles',
  'Refractory clergy',
  'Foreign powers (Austria, Prussia)',
  'Domestic royalists',
  'Royal officers and court',
  'Counter-revolutionary press and pamphlets',
]

export default function Act4({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const [tags,       setTags]       = useState(initialAnswers?.tags     ?? [])
  const [response,   setResponse]   = useState(initialAnswers?.response ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )
  const textRef = useRef(null)

  const state = () => ({ tags, response })

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSaveStatus('unsaved')
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const toggleTag = (t) => {
    const next = tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t]
    setTags(next)
    onSave({ response, tags: next })
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
      <p className={s.selectionHint}>Select the groups that opposed the Revolution (choose all that apply).</p>
      <div className={s.tagSelector} role="group" aria-label="Opposition groups">
        {OPPOSITION_TAGS.map(t => (
          <button
            key={t}
            type="button"
            className={`${s.tagBtn} ${tags.includes(t) ? s.tagSelected : ''}`}
            onClick={() => toggleTag(t)}
            aria-pressed={tags.includes(t)}
            disabled={isCompleted}
          >
            {t}
          </button>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>Why counter-revolution failed</label>
        <StarterChips starters={sentenceStarters} onInsert={appendStarter} disabled={isCompleted} />
        <textarea
          ref={textRef}
          className={s.responseTextarea}
          value={response}
          onChange={e => { setResponse(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
          disabled={isCompleted}
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button type="submit" className={s.saveBtn} disabled={isCompleted || tags.length < 2}>
          {tags.length < 2 ? 'Select at least 2 groups' : 'Save response'}
        </button>
      </div>
    </form>
  )
}
