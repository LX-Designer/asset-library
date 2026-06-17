import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { EVIDENCE_CHRONOLOGY } from '../global-warming/index.jsx'
import ChronologyOverlay from './ChronologyOverlay.jsx'

export default function ChronologyTab() {
  const [open, setOpen] = useState(false)
  const openOverlay  = useCallback(() => setOpen(true),  [])
  const closeOverlay = useCallback(() => setOpen(false), [])

  return (
    <>
      <div style={{ padding: '10px 12px', overflowY: 'auto', height: '100%' }}>
        <button
          onClick={openOverlay}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '10px 12px', marginBottom: '10px',
            borderRadius: '7px', cursor: 'pointer', textAlign: 'left',
            border: '1px solid var(--lab-accent)',
            background: 'var(--lab-accent-subtle, rgba(192,57,43,0.05))',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--lab-accent)', marginBottom: '1px' }}>
              Expand timeline
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--lab-ink-mid)', lineHeight: 1.3 }}>
              {EVIDENCE_CHRONOLOGY.length} developments · {EVIDENCE_CHRONOLOGY[0].year}–{EVIDENCE_CHRONOLOGY[EVIDENCE_CHRONOLOGY.length - 1].year}
            </div>
          </div>
          <span style={{ fontSize: '16px', color: 'var(--lab-accent)', marginLeft: '8px' }}>↗</span>
        </button>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {EVIDENCE_CHRONOLOGY.map(e => (
            <li
              key={e.year}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr',
                gap: '8px',
                padding: '8px 0',
                borderBottom: '1px solid var(--lab-rule-light)',
              }}
            >
              <strong style={{ color: 'var(--lab-accent)', fontSize: '11px', paddingTop: '1px' }}>{e.year}</strong>
              <span style={{ fontSize: '11px', color: 'var(--lab-ink-mid)', lineHeight: 1.45 }}>{e.event}</span>
            </li>
          ))}
        </ul>
      </div>

      {open && createPortal(
        <ChronologyOverlay isOpen={open} onClose={closeOverlay} />,
        document.body
      )}
    </>
  )
}
