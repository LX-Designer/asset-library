import React from 'react'
import { EVIDENCE_CHRONOLOGY } from '../global-warming/index.jsx'

export default function ChronologyTab() {
  return (
    <div style={{ padding: '10px 12px', overflowY: 'auto', height: '100%' }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {EVIDENCE_CHRONOLOGY.map(e => (
          <li
            key={e.year}
            style={{
              display: 'grid',
              gridTemplateColumns: '44px 1fr',
              gap: '8px',
              padding: '9px 0',
              borderBottom: '1px solid var(--lab-rule-light)',
            }}
          >
            <strong style={{ color: 'var(--lab-accent)', fontSize: '12px' }}>{e.year}</strong>
            <span style={{ fontSize: '11.5px', color: 'var(--lab-ink-mid)', lineHeight: 1.45 }}>{e.event}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
