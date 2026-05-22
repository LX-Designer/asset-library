import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'
import SpeechInput from '../SpeechInput/SpeechInput.jsx'

export default function Layout() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <svg className={styles.logoMark} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 1L17 9L9 17L1 9Z" fill="#2563EB"/>
            </svg>
            <span className={styles.logoText}>InquiryLabs</span>
          </Link>
          <nav className={styles.nav} aria-label="Main">
            <Link to="/" className={styles.navLink}>Portfolio</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerText}>InquiryLabs — built for learning.</span>
        </div>
      </footer>
      <SpeechInput />
    </div>
  )
}
