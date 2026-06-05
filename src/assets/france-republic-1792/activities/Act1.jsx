import { useState } from 'react'
import s from '../FranceRepublic.module.css'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

const DEVELOPMENTS = [
  { id: 'd1', text: 'Estates-General opens and sovereignty is contested (May 1789)' },
  { id: 'd2', text: 'Declaration of the Rights of Man establishes new standards (August 1789)' },
  { id: 'd3', text: 'Feudal privileges abolished — old social order dismantled (August 1789)' },
  { id: 'd4', text: 'Church lands nationalised and assignats introduced (1789)' },
  { id: 'd5', text: 'Administrative reform creates departments — old provincial structures dissolved (1790)' },
  { id: 'd6', text: 'Civil Constitution of the Clergy splits religious and political loyalties (1790)' },
  { id: 'd7', text: 'Flight to Varennes — trust in Louis XVI collapses (June 1791)' },
  { id: 'd8', text: 'Champ de Mars — division inside the Revolution becomes violent (July 1791)' },
  { id: 'd9', text: 'War with Austria — military emergency and treason fears (April 1792)' },
  { id: 'd10', text: 'Brunswick Manifesto — counter-revolutionary threat strengthens radical pressure (July 1792)' },
]

export default function Act1({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [selections, setSelections] = useState(initialAnswers?.selections ?? [])
  const [response,   setResponse]   = useState(initialAnswers?.response   ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )

  const state = () => ({ selections, response })

  const toggleItem = (id) => {
    const next = selections.includes(id) ? selections.filter(x => x !== id) : [...selections, id]
    setSelections(next)
    onSave({ response, selections: next })
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
      <p className={s.selectionHint}>Choose 3–5 developments that made constitutional monarchy harder to sustain.</p>
      <div className={s.checkList} role="group" aria-label="Developments to select">
        {DEVELOPMENTS.map(d => (
          <label key={d.id} className={`${s.checkItem} ${selections.includes(d.id) ? s.checked : ''}`}>
            <input
              type="checkbox"
              checked={selections.includes(d.id)}
              onChange={() => toggleItem(d.id)}
              disabled={isCompleted}
            />
            <span className={s.checkItemText}>{d.text}</span>
          </label>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My explanation — what changed and why it mattered</label>
        <textarea
          className={s.responseTextarea}
          value={response}
          onChange={e => { setResponse(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
          placeholder="For each development you chose, briefly explain what changed and why it weakened constitutional monarchy…"
          disabled={isCompleted}
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button type="submit" className={s.saveBtn} disabled={isCompleted || selections.length < 3}>
          {selections.length < 3 ? `Select ${3 - selections.length} more` : 'Save response'}
        </button>
      </div>
    </form>
  )
}
