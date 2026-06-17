import React, { useState } from 'react'

const GAS_DATA = [
  {
    gas:           'Carbon dioxide',
    formula:       'CO₂',
    preIndustrial: '280 ppm',
    current:       '427.35 ppm (2025, NOAA ML)',
    gwp100:        1,
    gwp100Display: '1 (reference)',
    lifetime:      'Varies by fraction: decades to centuries; ~20% remains for thousands of years',
    lifetimeSortKey: 10000,
    concPpm:       427.35,
    unit:          'ppm',
  },
  {
    gas:           'Methane',
    formula:       'CH₄',
    preIndustrial: '720 ppb',
    current:       '1,935.72 ppb (2025, prelim.)',
    gwp100:        28.5,
    gwp100Display: '27–30 (AR6)',
    lifetime:      '~11.8 years',
    lifetimeSortKey: 11.8,
    concPpm:       1.93572,
    unit:          'ppb',
  },
  {
    gas:           'Nitrous oxide',
    formula:       'N₂O',
    preIndustrial: '270 ppb',
    current:       '338.86 ppb (2025, prelim.)',
    gwp100:        273,
    gwp100Display: '273',
    lifetime:      '~109–114 years',
    lifetimeSortKey: 111,
    concPpm:       0.33886,
    unit:          'ppb',
  },
  {
    gas:           'HFC-134a',
    formula:       'C₂H₂F₄',
    preIndustrial: '0 (synthetic gas)',
    current:       '~100 ppt (~0.0001 ppm)',
    gwp100:        1530,
    gwp100Display: '1,530',
    lifetime:      '~14 years',
    lifetimeSortKey: 14,
    concPpm:       0.0000001,
    unit:          'ppt',
  },
  {
    gas:           'HFC-23',
    formula:       'CHF₃',
    preIndustrial: '0 (synthetic gas)',
    current:       '~32 ppt (~0.000032 ppm)',
    gwp100:        14600,
    gwp100Display: '14,600',
    lifetime:      '~228 years',
    lifetimeSortKey: 228,
    concPpm:       0.000000032,
    unit:          'ppt',
  },
  {
    gas:           'Sulphur hexafluoride',
    formula:       'SF₆',
    preIndustrial: '0 (synthetic gas)',
    current:       '~12.24 ppt (2025, NOAA)',
    gwp100:        23500,
    gwp100Display: '23,500 (AR6)',
    lifetime:      '~3,200 years',
    lifetimeSortKey: 3200,
    concPpm:       0.0000000122,
    unit:          'ppt',
  },
]

const SORT_MODES = [
  { id: 'conc',     label: 'Highest concentration' },
  { id: 'gwp',      label: 'Highest GWP-100'       },
  { id: 'lifetime', label: 'Longest lifetime'       },
  { id: 'default',  label: 'Default order'          },
]

export default function GHGComparisonTable() {
  const [sortMode, setSortMode] = useState('default')

  const sorted = [...GAS_DATA].sort((a, b) => {
    if (sortMode === 'conc')     return b.concPpm - a.concPpm
    if (sortMode === 'gwp')      return b.gwp100  - a.gwp100
    if (sortMode === 'lifetime') return b.lifetimeSortKey - a.lifetimeSortKey
    return 0
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {SORT_MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setSortMode(m.id)}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              border: '2px solid #1F4E79',
              background: sortMode === m.id ? '#1F4E79' : 'transparent',
              color: sortMode === m.id ? '#fff' : '#1F4E79',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: sortMode === m.id ? 600 : 400,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: 'white' }}>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Greenhouse gas</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Formula</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Pre-industrial conc. (~1750)</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>2023–2025 conc. (approx.)</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>GWP-100 (IPCC AR6)</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Atmospheric lifetime</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((g, i) => (
              <tr key={g.formula} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '0.5rem 0.75rem' }}><strong>{g.gas}</strong></td>
                <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace' }}>{g.formula}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{g.preIndustrial}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{g.current}</td>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', color: g.gwp100 > 1000 ? '#c0392b' : 'inherit' }}>{g.gwp100Display}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{g.lifetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
        Data sources: GWP-100 values from IPCC AR6 WGI Chapter 7 (2021). Concentrations: NOAA Global Monitoring Laboratory (2025, preliminary for CH₄, N₂O, SF₆); WMO Greenhouse Gas Bulletin. Pre-industrial values: Antarctic ice core records. Note on units: ppm = parts per million; ppb = parts per billion; ppt = parts per trillion. 1 ppm = 1,000 ppb = 1,000,000 ppt.
      </p>
    </div>
  )
}
