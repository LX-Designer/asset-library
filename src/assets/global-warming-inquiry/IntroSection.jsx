import React from 'react'

const OVERVIEW = [
  ['1', 'Noticing and questioning the temperature record', 'Observe → question'],
  ['2', 'Evaluating proxy evidence', 'Evaluate sources'],
  ['3', 'Triangulating multiple evidence lines', 'Synthesise evidence'],
  ['4', 'Causal mechanisms — what is driving the warming?', 'Reason causally'],
  ['5', 'The greenhouse mechanism and forcing agents', 'Analyse mechanisms'],
  ['6', 'Weighing the evidence — how convinced should we be?', 'Evaluate and judge'],
  ['7', 'Constructing a structured argument', 'Write → reflect'],
]

export default function IntroSection() {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '8px 0 20px', borderBottom: '3px solid var(--lab-accent)', marginBottom: '20px' }}>
        <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lab-ink-light)', margin: '0 0 6px' }}>
          Cambridge AS Level Geography · 2.3.1 &amp; 2.3.2
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--lab-ink)', margin: '0 0 6px' }}>
          Global Warming and Climate Change
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--lab-ink-mid)', margin: 0 }}>
          A seven-stage guided inquiry — activity-primary layout
        </p>
      </div>

      <div style={{
        background: 'var(--lab-accent-subtle, rgba(192,57,43,0.06))',
        borderLeft: '4px solid var(--lab-accent)',
        borderRadius: '0 6px 6px 0',
        padding: '14px 18px',
        marginBottom: '20px',
      }}>
        <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--lab-accent)', marginBottom: '6px' }}>
          Inquiry question
        </span>
        <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--lab-ink)', margin: 0, lineHeight: 1.5 }}>
          How convincing is the scientific evidence that recent global warming is primarily caused by human activity?
        </p>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--lab-ink-mid)', lineHeight: 1.6, margin: '0 0 18px' }}>
        Work through the seven activities below in order. Each activity opens with a short
        background you can expand, links to the relevant charts (which open in the evidence
        dock on the right), and the task itself. Reference material — evidence cards, the
        discovery timeline, the glossary, and units — lives in the sidebar on the left.
      </p>

      <h2 style={{ fontSize: '1.1rem', color: 'var(--lab-accent)', margin: '0 0 10px' }}>Lab overview</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: 'white' }}>
              <th style={{ padding: '6px 10px', textAlign: 'left' }}>Stage</th>
              <th style={{ padding: '6px 10px', textAlign: 'left' }}>Activity</th>
              <th style={{ padding: '6px 10px', textAlign: 'left' }}>Thinking move</th>
            </tr>
          </thead>
          <tbody>
            {OVERVIEW.map(([n, a, t], i) => (
              <tr key={n} style={{ background: i % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={{ padding: '6px 10px', fontWeight: 700 }}>{n}</td>
                <td style={{ padding: '6px 10px' }}>{a}</td>
                <td style={{ padding: '6px 10px', color: 'var(--lab-ink-mid)' }}>{t}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
