import React, { useState } from 'react'

const GASES = [
  { label: 'CO₂',      gwp: 1,     example: 'e.g. vehicle exhaust, power station' },
  { label: 'CH₄',      gwp: 28.5,  example: 'e.g. livestock, natural gas leak'    },
  { label: 'N₂O',      gwp: 273,   example: 'e.g. agricultural soils, fertiliser' },
  { label: 'HFC-134a', gwp: 1530,  example: 'e.g. refrigerant leak'               },
  { label: 'HFC-23',   gwp: 14600, example: 'e.g. industrial process by-product'  },
  { label: 'SF₆',      gwp: 23500, example: 'e.g. electrical switchgear'          },
]

export default function CO2eCalculator() {
  const [selectedGas, setSelectedGas] = useState(GASES[1])
  const [mass,        setMass]        = useState('')
  const [unit,        setUnit]        = useState('tonnes')

  const massNum = parseFloat(mass)
  const massKg  = isNaN(massNum) ? null : (unit === 'tonnes' ? massNum * 1000 : massNum)
  const co2eKg  = massKg !== null ? massKg * selectedGas.gwp : null
  const co2eT   = co2eKg !== null ? co2eKg / 1000 : null

  const fmtNum = n => n >= 1e6 ? `${(n / 1e6).toFixed(2)} million` : n >= 1000 ? `${(n / 1000).toFixed(2)}` : n.toFixed(2)

  return (
    <div style={{ background: '#f0f4f8', border: '1px solid #c8d6e0', borderRadius: '8px', padding: '1.25rem', margin: '1.5rem 0' }}>
      <h4 style={{ margin: '0 0 1rem', color: '#1F4E79' }}>CO₂ Equivalent Calculator</h4>
      <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: '#444' }}>
        Formula: CO₂e = mass of gas × GWP-100
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Gas</label>
          <select
            value={selectedGas.label}
            onChange={e => setSelectedGas(GASES.find(g => g.label === e.target.value))}
            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #aaa' }}
          >
            {GASES.map(g => <option key={g.label} value={g.label}>{g.label} (GWP-100 = {g.gwp})</option>)}
          </select>
          <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>{selectedGas.example}</p>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Mass emitted</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              min="0"
              value={mass}
              onChange={e => setMass(e.target.value)}
              placeholder="Enter mass"
              style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid #aaa' }}
            />
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #aaa' }}
            >
              <option value="tonnes">tonnes</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>
      </div>
      {co2eT !== null && (
        <div style={{ background: 'white', borderRadius: '6px', padding: '0.75rem 1rem', borderLeft: '4px solid #c0392b' }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>{mass} {unit} of {selectedGas.label}</strong>
            {' = '}
            <strong style={{ color: '#c0392b', fontSize: '1.1rem' }}>
              {fmtNum(co2eT)} tonnes CO₂e
            </strong>
            {' '}({fmtNum(co2eKg)} kg CO₂e)
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#555' }}>
            Calculation: {mass} {unit} × GWP-100 of {selectedGas.gwp} = {fmtNum(co2eT)} tonnes CO₂e
          </p>
        </div>
      )}
      {co2eT === null && mass !== '' && (
        <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>Please enter a valid mass.</p>
      )}
      {mass === '' && (
        <p style={{ color: '#888', fontSize: '0.875rem', fontStyle: 'italic' }}>Enter a mass above to see the CO₂ equivalent.</p>
      )}
    </div>
  )
}
