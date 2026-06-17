export default function EvidenceTab({ documents = [], onOpenEvidence, visitedIds }) {
  return (
    <div style={{ padding: '10px 12px', overflowY: 'auto', height: '100%' }}>
      <p style={{ fontSize: '11px', color: 'var(--lab-ink-light)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Six charts and diagrams. Click any item to open the evidence viewer.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {documents.map((doc, i) => {
          const visited = visitedIds?.has(doc.id)
          return (
            <button
              key={doc.id}
              onClick={() => onOpenEvidence?.(doc.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: '100%', textAlign: 'left', padding: '8px 10px',
                borderRadius: '6px', cursor: 'pointer', transition: 'all 0.12s',
                border: `1px solid ${visited ? 'var(--lab-accent)' : 'var(--lab-rule, #e5e7eb)'}`,
                background: visited ? 'var(--lab-accent-subtle, rgba(192,57,43,0.05))' : 'var(--lab-surface, #fff)',
              }}
            >
              <span style={{
                flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700,
                background: visited ? 'var(--lab-accent)' : 'var(--lab-bg, #f9f9f9)',
                color: visited ? '#fff' : 'var(--lab-ink-light)',
                border: `1px solid ${visited ? 'var(--lab-accent)' : 'var(--lab-rule, #e5e7eb)'}`,
              }}>
                {i + 1}
              </span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--lab-ink)', marginBottom: '1px' }}>
                  {doc.label}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--lab-ink-light)', lineHeight: 1.3 }}>
                  {doc.title}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
