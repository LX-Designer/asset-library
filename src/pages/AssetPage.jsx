import { useParams, Link } from 'react-router-dom'
import { getAssetMeta } from '../registry.js'
import AssetWrapper from '../components/AssetWrapper/AssetWrapper.jsx'
import styles from './AssetPage.module.css'

export default function AssetPage() {
  const { assetId } = useParams()
  const meta = getAssetMeta(assetId)

  if (!meta) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Lab not found</h1>
        <p className={styles.notFoundText}>There's no lab with the ID "{assetId}".</p>
        <Link to="/" className={styles.notFoundLink}>← Back to portfolio</Link>
      </div>
    )
  }

  // Assets with layout: 'full' manage their own layout (sidebar, header, etc.)
  if (meta.layout === 'full') {
    return <AssetWrapper assetId={assetId} />
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link to="/" className={styles.back}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11.5 7H2.5M6.5 3L2.5 7L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to portfolio
        </Link>

        <header className={styles.assetHeader}>
          <div className={styles.badges}>
            <span className={styles.difficultyBadge}>{meta.difficulty}</span>
            <span className={styles.timeBadge}>{meta.estimatedMinutes} min</span>
          </div>

          <div className={styles.tags}>
            {meta.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.description}>{meta.description}</p>
        </header>

        <div className={styles.assetBody}>
          <AssetWrapper assetId={assetId} />
        </div>
      </div>
    </div>
  )
}
