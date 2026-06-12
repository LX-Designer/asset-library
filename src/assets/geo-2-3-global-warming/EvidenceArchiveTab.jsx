import s from './EvidenceArchiveTab.module.css'

const SECTION_ORDER = [
  { id: 's-proxy',         label: 'Proxy Evidence',           color: '#065F46' },
  { id: 's-instrumental',  label: 'Instrumental & Physical',  color: '#1E40AF' },
  { id: 's-greenhouse',    label: 'Greenhouse Gases',         color: '#7C2D12' },
  { id: 's-natural',       label: 'Natural Factors',          color: '#92400E' },
  { id: 's-anthropogenic', label: 'Anthropogenic Factors',    color: '#1E3A5F' },
  { id: 's-comparison',    label: 'Comparison & Attribution', color: '#4C1D95' },
]

export default function EvidenceArchiveTab({ evidenceCards, onOpenCard }) {
  return (
    <div className={s.archive}>
      <div className={s.header}>
        <div className={s.title}>Evidence Archive</div>
        <div className={s.subtitle}>{evidenceCards.length} pieces of evidence · click any to read</div>
      </div>

      {SECTION_ORDER.map(section => {
        const cards = evidenceCards.filter(c => c.section === section.id)
        if (!cards.length) return null
        return (
          <details key={section.id} className={s.group} open>
            <summary className={s.groupLabel}>
              <span className={s.dot} style={{ background: section.color }} />
              <span style={{ color: section.color }}>{section.label}</span>
              <span className={s.count}>{cards.length}</span>
            </summary>
            <ul className={s.list}>
              {cards.map(card => (
                <li key={card.id}>
                  <button className={s.cardBtn} onClick={() => onOpenCard(card.id)}>
                    <span className={s.cardId}>{card.id.toUpperCase()}</span>
                    <span className={s.cardTitle}>{card.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )
      })}
    </div>
  )
}
