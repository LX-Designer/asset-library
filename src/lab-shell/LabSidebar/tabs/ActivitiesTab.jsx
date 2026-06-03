import { useState, useRef, useEffect } from 'react'
import ResetDialog from '../../ResetDialog/ResetDialog.jsx'
import s from './ActivitiesTab.module.css'

const DEFAULT_STATUS_LABELS = {
  'not-started': 'Not started',
  'inprogress':  'In progress',
  'complete':    'Complete',
}

export default function ActivitiesTab({
  activities,
  responses,
  getActivityStatus,
  completedCount,
  totalCount,
  labTitle,
  labSubtitle,
  accentHeader = false,
  statusLabels = {},
  // Configurable sidebar header text (overrides labTitle / labSubtitle)
  eyebrow,
  sidebarTitle,
  sidebarSubtitle,
  // Close callback — when provided with accentHeader, renders a circular × button
  onClose,
  onOpenActivity,
  onReset,
}) {
  const [confirmReset, setConfirmReset] = useState(false)
  const footerRef = useRef(null)
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels }

  useEffect(() => {
    if (confirmReset) {
      footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [confirmReset])

  return (
    <>
      <div className={`${s.header} ${accentHeader ? s.headerAccent : ''}`}>
        {/* Circular close button — shown in accent header when onClose is provided */}
        {accentHeader && onClose && (
          <button className={s.closeBtn} onClick={onClose} aria-label="Close guide">×</button>
        )}
        <div className={s.eyebrow}>{eyebrow ?? 'Activity guide'}</div>
        {(sidebarTitle ?? labTitle) && <div className={s.title}>{sidebarTitle ?? labTitle}</div>}
        {(sidebarSubtitle ?? labSubtitle) && <div className={s.subtitle}>{sidebarSubtitle ?? labSubtitle}</div>}
        <div className={s.progress}>
          {completedCount} of {totalCount} {totalCount === 1 ? 'activity' : 'activities'} complete
          <span
            className={s.progressFill}
            style={{ '--progress': `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progressPct}% complete`}
          />
        </div>
      </div>

      <ul className={s.list} role="list">
        {activities.map((act) => {
          const status   = getActivityStatus(act.id, responses)
          const hasbadge = act.number != null

          return (
            <li key={act.id} className={s.item}>
              <button
                className={s.btn}
                onClick={() => onOpenActivity(act.id)}
                aria-label={`${act.label}: ${act.title} — ${labels[status] ?? status}`}
              >
                {/* Status indicator — numbered square badge OR circular dot */}
                {hasbadge ? (
                  <span
                    className={`${s.badge} ${status === 'complete' ? s.badgeComplete : ''}`}
                    aria-hidden="true"
                  >
                    {act.number}
                  </span>
                ) : (
                  <span
                    className={`${s.dot} ${status === 'complete' ? s.complete : ''} ${status === 'inprogress' ? s.inprogress : ''}`}
                    aria-hidden="true"
                  />
                )}

                <span className={s.meta}>
                  {/* Stage label (e.g. "Stage 1 · Build the evidence base") */}
                  {act.stageLabel && (
                    <span className={s.stageLabel}>{act.stageLabel}</span>
                  )}
                  {/* Fallback label for labs without badges or stage labels */}
                  {!hasbadge && !act.stageLabel && (
                    <span className={s.label}>{act.label}</span>
                  )}
                  <span className={s.actTitle}>{act.title}</span>
                  <span className={`${s.statusText} ${status === 'complete' ? s.complete : ''} ${status === 'inprogress' ? s.inprogress : ''}`}>
                    {labels[status] ?? status}
                  </span>
                </span>

                <span className={s.chevron} aria-hidden="true">›</span>
              </button>
            </li>
          )
        })}
      </ul>

      {onReset && (
        <div className={s.footer} ref={footerRef}>
          {confirmReset ? (
            <ResetDialog
              onReset={() => { setConfirmReset(false); onReset() }}
              onCancel={() => setConfirmReset(false)}
            />
          ) : (
            <button className={s.footerBtn} onClick={() => setConfirmReset(true)}>
              Start again
            </button>
          )}
        </div>
      )}
    </>
  )
}
