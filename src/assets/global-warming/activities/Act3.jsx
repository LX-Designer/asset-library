import React, { useState } from 'react'

const CARDS = [
  { id: 'arctic-ice', title: 'Arctic sea ice extent',              type: 'Satellite observation',                          summary: 'Arctic summer sea ice extent has declined by approximately 13% per decade since satellite records began in 1979 (NSIDC). The 2012 minimum was the lowest on record.' },
  { id: 'glacier',    title: 'Glacier retreat',                    type: 'Historical photograph + field measurement',      summary: 'The Rhône Glacier (Swiss Alps) has retreated by over 3 km since the 1870s. World Glacier Monitoring Service data show net mass loss across >90% of measured glaciers since 1980.' },
  { id: 'sea-level',  title: 'Global mean sea level',              type: 'Tide gauge + satellite altimetry',               summary: 'Sea level has risen approximately 20 cm since 1901, with the rate accelerating: ~1.4 mm/year 1901–1971, ~2.0 mm/year 1971–2006, ~3.7 mm/year 2006–2018 (IPCC AR6).' },
  { id: 'ocean-heat', title: 'Ocean heat content',                 type: 'In situ measurements + Argo float network',      summary: 'The upper 700 m of ocean has warmed by ~0.13 °C per decade since 1969. The ocean absorbs over 90% of excess energy trapped by greenhouse gases.' },
  { id: 'co2',        title: 'Atmospheric CO₂ concentration',      type: 'Direct atmospheric measurement (Mauna Loa)',     summary: 'CO₂ has risen from ~280 ppm (pre-industrial) to 427.35 ppm (2025). The annual rate of increase has accelerated from ~0.7 ppm/year in the 1960s to ~2.5 ppm/year now.' },
  { id: 'temp',       title: 'Global average surface temperature',  type: 'Instrumental record (multiple datasets)',        summary: '2024 was the warmest year on record (+1.29 °C above the 1951–1980 baseline, NASA GISS). Nineteen of the twenty warmest years on record have occurred since 2000.' },
]

const ZONES = [
  { key: 'supports', label: 'Strongly supports', colour: '#1e8449', bg: '#eafaf1' },
  { key: 'partial',  label: 'Partially supports', colour: '#c17d0a', bg: '#fef9ec' },
  { key: 'weakens',  label: 'Weakens or complicates', colour: '#922b21', bg: '#fdf2f1' },
]

const CONFIDENCE_OPTIONS = ['', 'High', 'Medium', 'Low']

const CHIPS = [
  { label: 'Start: overall judgement',    fills: { summary: 'Taken together, the observational evidence ' } },
  { label: 'Address limitations',          fills: { summary: 'While each individual indicator has limitations, ' } },
  { label: 'Use triangulation language',   fills: { summary: 'The fact that multiple independent data sources ' } },
]

function EvidenceCard({ card, draggable, onDragStart }) {
  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? () => onDragStart(card.id) : undefined}
      style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '0.75rem 0.9rem', marginBottom: '0.5rem', background: 'white', cursor: draggable ? 'grab' : 'default', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <p style={{ margin: '0 0 0.15rem', fontWeight: '700', fontSize: '0.9rem' }}>{card.title}</p>
      <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>{card.type}</p>
      <p style={{ margin: 0, fontSize: '0.83rem', color: '#333', lineHeight: 1.45 }}>{card.summary}</p>
    </div>
  )
}

