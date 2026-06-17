import React from 'react'
import { EVIDENCE_WEIGHTING, WeightingCard } from '../global-warming/index.jsx'
import Term from './Term.jsx'

const note = {
  background: '#f0f4f8',
  border: '1px solid #c8d6e0',
  borderRadius: '6px',
  padding: '10px 14px',
  margin: '12px 0 0',
  fontSize: '13px',
  lineHeight: 1.55,
}
const th = { padding: '6px 10px', textAlign: 'left', background: '#1F4E79', color: 'white' }
const td = { padding: '6px 10px', borderBottom: '1px solid #eee', verticalAlign: 'top' }
const tableWrap = { overflowX: 'auto', margin: '10px 0 0' }
const table = { width: '100%', borderCollapse: 'collapse', fontSize: '13px' }

function P({ children }) {
  return <p style={{ margin: '0 0 10px', lineHeight: 1.6 }}>{children}</p>
}

export function Act1Background() {
  return (
    <div>
      <P>
        The global mean surface temperature (GMST) record combines measurements from
        thousands of land stations and ocean buoys. Four independent research groups
        (NASA GISS, NOAA, Hadley Centre/CRU, Berkeley Earth) each produce their own
        dataset using different methodologies — yet their long-term trends closely agree.
      </P>
      <P>
        The record shows warming of approximately +1.1–1.2 °C above the pre-industrial
        (1850–1900) average by the 2011–2020 decade, and the rate of warming has
        increased. It is not a smooth line: year-to-year variability from <Term term="ENSO">El Niño events</Term>{' '}
        and volcanic eruptions sits on top of the underlying upward trend.
      </P>
      <P>
        Open the <strong>Proxy vs instrumental record</strong> chart to compare the
        instrumental record with a 2,000-year proxy reconstruction.
      </P>
    </div>
  )
}

