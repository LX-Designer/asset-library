import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import { CAUSE_FACTORS } from '../data.js'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

const MATRIX_COLS = [
  { key: 'pressure', label: 'Background\npressure' },
  { key: 'trigger',  label: 'Immediate\ntrigger'   },
  { key: 'monarchy', label: 'Damaged\ntrust in monarchy' },
  { key: 'radical',  label: 'Increased\nradicalisation'  },
  { key: 'republic', label: 'Made republic\nmore likely'  },
]

export default function Act9({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const [matrix,     setMatrix]     = useState(initialAnswers?.matrix   ?? {})
  const [ranked,     setRanked]     = useState(initialAnswers?.ranked   ?? ['', '', ''])
  const [response,   setResponse]   = useState(initialAnswers?.response ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )
  const textRef = useRef(null)

  const state = () => ({ matrix, ranked, response })

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSaveStatus('unsaved')
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const setCell = (factorId, col, val) => {
    const next = { ...matrix, [factorId]: { ...(matrix[factorId] ?? {}), [col]: val } }
    setMatrix(next)
    onSave({ ranked, response, matrix: next })
    setSaveStatus('unsaved')
  }

  const setRank = (idx, val) => {
    const next = [...ranked]; next[idx] = val; setRanked(next)
    onSave({ matrix, response, ranked: next })
    setSaveStatus('unsaved')
  }

  const handleBlur = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  // onSubmit triggers AI feedback via ActivityBody (feedback config is in shell.config.js)
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state())
    setSaveStatus('saved')
  }

  const ratedCount = Object.keys(matrix).filter(k => Object.keys(matrix[k] ?? {}).length >= 3).length

  return (
    <form onSubmit={handleSubmit}>
      <p className={s.selectionHint}>Rate each cause across all five dimensions, then rank your top three.</p>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table className={s.causeMatrix}>
          <thead>
            <tr>
              <th style={{ minWidth: 160, textAlign: 'left' }}>Factor</th>
              {MATRIX_COLS.map(c => (
                <th key={c.key} style={{ minWidth: 80, whiteSpace: 'pre-line' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAUSE_FACTORS.map(cf => (
              <tr key={cf.id}>
                <td>{cf.factor}</td>
                {MATRIX_COLS.map(c => (
                  <td key={c.key} style={{ textAlign: 'center' }}>
                    <select
                      className={s.lmhSelect}
                      value={matrix[cf.id]?.[c.key] ?? ''}
                      onChange={e => setCell(cf.id, c.key, e.target.value)}
                      aria-label={`${cf.factor} — ${c.label}`}
                      disabled={isCompleted}
                    >
                      <option value="">—</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className={s.synthSectionTitle}>Rank your top three causes</div>
        {[0, 1, 2].map(i => (
          <div key={i} className={s.rankRow}>
            <label className={s.rankLabel} htmlFor={`rank-${i}`}>Rank {i + 1}</label>
            <select
              id={`rank-${i}`}
              className={s.rankSelect}
              value={ranked[i] ?? ''}
              onChange={e => setRank(i, e.target.value)}
              disabled={isCompleted}
            >
              <option value="">— select a cause —</option>
              {CAUSE_FACTORS.map(cf => (
                <option
                  key={cf.id}
                  value={cf.factor}
                  disabled={ranked.includes(cf.factor) && ranked[i] !== cf.factor}
                >
                  {cf.factor}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My ranked cause judgement</label>
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
        <button type="submit" className={s.saveBtn} disabled={isCompleted || ratedCount < 5}>
          {ratedCount < 5 ? `Rate ${5 - ratedCount} more cause${ratedCount === 4 ? '' : 's'}` : 'Submit for feedback'}
        </button>
      </div>
    </form>
  )
}
