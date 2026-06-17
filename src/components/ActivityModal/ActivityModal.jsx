import { useState } from 'react'
import s from './ActivityModal.module.css'

/**
 * Shared activity panel chrome.
 *
 * Renders activity content (header, body, footer) without any overlay or
 * fixed positioning — designed to be hosted inside a FloatingPanel or any
 * other scroll container that provides the outer chrome.
 *
 * Layout: when the panel is wide enough (≥ 560px), the body splits into two
 * columns: left (context — purpose, prompt, task, scaffold, chips) and right
 * (the activity form). At narrow widths the columns stack vertically.
 *
 * Props:
 *   activityNumber   number | null    — shown as "Activity N" when set
 *   activityLabel    string           — label shown when number is null
 *   thinkingMove     string           — cognitive move label
 *   title            string           — activity h2
 *   purpose          string           — optional "Why this matters" context block
 *   prompt           string           — optional task question rendered above the form
 *   task             string           — optional "Your task" instruction block
 *   scaffold         string | null    — optional italic hint shown below the prompt
 *   evidenceSections { id, label }[]          — scroll-to section links
 *   conceptLinks     { id, title }[]          — toolkit concept links
 *   prevItem         { id, label } | null
 *   nextItem         { id, label } | null
 *   onClose          () => void | null
 *   onNavigate       (id) => void | null
 *   onScrollTo       (sectionId) => void
 *   onOpenConcept    (conceptId) => void
 *   onClear          () => void
 *   noHeader         bool
 *   children         ReactNode        — the activity form (right column)
 */
export default function ActivityModal({
  activityNumber,
  activityLabel,
  thinkingMove,
  title,
  purpose,
  prompt,
  task,
  scaffold,
  evidenceSections = [],
  conceptLinks = [],
  conceptsLabel = 'Concepts',
  prevItem,
  nextItem,
  onClose,
  onNavigate,
  onScrollTo,
  onOpenConcept,
  onOpenEvidence = null,
  onClear,
  noHeader = false,
  darkHeader = false,
  // ── Inquiry (activity-primary) layout ──────────────────────────────────────
  // stacked: single full-width column (context on top, form below) instead of
  //          the two-column split. Used when the activity lives in the page flow
  //          rather than a fixed-height side panel, so the form gets full width.
  // hideNav: drop the prev/next footer buttons (meaningless when the page scrolls
  //          through every activity).
  stacked = false,
  hideNav = false,
  children,
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const navigate = (id) => {
    setShowClearConfirm(false)
    if (onNavigate) onNavigate(id)
    else onClose?.(id)
  }

  // Evidence links scroll to a content section in the default layout, or open
  // the evidence dock in the inquiry layout (when onOpenEvidence is supplied).
  const handleEvidenceClick = onOpenEvidence ?? onScrollTo

  const subtitle = activityNumber !== null && activityNumber !== undefined
    ? `Activity ${activityNumber} · ${thinkingMove}`
    : `${activityLabel} · ${thinkingMove}`

  const hasLeftContent = !!(purpose || prompt || task || scaffold || evidenceSections.length || conceptLinks.length)

  const contextBlocks = (
    <>
      {purpose && (
        <div className={s.purpose}>
          <span className={s.purposeLabel}>Why this matters</span>
          {purpose}
        </div>
      )}

      {prompt && <p className={s.prompt}>{prompt}</p>}

      {task && (
        <div className={s.task}>
          <span className={s.taskLabel}>Your task</span>
          {task}
        </div>
      )}

      {scaffold && (
        <div className={s.scaffold}>{scaffold}</div>
      )}

      {evidenceSections.length > 0 && (
        <div className={s.evidenceLinks}>
          <div className={s.evidenceLabel}>{onOpenEvidence ? 'View evidence' : 'Go to evidence'}</div>
          <div className={s.evidenceBtns}>
            {evidenceSections.map(({ id, label }) => (
              <button
                key={id}
                className={s.evidenceScrollBtn}
                onClick={() => handleEvidenceClick?.(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {conceptLinks.length > 0 && (
        <div className={s.conceptLinks}>
          <div className={s.conceptLabel}>{conceptsLabel}</div>
          <div className={s.conceptBtns}>
            {conceptLinks.map(({ id, title }) => (
              <button
                key={id}
                className={s.conceptBtn}
                onClick={() => onOpenConcept?.(id)}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )

  return (
    <div className={s.panel}>
      {!noHeader && (
        <div className={`${s.header}${darkHeader ? ` ${s.headerDark}` : ''}${stacked ? ` ${s.headerInline}` : ''}`}>
          <div className={s.subtitle}>{subtitle}</div>
          <h2 id="activity-modal-title" className={s.title}>{title}</h2>
          {onClose && (
            <button className={s.closeBtn} onClick={() => onClose()} aria-label="Close activity">×</button>
          )}
        </div>
      )}

      {stacked ? (
        <div className={s.bodyStacked}>
          {hasLeftContent && <div className={s.stackedContext}>{contextBlocks}</div>}
          <div className={s.stackedForm}>{children}</div>
        </div>
      ) : (
        <div className={s.body}>
          {hasLeftContent ? (
            <>
              <div className={s.leftCol}>{contextBlocks}</div>
              <div className={s.rightCol}>{children}</div>
            </>
          ) : (
            <div className={s.rightCol}>{children}</div>
          )}
        </div>
      )}

      <div className={`${s.footer}${stacked ? ` ${s.footerInline}` : ''}`}>
        {!hideNav && (
          <button
            className={s.navBtn}
            disabled={!prevItem}
            onClick={() => prevItem && navigate(prevItem.id)}
            aria-label="Previous activity"
          >
            ← {prevItem ? prevItem.label : 'Previous'}
          </button>
        )}

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

        {!hideNav && (
          <button
            className={s.navBtn}
            disabled={!nextItem}
            onClick={() => nextItem && navigate(nextItem.id)}
            aria-label="Next activity"
          >
            {nextItem ? nextItem.label : 'Next'} →
          </button>
        )}
      </div>
    </div>
  )
}
