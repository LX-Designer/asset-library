import { Link } from 'react-router-dom'
import styles from './AssetCard.module.css'

const DIFFICULTY_VARIANT = {
  beginner:     'green',
  intermediate: 'blue',
  advanced:     'purple',
}

export default function AssetCard({ asset }) {
  const variant = DIFFICULTY_VARIANT[asset.difficulty] ?? 'blue'

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={`${styles.difficulty} ${styles[`difficulty--${variant}`]}`}>
            {asset.difficulty}
          </span>
          <span className={styles.time}>{asset.estimatedMinutes} min</span>
        </div>

        <h3 className={styles.title}>{asset.title}</h3>
        <p className={styles.description}>{asset.description}</p>

        <div className={styles.tags}>
          {asset.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <Link to={`/asset/${asset.id}`} className={styles.cta}>
          Start lab
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </article>
  )
}
