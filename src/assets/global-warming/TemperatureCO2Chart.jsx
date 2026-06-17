import React, { useState } from 'react'
import {
  ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Label,
  ResponsiveContainer, Legend, ReferenceArea,
} from 'recharts'

const data = [
  { year: 1960, temp: -0.03, co2: 316.91 },
  { year: 1965, temp: -0.11, co2: 320.04 },
  { year: 1970, temp:  0.03, co2: 325.68 },
  { year: 1975, temp: -0.01, co2: 331.13 },
  { year: 1980, temp:  0.26, co2: 338.76 },
  { year: 1985, temp:  0.12, co2: 346.35 },
  { year: 1990, temp:  0.45, co2: 354.45 },
  { year: 1995, temp:  0.45, co2: 360.97 },
  { year: 2000, temp:  0.39, co2: 369.71 },
  { year: 2005, temp:  0.68, co2: 379.98 },
  { year: 2010, temp:  0.73, co2: 390.10 },
  { year: 2015, temp:  0.90, co2: 401.01 },
  { year: 2020, temp:  1.01, co2: 414.21 },
  { year: 2025, temp:  1.19, co2: 427.35 },
]

const ENSO_BANDS = [
  { x1: 1982, x2: 1983, label: 'El Niño 1982–83' },
  { x1: 1997, x2: 1998, label: 'El Niño 1997–98' },
  { x1: 2015, x2: 2016, label: 'El Niño 2015–16' },
  { x1: 2023, x2: 2024, label: 'El Niño 2023'    },
]

const VOLCANIC_EVENTS = [
  { year: 1963, label: 'Agung −0.3 °C',     color: '#7D3C98' },
  { year: 1982, label: 'El Chichón −0.3 °C', color: '#7D3C98' },
  { year: 1991, label: 'Pinatubo −0.5 °C',  color: '#7D3C98' },
]

export default function TemperatureCO2Chart() {
  const [showTemp,     setShowTemp]     = useState(true)
  const [showCO2,      setShowCO2]      = useState(true)
  const [showVolcanic, setShowVolcanic] = useState(false)
  const [showENSO,     setShowENSO]     = useState(false)
  const [showSolar,    setShowSolar]    = useState(false)

  return (
    <figure style={{ margin: '2rem 0' }}>
      {/* Toggle controls */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {[
          { label: 'Temperature',    active: showTemp,     toggle: () => setShowTemp(v => !v),     colour: '#1F4E79' },
          { label: 'CO₂',            active: showCO2,      toggle: () => setShowCO2(v => !v),      colour: '#C55A11' },
          { label: 'Volcanic events',active: showVolcanic, toggle: () => setShowVolcanic(v => !v), colour: '#7D3C98' },
          { label: 'ENSO (El Niño)', active: showENSO,     toggle: () => setShowENSO(v => !v),     colour: '#E67E22' },
          { label: 'Solar note',     active: showSolar,    toggle: () => setShowSolar(v => !v),    colour: '#888' },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.toggle}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              border: `2px solid ${btn.colour}`,
              background: btn.active ? btn.colour : 'transparent',
              color: btn.active ? '#fff' : btn.colour,
              cursor: 'pointer',
              fontWeight: btn.active ? 600 : 400,
              fontSize: '0.85rem',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Solar note card */}
      {showSolar && (
        <div style={{ background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
          <strong>Solar output (TSI), 1978–2025:</strong> No statistically significant upward trend has been detected across the satellite era. TSI varies by approximately 1–2 W/m² (~0.1%) across the 11-year solar cycle. Solar cycle 24 (2008–2019) was one of the weakest on record. Net solar forcing since 1750: approximately +0.05 W/m² (IPCC AR6).
        </div>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 60, bottom: 40, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="year"
            type="number"
            domain={[1958, 2026]}
            tickCount={8}
            label={{ value: 'Year', position: 'insideBottom', offset: -10, fontSize: 13 }}
          />
          <YAxis
            yAxisId="left"
            domain={[-0.3, 1.4]}
            tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(1)}`}
            label={{ value: 'Temperature anomaly (°C)', angle: -90, position: 'insideLeft', offset: -10, fontSize: 12 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[310, 435]}
            label={{ value: 'CO₂ (ppm)', angle: 90, position: 'insideRight', offset: 10, fontSize: 12 }}
          />
          <Tooltip
            formatter={(val, name) => {
              if (name === 'Temperature anomaly') return [`${val > 0 ? '+' : ''}${val.toFixed(2)} °C`, name]
              if (name === 'CO₂ concentration')  return [`${val.toFixed(2)} ppm`, name]
              return [val, name]
            }}
            labelFormatter={y => `Year: ${y}`}
          />
          <ReferenceLine yAxisId="left" y={0} stroke="#666" strokeDasharray="4 2">
            <Label value="1951–1980 avg" position="insideTopLeft" fontSize={10} fill="#666" />
          </ReferenceLine>

          {/* ENSO bands */}
          {showENSO && ENSO_BANDS.map(b => (
            <ReferenceArea
              key={b.label}
              yAxisId="left"
              x1={b.x1} x2={b.x2}
              fill="#E67E22" fillOpacity={0.15}
              label={{ value: b.label.replace('El Niño ', ''), position: 'insideTop', fontSize: 9, fill: '#C55A11' }}
            />
          ))}

          {/* Volcanic reference lines */}
          {showVolcanic && VOLCANIC_EVENTS.map(e => (
            <ReferenceLine
              key={e.year}
              yAxisId="left"
              x={e.year}
              stroke={e.color}
              strokeDasharray="4 2"
              label={{ value: e.label, position: 'top', fontSize: 9, fill: e.color, angle: -45 }}
            />
          ))}

          {showTemp && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              stroke="#1F4E79"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Temperature anomaly"
            />
          )}
          {showCO2 && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="co2"
              stroke="#C55A11"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="CO₂ concentration"
            />
          )}
          <Legend verticalAlign="top" height={36} />
        </ComposedChart>
      </ResponsiveContainer>
      <figcaption style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem', textAlign: 'center', maxWidth: '720px', margin: '0.5rem auto 0' }}>
        Figure 4.1  Global surface temperature anomaly (NASA GISS GISTEMP v4, left axis) and atmospheric CO₂ annual mean (NOAA Mauna Loa, right axis), 1960–2025. Use the toggle buttons to show or hide overlays for volcanic events, ENSO warm phases, and the solar output note.
      </figcaption>
    </figure>
  )
}
