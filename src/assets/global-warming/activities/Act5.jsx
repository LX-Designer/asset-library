import React, { useState } from 'react'

const BOXES = [1,2,3,4,5,6]

const PART_B = [
  { key: 'qB1', label: 'What would happen to the energy balance if the concentration of greenhouse gases in the atmosphere doubled? Explain your reasoning using Figure 5.1.' },
  { key: 'qB2', label: 'Box [3] shows infrared radiation emitted from Earth\'s surface. Why does the Earth emit radiation in the infrared range rather than the visible range?' },
  { key: 'qB3', label: '1 tonne of SF₆ is emitted. Calculate its CO₂ equivalent (CO₂e). Show your working. (GWP-100 of SF₆ = 23,500)' },
  { key: 'qB4', label: 'What is the AGGI, and what does its increase over time tell us about the composition of the atmosphere?' },
]

const CHIPS = [
  { label: 'Annotation structure',       fills: { ann_1_desc: 'Process [1]: ' } },
  { label: 'Energy balance explanation', fills: { qB1: 'If the concentration of greenhouse gases doubled, ' } },
  { label: 'CO₂e working structure',     fills: { qB3: '1 tonne SF₆ × 23,500 = ' } },
]

export default function Act5({ initialAnswers = {}, isCompleted, onSave, onSubmit, onClose }) {
  const initDefaults = { qB3: '1 tonne SF₆ × 23,500 = ', ...initialAnswers }
  const [answers, setAnswers] = useState(initDefaults)

  function update(key, value) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    onSave?.(next)
  }

  function applyChip(fills) {
    const next = { ...answers, ...fills }
    setAnswers(next)
    onSave?.(next)
  }

  const annKeys = BOXES.flatMap(n => [`ann_${n}_name`, `ann_${n}_desc`])
  const allKeys = [...annKeys, ...PART_B.map(q => q.key)]
  const canSubmit = allKeys.every(k => (answers[k] || '').trim().length > 0)

  return (
    <div style={{ padding: '1.5rem' }}>
      {!isCompleted && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {CHIPS.map(c => (
            <button key={c.label} onClick={() => applyChip(c.fills)}
              style={{ padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1px solid #c0392b', background: 'rgba(192,57,43,0.06)', color: '#c0392b', cursor: 'pointer', fontSize: '0.82rem' }}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      <h4 style={{ margin: '0 0 0.75rem', color: '#1a1a1a' }}>Part A — Label the diagram (Figure 5.1)</h4>
      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.75rem' }}>For each numbered box in Figure 5.1, write the name of the process and a brief description in your own words.</p>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: 'white' }}>
              <th style={{ padding: '0.4rem 0.6rem', width: '48px' }}>Box</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>Process name</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>Description in your own words</th>
            </tr>
          </thead>
          <tbody>
            {BOXES.map((n, i) => (
              <tr key={n} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '0.4rem 0.6rem', fontWeight: '700', color: '#c0392b', textAlign: 'center', verticalAlign: 'top' }}>[{n}]</td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <input type="text" value={answers[`ann_${n}_name`] || ''} onChange={e => update(`ann_${n}_name`, e.target.value)}
                    disabled={isCompleted}
                    style={{ width: '100%', padding: '0.3rem 0.4rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <textarea value={answers[`ann_${n}_desc`] || ''} onChange={e => update(`ann_${n}_desc`, e.target.value)}
                    disabled={isCompleted} rows={2}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 style={{ margin: '0 0 0.75rem', color: '#1a1a1a' }}>Part B — Questions</h4>
      {PART_B.map(q => (
        <div key={q.key} style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '0.35rem' }}>{q.label}</label>
          {q.key === 'qB3' && (
            <div style={{ background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', padding: '0.5rem 0.75rem', marginBottom: '0.4rem', fontSize: '0.85rem', fontFamily: 'monospace', color: '#333' }}>
              Calculation: 1 tonne SF₆ × GWP-100 (23,500) = _____ tonnes CO₂e
            </div>
          )}
          <textarea value={answers[q.key] || ''} onChange={e => update(q.key, e.target.value)}
            disabled={isCompleted} rows={q.key === 'qB3' ? 3 : 4}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>
      ))}

      {!isCompleted && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button onClick={() => onSubmit?.(answers)} disabled={!canSubmit}
            style={{ padding: '0.55rem 1.5rem', borderRadius: '4px', background: canSubmit ? '#c0392b' : '#ccc', color: 'white', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', fontWeight: '600' }}>
            Submit
          </button>
          <button onClick={onClose} style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', background: 'transparent', border: '1px solid #aaa', cursor: 'pointer', color: '#555' }}>Close</button>
        </div>
      )}
      {isCompleted && <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#eafaf1', borderRadius: '4px', color: '#1e8449', fontSize: '0.875rem' }}>Activity 5 submitted.</div>}
    </div>
  )
}
