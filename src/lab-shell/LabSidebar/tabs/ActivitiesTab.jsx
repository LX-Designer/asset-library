import { useState, useRef, useEffect } from 'react'
import ResetDialog from '../../ResetDialog/ResetDialog.jsx'
import s from './ActivitiesTab.module.css'

export default function ActivitiesTab({
  activities,
  responses,
  getActivityStatus,
  completedCount,
  totalCount,
  labTitle,
  labSubtitle,
  onOpenActivity,
  onReset,
}) {
  const [confirmReset, setConfirmReset] = useState(false)
  const footerRef = useRef(null)
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  useEffect(() => {
    if (confirmReset) {
      footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [confirmReset])

  return (
    <>
      <div className={s.header}>
        <div className={s.eyebrow}>Activity guide</div>
        {labTitle   && <div className={s.title}>{labTitle}</div>}
        {labSubtitle && <div className={s.subtitle}>{labSubtitle}</div>}
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
          const status = getActivityStatus(act.id, responses)
          return (
            <li key={act.id} className={s.item}>
              <button
                className={s.btn}
                onClick={() => onOpenActivity(act.id)}
                aria-label={`${act.label}: ${act.title} — ${status.replace('-', ' ')}`}
              >
                <span
                  className={`${s.dot} ${status === 'complete' ? s.complete : ''} ${status === 'inprogress' ? s.inprogress : ''}`}
                  aria-hidden="true"
                />
                <span className={s.meta}>
                  <span className={s.label}>{act.label}</span>
                  <span className={s.actTitle}>{act.title}</span>
                  <span className={`${s.statusText} ${status === 'complete' ? s.complete : ''} ${status === 'inprogress' ? s.inprogress : ''}`}>
                    {status === 'not-started' ? 'Not started' : status === 'inprogress' ? 'In progress' : 'Complete'}
                  </span>
                </span>
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
