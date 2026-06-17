import { EVIDENCE_STARTER_CARDS } from '../global-warming/index.jsx'

function Section({ label, color, italic, children }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: '18px' }}>
      <span style={{
        display: 'block', fontSize: '10px', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color, marginBottom: '7px',
      }}>
        {label}
      </span>
      <p style={{
        margin: 0, fontSize: '0.95rem', lineHeight: 1.7,
        color: 'var(--lab-ink-mid)', fontStyle: italic ? 'italic' : 'normal',
      }}>
        {children}
      </p>
    </div>
  )
}

export default function CardStage({ evidenceId }) {
  const card = EVIDENCE_STARTER_CARDS.find(c => c.id === evidenceId)
  if (!card) return null

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={{
          display: 'inline-block', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--lab-accent)',
          background: 'var(--lab-accent-subtle, rgba(192,57,43,0.06))',
          padding: '4px 10px', borderRadius: '4px', marginBottom: '10px',
        }}>
          {card.type}
        </span>
        <h2 style={{
          fontSize: '1.25rem', fontWeight: 700, color: 'var(--lab-ink)',
          margin: 0, lineHeight: 1.35,
        }}>
          {card.title}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <Section label="Observable" color="var(--lab-accent, #c0392b)">
          {card.observable}
        </Section>
        <Section label="Limitation affecting confidence" color="#b7770d">
          {card.limitation}
        </Section>
        <Section label="Guiding question" color="#1a5276" italic>
          {card.question}
        </Section>
      </div>
    </div>
  )
}