export function Act2Background() {
  return (
    <div>
      <P>
        Instrumental records only extend back to about 1850, with global coverage
        improving after 1950. To judge whether recent warming is unusual over the longer
        term, scientists use <Term term="Proxy record"><strong>proxy records</strong></Term> — natural archives that preserve
        indirect signals of past climate.
      </P>
      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr><th style={th}>Proxy type</th><th style={th}>How it records climate</th><th style={th}>Resolution</th></tr>
          </thead>
          <tbody>
            {[
              ['Tree rings', 'Ring width and density reflect growing-season temperature and precipitation', 'Annual'],
              ['Ice cores', 'Trapped air bubbles preserve CO₂; oxygen isotopes record temperature', 'Annual–decadal'],
              ['Ocean sediment cores', 'Foraminifera shell chemistry reflects ocean temperature and pH', 'Centennial–millennial'],
              ['Coral skeletons', 'Sr/Ca ratios and growth bands reflect sea-surface temperature', 'Seasonal–annual'],
              ['Speleothems', 'Oxygen isotopes in cave deposits record rainfall and temperature', 'Annual–decadal'],
              ['Pollen records', 'Plant species composition reflects temperature and moisture', 'Decadal–centennial'],
            ].map(([t, h, r]) => (
              <tr key={t}><td style={td}><strong>{t}</strong></td><td style={td}>{h}</td><td style={td}>{r}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={note}>
        <strong>Key point:</strong> each proxy has different strengths and limitations. A
        strong reconstruction uses multiple independent proxies from different regions that
        converge on the same signal.
      </p>
    </div>
  )
}

export function Act3Background() {
  return (
    <div>
      <P>
        Temperature records alone might be questioned on methodological grounds. The power
        of the case comes from multiple <em>independent</em> evidence types all changing in
        the expected direction.
      </P>
      <P>
        <Term term="Evidence triangulation">Triangulation</Term> asks: if the hypothesis is correct, what should we observe across
        different systems? When the expected signatures appear independently in Arctic sea
        ice, glacier mass balance, sea level, ocean heat content, CO₂ concentration, and
        global temperature, the convergence substantially increases confidence. The six
        indicators you will sort are in the <strong>Cards</strong> tab on the left.
      </P>
    </div>
  )
}

export function Act4Background() {
  return (
    <div>
      <P>
        Establishing that warming has occurred is not the same as establishing its cause. A
        rigorous approach tests every plausible hypothesis against the observed pattern of
        change, and the evidence must distinguish between competing explanations.
      </P>
      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr><th style={th}>Candidate cause</th><th style={th}>What pattern would we expect?</th></tr>
          </thead>
          <tbody>
            {[
              ['Solar output increase (TSI)', 'Warming at all atmospheric levels including the stratosphere; correlated with the solar cycle'],
              ['Greenhouse gas increase', 'Stratospheric cooling + tropospheric warming; polar amplification; not correlated with the solar cycle'],
              ['Volcanic activity', 'Short-term cooling (1–3 years) after major eruptions; no long-term trend'],
              ['Internal variability (ENSO, PDO)', 'Decade-scale fluctuations around a stable mean; no persistent multi-decadal trend'],
              ['Land use / urban heat islands', 'Warming concentrated in urbanising areas; rural sites show less warming'],
            ].map(([c, p]) => (
              <tr key={c}><td style={td}><strong>{c}</strong></td><td style={td}>{p}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={note}>
        Open the <strong>Temperature vs CO₂ &amp; forcings</strong> chart to compare the
        timing of each candidate driver against the temperature record.
      </p>
    </div>
  )
}

export function Act5Background() {
  return (
    <div>
      <P>
        The Earth maintains a balance between incoming solar radiation and outgoing infrared
        (longwave) radiation. Greenhouse gases disrupt this balance by absorbing outgoing
        infrared and re-emitting it — including back towards the surface — an effect known
        as <Term term="Radiative forcing">radiative forcing</Term>.
      </P>
      <P>
        Open the <strong>Energy budget</strong> diagram to study the six marked processes
        you will label, the <strong>GHG comparison</strong> table to compare gases by
        concentration, <Term term="Global warming potential (GWP-100)">GWP-100</Term> and lifetime, and the <strong>CO₂e calculator</strong> to
        explore carbon-dioxide equivalence (including SF₆, used in the task).
      </P>
    </div>
  )
}

export function Act6Background() {
  return (
    <div>
      <P>
        Evaluating the strength of a scientific case requires more than counting evidence
        items. It requires assessing the <em>quality</em>, <em>independence</em>, and
        <em> convergence</em> of the evidence, and weighing counter-evidence and
        alternative explanations.
      </P>
      <P>
        The IPCC expresses confidence with a calibrated combination of evidence quality
        (robust/medium/limited) and agreement across lines of evidence (high/medium/low).
        Open the <strong>Global temperature</strong> and <strong>Temp vs CO₂ &amp; forcings</strong> charts
        and use the overlays for volcanic events, <Term term="ENSO">ENSO phases</Term>, and solar output.
      </P>
      <P><strong>The eight evidence tiles (A–H) you will weigh:</strong></P>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {EVIDENCE_WEIGHTING.map(item => <WeightingCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}

export function Act7Background() {
  return (
    <div>
      <P>
        A well-constructed argument has four components: a clear <strong>claim</strong> that
        directly answers the question, <strong>evidence</strong> that supports it,
        <strong> reasoning</strong> that links evidence to claim, and acknowledgement of
        <strong> counter-evidence or limitations</strong> that qualifies the conclusion.
      </P>
      <P>
        Cambridge AS Geography mark schemes reward responses that are precise (use data and
        named evidence), balanced (acknowledge limitations and uncertainty), and
        well-structured. Aim for 250–350 words of continuous prose. Every chart and the
        full evidence set remain available in the sidebar and evidence dock as you write.
      </P>
    </div>
  )
}

export default {
  'act-1': Act1Background,
  'act-2': Act2Background,
  'act-3': Act3Background,
  'act-4': Act4Background,
  'act-5': Act5Background,
  'act-6': Act6Background,
  'act-7': Act7Background,
}
