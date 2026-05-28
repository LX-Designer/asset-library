import { useEffect, useRef } from 'react'
import s from './ActivityModal.module.css'

/**
 * Shared activity modal chrome.
 *
 * Handles: overlay, panel, focus trap, Escape, header (number/label, thinking
 * move, title, close button), purpose block, prompt, scaffold, evidence
 * section links, prev/next footer navigation, and "Clear this response".
 *
 * Visual theming is controlled entirely by CSS custom properties on the
 * nearest ancestor that defines them (typically the asset's root element).
 * See ActivityModal.module.css for the full --modal-* variable list and
 * their fallback values.
 *
 * Props:
 *   activityNumber   number | null    — shown as "Activity N" when set
 *   activityLabel    string           — label shown when number is null
 *   thinkingMove     string           — cognitive move label, shown in subtitle
 *   title            string           — modal h2
 *   purpose          string           — "Why this matters" text
 *   prompt           string           — main activity question
 *   scaffold         string | null    — optional italic hint
 *   evidenceSections { id, label }[]  — pre-resolved section links
 *   prevItem         { id, label } | null
 *   nextItem         { id, label } | null
 *   onClose          (nextId?) => void
 *   onScrollTo       (sectionId) => void
 *   onClear          () => void
 *   children         ReactNode        — the activity form
 */
export default function ActivityModal({
  activityNumber,
  activityLabel,
  thinkingMove,
  title,
  purpose,
  prompt,
  scaffold,
  evidenceSections = [],
  prevItem,
  nextItem,
  onClose,
  onScrollTo,
  onClear,
  children,
}) {
  const panelRef = useRef(null)

  // Focus trap + Escape
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const focusable = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    first?.focus()

    const trap = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    panel.addEventListener('keydown', trap)
    document.addEventListener('keydown', esc)
    return () => {
      panel.removeEventListener('keydown', trap)
      document.removeEventListener('keydown', esc)
    }
  }, [onClose])

  const handleScrollTo = (sectionId) => {
    onClose()
    setTimeout(() => onScrollTo(sectionId), 100)
  }

  const subtitle = activityNumber !== null
    ? `Activity ${activityNumber} · ${thinkingMove}`
    : `${activityLabel} · ${thinkingMove}`

  return (
    <div
      className={s.overlay}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className={s.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-modal-title"
        ref={panelRef}
      >
        {/* ── Header ── */}
        <div className={s.header}>
          <div className={s.subtitle}>{subtitle}</div>
          <h2 id="activity-modal-title" className={s.title}>{title}</h2>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close activity">×</button>
        </div>

        {/* ── Scrollable body ── */}
        <div className={s.body}>
          <div className={s.purpose}>
            <span className={s.purposeLabel}>Why this matters</span>
            {purpose}
          </div>

          <p className={s.prompt}>{prompt}</p>

          {scaffold && (
            <div className={s.scaffold}>{scaffold}</div>
          )}

          {evidenceSections.length > 0 && (
            <div className={s.evidenceLinks}>
              <div className={s.evidenceLabel}>Go to evidence</div>
              <div className={s.evidenceBtns}>
                {evidenceSections.map(({ id, label }) => (
                  <button
                    key={id}
                    className={s.evidenceScrollBtn}
                    onClick={() => handleScrollTo(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {children}
        </div>

        {/* ── Footer ── */}
        <div className={s.footer}>
          <button
            className={s.navBtn}
            disabled={!prevItem}
            onClick={() => prevItem && onClose(prevItem.id)}
            aria-label="Previous activity"
          >
            ← {prevItem ? prevItem.label : 'Previous'}
          </button>

          <button
            className={s.clearBtn}
            onClick={() => {
              if (window.confirm('Clear your response for this activity? This cannot be undone.')) {
                onClear()
              }
            }}
          >
            Clear this response
          </button>

          <button
            className={s.navBtn}
            disabled={!nextItem}
            onClick={() => nextItem && onClose(nextItem.id)}
            aria-label="Next activity"
          >
            {nextItem ? nextItem.label : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  )
}
