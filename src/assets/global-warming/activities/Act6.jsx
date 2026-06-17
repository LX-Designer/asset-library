import React, { useState } from 'react'

const EVIDENCE = [
  { id: 'A', title: 'Isotopic fingerprinting of CO₂',                description: 'The ratio of carbon isotopes (¹²C:¹³C:¹⁴C) in atmospheric CO₂ has shifted in a direction consistent with fossil fuel combustion.' },
  { id: 'B', title: 'Stratospheric cooling while troposphere warms', description: 'If the Sun were driving warming, both layers would warm. Instead, the troposphere warms while the stratosphere cools — a greenhouse fingerprint.' },
  { id: 'C', title: 'Night warms faster than day',                   description: 'Minimum temperatures are rising faster than maximum temperatures. A greenhouse signal produces this pattern; solar forcing does not.' },
  { id: 'D', title: 'Polar amplification',                           description: 'The Arctic is warming at approximately two to four times the global average rate — a predicted consequence of greenhouse forcing.' },
  { id: 'E', title: 'Attribution studies (GCM model runs)',          description: 'Climate models cannot reproduce observed warming since 1950 with natural forcings alone; anthropogenic GHG forcings are required.' },
  { id: 'F', title: 'Mount Pinatubo eruption (1991) cooling',        description: 'The 1991 eruption caused ~0.5 °C cooling, followed by a rebound confirming the underlying GHG forcing remained active.' },
  { id: 'G', title: 'Deforestation and land-use change',             description: 'Net positive forcing of +0.15 ± 0.10 W/m² (IPCC AR6); secondary to GHG emissions but supports the anthropogenic forcing case.' },
]

const ZONES = [
  { key: 'strong',     label: 'Strong evidence',            colour: '#1e8449', bg: '#eafaf1' },
  { key: 'supporting', label: 'Supporting evidence',        colour: '#c17d0a', bg: '#fef9ec' },
  { key: 'weak',       label: 'Weak or contested evidence', colour: '#922b21', bg: '#fdf2f1' },
]

const STRENGTH_OPTIONS = ['', 'Very strong', 'Strong', 'Moderate', 'Weak', 'Very weak']


function EvidenceTile({ item, draggable, onDragStart }) {
  return (
    <div draggable={draggable} onDragStart={draggable ? () => onDragStart(item.id) : undefined}
      style={{ border: '1px solid #ddd', borderLeft: '4px solid #c0392b', borderRadius: '4px', padding: '0.6rem 0.8rem', marginBottom: '0.4rem', background: 'white', cursor: draggable ? 'grab' : 'default' }}>
      <span style={{ fontWeight: '700', color: '#c0392b', marginRight: '0.4rem' }}>{item.id}.</span>
      <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{item.title}</span>
      <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#555', lineHeight: 1.4 }}>{item.description}</p>
    </div>
  )
}

