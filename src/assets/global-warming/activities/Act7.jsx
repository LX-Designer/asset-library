import React, { useState } from 'react'

const EV_LETTERS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G']

const WF_SECTIONS = [
  { key: 'wf_claim',    role: 'CLAIM',                    prompt: 'State your overall answer to the inquiry question. Make your position clear.' },
  { key: 'wf_evidence', role: 'EVIDENCE',                 prompt: 'Refer to at least two specific pieces of evidence (use letters A–G). Include specific data.' },
  { key: 'wf_reasoning',role: 'REASONING',                prompt: 'Explain how and why your evidence supports your claim. Use geographical vocabulary.' },
  { key: 'wf_counter',  role: 'COUNTER-ARGUMENT',         prompt: 'Acknowledge a significant limitation, alternative explanation, or counterargument.' },
  { key: 'wf_limit',    role: 'LIMITATION / CONCLUSION',  prompt: 'Explain how your overall argument holds despite this limitation. Conclude by restating your position.' },
]

const CHECKLIST = [
  { key: 'chk_inquiry',   label: 'My claim directly answers the inquiry question.' },
  { key: 'chk_evidence',  label: 'I have referred to at least two pieces of evidence by letter (A–G).' },
  { key: 'chk_data',      label: 'I have included specific data (numbers, dates, or measurements) in at least one place.' },
  { key: 'chk_reasoning', label: 'I have explained how the evidence supports my claim, not just described it.' },
  { key: 'chk_counter',   label: 'I have acknowledged at least one limitation or counterargument.' },
  { key: 'chk_rebuttal',  label: 'I have explained why the limitation does not undermine my overall argument.' },
  { key: 'chk_vocab',     label: 'I have used appropriate geographical vocabulary throughout.' },
  { key: 'chk_length',    label: 'My response is between 350 and 500 words.' },
]

const CHIPS = [
  { label: 'Claim sentence starter',          fills: { wf_claim:   'The evidence indicates that global warming ' } },
  { label: 'Evidence sentence starter',       fills: { wf_evidence: 'Evidence ' } },
  { label: 'Counterargument acknowledgement', fills: { wf_counter:  'A significant limitation of this argument is that ' } },
]

function countWords(str) {
  return (str || '').trim().split(/\s+/).filter(Boolean).length
}

export default function Act7({ initialAnswers = {}, isCompleted, onSave, onSubmit, onClose }) {
  const [answers, setAnswers] = useState(initialAnswers)

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

  const totalWords = WF_SECTIONS.reduce((sum, s) => sum + countWords(answers[s.key]), 0)
  const wordColour = totalWords < 350 ? '#c17d0a' : totalWords > 500 ? '#c0392b' : '#1e8449'

  const ev1Complete = (answers.ev_1_item || '') && (answers.ev_1_data || '').trim().length > 0 && (answers.ev_1_arg || '').trim().length > 0
  const wfComplete  = WF_SECTIONS.every(s => (answers[s.key] || '').trim().length > 0)
  const allChecked  = CHECKLIST.every(c => answers[c.key])
  const canSubmit   = ev1Complete && wfComplete && allChecked

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

      {/* Part A — Evidence summary */}
      <h4 style={{ margin: '0 0 0.5rem', color: '#1a1a1a' }}>Part A — Evidence summary</h4>
      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.75rem' }}>Before writing, note up to four pieces of evidence you plan to use. Complete at least row 1.</p>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: 'white' }}>
              <th style={{ padding: '0.4rem 0.6rem', width: '80px' }}>Evidence</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>Key data / finding</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>How it relates to your argument</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4].map((n, i) => (
              <tr key={n} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <select value={answers[`ev_${n}_item`] || ''} onChange={e => update(`ev_${n}_item`, e.target.value)}
                    disabled={isCompleted}
                    style={{ width: '100%', padding: '0.25rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.85rem' }}>
                    {EV_LETTERS.map(l => <option key={l} value={l}>{l || '—'}</option>)}
                  </select>
                </td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <textarea value={answers[`ev_${n}_data`] || ''} onChange={e => update(`ev_${n}_data`, e.target.value)}
                    disabled={isCompleted} rows={2}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <textarea value={answers[`ev_${n}_arg`] || ''} onChange={e => update(`ev_${n}_arg`, e.target.value)}
                    disabled={isCompleted} rows={2}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Part B — Writing frame */}
      <h4 style={{ margin: '0 0 0.5rem', color: '#1a1a1a' }}>Part B — Writing frame</h4>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: wordColour }}>
          {totalWords} words (target: 350–500)
        </span>
      </div>
      {WF_SECTIONS.map(s => (
        <div key={s.key} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c0392b', background: 'rgba(192,57,43,0.06)', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>{s.role}</span>
            <span style={{ fontSize: '0.82rem', color: '#666', fontStyle: 'italic' }}>{s.prompt}</span>
          </div>
          <textarea value={answers[s.key] || ''} onChange={e => update(s.key, e.target.value)}
            disabled={isCompleted} rows={5}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>
      ))}

      {/* Part C — Self-check */}
      <h4 style={{ margin: '1.5rem 0 0.5rem', color: '#1a1a1a' }}>Part C — Self-check</h4>
      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.75rem' }}>Tick each item only when you are satisfied it applies to your response.</p>
      {CHECKLIST.map(c => (
        <label key={c.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', cursor: isCompleted ? 'default' : 'pointer', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={!!answers[c.key]} onChange={e => update(c.key, e.target.checked)}
            disabled={isCompleted} style={{ marginTop: '0.15rem', accentColor: '#c0392b' }} />
          {c.label}
        </label>
      ))}

      {!isCompleted && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button onClick={() => onSubmit?.(answers)} disabled={!canSubmit}
            style={{ padding: '0.55rem 1.5rem', borderRadius: '4px', background: canSubmit ? '#c0392b' : '#ccc', color: 'white', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', fontWeight: '600' }}>
            Submit
          </button>
          <button onClick={onClose} style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', background: 'transparent', border: '1px solid #aaa', cursor: 'pointer', color: '#555' }}>Close</button>
        </div>
      )}
      {isCompleted && <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#eafaf1', borderRadius: '4px', color: '#1e8449', fontSize: '0.875rem' }}>Activity 7 submitted. Well done — you have completed the lab.</div>}
    </div>
  )
}
