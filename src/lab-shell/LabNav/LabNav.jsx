import { Link } from 'react-router-dom'
import s from './LabNav.module.css'

export default function LabNav({
  config,
  backHref,
  isExploreActive,
  isWorkActive,
  onExplore,
  onWork,
}) {
  return (
    <nav className={s.nav} aria-label="Lab navigation">
      {backHref ? (
        <Link to={backHref} className={s.back}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M10.5 6.5H2.5M5.5 3.5L2.5 6.5L5.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Labs
        </Link>
      ) : (
        <div className={s.backPlaceholder} />
      )}

      <div className={s.centre}>
        {config.nav.navCenter ?? (
          <>
            {config.nav.title && (
              <span className={s.title}>{config.nav.title}</span>
            )}
            {config.nav.subtitle && (
              <span className={s.subtitle}>{config.nav.subtitle}</span>
            )}
          </>
        )}
      </div>

      {config.nav.showWorkExplore && (
        <div className={s.actions}>
          <button
            className={`${s.btn} ${isExploreActive ? s.btnActive : ''}`}
            onClick={onExplore}
            aria-pressed={isExploreActive}
          >
            Explore
          </button>
          <button
            className={`${s.btn} ${isWorkActive ? s.btnActive : ''}`}
            onClick={onWork}
            aria-pressed={isWorkActive}
          >
            Work
          </button>
        </div>
      )}
    </nav>
  )
}
