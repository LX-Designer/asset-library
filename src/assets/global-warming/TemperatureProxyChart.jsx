import React from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Label,
  ResponsiveContainer, Legend,
} from 'recharts'

const proxyData = [
  {y:1,a:-0.15},{y:50,a:-0.12},{y:100,a:-0.10},{y:150,a:-0.08},{y:200,a:-0.08},
  {y:250,a:-0.12},{y:300,a:-0.18},{y:350,a:-0.22},{y:400,a:-0.25},{y:450,a:-0.20},
  {y:500,a:-0.15},{y:550,a:-0.10},{y:600,a:-0.08},{y:650,a:-0.05},{y:700,a:-0.02},
  {y:750,a:0.02},{y:800,a:0.05},{y:850,a:0.08},{y:900,a:0.10},{y:950,a:0.15},
  {y:1000,a:0.20},{y:1050,a:0.18},{y:1100,a:0.15},{y:1150,a:0.10},{y:1200,a:0.05},
  {y:1250,a:-0.05},{y:1300,a:-0.18},{y:1350,a:-0.30},{y:1400,a:-0.40},
  {y:1450,a:-0.45},{y:1500,a:-0.42},{y:1550,a:-0.48},{y:1600,a:-0.52},
  {y:1650,a:-0.50},{y:1700,a:-0.42},{y:1750,a:-0.35},{y:1800,a:-0.28},{y:1849,a:-0.20},
].map(d => ({ y: d.y, proxy: d.a, hi: d.a + 0.20, lo: d.a - 0.20 }))

const instrumentalData = [
  {y:1850,a:-0.36},{y:1860,a:-0.37},{y:1870,a:-0.30},{y:1880,a:-0.31},
  {y:1890,a:-0.28},{y:1900,a:-0.24},{y:1910,a:-0.53},{y:1920,a:-0.43},
  {y:1930,a:-0.25},{y:1940,a:-0.07},{y:1950,a:-0.33},{y:1960,a:-0.17},
  {y:1970,a:-0.13},{y:1980,a:0.10},{y:1990,a:0.28},{y:2000,a:0.26},
  {y:2005,a:0.46},{y:2010,a:0.56},{y:2015,a:0.74},{y:2020,a:0.86},
  {y:2023,a:1.01},
].map(d => ({ y: d.y, instrumental: d.a }))

const allYears = {}
proxyData.forEach(d => { allYears[d.y] = { ...allYears[d.y], ...d } })
instrumentalData.forEach(d => { allYears[d.y] = { ...allYears[d.y], ...d } })
const chartData = Object.values(allYears).sort((a, b) => a.y - b.y)

export default function TemperatureProxyChart() {
  return (
    <figure style={{ margin: '2rem 0' }}>
      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 40, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="y"
            type="number"
            domain={[0, 2030]}
            tickCount={10}
            label={{ value: 'Year (CE)', position: 'insideBottom', offset: -10, fontSize: 13 }}
          />
          <YAxis
            domain={[-1.2, 1.5]}
            tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(2)}`}
            label={{ value: 'Temperature anomaly (°C)', angle: -90, position: 'insideLeft', offset: -10, fontSize: 13 }}
          />
          <Tooltip
            formatter={(val, name) => {
              if (name === 'proxy') return [`${val > 0 ? '+' : ''}${val.toFixed(2)} °C`, 'Proxy reconstruction']
              if (name === 'instrumental') return [`${val > 0 ? '+' : ''}${val.toFixed(2)} °C`, 'Instrumental (HadCRUT5)']
              return [val, name]
            }}
            labelFormatter={y => `Year: ${y} CE`}
          />
          {/* Uncertainty band */}
          <Area
            type="monotone"
            dataKey="hi"
            stroke="none"
            fill="#888888"
            fillOpacity={0.15}
            legendType="none"
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="lo"
            stroke="none"
            fill="#ffffff"
            fillOpacity={1}
            legendType="none"
            connectNulls
          />
          {/* Proxy line */}
          <Line
            type="monotone"
            dataKey="proxy"
            stroke="#888888"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            name="Proxy reconstruction (PAGES 2k)"
            connectNulls
          />
          {/* Instrumental line */}
          <Line
            type="monotone"
            dataKey="instrumental"
            stroke="#1F4E79"
            strokeWidth={2}
            dot={false}
            name="Instrumental record (HadCRUT5)"
            connectNulls
          />
          {/* Baseline */}
          <ReferenceLine y={0} stroke="#666" strokeDasharray="4 2">
            <Label value="1961–1990 average" position="right" fontSize={11} fill="#666" />
          </ReferenceLine>
          {/* Start of instrumental record */}
          <ReferenceLine x={1850} stroke="#c0392b" strokeDasharray="3 3">
            <Label value="Start of instrumental record" position="top" fontSize={10} fill="#c0392b" angle={-90} />
          </ReferenceLine>
          <Legend verticalAlign="top" height={36} />
        </ComposedChart>
      </ResponsiveContainer>
      <figcaption style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem', textAlign: 'center', maxWidth: '720px', margin: '0.5rem auto 0' }}>
        Figure 2.1  Northern Hemisphere surface temperature anomaly (°C), 1–2023 CE, relative to the 1961–1990 mean. Grey dashed line with shaded band: multi-proxy reconstruction (PAGES 2k Consortium, 2019). Dark blue solid line: HadCRUT5 instrumental record (from 1850 CE). Shaded band = ±0.20 °C uncertainty range.
      </figcaption>
    </figure>
  )
}
