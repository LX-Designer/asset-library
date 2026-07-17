import { assetRegistry } from '../registry.js'
import { explorableRegistry } from '../explorables/registry.js'
import AssetCard from '../components/AssetCard/AssetCard.jsx'
import ExplorableCard from '../components/ExplorableCard/ExplorableCard.jsx'
import styles from './Home.module.css'

export default function Home() {
  const explorables = explorableRegistry.filter(e => e.type === 'explorable')
  const simulations = explorableRegistry.filter(e => e.type === 'simulation')

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Interactive learning</span>
          <h1 className={styles.title}>InquiryLabs</h1>
          <p className={styles.subtitle}>
            Interactive scenarios that foster deep learning through situated practice, problem-solving, and genuine inquiry.
          </p>
        </div>
      </section>

      <section id="labs" className={styles.catalogue}>
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

      {explorables.length > 0 && (
        <section id="explorables" className={styles.catalogue}>
          <div className={styles.catalogueHeader}>
            <h2 className={styles.catalogueTitle}>Explorables</h2>
            <span className={styles.catalogueCount}>
              {explorables.length} {explorables.length === 1 ? 'explorable' : 'explorables'}
            </span>
          </div>

          <div className={styles.grid}>
            {explorables.map(explorable => (
              <ExplorableCard key={explorable.id} explorable={explorable} />
            ))}
          </div>
        </section>
      )}

      {simulations.length > 0 && (
        <section id="simulations" className={styles.catalogue}>
          <div className={styles.catalogueHeader}>
            <h2 className={styles.catalogueTitle}>Simulations</h2>
            <span className={styles.catalogueCount}>
              {simulations.length} {simulations.length === 1 ? 'simulation' : 'simulations'}
            </span>
          </div>

          <div className={styles.grid}>
            {simulations.map(simulation => (
              <ExplorableCard key={simulation.id} explorable={simulation} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
