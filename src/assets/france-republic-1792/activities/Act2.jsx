import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

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

export default function Act2({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [pathway,    setPathway]    = useState(initialAnswers?.pathway   ?? [])
  const [response,   setResponse]   = useState(initialAnswers?.response  ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const state = () => ({ pathway, response })
  const ready = pathway.length >= 1 && response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const toggle = (id) => {
    const next = pathway.includes(id) ? pathway.filter(x => x !== id) : [...pathway, id]
    setPathway(next)
    setSubmitLocked(false)
    onSave({ response, pathway: next })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
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
            />
            <span className={s.checkItemText}>{p.text}</span>
          </label>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My explanation of how monarchy collapsed</label>
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
