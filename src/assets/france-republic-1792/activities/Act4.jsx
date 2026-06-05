import { useState } from 'react'
import s from '../FranceRepublic.module.css'

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

export default function Act4({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [tags,       setTags]       = useState(initialAnswers?.tags     ?? [])
  const [response,   setResponse]   = useState(initialAnswers?.response ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )

  const state = () => ({ tags, response })

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
        <textarea
          className={s.responseTextarea}
          value={response}
          onChange={e => { setResponse(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
          placeholder="For each group you selected, explain why they opposed the Revolution and why they failed to stop the move toward republic…"
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
