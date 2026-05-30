import { useState } from 'react'
import s from './ActivityModal.module.css'

/**
 * Shared activity panel chrome.
 *
 * Renders activity content (header, body, footer) without any overlay or
 * fixed positioning — designed to be hosted inside a FloatingPanel or any
 * other scroll container that provides the outer chrome.
 *
 * Props:
 *   activityNumber   number | null    — shown as "Activity N" when set
 *   activityLabel    string           — label shown when number is null
 *   thinkingMove     string           — cognitive move label
 *   title            string           — activity h2
 *   purpose          string           — "Why this matters" text
 *   prompt           string           — main activity question
 *   scaffold         string | null    — optional italic hint
 *   evidenceSections { id, label }[]  — pre-resolved section links
 *   prevItem         { id, label } | null
 *   nextItem         { id, label } | null
 *   onClose          () => void | null        — optional; shows × if provided
 *   onNavigate       (id) => void | null      — prev/next; falls back to onClose(id)
 *   onScrollTo       (sectionId) => void
 *   onClear          () => void
 *   noHeader         bool             — skip header div (when FloatingPanel title suffices)
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
  onNavigate,
  onScrollTo,
  onClear,
  noHeader = false,
  children,
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const navigate = (id) => {
    setShowClearConfirm(false)
    if (onNavigate) onNavigate(id)
    else onClose?.(id)
  }

  const subtitle = activityNumber !== null && activityNumber !== undefined
    ? `Activity ${activityNumber} · ${thinkingMove}`
    : `${activityLabel} · ${thinkingMove}`

  return (
    <div className={s.panel}>
      {!noHeader && (
        <div className={s.header}>
          <div className={s.subtitle}>{subtitle}</div>
          <h2 id="activity-modal-title" className={s.title}>{title}</h2>
          {onClose && (
            <button className={s.closeBtn} onClick={() => onClose()} aria-label="Close activity">×</button>
          )}
        </div>
      )}

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
                  onClick={() => onScrollTo?.(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {children}
      </div>

      <div className={s.footer}>
        <button
          className={s.navBtn}
          disabled={!prevItem}
          onClick={() => prevItem && navigate(prevItem.id)}
          aria-label="Previous activity"
        >
          ← {prevItem ? prevItem.label : 'Previous'}
        </button>

        {showClearConfirm ? (
          <div className={s.clearConfirm}>
            <span className={s.clearConfirmText}>Clear this response?</span>
            <button className={s.clearConfirmCancel} onClick={() => setShowClearConfirm(false)}>Cancel</button>
            <button className={s.clearConfirmOk} onClick={() => { setShowClearConfirm(false); onClear() }}>Clear</button>
          </div>
        ) : (
          <button className={s.clearBtn} onClick={() => setShowClearConfirm(true)}>
            Clear this response
          </button>
        )}

        <button
          className={s.navBtn}
          disabled={!nextItem}
          onClick={() => nextItem && navigate(nextItem.id)}
          aria-label="Next activity"
        >
          {nextItem ? nextItem.label : 'Next'} →
        </button>
      </div>
    </div>
  )
}