export default function Act6({ initialAnswers = {}, isCompleted, onSave, onSubmit, onClose }) {
  const initZones = initialAnswers._zones || { unsorted: EVIDENCE.map(e => e.id), strong: [], supporting: [], weak: [] }
  const [zones,    setZones]    = useState(initZones)
  const [dragging, setDragging] = useState(null)
  const initDefaults = {
    judgement:        'Of the seven pieces of evidence, I find ',
    eval_A_relevance: 'Evidence A is relevant because ',
    eval_B_relevance: 'Evidence B is relevant because ',
    eval_C_relevance: 'Evidence C is relevant because ',
    eval_D_relevance: 'Evidence D is relevant because ',
    eval_E_relevance: 'Evidence E is relevant because ',
    eval_F_relevance: 'Evidence F is relevant because ',
    eval_G_relevance: 'Evidence G is relevant because ',
    ...initialAnswers,
  }
  const [answers,  setAnswers]  = useState(initDefaults)

  function update(key, value) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    onSave?.({ ...next, _zones: zones })
  }

  function handleDrop(targetZone) {
    if (!dragging) return
    const newZones = { ...zones }
    for (const z of ['unsorted', ...ZONES.map(z => z.key)]) {
      newZones[z] = newZones[z].filter(id => id !== dragging)
    }
    newZones[targetZone] = [...(newZones[targetZone] || []), dragging]
    setZones(newZones)
    setDragging(null)
    onSave?.({ ...answers, _zones: newZones })
  }

  const itemById = Object.fromEntries(EVIDENCE.map(e => [e.id, e]))
  const evalKeys = EVIDENCE.flatMap(e => [`eval_${e.id}_relevance`, `eval_${e.id}_strength`])
  const allSorted = zones.unsorted.length === 0
  const judgementOk = (answers.judgement || '').trim().length >= 200
  const canSubmit = allSorted && evalKeys.every(k => (answers[k] || '').trim().length > 0) && judgementOk

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Weighing board */}
      {zones.unsorted.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555', marginBottom: '0.5rem' }}>Evidence to place ({zones.unsorted.length} remaining):</p>
          {zones.unsorted.map(id => <EvidenceTile key={id} item={itemById[id]} draggable={!isCompleted} onDragStart={setDragging} />)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {ZONES.map(zone => (
          <div key={zone.key} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(zone.key)}
            style={{ minHeight: '100px', border: `2px dashed ${zone.colour}`, borderRadius: '8px', padding: '0.75rem', background: zone.bg }}>
            <p style={{ margin: '0 0 0.4rem', fontWeight: '700', fontSize: '0.85rem', color: zone.colour }}>{zone.label}</p>
            {(zones[zone.key] || []).map(id => <EvidenceTile key={id} item={itemById[id]} draggable={!isCompleted} onDragStart={setDragging} />)}
            {!(zones[zone.key] || []).length && <p style={{ fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic' }}>Drag tiles here</p>}
          </div>
        ))}
      </div>

      {/* Evaluation table */}
      <h4 style={{ margin: '0 0 0.75rem', color: '#1a1a1a' }}>Evaluation table</h4>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: 'white' }}>
              <th style={{ padding: '0.4rem 0.6rem', width: '36px' }}>Item</th>
              <th style={{ padding: '0.4rem 0.6rem' }}>Why it is relevant to the inquiry question</th>
              <th style={{ padding: '0.4rem 0.6rem', width: '130px' }}>Strength of evidence</th>
            </tr>
          </thead>
          <tbody>
            {EVIDENCE.map((e, i) => (
              <tr key={e.id} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '0.4rem 0.6rem', fontWeight: '700', color: '#c0392b', textAlign: 'center', verticalAlign: 'top' }}>{e.id}</td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <textarea value={answers[`eval_${e.id}_relevance`] || ''} onChange={ev => update(`eval_${e.id}_relevance`, ev.target.value)}
                    disabled={isCompleted} rows={2}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <select value={answers[`eval_${e.id}_strength`] || ''} onChange={ev => update(`eval_${e.id}_strength`, ev.target.value)}
                    disabled={isCompleted}
                    style={{ width: '100%', padding: '0.25rem 0.4rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem' }}>
                    {STRENGTH_OPTIONS.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparative judgement */}
      <h4 style={{ margin: '0 0 0.4rem', color: '#1a1a1a' }}>Comparative judgement</h4>
      <label style={{ display: 'block', fontSize: '0.875rem', color: '#555', marginBottom: '0.5rem' }}>
        Write a 5–8 sentence comparative judgement. State which evidence you consider most persuasive overall and why. You must refer to at least three pieces of evidence by letter and address one piece you considered weak or contested.
      </label>
      <textarea value={answers.judgement || ''} onChange={e => update('judgement', e.target.value)}
        disabled={isCompleted} rows={7}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }} />
      <p style={{ fontSize: '0.75rem', color: (answers.judgement || '').length >= 200 ? '#1e8449' : '#888', marginTop: '0.25rem' }}>
        {(answers.judgement || '').length} / 200 characters minimum
      </p>

      {!isCompleted && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button onClick={() => onSubmit?.({ ...answers, _zones: zones })} disabled={!canSubmit}
            style={{ padding: '0.55rem 1.5rem', borderRadius: '4px', background: canSubmit ? '#c0392b' : '#ccc', color: 'white', border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed', fontWeight: '600' }}>
            Submit
          </button>
          {onClose && <button onClick={onClose} style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', background: 'transparent', border: '1px solid #aaa', cursor: 'pointer', color: '#555' }}>Close</button>}
        </div>
      )}
      {isCompleted && <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#eafaf1', borderRadius: '4px', color: '#1e8449', fontSize: '0.875rem' }}>Activity 6 submitted.</div>}
    </div>
  )
}
