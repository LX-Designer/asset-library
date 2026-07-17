import { Link, Outlet, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'
import SpeechInput from '../SpeechInput/SpeechInput.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { getAssetMeta } from '../../registry.js'
import { explorableRegistry } from '../../explorables/registry.js'

export default function Layout() {
  const { user } = useAuth()
  const location = useLocation()

  // Full-layout assets own the entire screen — suppress the app shell so
  // the asset header and footer are the only chrome the student sees.
  const assetMatch = location.pathname.match(/^\/asset\/([^/]+)$/)
  const assetMeta  = assetMatch ? getAssetMeta(assetMatch[1]) : null
  const hideShell  = assetMeta?.layout === 'full'

  const hasExplorables = explorableRegistry.some(e => e.type !== 'simulation')
  const hasSimulations  = explorableRegistry.some(e => e.type === 'simulation')

  function handleSignOut() {
    supabase.auth.signOut()
  }

  return (
    <div className={styles.root}>
      {!hideShell && (
        <header className={styles.header}>
          <div className={styles.inner}>
            <Link to="/" className={styles.logo}>
              <svg className={styles.logoMark} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 1L17 9L9 17L1 9Z" fill="#2563EB"/>
              </svg>
              <span className={styles.logoText}>InquiryLabs</span>
            </Link>
            <nav className={styles.nav} aria-label="Main">
              <Link to="/" className={styles.navLink}>Labs</Link>
              {hasExplorables && (
                <a href="/#explorables" className={styles.navLink}>Explorables</a>
              )}
              {hasSimulations && (
                <a href="/#simulations" className={styles.navLink}>Simulations</a>
              )}
              {user ? (
                <>
                  <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
                  <button onClick={handleSignOut} className={styles.navLink}>Sign out</button>
                </>
              ) : (
                <Link to="/login" className={styles.navLink}>Teacher login</Link>
              )}
            </nav>
          </div>
        </header>
      )}

      <main className={styles.main}>
        <Outlet />
      </main>

      {!hideShell && (
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <span className={styles.footerText}>InquiryLabs — built for learning.</span>
          </div>
        </footer>
      )}
      <SpeechInput />
    </div>
  )
}
