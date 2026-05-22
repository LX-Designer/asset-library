import { assetRegistry } from '../registry.js'
import AssetCard from '../components/AssetCard/AssetCard.jsx'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Interactive learning</span>
          <h1 className={styles.title}>InquiryLabs</h1>
          <p className={styles.subtitle}>
            Interactive labs for discovery, reasoning, and genuine learning across all areas of study.
          </p>
        </div>
      </section>

      <section className={styles.catalogue}>
        <div className={styles.catalogueHeader}>
          <h2 className={styles.catalogueTitle}>Available labs</h2>
          <span className={styles.catalogueCount}>
            {assetRegistry.length} {assetRegistry.length === 1 ? 'lab' : 'labs'}
          </span>
        </div>

        {assetRegistry.length === 0 ? (
          <p className={styles.empty}>No labs published yet.</p>
        ) : (
          <div className={styles.grid}>
            {assetRegistry.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
