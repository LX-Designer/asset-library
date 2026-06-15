import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const GROUPS = ['Jacobins', 'Feuillants', 'Girondins']
const COLS   = ['Aims', 'Attitude to monarchy', 'Social / political base', 'Key significance']

function initTable(saved) {
  if (saved) return saved
  const t = {}
  GROUPS.forEach(g => { t[g] = {}; COLS.forEach(c => { t[g][c] = '' }) })
  return t
}

function tableHasContent(table) {
  return GROUPS.some(g => COLS.some(c => (table[g]?.[c] ?? '').trim()))
}

export default function Act3({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [table,      setTable]      = useState(() => initTable(initialAnswers?.table))
  const [response,   setResponse]   = useState(initialAnswers?.response ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const state = () => ({ table, response })
  const ready = tableHasContent(table) && response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const updateCell = (group, col, value) => {
    const next = { ...table, [group]: { ...table[group], [col]: value } }
    setTable(next)
    setSubmitLocked(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
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
                      onBlur={() => onSave(state())}
                      aria-label={`${g} — ${c}`}
                      rows={3}
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
