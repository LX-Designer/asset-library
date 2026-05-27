import { Link } from 'react-router-dom'
import styles from './FastFashion.module.css'

const ACTIVITIES = [
  {
    num: 1,
    name: 'Prior Thinking',
    signpost: 'Attempt before reading the case file.',
  },
  {
    num: 2,
    name: 'Apply the Efficiency Criteria',
    signpost: 'Read §01 and §02 first.',
  },
  {
    num: 3,
    name: 'Identify the Discontinuity',
    signpost: 'Read §03 and §04 first.',
  },
  {
    num: 4,
    name: 'Analyse the Mechanism',
    signpost: 'Read §05 and §06 first.',
  },
  {
    num: 5,
    name: 'Evaluate the Expert Positions',
    signpost: 'Read §07 first.',
  },
  {
    num: 6,
    name: 'Culminating Task',
    signpost: 'Review all sections and your earlier responses.',
  },
]

export default function Sidebar({ completedSet, isCompleted, onOpenModal, onReset }) {
  const count   = completedSet.size
  const fillPct = (count / 6) * 100

  return (
    <aside className={styles.sidebar} aria-label="Inquiry activities">
      <Link to="/" className={styles.sidebarBack}>← Portfolio</Link>

      {isCompleted && (
        <div className={styles.completionBanner}>
          <span className={styles.completionBannerTitle}>Assessment complete</span>
          <p className={styles.completionBannerText}>
            You have submitted all six activities. All responses remain accessible.
          </p>
          {onReset && (
            <button className={styles.resetBtn} onClick={onReset}>
              Start again
            </button>
          )}
        </div>
      )}

      <div className={styles.sidebarHeader}>
        <div className={styles.caseStamp}>Inquiry Labs — Consumer Markets Division</div>
        <div className={styles.sidebarTitle}>The Price of Fast Fashion</div>
        <div className={styles.sidebarSub}>CTF-2024-0047-INT · Internal Review</div>
      </div>

      <div className={styles.progressLabel}>Inquiry Activities</div>

      <div className={styles.activityList}>
        {ACTIVITIES.map(({ num, name, signpost }) => {
          const done = completedSet.has(num)
          return (
            <button
              key={num}
              className={`${styles.actItem} ${done ? styles.actItemDone : ''}`}
              onClick={() => onOpenModal(num)}
            >
              <div className={`${styles.actNum} ${done ? styles.actNumDone : ''}`}>
                {done ? '✓' : num}
              </div>
              <div className={styles.actText}>
                <span className={styles.actName}>{name}</span>
                <span className={styles.actSignpost}>{signpost}</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.progressBarWrap}>
          <div className={styles.progressBarFill} style={{ width: `${fillPct}%` }} />
        </div>
        <div className={styles.progressText}>
          {count} / 6 activities completed
        </div>
      </div>
    </aside>
  )
}