export default function Act3({ initialAnswers = {}, isCompleted, onSave, onSubmit, onClose }) {
  const initState = initialAnswers._zones || { unsorted: CARDS.map(c => c.id), supports: [], partial: [], weakens: [] }
  const [zones,    setZones]    = useState(initState)
  const [dragging, setDragging] = useState(null)
  const [answers,  setAnswers]  = useState(initialAnswers)

  function update(key, value) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    onSave?.({ ...next, _zones: zones })
  }

  function applyChip(fills) {
    const next = { ...answers, ...fills }
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

  const cardById = Object.fromEntries(CARDS.map(c => [c.id, c]))

  const allSorted    = zones.unsorted.length === 0
  const triComplete  = CARDS.every(c => (answers[`tri_${c.id}_measures`] || '').trim().length > 0 && (answers[`tri_${c.id}_confidence`] || '').trim().length > 0)
  const summaryOk    = (answers.summary || '').trim().length >= 80
  const canSubmit    = allSorted && triComplete && summaryOk

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

      {/* Unsorted pool */}
      {zones.unsorted.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555', marginBottom: '0.5rem' }}>Cards to sort ({zones.unsorted.length} remaining):</p>
          {zones.unsorted.map(id => (
            <EvidenceCard key={id} card={cardById[id]} draggable={!isCompleted} onDragStart={setDragging} />
          ))}
        </div>
      )}

      {/* Drop zones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {ZONES.map(zone => (
          <div
            key={zone.key}
            onDragOver={e => { e.preventDefault() }}
            onDrop={() => handleDrop(zone.key)}
            style={{ minHeight: '120px', border: `2px dashed ${zone.colour}`, borderRadius: '8px', padding: '0.75rem', background: zone.bg }}
          >
            <p style={{ margin: '0 0 0.5rem', fontWeight: '700', fontSize: '0.85rem', color: zone.colour }}>{zone.label}</p>
            {(zones[zone.key] || []).map(id => (
              <EvidenceCard key={id} card={cardById[id]} draggable={!isCompleted} onDragStart={setDragging} />
            ))}
            {(zones[zone.key] || []).length === 0 && (
              <p style={{ fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic' }}>Drag cards here</p>
            )}
          </div>
        ))}
      </div>

      {/* Triangulation matrix */}
      <h4 style={{ margin: '0 0 0.75rem', color: '#1a1a1a' }}>Triangulation matrix</h4>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: 'white' }}>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Indicator</th>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>What it measures</th>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Reliability / limitations</th>
              <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left' }}>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {CARDS.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '0.4rem 0.6rem', fontWeight: '600', verticalAlign: 'top' }}>{c.title}</td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <textarea value={answers[`tri_${c.id}_measures`] || ''} onChange={e => update(`tri_${c.id}_measures`, e.target.value)}
                    disabled={isCompleted} rows={2}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <textarea value={answers[`tri_${c.id}_limits`] || ''} onChange={e => update(`tri_${c.id}_limits`, e.target.value)}
                    disabled={isCompleted} rows={2}
                    style={{ width: '100%', padding: '0.3rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </td>
                <td style={{ padding: '0.4rem 0.6rem', verticalAlign: 'top' }}>
                  <select value={answers[`tri_${c.id}_confidence`] || ''} onChange={e => update(`tri_${c.id}_confidence`, e.target.value)}
                    disabled={isCompleted}
                    style={{ padding: '0.25rem 0.4rem', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.83rem' }}>
                    {CONFIDENCE_OPTIONS.map(o => <option key={o} value={o}>{o || '— select —'}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary judgement */}
      <h4 style={{ margin: '0 0 0.4rem', color: '#1a1a1a' }}>Summary judgement</h4>
      <label style={{ display: 'block', fontSize: '0.875rem', color: '#555', marginBottom: '0.5rem' }}>
        Overall, how convincing is the observational evidence that global temperatures have risen significantly? Consider the number of independent indicators, their consistency, and any gaps or limitations.
      </label>
      <textarea
        value={answers.summary || ''} onChange={e => update('summary', e.target.value)}
        disabled={isCompleted} rows={5}
        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }}
      />
      <p style={{ fontSize: '0.75rem', color: (answers.summary || '').length >= 80 ? '#1e8449' : '#888', marginTop: '0.25rem' }}>
        {(answers.summary || '').length} / 80 characters minimum
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
      {isCompleted && <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#eafaf1', borderRadius: '4px', color: '#1e8449', fontSize: '0.875rem' }}>Activity 3 submitted.</div>}
    </div>
  )
}
