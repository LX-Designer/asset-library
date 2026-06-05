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

  const ConceptComponent = config.conceptComponent ?? null

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
      titleEyebrow={concept ? `Concept ${conceptIndex + 1} of ${concepts.length}` : undefined}
      side="right"
      width={580}
      defaultHeight={680}
      initialState="closed"
      modalFirst
      floatOnly
      noTab
      accentHeader
      triggerOpen={triggerOpen}
      onClose={onClose}
      themeVars={themeVars}
    >
      {concept && ConceptComponent && (
        <div className={s.wrap}>
          <div
            className={`${s.body} ${slideDir ? s[`slide${slideDir.charAt(0).toUpperCase() + slideDir.slice(1)}`] : ''}`}
            key={activeConceptId}
            onAnimationEnd={() => setSlideDir(null)}
          >
            <ConceptComponent concept={concept} />
          </div>

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
