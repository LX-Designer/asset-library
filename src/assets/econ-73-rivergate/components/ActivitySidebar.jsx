import { Link } from 'react-router-dom'
import { ACTIVITIES } from '../data/activities.js'
import styles from '../RivergateOverflow.module.css'

export default function ActivitySidebar({ completedSet, isCompleted, onOpenActivity, onReset }) {
  const count = completedSet.size
  const fillPct = (count / 6) * 100

  return (
    <aside className={styles.sidebar} aria-label="Analyst tasks">
      <Link to="/" className={styles.sidebarBack}>← Portfolio</Link>

      {isCompleted && (
        <div className={styles.completionBanner}>
          <span className={styles.completionTitle}>Inquiry complete</span>
          <p className={styles.completionText}>
            All six analyst tasks submitted. Responses remain accessible for review.
          </p>
          {onReset && (
            <button className={styles.resetBtn} onClick={onReset}>Start again</button>
          )}
        </div>
      )}

      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarStamp}>Rivergate Economic Review Panel</span>
        <div className={styles.sidebarCaseTitle}>The Rivergate Overflow Inquiry</div>
        <div className={styles.sidebarCaseRef}>RG/7.3/NWW/Overflow</div>
      </div>

      <span className={styles.sidebarSectionLabel}>Analyst Response Tasks</span>

      <div className={styles.activityList}>
        {ACTIVITIES.map(({ num, shortLabel, title, signpost }) => {
          const done = completedSet.has(num)
          return (
            <button
              key={num}
              className={`${styles.actItem} ${done ? styles.actItemDone : ''}`}
              onClick={() => onOpenActivity(num)}
            >
              <span className={`${styles.actBadge} ${done ? styles.actBadgeDone : ''}`}>
                {done ? '✓' : String(num).padStart(2, '0')}
              </span>
              <span className={styles.actText}>
                <span className={styles.actTitle}>{title}</span>
                <span className={styles.actSignpost}>{signpost}</span>
                <span className={`${styles.actStatusLine} ${done ? styles.actStatusLineDone : ''}`}>
                  {done ? 'Completed' : 'Not started'}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressCount}>{count} / 6</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressBarFill} style={{ width: `${fillPct}%` }} />
        </div>
      </div>
    </aside>
  )
}
