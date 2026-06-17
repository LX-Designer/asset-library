import React, { useState } from 'react'

const PART_A = [
  { key: 'notice1', starter: 'When I look at the title of this lab, I immediately think about…' },
  { key: 'notice2', starter: 'One thing I already know (or think I know) about global warming is…' },
  { key: 'notice3', starter: 'Something about global warming that surprises me or that I find hard to believe is…' },
  { key: 'notice4', starter: 'If I had to guess the single most important cause of global warming, I would say…' },
]

const PART_B = [
  { key: 'wonder1', label: 'Something I genuinely don\'t know about global warming is…' },
  { key: 'wonder2', label: 'A question I would like to investigate in this lab is…' },
]

const PART_C = [
  { key: 'reflect1', label: 'What is the difference between weather and climate? (Try to use an example.)' },
  { key: 'reflect2', label: 'What does the phrase \'temperature anomaly\' mean? How does it differ from \'temperature\'?' },
  { key: 'reflect3', label: 'If you had to estimate: how much has average global temperature risen since the mid-1800s? What influenced your estimate?' },
]

export default function Act1({ initialAnswers = {}, isCompleted, onSave, onSubmit, onClose }) {
  const initDefaults = {
    notice1: 'When I look at the title of this lab, I immediately think about ',
    notice2: 'One thing I already know (or think I know) about global warming is ',
    ...initialAnswers,
  }
  const [answers, setAnswers] = useState(initDefaults)

  function update(key, value) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    onSave?.(next)
  }

  const allFilled = [...PART_A, ...PART_B, ...PART_C].every(f => (answers[f.key] || '').trim().length > 0)

  return (
    <div style={{ padding: '1.5rem' }}>
      <h4 style={{ margin: '0 0 0.25rem', color: '#1a1a1a' }}>Part A — What I notice</h4>
      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '1rem' }}>Complete each sentence starter. There are no right or wrong answers here.</p>
      {PART_A.map(f => (
        <div key={f.key} style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontStyle: 'italic', color: '#333', marginBottom: '0.35rem' }}>{f.starter}</label>
          <textarea
            value={answers[f.key] || ''}
            onChange={e => update(f.key, e.target.value)}
            disabled={isCompleted}
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }}
          />
        </div>
      ))}

      <h4 style={{ margin: '1.5rem 0 0.25rem', color: '#1a1a1a' }}>Part B — What I wonder</h4>
      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '1rem' }}>What are you genuinely uncertain about?</p>
      {PART_B.map(f => (
        <div key={f.key} style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontStyle: 'italic', color: '#333', marginBottom: '0.35rem' }}>{f.label}</label>
          <textarea
            value={answers[f.key] || ''}
            onChange={e => update(f.key, e.target.value)}
            disabled={isCompleted}
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }}
          />
        </div>
      ))}

      <h4 style={{ margin: '1.5rem 0 0.25rem', color: '#1a1a1a' }}>Part C — Reflect</h4>
      {PART_C.map(f => (
        <div key={f.key} style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '0.35rem' }}>{f.label}</label>
          <textarea
            value={answers[f.key] || ''}
            onChange={e => update(f.key, e.target.value)}
            disabled={isCompleted}
            rows={4}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }}
          />
        </div>
      ))}

      {!isCompleted && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => onSubmit?.(answers)}
            disabled={!allFilled}
            style={{ padding: '0.55rem 1.5rem', borderRadius: '4px', background: allFilled ? '#c0392b' : '#ccc', color: 'white', border: 'none', cursor: allFilled ? 'pointer' : 'not-allowed', fontWeight: '600' }}
          >
            Submit
          </button>
          {onClose && (
            <button onClick={onClose} style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', background: 'transparent', border: '1px solid #aaa', cursor: 'pointer', color: '#555' }}>
              Close
            </button>
          )}
        </div>
      )}
      {isCompleted && (
        <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#eafaf1', borderRadius: '4px', color: '#1e8449', fontSize: '0.875rem' }}>
          Activity 1 submitted.
        </div>
      )}
    </div>
  )
}
