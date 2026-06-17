import { useEffect, useRef, useState } from 'react'
import s from './EvidenceViewer.module.css'

export default function EvidenceViewer({
  documents = [],
  EvidenceComponent,
  activeId,
  onNavigate,
  onClose,
  isOpen,
  visitedIds,
  dossierLabel = 'Evidence dossier',
}) {
  const closeRef = useRef(null)

  // Scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus close button when opened
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') { onClose(); return }
      const idx = documents.findIndex(d => d.id === activeId)
      if (e.key === 'ArrowRight' && idx < documents.length - 1) {
        onNavigate(documents[idx + 1].id)
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        onNavigate(documents[idx - 1].id)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, activeId, documents, onNavigate, onClose])

  if (!isOpen || !activeId) return null

  const activeIndex = documents.findIndex(d => d.id === activeId)
  const activeDoc   = documents[activeIndex]
  const canPrev     = activeIndex > 0
  const canNext     = activeIndex < documents.length - 1

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label={activeDoc?.title ?? 'Evidence'}>
      <div className={s.backdrop} onClick={onClose} aria-hidden="true" />

      <div className={s.viewer}>
        {/* ── Header ── */}
        <div className={s.header}>
          <div>
            <span className={s.eyebrow}>{dossierLabel} · {activeIndex + 1} of {documents.length}</span>
            <h2 className={s.title}>{activeDoc?.title}</h2>
          </div>
          <button ref={closeRef} className={s.closeBtn} onClick={onClose} aria-label="Close evidence viewer">
            ✕
          </button>
        </div>

        {/* ── Stage ── */}
        <div className={s.stage}>
          <div className={s.stageInner}>
            {EvidenceComponent && <EvidenceComponent evidenceId={activeId} />}
          </div>
        </div>

        {/* ── Filmstrip ── */}
        {documents.length > 1 && (
          <div className={s.filmstrip}>
            <button
              className={`${s.filmArrow} ${!canPrev ? s.filmArrowDisabled : ''}`}
              onClick={() => canPrev && onNavigate(documents[activeIndex - 1].id)}
              aria-label="Previous evidence item"
              disabled={!canPrev}
            >
              ‹
            </button>

            <div className={s.filmItems} role="tablist" aria-label="Evidence collection">
              {documents.map((doc, i) => {
                const isActive  = doc.id === activeId
                const isVisited = visitedIds?.has(doc.id)
                return (
                  <button
                    key={doc.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`${s.filmItem} ${isActive ? s.filmItemActive : ''} ${isVisited && !isActive ? s.filmItemVisited : ''}`}
                    onClick={() => !isActive && onNavigate(doc.id)}
                  >
                    <span className={s.filmNum}>{i + 1}</span>
                    <span className={s.filmLabel}>{doc.label}</span>
                    {isVisited && !isActive && <span className={s.filmDot} aria-hidden="true" />}
                  </button>
                )
              })}
            </div>

            <button
              className={`${s.filmArrow} ${!canNext ? s.filmArrowDisabled : ''}`}
              onClick={() => canNext && onNavigate(documents[activeIndex + 1].id)}
              aria-label="Next evidence item"
              disabled={!canNext}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
