import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

const PATHWAY_STEPS = [
  { id: 'ps1', text: 'Constitution of 1791 creates constitutional monarchy with royal veto' },
  { id: 'ps2', text: 'Legislative Assembly begins — new, more radical deputies' },
  { id: 'ps3', text: 'War declared; military defeats deepen suspicion of the king' },
  { id: 'ps4', text: 'Royal vetoes on war measures intensify treason fears' },
  { id: 'ps5', text: 'Popular pressure on the Tuileries (20 June 1792)' },
  { id: 'ps6', text: 'Insurrection and fall of the Tuileries (10 August 1792)' },
  { id: 'ps7', text: 'King suspended; National Convention called' },
  { id: 'ps8', text: 'Convention abolishes monarchy and declares the republic (21–22 September 1792)' },
]

export default function Act2({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const [pathway,    setPathway]    = useState(initialAnswers?.pathway   ?? [])
  const [response,   setResponse]   = useState(initialAnswers?.response  ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )
  const textRef = useRef(null)

  const state = () => ({ pathway, response })

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSaveStatus('unsaved')
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const toggle = (id) => {
    const next = pathway.includes(id) ? pathway.filter(x => x !== id) : [...pathway, id]
    setPathway(next)
    onSave({ response, pathway: next })
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
      <p className={s.selectionHint}>Check the pathway steps that best explain the mechanism of change.</p>
      <div className={s.checkList} role="group" aria-label="Pathway steps">
        {PATHWAY_STEPS.map(p => (
          <label key={p.id} className={`${s.checkItem} ${pathway.includes(p.id) ? s.checked : ''}`}>
            <input
              type="checkbox"
              checked={pathway.includes(p.id)}
              onChange={() => toggle(p.id)}
              disabled={isCompleted}
            />
            <span className={s.checkItemText}>{p.text}</span>
          </label>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My explanation of how monarchy collapsed</label>
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
        <button type="submit" className={s.saveBtn} disabled={isCompleted}>
          Save response
        </button>
      </div>
    </form>
  )
}
