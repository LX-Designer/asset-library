import { useState, useCallback } from 'react'
import FloatingPanel from '../../components/FloatingPanel'
import s from './ConceptsModal.module.css'

export default function ConceptsModal({
  config,
  labId,
  activeConceptId,
  onNavigateConcept,
  onClose,
  triggerOpen,
  themeVars,
}) {
  const [slideDir, setSlideDir] = useState(null)

  const concepts = config.concepts ?? []
  const conceptIndex = activeConceptId
    ? concepts.findIndex(c => c.id === activeConceptId)
    : -1
  const concept = conceptIndex >= 0 ? concepts[conceptIndex] : null

  const navigate = useCallback((dir) => {
    const nextIndex = dir === 'forward' ? conceptIndex + 1 : conceptIndex - 1
    if (nextIndex < 0 || nextIndex >= concepts.length) return
    setSlideDir(dir === 'forward' ? 'right' : 'left')
    onNavigateConcept(concepts[nextIndex].id)
  }, [conceptIndex, concepts, onNavigateConcept])

  return (
    <FloatingPanel
      id={`${labId}-concepts`}
      title={concept?.title ?? 'Concept'}
      side="right"
      width={580}
      defaultHeight={680}
      initialState="closed"
      modalFirst
      noTab
      accentHeader
      triggerOpen={triggerOpen}
      onClose={onClose}
      themeVars={themeVars}
    >
      {concept && (
        <div className={s.wrap}>
          <div
            className={`${s.body} ${slideDir ? s[`slide${slideDir.charAt(0).toUpperCase() + slideDir.slice(1)}`] : ''}`}
            key={activeConceptId}
            onAnimationEnd={() => setSlideDir(null)}
          >
            {/* Eyebrow count — sits at the top of the scrollable body */}
            <p className={s.count}>Concept {conceptIndex + 1} of {concepts.length}</p>
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

            {concept.visual && config.conceptVisuals?.[concept.visual] && (
              <div className={s.visual}>
                {(() => { const Visual = config.conceptVisuals[concept.visual]; return <Visual /> })()}
              </div>
            )}
          </div>

          {/* Footer navigation — prev / next concept */}
          <div className={s.footer}>
            <button
              className={s.footerBtn}
              disabled={conceptIndex <= 0}
              onClick={() => navigate('backward')}
              aria-label="Previous concept"
            >
              ← {conceptIndex > 0 ? concepts[conceptIndex - 1].title : 'Previous'}
            </button>
            <button
              className={s.footerBtn}
              disabled={conceptIndex >= concepts.length - 1}
              onClick={() => navigate('forward')}
              aria-label="Next concept"
            >
              {conceptIndex < concepts.length - 1 ? concepts[conceptIndex + 1].title : 'Next'} →
            </button>
          </div>
        </div>
      )}
    </FloatingPanel>
  )
}
