import React, { useState } from 'react'

const CAUSES = [
  { key: 'ghg',      label: 'Greenhouse gas emissions' },
  { key: 'solar',    label: 'Solar output variation' },
  { key: 'volcanic', label: 'Volcanic activity' },
  { key: 'orbital',  label: 'Natural orbital cycles (Milankovitch)' },
  { key: 'landUse',  label: 'Land-use change (deforestation and albedo)' },
]

const RANK_OPTIONS = ['', '1', '2', '3', '4', '5']


export default function Act4({ initialAnswers = {}, isCompleted, onSave, onSubmit, onClose }) {
  const initDefaults = {
    pa_ghg_pattern:    'If greenhouse gas emissions were the dominant cause, we would expect ',
    pa_solar_mismatch: 'A significant mismatch is that ',
    ...initialAnswers,
  }
  const [answers, setAnswers] = useState(initDefaults)

  function update(key, value) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    onSave?.(next)
  }

  const partAKeys = CAUSES.flatMap(c => [`pa_${c.key}_pattern`, `pa_${c.key}_fit`, `pa_${c.key}_mismatch`])
  const partBKeys = CAUSES.flatMap(c => [`pb_${c.key}_rank`, `pb_${c.key}_just`])
  const canSubmit = [...partAKeys, ...partBKeys].every(k => (answers[k] || '').trim().length > 0)

  return (
    <div style={{ padding: '1.5rem' }}>
      <h4 style={{ margin: '0 0 0.75rem', color: '#1a1a1a' }}>Part A — Pattern match</h4>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: 'white' }}>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', minWidth: '140px' }}>Candidate cause</th>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', minWidth: '180px' }}>Predicted warming pattern</th>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', minWidth: '180px' }}>How well does it fit the observed record?</th>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', minWidth: '180px' }}>Any significant mismatch?</th>
            </tr>
          </thead>
          <tbody>
            {CAUSES.map((c, i) => (
              <tr key={c.key} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '0.4rem 0.6rem', fontWeight: '600', verticalAlign: 'top' }}>{c.label}</td>
                {['pattern', 'fit', 'mismatch'].map(col => (
                  <td key={col} style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                    <textarea value={answers[`pa_${c.key}_${col}`] || ''} onChange={e => update(`pa_${c.key}_${col}`, e.target.value)}
                      disabled={isCompleted} rows={3}
                      style={{ width: '100%', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 style={{ margin: '0 0 0.75rem', color: '#1a1a1a' }}>Part B — Ranking</h4>
      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.75rem' }}>Rank the five causes from most (1) to least likely (5) to be the dominant driver of 20th–21st century warming. Justify each ranking.</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: 'white' }}>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Cause</th>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Justification</th>
            </tr>
          </thead>
          <tbody>
            {CAUSES.map((c, i) => (
              <tr key={c.key} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <select value={answers[`pb_${c.key}_rank`] || ''} onChange={e => update(`pb_${c.key}_rank`, e.target.value)}
                    disabled={isCompleted}
                    style={{ padding: '0.25rem 0.4rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem' }}>
                    {RANK_OPTIONS.map(o => <option key={o} value={o}>{o || '—'}</option>)}
                  </select>
                </td>
                <td style={{ padding: '0.4rem 0.6rem', fontWeight: '600', verticalAlign: 'top' }}>{c.label}</td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <textarea value={answers[`pb_${c.key}_just`] || ''} onChange={e => update(`pb_${c.key}_just`, e.target.value)}
                    disabled={isCompleted} rows={3}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isCompleted && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button onClick={() => onSubmit?.(answers)} disabled={!canSubmit}
            style={{ padding: '0.55rem 1.5rem', borderRadius: '4px', background: canSubmit ? '#c0392b' : '#ccc', color: 'white', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', fontWeight: '600' }}>
            Submit
          </button>
          {onClose && <button onClick={onClose} style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', background: 'transparent', border: '1px solid #aaa', cursor: 'pointer', color: '#555' }}>Close</button>}
        </div>
      )}
      {isCompleted && <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#eafaf1', borderRadius: '4px', color: '#1e8449', fontSize: '0.875rem' }}>Activity 4 submitted.</div>}
    </div>
  )
}
