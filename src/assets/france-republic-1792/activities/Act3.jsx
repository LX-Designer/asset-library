import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

const GROUPS = ['Jacobins', 'Feuillants', 'Girondins']
const COLS   = ['Aims', 'Attitude to monarchy', 'Social / political base', 'Key significance']

function initTable(saved) {
  if (saved) return saved
  const t = {}
  GROUPS.forEach(g => { t[g] = {}; COLS.forEach(c => { t[g][c] = '' }) })
  return t
}

export default function Act3({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const [table,      setTable]      = useState(() => initTable(initialAnswers?.table))
  const [response,   setResponse]   = useState(initialAnswers?.response ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )
  const textRef = useRef(null)

  const state = () => ({ table, response })

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSaveStatus('unsaved')
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const updateCell = (group, col, value) => {
    const next = { ...table, [group]: { ...table[group], [col]: value } }
    setTable(next)
    onSave({ response, table: next })
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
      <p className={s.selectionHint}>Complete the comparison table using the Groups section of the dossier, then write your judgement below.</p>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table className={s.comparisonTable}>
          <thead>
            <tr>
              <th>Group</th>
              {COLS.map(c => <th key={c}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map(g => (
              <tr key={g}>
                <td>{g}</td>
                {COLS.map(c => (
                  <td key={c}>
                    <textarea
                      className={s.comparisonCell}
                      value={table[g]?.[c] ?? ''}
                      onChange={e => updateCell(g, c, e.target.value)}
                      onBlur={handleBlur}
                      aria-label={`${g} — ${c}`}
                      rows={3}
                      disabled={isCompleted}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My group comparison and judgement</label>
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
