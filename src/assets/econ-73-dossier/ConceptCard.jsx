import { VisualProductive, VisualSocialCost, VisualTradeoff, VisualInnovation } from './visuals.jsx'
import s from './ConceptCard.module.css'

// Visual components keyed by concept.visual string.
// Kept here so the shell has no knowledge of dossier-specific visuals.
const CONCEPT_VISUALS = {
  productive:    VisualProductive,
  'social-cost': VisualSocialCost,
  tradeoff:      VisualTradeoff,
  innovation:    VisualInnovation,
}

/**
 * ConceptCard — dossier-specific concept body renderer.
 *
 * Renders the content blocks used by the economics toolkit concepts:
 * summary paragraph, keyword chips, definition/condition/example/judgement
 * cards, reason cards, a relevance table, and an optional inline visual.
 *
 * Receives a single `concept` prop (the concept object from data.js / shell.config.js).
 * Registered as config.conceptComponent so ConceptsModal stays content-agnostic.
 */
export default function ConceptCard({ concept }) {
  const Visual = concept.visual ? CONCEPT_VISUALS[concept.visual] : null

  return (
    <>
      {concept.summary && (
        <p className={s.summary}>{concept.summary}</p>
      )}

      {concept.chips?.length > 0 && (
        <div className={s.chips}>
          {concept.chips.map(chip => (
            <span key={chip} className={s.chip}>{chip}</span>
          ))}
        </div>
      )}

      {concept.cards?.length > 0 && (
        <div className={s.cardGrid}>
          {concept.cards.map((card, i) => (
            <div key={i} className={`${s.card} ${s[card.type] ?? ''}`}>
              <span className={s.cardLabel}>{card.label}</span>
              <p className={s.cardText}>{card.text}</p>
            </div>
          ))}
        </div>
      )}

      {concept.reasons?.length > 0 && (
        <div className={s.reasonGrid}>
          {concept.reasons.map((r, i) => (
            <div key={i} className={s.reasonCard}>
              <div className={s.reasonTitle}>{r.title}</div>
              <p className={s.reasonText}>{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {concept.table && (
        <div className={s.tableWrap}>
          <table className={s.table}>
            {concept.table.headers?.length > 0 && (
              <thead>
                <tr>
                  {concept.table.headers.map((h, i) => (
                    <th key={i} className={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {concept.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className={s.td}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Visual && (
        <div className={s.visual}>
          <Visual />
        </div>
      )}
    </>
  )
}
