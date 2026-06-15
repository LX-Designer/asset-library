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
  getResponseExcerpt,
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
  onOpenActivity,
  onReset,
}) {
  const [confirmReset, setConfirmReset] = useState(false)
  const [expandedIds, setExpandedIds]   = useState(new Set())
  const footerRef = useRef(null)
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels }

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    if (confirmReset) {
      footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [confirmReset])

  return (
    <>
      <div className={`${s.header} ${accentHeader ? s.headerAccent : ''}`}>
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
        {activities.map((act, i) => {
          const status        = getActivityStatus(act.id, responses)
          const activityLabel = `Activity ${i + 1}`
          const excerpt       = getResponseExcerpt?.(act.id, responses) ?? null
          const hasExcerpt    = !!excerpt && status !== 'not-started'
          const isExpanded    = expandedIds.has(act.id)

          return (
            <li key={act.id} className={s.item}>
              <button
                className={s.btn}
                onClick={() => onOpenActivity(act.id)}
                aria-label={`${activityLabel}: ${act.title} — ${labels[status] ?? status}`}
              >
                <span
                  className={`${s.dot} ${status === 'complete' ? s.complete : ''} ${status === 'inprogress' ? s.inprogress : ''}`}
                  aria-hidden="true"
                />

                <span className={s.meta}>
                  <span className={s.activityLabel}>{activityLabel}</span>
                  <span className={s.actTitle}>{act.title}</span>
                  <span className={`${s.statusText} ${status === 'complete' ? s.complete : status === 'inprogress' ? s.inprogress : ''}`}>
                    {labels[status] ?? status}
                  </span>
                </span>

                <span className={s.chevron} aria-hidden="true">›</span>
              </button>

              {hasExcerpt && (
                <button
                  className={s.excerptRow}
                  onClick={() => toggleExpand(act.id)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Show less' : 'Show more'}
                >
                  <span className={`${s.excerptText} ${isExpanded ? s.excerptExpanded : ''}`}>
                    {excerpt}
                  </span>
                  <span className={`${s.excerptChevron} ${isExpanded ? s.excerptChevronUp : ''}`} aria-hidden="true">›</span>
                </button>
              )}
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
