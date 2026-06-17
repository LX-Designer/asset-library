import React, { useState } from 'react'

const PROXY_TYPES = ['Ice core', 'Tree rings', 'Lake sediment varves']

const PART_A = [
  { limKey: 'iceLimitation',  rsKey: 'iceReason',  label: 'Ice core evidence' },
  { limKey: 'treeLimitation', rsKey: 'treeReason',  label: 'Tree ring evidence' },
  { limKey: 'sedLimitation',  rsKey: 'sedReason',   label: 'Lake sediment (varve) evidence' },
]

const PART_B_ROWS = [
  { key: 'srcOrigin',  label: 'Origin / provenance — where does this evidence come from?' },
  { key: 'srcDate',    label: 'Period covered — what time range does it represent?' },
  { key: 'srcMethod',  label: 'Method of analysis — how is the climate signal extracted?' },
  { key: 'srcBias',    label: 'Potential bias or uncertainty — what might affect accuracy?' },
  { key: 'srcScope',   label: 'Scope — what can this evidence tell us, and what can it not tell us?' },
]

const PART_C = [
  { key: 'reflectC1', label: 'Why do scientists combine multiple proxy types rather than relying on a single one?' },
  { key: 'reflectC2', label: 'How does the time resolution of proxy evidence compare to the instrumental record? What are the consequences of this difference?' },
  { key: 'reflectC3', label: 'Look at Figure 2.1 again. What pattern do you notice between 950 CE and 1850 CE? What factors other than human activity could explain the variation?' },
]

export default function Act2({ initialAnswers = {}, isCompleted, onSave, onSubmit, onClose }) {
  const initDefaults = {
    iceLimitation:  'One limitation of ice core evidence is that ',
    iceReason:      'This matters because ',
    treeLimitation: 'One limitation of tree ring evidence is that ',
    treeReason:     'This matters because ',
    sedLimitation:  'One limitation of lake sediment evidence is that ',
    sedReason:      'This matters because ',
    srcOrigin:      'This evidence comes from ',
    reflectC1:      'Scientists combine multiple proxy types rather than relying on one because ',
    ...initialAnswers,
  }
  const [answers, setAnswers] = useState(initDefaults)

  function update(key, value) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    onSave?.(next)
  }

  const allKeys = [...PART_A.flatMap(r => [r.limKey, r.rsKey]), ...PART_B_ROWS.map(r => r.key), 'srcProxyType', ...PART_C.map(r => r.key)]
  const allFilled = allKeys.every(k => (answers[k] || '').trim().length > 0)

  return (
    <div style={{ padding: '1.5rem' }}>
      <h4 style={{ margin: '0 0 0.75rem', color: '#1a1a1a' }}>Part A — Limitations</h4>
      {PART_A.map(r => (
        <div key={r.limKey} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          <p style={{ fontWeight: '600', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{r.label}</p>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#555', marginBottom: '0.25rem' }}>Limitation:</label>
          <textarea value={answers[r.limKey] || ''} onChange={e => update(r.limKey, e.target.value)} disabled={isCompleted} rows={2}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box', marginBottom: '0.5rem' }} />
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#555', marginBottom: '0.25rem' }}>Why this matters for interpretation:</label>
          <textarea value={answers[r.rsKey] || ''} onChange={e => update(r.rsKey, e.target.value)} disabled={isCompleted} rows={2}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>
      ))}

      <h4 style={{ margin: '1.5rem 0 0.5rem', color: '#1a1a1a' }}>Part B — Source evaluation</h4>
      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.75rem' }}>Choose one proxy type to evaluate in detail.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {PROXY_TYPES.map(t => (
          <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', cursor: isCompleted ? 'default' : 'pointer' }}>
            <input type="radio" name="srcProxyType" value={t} checked={(answers.srcProxyType || '') === t}
              onChange={e => update('srcProxyType', e.target.value)} disabled={isCompleted} />
            {t}
          </label>
        ))}
      </div>
      {PART_B_ROWS.map(r => (
        <div key={r.key} style={{ marginBottom: '0.85rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '0.25rem' }}>{r.label}</label>
          <textarea value={answers[r.key] || ''} onChange={e => update(r.key, e.target.value)} disabled={isCompleted} rows={2}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>
      ))}

      <h4 style={{ margin: '1.5rem 0 0.75rem', color: '#1a1a1a' }}>Part C — Reflect</h4>
      {PART_C.map(r => (
        <div key={r.key} style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '0.35rem' }}>{r.label}</label>
          <textarea value={answers[r.key] || ''} onChange={e => update(r.key, e.target.value)} disabled={isCompleted} rows={4}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>
      ))}

      {!isCompleted && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button onClick={() => onSubmit?.(answers)} disabled={!allFilled}
            style={{ padding: '0.55rem 1.5rem', borderRadius: '4px', background: allFilled ? '#c0392b' : '#ccc', color: 'white', border: 'none', cursor: allFilled ? 'pointer' : 'not-allowed', fontWeight: '600' }}>
            Submit
          </button>
          {onClose && <button onClick={onClose} style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', background: 'transparent', border: '1px solid #aaa', cursor: 'pointer', color: '#555' }}>Close</button>}
        </div>
      )}
      {isCompleted && <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#eafaf1', borderRadius: '4px', color: '#1e8449', fontSize: '0.875rem' }}>Activity 2 submitted.</div>}
    </div>
  )
}
