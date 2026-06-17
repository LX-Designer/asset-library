import React from 'react'
import { EVIDENCE_STARTER_CARDS, EvidenceStarterCard } from '../global-warming/index.jsx'

export default function CardsTab() {
  return (
    <div style={{ padding: '10px 12px', overflowY: 'auto', height: '100%' }}>
      <p style={{ fontSize: '11px', color: 'var(--lab-ink-light)', margin: '0 0 10px', lineHeight: 1.4 }}>
        Thirteen evidence types. Each card describes what is observable, the
        limitations affecting confidence, and a guiding question.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {EVIDENCE_STARTER_CARDS.map(c => <EvidenceStarterCard key={c.id} card={c} />)}
      </div>
    </div>
  )
}
