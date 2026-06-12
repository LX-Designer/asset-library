import { useEffect, useCallback } from 'react'
import s from './EvidenceCardOverlay.module.css'

const SECTION_META = {
  's-proxy':         { label: 'Proxy Evidence',           color: '#065F46', bg: '#ECFDF5' },
  's-instrumental':  { label: 'Instrumental & Physical',  color: '#1E40AF', bg: '#DBEAFE' },
  's-greenhouse':    { label: 'Greenhouse Gases',         color: '#7C2D12', bg: '#FEF3C7' },
  's-natural':       { label: 'Natural Factors',          color: '#92400E', bg: '#FFFBEB' },
  's-anthropogenic': { label: 'Anthropogenic Factors',    color: '#1E3A5F', bg: '#EBF1F9' },
  's-comparison':    { label: 'Comparison & Attribution', color: '#4C1D95', bg: '#F5F3FF' },
}

export default function EvidenceCardOverlay({ cards, activeId, onNavigate, onClose }) {
  const idx  = cards.findIndex(c => c.id === activeId)
  const card = cards[idx]

  const goPrev = useCallback(() => { if (idx > 0) onNavigate(cards[idx - 1].id) }, [idx, cards, onNavigate])
  const goNext = useCallback(() => { if (idx < cards.length - 1) onNavigate(cards[idx + 1].id) }, [idx, cards, onNavigate])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, goPrev, goNext])

  if (!card) return null

  const meta = SECTION_META[card.section] ?? { label: card.section, color: '#1E3A5F', bg: '#EBF1F9' }

  return (
    <div
      className={s.backdrop}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={card.title}
    >
      <div className={s.panel}>

        {/* ── Header (colour-shifts per section) ── */}
        <div
          className={s.header}
          style={{ background: meta.bg, borderBottom: `2px solid ${meta.color}` }}
        >
          <span className={s.eyebrow} style={{ color: meta.color }}>{meta.label}</span>
          <div className={s.headerControls}>
            <span className={s.counter}>{idx + 1} of {cards.length}</span>
            <button className={s.navBtn} onClick={goPrev} disabled={idx === 0} aria-label="Previous evidence card">←</button>
            <button className={s.navBtn} onClick={goNext} disabled={idx === cards.length - 1} aria-label="Next evidence card">→</button>
            <button className={s.closeBtn} onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className={s.body}>
          <div className={s.cardMeta}>
            <span className={s.cardId}>{card.id.toUpperCase()}</span>
            <span className={s.cardType}>{card.type}</span>
          </div>
          {card.timescale && <div className={s.cardTimescale}>{card.timescale}</div>}
          <h2 className={s.cardTitle}>{card.title}</h2>

          {card.shows && (
            <div className={s.showsBlock}>
              <div className={s.blockLabel}>What this shows</div>
              <p className={s.blockText}>{card.shows}</p>
            </div>
          )}

          {card.notProve && (
            <details className={s.notProve}>
              <summary>What this does NOT prove</summary>
              <p className={s.notProveText}>{card.notProve}</p>
            </details>
          )}

          {card.inquiry && (
            <div
              className={s.inquiryBlock}
              style={{ borderLeft: `3px solid ${meta.color}`, background: meta.bg }}
            >
              <div className={s.blockLabel} style={{ color: meta.color }}>Inquiry link</div>
              <p className={s.inquiryText}>{card.inquiry}</p>
            </div>
          )}
        </div>

        {/* ── Footer nav ── */}
        <div className={s.footer}>
          <button className={s.footerBtn} onClick={goPrev} disabled={idx === 0}>← Previous</button>
          <button className={s.footerBtn} onClick={goNext} disabled={idx === cards.length - 1}>Next →</button>
        </div>

      </div>
    </div>
  )
}
