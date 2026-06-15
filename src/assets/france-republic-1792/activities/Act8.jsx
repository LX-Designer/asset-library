import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import { TURNING_POINTS } from '../data.js'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const TP_TYPES = ['Trigger', 'Accelerator', 'Symptom', 'Legitimacy turning point', 'Decisive break']

export default function Act8({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [classifications, setClassifications] = useState(initialAnswers?.classifications ?? {})
  const [response,        setResponse]        = useState(initialAnswers?.response        ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const state = () => ({ classifications, response })
  const classified = Object.keys(classifications).filter(k => classifications[k]).length
  const ready = classified >= 4 && response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const setClass = (id, val) => {
    const next = { ...classifications, [id]: val }
    setClassifications(next)
    setSubmitLocked(false)
    onSave({ response, classifications: next })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className={s.selectionHint}>Classify each event. Classify at least four before writing your judgement.</p>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table className={s.classifyTable}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Classification</th>
            </tr>
          </thead>
          <tbody>
            {TURNING_POINTS.map(tp => (
              <tr key={tp.id}>
                <td>{tp.event}</td>
                <td>
                  <select
                    className={s.classifySelect}
                    value={classifications[tp.id] ?? ''}
                    onChange={e => setClass(tp.id, e.target.value)}
                    aria-label={`Classification for ${tp.event}`}
                  >
                    <option value="">— choose —</option>
                    {TP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My turning-point judgement</label>
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
