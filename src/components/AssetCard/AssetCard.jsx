import { Link } from 'react-router-dom'
import styles from './AssetCard.module.css'

const LEVEL_CONFIG = {
  'lower-primary':    { label: 'Lower Primary',    color: 'green'  },
  'upper-primary':    { label: 'Upper Primary',    color: 'amber'  },
  'lower-secondary':  { label: 'Lower Secondary',  color: 'teal'   },
  'middle-secondary': { label: 'Middle Secondary', color: 'blue'   },
  'senior-secondary': { label: 'Senior Secondary', color: 'violet' },
  'undergraduate':    { label: 'Undergraduate',    color: 'rose'   },
  'postgraduate':     { label: 'Postgraduate',     color: 'slate'  },
}

export function getLevelLabel(level) {
  return LEVEL_CONFIG[level]?.label ?? level ?? '—'
}

export default function AssetCard({ asset }) {
  const cfg     = LEVEL_CONFIG[asset.level] ?? { label: asset.level ?? '—', color: 'blue' }
  const colorCls = styles[`level--${cfg.color}`]

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={`${styles.level} ${colorCls}`}>
            {cfg.label}
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
