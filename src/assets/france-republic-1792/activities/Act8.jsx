import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import { TURNING_POINTS } from '../data.js'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

const TP_TYPES = ['Trigger', 'Accelerator', 'Symptom', 'Legitimacy turning point', 'Decisive break']

export default function Act8({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const [classifications, setClassifications] = useState(initialAnswers?.classifications ?? {})
  const [response,        setResponse]        = useState(initialAnswers?.response        ?? '')
  const [saveStatus,      setSaveStatus]      = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )
  const textRef = useRef(null)

  const state = () => ({ classifications, response })

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSaveStatus('unsaved')
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const setClass = (id, val) => {
    const next = { ...classifications, [id]: val }
    setClassifications(next)
    onSave({ response, classifications: next })
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

  const classified = Object.keys(classifications).filter(k => classifications[k]).length

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
                    disabled={isCompleted}
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
        <button type="submit" className={s.saveBtn} disabled={isCompleted || classified < 4}>
          {classified < 4 ? `Classify ${4 - classified} more event${classified === 3 ? '' : 's'}` : 'Save response'}
        </button>
      </div>
    </form>
  )
}
