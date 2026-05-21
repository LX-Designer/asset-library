import { Link } from 'react-router-dom'
import styles from './TacomaNarrows.module.css'

const ACTIVITIES = [
  { num: 1, name: 'Initial hypothesis',      sub: 'What do you already think?' },
  { num: 2, name: 'Frequency analysis',      sub: 'Does the data support resonance?' },
  { num: 3, name: 'Timeline reconstruction', sub: 'Two phases, two explanations?' },
  { num: 4, name: 'Design analysis',         sub: 'What made this bridge different?' },
  { num: 5, name: 'Expert evaluation',       sub: 'Two witnesses, two theories' },
  { num: 6, name: 'Tribunal report',         sub: 'Write your findings' },
]

export default function Sidebar({ completedSet, onOpenModal }) {
  const count    = completedSet.size
  const fillPct  = (count / 6) * 100

  return (
    <aside className={styles.sidebar} aria-label="Inquiry activities">
      <Link to="/" className={styles.sidebarBack}>← Portfolio</Link>

      <div className={styles.sidebarHeader}>
        <div className={styles.caseStamp}>Inquiry Tribunal — Case File</div>
        <div className={styles.sidebarTitle}>Tacoma Narrows Bridge</div>
        <div className={styles.sidebarSub}>November 7, 1940 · Washington State</div>
        <button className={styles.beforeBtn} onClick={() => onOpenModal(0)}>
          ⓘ Before you begin
        </button>
      </div>

      <div className={styles.progressLabel}>Inquiry Activities</div>

      <div className={styles.activityList}>
        {ACTIVITIES.map(({ num, name, sub }) => {
          const done = completedSet.has(num)
          return (
            <button
              key={num}
              className={`${styles.actItem} ${done ? styles.actItemActive : ''}`}
              onClick={() => onOpenModal(num)}
            >
              <div className={`${styles.actNum} ${done ? styles.actNumDone : ''}`}>
                {done ? '✓' : num}
              </div>
              <div className={styles.actText}>
                <span className={styles.actName}>{name}</span>
                <span className={styles.actSub}>{sub}</span>
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
          {count} of 6 activities completed
        </div>
      </div>
    </aside>
  )
}
