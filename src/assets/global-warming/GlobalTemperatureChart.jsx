import React from 'react'
import {
  ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Label,
  ResponsiveContainer, Legend,
} from 'recharts'

const annualData = [
  { year: 1880, anomalyC: -0.18 }, { year: 1890, anomalyC: -0.22 },
  { year: 1900, anomalyC: -0.09 }, { year: 1910, anomalyC: -0.40 },
  { year: 1915, anomalyC: -0.19 }, { year: 1920, anomalyC: -0.28 },
  { year: 1925, anomalyC: -0.12 }, { year: 1930, anomalyC: -0.04 },
  { year: 1935, anomalyC: -0.14 }, { year: 1940, anomalyC:  0.12 },
  { year: 1945, anomalyC:  0.09 }, { year: 1950, anomalyC: -0.17 },
  { year: 1955, anomalyC: -0.14 }, { year: 1960, anomalyC: -0.03 },
  { year: 1963, anomalyC:  0.05 }, { year: 1965, anomalyC: -0.11 },
  { year: 1970, anomalyC:  0.03 }, { year: 1975, anomalyC: -0.01 },
  { year: 1980, anomalyC:  0.26 }, { year: 1982, anomalyC:  0.12 },
  { year: 1985, anomalyC:  0.12 }, { year: 1988, anomalyC:  0.39 },
  { year: 1991, anomalyC:  0.41 }, { year: 1992, anomalyC:  0.23 },
  { year: 1993, anomalyC:  0.24 }, { year: 1995, anomalyC:  0.45 },
  { year: 1997, anomalyC:  0.46 }, { year: 1998, anomalyC:  0.63 },
  { year: 2000, anomalyC:  0.39 }, { year: 2005, anomalyC:  0.68 },
  { year: 2010, anomalyC:  0.73 }, { year: 2012, anomalyC:  0.65 },
  { year: 2015, anomalyC:  0.90 }, { year: 2016, anomalyC:  1.01 },
  { year: 2018, anomalyC:  0.85 }, { year: 2020, anomalyC:  1.01 },
  { year: 2021, anomalyC:  0.85 }, { year: 2022, anomalyC:  0.89 },
  { year: 2023, anomalyC:  1.17 }, { year: 2024, anomalyC:  1.29 },
  { year: 2025, anomalyC:  1.19 },
]

function rollingAvg(data, window = 10) {
  return data.map((d, i) => {
    const half = Math.floor(window / 2)
    const start = Math.max(0, i - half)
    const end   = Math.min(data.length - 1, i + half)
    const slice = data.slice(start, end + 1)
    const avg   = slice.reduce((s, x) => s + x.anomalyC, 0) / slice.length
    return { ...d, rolling: parseFloat(avg.toFixed(3)) }
  })
}

const chartData = rollingAvg(annualData)

export default function GlobalTemperatureChart() {
  return (
    <figure style={{ margin: '2rem 0' }}>
      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 40, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="year"
            type="number"
            domain={[1880, 2026]}
            tickCount={8}
            label={{ value: 'Year', position: 'insideBottom', offset: -10, fontSize: 13 }}
          />
          <YAxis
            domain={[-0.6, 1.4]}
            tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(2)}`}
            label={{ value: 'Temperature anomaly (°C)', angle: -90, position: 'insideLeft', offset: -10, fontSize: 13 }}
          />
          <Tooltip
            formatter={(val, name) => [
              `${val > 0 ? '+' : ''}${val.toFixed(2)} °C`,
              name === 'anomalyC' ? 'Annual mean' : '10-yr average',
            ]}
            labelFormatter={y => `Year: ${y}`}
          />
          <ReferenceLine y={0} stroke="#666" strokeDasharray="4 2">
            <Label value="1951–1980 average" position="right" fontSize={11} fill="#666" />
          </ReferenceLine>
          <Line
            type="monotone"
            dataKey="anomalyC"
            stroke="#1F4E79"
            strokeWidth={1}
            dot={false}
            name="Annual mean"
          />
          <Line
            type="monotone"
            dataKey="rolling"
            stroke="#C55A11"
            strokeWidth={2.5}
            dot={false}
            name="10-year rolling average"
          />
          <Legend verticalAlign="top" height={36} />
        </ComposedChart>
      </ResponsiveContainer>
      <figcaption style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem', textAlign: 'center', maxWidth: '720px', margin: '0.5rem auto 0' }}>
        Figure 3.1  Global mean surface temperature anomaly (°C) relative to 1951–1980 average, 1880–2025 (NASA GISS GISTEMP v4). Orange line: 10-year rolling average.
      </figcaption>
    </figure>
  )
}
