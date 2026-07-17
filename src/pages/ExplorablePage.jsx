import { useParams, Link } from 'react-router-dom'
import { Suspense } from 'react'
import { getExplorable } from '../explorables/registry.js'
import styles from './ExplorablePage.module.css'

export default function ExplorablePage() {
  const { explorableId } = useParams()
  const explorable = getExplorable(explorableId)

  if (!explorable) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Explorable not found</h1>
        <p className={styles.notFoundText}>There's no explorable with the ID "{explorableId}".</p>
        <Link to="/#explorables" className={styles.notFoundLink}>← Back to explorables</Link>
      </div>
    )
  }

  const { Component } = explorable
  const isSimulation = explorable.type === 'simulation'
  const backHref = isSimulation ? '/#simulations' : '/#explorables'
  const backLabel = isSimulation ? 'Back to simulations' : 'Back to explorables'
  const loadingLabel = isSimulation ? 'Loading simulation…' : 'Loading explorable…'

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link to={backHref} className={styles.back}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11.5 7H2.5M6.5 3L2.5 7L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {backLabel}
        </Link>

        <div className={styles.panel}>
          <Suspense fallback={<div className={styles.loading}>{loadingLabel}</div>}>
            <Component />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
