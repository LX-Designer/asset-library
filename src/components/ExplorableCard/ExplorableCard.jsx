import styles from './ExplorableCard.module.css'

export default function ExplorableCard({ explorable, onOpen }) {
  return (
    <article className={styles.card}>
      <button className={styles.hit} onClick={() => onOpen(explorable)}>
        <div className={styles.body}>
          <div className={styles.topRow}>
            <span className={styles.kind}>Explorable</span>
            {explorable.estimatedMinutes && (
              <span className={styles.time}>{explorable.estimatedMinutes} min</span>
            )}
          </div>

          <h3 className={styles.title}>{explorable.title}</h3>
          <p className={styles.description}>{explorable.description}</p>

          <div className={styles.tags}>
            {explorable.discipline && (
              <span className={`${styles.tag} ${styles.tagDiscipline}`}>{explorable.discipline}</span>
            )}
            {explorable.topic && (
              <span className={`${styles.tag} ${styles.tagTopic}`}>{explorable.topic}</span>
            )}
          </div>
        </div>

        <span className={styles.footer}>
          <span className={styles.cta}>
            Open explorable
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </span>
      </button>
    </article>
  )
}
