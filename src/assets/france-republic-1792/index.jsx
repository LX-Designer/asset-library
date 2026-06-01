import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import s from './FranceRepublic.module.css'
import PathwayMap from './PathwayMap.jsx'
import CauseMap from './CauseMap.jsx'
import ActivityModal from './ActivityModal.jsx'
import FloatingPanel from '../../components/FloatingPanel'
import {
  SECTIONS, ACTIVITIES, CHRONOLOGY, EVIDENCE_CARDS,
  FACTIONS, REFORMS, TURNING_POINTS, CAUSE_FACTORS,
  GLOSSARY, VISUAL_ASSETS, PATHWAY_NODES
} from './data.js'

// ── Asset-specific CSS vars forwarded through FloatingPanel portals ──────────
// FloatingPanel's anchor div lives inside .shell and reads these via
// getComputedStyle. Chrome resolves var() chains at read time, so the portal
// wrapper receives literal values (hex, font stacks) not unresolved var() refs.
const FR_THEME_VARS = [
  // Base tokens
  '--fr-parchment', '--fr-parchment-mid', '--fr-paper', '--fr-paper-raised',
  '--fr-ink', '--fr-ink-mid', '--fr-ink-light',
  '--fr-rule', '--fr-rule-light',
  '--fr-accent', '--fr-accent-hover', '--fr-accent-subtle',
  '--fr-seal', '--fr-seal-subtle', '--fr-seal-muted',
  '--fr-complete', '--fr-complete-subtle', '--fr-complete-muted',
  '--fr-inprogress', '--fr-inprogress-subtle',
  '--fr-serif', '--fr-sans', '--fr-transition', '--fr-nav-height',
  // Modal-chrome tokens (used by SharedActivityModal)
  '--modal-panel-bg', '--modal-border', '--modal-ink', '--modal-ink-mid',
  '--modal-ink-light', '--modal-accent', '--modal-accent-hover',
  '--modal-subtle', '--modal-label', '--modal-serif', '--modal-transition',
]

// ── Media query hook ─────────────────────────────────────────────────────────
function useIsDesktop() {
  const [ok, setOk] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 900)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const handler = (e) => setOk(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return ok
}

// ── Completion logic ─────────────────────────────────────────────────────────
function getActivityStatus(id, responses) {
  const has = (key) => {
    const v = responses[key]
    if (v == null) return false
    if (typeof v === 'string') return v.trim().length > 0
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object') return Object.keys(v).length > 0
    return v != null
  }
  const arr = (key, n) => Array.isArray(responses[key]) && responses[key].length >= n
  const obj = (key, n) => typeof responses[key] === 'object' && responses[key] != null && Object.keys(responses[key]).length >= n
  const str = (key, n = 1) => typeof responses[key] === 'string' && responses[key].trim().length >= n

  switch (id) {
    case 'init':
      if (str('init-text') || responses['init-confidence'] != null) return 'complete'
      return 'not-started'
    case 'act1':
      if (arr('act1-selections', 3) && str('act1-response')) return 'complete'
      if (has('act1-selections') || has('act1-response')) return 'inprogress'
      return 'not-started'
    case 'act2':
      if (has('act2-pathway') && str('act2-response')) return 'complete'
      if (has('act2-pathway') || has('act2-response')) return 'inprogress'
      return 'not-started'
    case 'act3':
      if (obj('act3-table', 1) && str('act3-response')) return 'complete'
      if (has('act3-table') || has('act3-response')) return 'inprogress'
      return 'not-started'
    case 'act4':
      if (arr('act4-tags', 2) && str('act4-response')) return 'complete'
      if (has('act4-tags') || has('act4-response')) return 'inprogress'
      return 'not-started'
    case 'act5':
      if (obj('act5-categories', 3) && str('act5-response')) return 'complete'
      if (has('act5-categories') || has('act5-response')) return 'inprogress'
      return 'not-started'
    case 'act6':
      if (responses['act6-rating'] != null && str('act6-response')) return 'complete'
      if (responses['act6-rating'] != null || has('act6-response')) return 'inprogress'
      return 'not-started'
    case 'act7':
      if (arr('act7-factors', 3) && str('act7-response')) return 'complete'
      if (has('act7-factors') || has('act7-response')) return 'inprogress'
      return 'not-started'
    case 'act8':
      const c8 = responses['act8-classifications']
      const classified = c8 ? Object.keys(c8).filter(k => c8[k]).length : 0
      if (classified >= 4 && str('act8-response')) return 'complete'
      if (classified > 0 || has('act8-response')) return 'inprogress'
      return 'not-started'
    case 'act9':
      const m = responses['act9-matrix']
      const rated = m ? Object.keys(m).filter(k => Object.keys(m[k] ?? {}).length >= 3).length : 0
      const ranked = Array.isArray(responses['act9-ranked']) && responses['act9-ranked'].filter(Boolean).length >= 3
      if (rated >= 5 && ranked && str('act9-response')) return 'complete'
      if (rated > 0 || has('act9-ranked') || has('act9-response')) return 'inprogress'
      return 'not-started'
    case 'final':
      if (str('final-response', 50)) return 'complete'
      if (has('final-response')) return 'inprogress'
      return 'not-started'
    case 'reflection':
      if (str('reflection')) return 'complete'
      if (has('reflection')) return 'inprogress'
      return 'not-started'
    default: return 'not-started'
  }
}

const COMPLETION_REQUIRED = ['act1','act2','act3','act4','act5','act6','act7','act8','act9','final']

// ── Visual asset card ────────────────────────────────────────────────────────
function VisualAssetCard({ va }) {
  return (
    <div className={s.vaCard}>
      <div className={s.vaImageWrap}>
        <img src={`/france-republic-1792/${va.filename}`} alt={va.altText} loading="lazy" />
      </div>
      {va.id === 'VA-005' && (
        <div className={s.vaContentNote}>
          Content note: this image depicts violence. Use it to understand fear and breakdown of authority.
        </div>
      )}
      <div className={s.vaBody}>
        <div className={s.vaId}>{va.id}</div>
        <div className={s.vaTitle}>{va.title}</div>
        <div className={s.vaCreator}>{va.creator} · {va.date}</div>
        <div className={s.vaEvidenceNote}>{va.evidenceNote}</div>
        <details className={s.vaRightsDetails}>
          <summary>Source and rights</summary>
          <p>{va.rights}</p>
        </details>
      </div>
    </div>
  )
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, label, title, children, intro }) {
  return (
    <section id={id} className={s.section} aria-labelledby={`${id}-title`}>
      {label && <div className={s.sectionLabel}>{label}</div>}
      <h2 id={`${id}-title`} className={s.sectionTitle}>{title}</h2>
      {intro && <p className={s.sectionIntro}>{intro}</p>}
      {children}
    </section>
  )
}

// ── Individual notes item — local draft keeps textarea snappy ────────────────
// onBlur syncs to parent (avoids per-keystroke saves). useEffect keeps local
// draft in sync when responses change externally (e.g. after saving in modal).
function NotesItem({ act, responseKey, savedValue, openModal, onSave }) {
  const [draft, setDraft] = useState(savedValue ?? '')

  useEffect(() => {
    setDraft(savedValue ?? '')
  }, [savedValue])

  const handleBlur = useCallback(() => {
    const trimmed = draft.trim()
    const prev = (savedValue ?? '').trim()
    if (trimmed === prev) return          // no change — skip the round-trip
    onSave(responseKey, trimmed || null)
  }, [draft, savedValue, responseKey, onSave])

  return (
    <div className={s.notesItem}>
      {/* Only the short label is a clickable link — title is static text below */}
      <button
        className={s.notesItemHeaderBtn}
        onClick={() => openModal(act.id)}
        title={`Open ${act.title}`}
      >
        <span className={s.notesItemLabel}>{act.label}</span>
      </button>
      <div className={s.notesItemTitle}>{act.title}</div>
      <textarea
        className={s.notesItemTextarea}
        value={draft}
        placeholder="Not yet completed"
        onChange={e => setDraft(e.target.value)}
        onBlur={handleBlur}
        rows={3}
        aria-label={`Notes for ${act.title}`}
      />
    </div>
  )
}

// ── Merged guide + notes panel ───────────────────────────────────────────────
// Single tabbed component used in both the desktop FloatingPanel and the
// mobile guide drawer. activeTab/setActiveTab are lifted to the parent so
// the viewport side-tabs can also drive which tab is shown on open.
function GuidePanelContent({ responses, completedCount, totalCount, progressPct, openModal, onSave, onReset, activeTab, setActiveTab, showTabs }) {
  const [confirmReset, setConfirmReset] = useState(false)
  const footerRef = useRef(null)

  useEffect(() => {
    if (confirmReset) {
      footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [confirmReset])

  // Dismiss the reset confirmation if the user switches away from the Activities tab
  useEffect(() => {
    if (activeTab !== 'activities') setConfirmReset(false)
  }, [activeTab])

  return (
    <>
      {/* ── Sticky tab strip — hidden when guide is floating (popped out) ── */}
      {showTabs && <div className={s.guideTabs} role="tablist">
        <button
          className={`${s.guideTab} ${activeTab === 'activities' ? s.guideTabActive : ''}`}
          role="tab"
          aria-selected={activeTab === 'activities'}
          onClick={() => setActiveTab('activities')}
        >
          Activities
        </button>
        <button
          className={`${s.guideTab} ${activeTab === 'notes' ? s.guideTabActive : ''}`}
          role="tab"
          aria-selected={activeTab === 'notes'}
          onClick={() => setActiveTab('notes')}
        >
          My Notes
        </button>
      </div>}

      {/* ── Activities tab ── */}
      {activeTab === 'activities' && (
        <>
          <div className={s.guideHeader}>
            <div className={s.guideTitle}>Activity guide</div>
            <div className={s.guideSubtitle}>From Monarchy to Republic</div>
            <div className={s.guideProgress}>
              {completedCount} of {totalCount} activities complete
              <span
                className={s.guideProgressFill}
                style={{ '--progress': `${progressPct}%` }}
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${progressPct}% complete`}
              />
            </div>
          </div>

          <ul className={s.guideList} role="list">
            {ACTIVITIES.map((act) => {
              const status = getActivityStatus(act.id, responses)
              return (
                <li key={act.id} className={s.guideItem}>
                  <button
                    className={s.guideBtn}
                    onClick={() => openModal(act.id)}
                    aria-label={`${act.label}: ${act.title} — ${status.replace('-', ' ')}`}
                  >
                    <span className={`${s.guideDot} ${status !== 'not-started' ? s[status] : ''}`} aria-hidden="true" />
                    <span className={s.guideMeta}>
                      <span className={s.guideItemLabel}>{act.label}</span>
                      <span className={s.guideItemTitle}>{act.title}</span>
                      <span className={`${s.guideStatusText} ${status !== 'not-started' ? s[status] : ''}`}>
                        {status === 'not-started' ? 'Not started' : status === 'inprogress' ? 'In progress' : 'Complete'}
                      </span>
                    </span>
                  </button>
                  {act.id === 'act9' && <div className={s.guideDivider} />}
                </li>
              )
            })}
          </ul>

          {onReset && (
            <div className={s.guideFooter} ref={footerRef}>
              {confirmReset ? (
                <>
                  <p className={s.guideConfirmText}>
                    Clear all responses and start again?
                  </p>
                  <div className={s.guideConfirmBtns}>
                    <button
                      className={s.guideConfirmCancel}
                      onClick={() => setConfirmReset(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={s.guideConfirmOk}
                      onClick={() => { setConfirmReset(false); onReset() }}
                    >
                      Yes, clear everything
                    </button>
                  </div>
                </>
              ) : (
                <button
                  className={s.guideFooterBtn}
                  onClick={() => setConfirmReset(true)}
                >
                  Start again
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* ── My Notes tab ── */}
      {activeTab === 'notes' && (
        <div className={s.notesBody}>
          {ACTIVITIES.filter(a => a.id !== 'init' && a.id !== 'reflection').map(act => {
            const responseKey = act.id === 'final' ? 'final-response' : `${act.id}-response`
            const savedValue = typeof responses[responseKey] === 'string' ? responses[responseKey] : ''
            return (
              <NotesItem
                key={act.id}
                act={act}
                responseKey={responseKey}
                savedValue={savedValue}
                openModal={openModal}
                onSave={onSave}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

// ── Main asset ───────────────────────────────────────────────────────────────
export default function FranceRepublic1792({ onResponse, onComplete, savedResponses, isCompleted, onReset, backHref }) {
  const [responses, setResponses] = useState(savedResponses ?? {})
  const [activeModal, setActiveModal] = useState(null)
  const [activityTrigger, setActivityTrigger] = useState(0)
  const [activeSection, setActiveSection] = useState('intro')
  const [guideOpen, setGuideOpen] = useState(false)         // mobile drawer open state
  // Initialise from localStorage so the first render agrees with FloatingPanel
  // (which also reads the same key synchronously), eliminating the side-tab flash.
  const [guideDesktopOpen, setGuideDesktopOpen] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('fp_france-guide') ?? 'null')
      return stored?.state === 'docked'
    } catch { return false }
  })
  const [guideDockTrigger, setGuideDockTrigger] = useState(0)       // increments to dock/open guide as sidebar
  const [guideCloseTrigger, setGuideCloseTrigger] = useState(0)     // increments to close guide
  // modalFirst panels always start as 'closed' regardless of localStorage, so
  // guideIsFloating is always false on mount — onFloat/onClose manage it at runtime.
  const [guideIsFloating, setGuideIsFloating] = useState(false)
  const [activityDockTrigger, setActivityDockTrigger] = useState(0) // increments to dock activity panel
  const [activityCloseTrigger, setActivityCloseTrigger] = useState(0) // increments to close activity panel
  const [activityDockedWidth, setActivityDockedWidth] = useState(0) // width when activity panel is docked right
  const [guideActiveTab, setGuideActiveTab] = useState('activities') // lifted from GuidePanelContent
  const isDesktop = useIsDesktop()
  const prevCompletedRef = useRef(false)
  // Tracks whether the activity panel is currently docked so we only fire
  // guideCloseTrigger on the transition TO docked (not on width-resize while docked).
  const activityIsDocked = useRef(false)
  // Remembers the last activity the user opened so Work can reopen it.
  const lastActivityRef = useRef(null)

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const observers = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-30% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  // Check completion
  useEffect(() => {
    if (isCompleted || prevCompletedRef.current) return
    const allDone = COMPLETION_REQUIRED.every(id => getActivityStatus(id, responses) === 'complete')
    if (allDone) {
      prevCompletedRef.current = true
      onComplete(100, { asset: 'france-republic-1792' })
    }
  }, [responses, isCompleted, onComplete])

  const handleSave = useCallback(async (key, value) => {
    if (value === null) {
      setResponses(prev => { const next = { ...prev }; delete next[key]; return next })
      await onResponse(key, null)
      return
    }
    setResponses(prev => ({ ...prev, [key]: value }))
    await onResponse(key, value)
  }, [onResponse])

  const openModal = useCallback((id) => {
    lastActivityRef.current = id
    setActiveModal(id)
    setActivityTrigger(t => t + 1)
    setGuideOpen(false)
  }, [])

  // Navigate between activities without closing the panel
  const navigateModal = useCallback((nextId) => {
    lastActivityRef.current = nextId
    setActiveModal(nextId)
  }, [])

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'smooth', block: 'start' })
  }, [])

  // Wraps scrollToSection for use inside the activity modal's evidence buttons.
  // On desktop, also docks the activity panel to the right (evidence mode) so the
  // user can read the dossier and the activity form simultaneously.
  const handleScrollToEvidence = useCallback((sectionId) => {
    scrollToSection(sectionId)
    if (isDesktop) setActivityDockTrigger(t => t + 1)
  }, [scrollToSection, isDesktop])

  // Stable onDockedChange handler for the guide panel. useCallback with [] gives a
  // stable reference so FloatingPanel's onDockedChange effect doesn't re-fire on
  // every parent render. State setters are guaranteed stable by React.
  const handleGuideDockedChange = useCallback((docked) => {
    setGuideDesktopOpen(docked)
    if (docked) setGuideIsFloating(false)
  }, [])

  // Stable onDockedChange handler for the activity panel.
  // Uses activityIsDocked ref to fire guideCloseTrigger only on the FIRST dock
  // transition (not on subsequent resize events while already docked).
  const handleActivityDockedChange = useCallback((isDocked, width) => {
    setActivityDockedWidth(isDocked ? width : 0)
    if (isDocked && !activityIsDocked.current) {
      setGuideCloseTrigger(t => t + 1)
    }
    activityIsDocked.current = isDocked
  }, [])

  // Explore view: dock the guide (activities tab), close the activity panel.
  const handleExplore = useCallback(() => {
    setActivityCloseTrigger(t => t + 1)
    setGuideActiveTab('activities')
    setGuideDockTrigger(t => t + 1)
  }, [])

  // Work view: dock the activity panel with the right activity, guide closes automatically.
  // Priority: last viewed → first not-started → first activity overall.
  const handleWork = useCallback(() => {
    const target =
      lastActivityRef.current ??
      ACTIVITIES.find(a => getActivityStatus(a.id, responses) === 'not-started')?.id ??
      ACTIVITIES.find(a => getActivityStatus(a.id, responses) === 'inprogress')?.id ??
      ACTIVITIES[0].id
    lastActivityRef.current = target
    setActiveModal(target)
    setActivityDockTrigger(t => t + 1)
  }, [responses])

  const handleSectionNavChange = (e) => {
    scrollToSection(e.target.value)
    setActiveSection(e.target.value)
  }

  const completedCount = COMPLETION_REQUIRED.filter(id => getActivityStatus(id, responses) === 'complete').length
  const progressPct = Math.round((completedCount / COMPLETION_REQUIRED.length) * 100)

  // Derive which nav button is active based on current panel states.
  // These reflect however the user arrived at the view (buttons, side-tabs, evidence dock, etc.)
  const isExploreActive = guideDesktopOpen && activityDockedWidth === 0
  const isWorkActive = activityDockedWidth > 0

  const guideProps = {
    responses,
    completedCount,
    totalCount: COMPLETION_REQUIRED.length,
    progressPct,
    openModal,
    onSave: handleSave,
    onReset,
    activeTab: guideActiveTab,
    setActiveTab: setGuideActiveTab,
    showTabs: !isDesktop || guideDesktopOpen || guideIsFloating,
  }

  return (
    <div className={s.shell}>
      {/* ── Activity Guide ── */}
      {isDesktop ? (
        <FloatingPanel
          id="france-guide"
          title="Activity Guide"
          side="left"
          width={600}
          defaultDockedWidth={260}
          maxDockedWidth={360}
          defaultHeight={700}
          initialState="closed"
          modalFirst
          noTab
          topOffset="var(--fr-nav-height)"
          triggerDock={guideDockTrigger}
          triggerClose={guideCloseTrigger}
          scrollTopKey={guideActiveTab}
          onDockedChange={handleGuideDockedChange}
          onFloat={() => setGuideIsFloating(true)}
          onClose={() => setGuideIsFloating(false)}
          themeVars={FR_THEME_VARS}
        >
          <GuidePanelContent {...guideProps} />
        </FloatingPanel>
      ) : (
        <nav className={`${s.guide} ${guideOpen ? s.open : ''}`} aria-label="Activity guide">
          <GuidePanelContent {...guideProps} />
        </nav>
      )}

      {/* ── Mobile guide backdrop ── */}
      {!isDesktop && guideOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.4)', zIndex: 34 }}
          onClick={() => setGuideOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Desktop guide side-tabs (visible when guide panel is closed) ── */}
      {isDesktop && !guideDesktopOpen && (
        <div className={`${s.guideSideTabs}${guideIsFloating ? ` ${s.guideSideTabsTucked}` : ''}`} aria-label="Open activity guide">
          <button
            className={s.guideSideTab}
            onClick={() => { setGuideActiveTab('activities'); setGuideDockTrigger(t => t + 1) }}
          >
            Activities
          </button>
          <button
            className={s.guideSideTab}
            onClick={() => { setGuideActiveTab('notes'); setGuideDockTrigger(t => t + 1) }}
          >
            Notes
          </button>
        </div>
      )}

      {/* ── Main content ── */}
      <div className={s.main} style={isDesktop && activityDockedWidth ? { paddingRight: `${activityDockedWidth}px` } : undefined}>
        {/* Section nav */}
        <nav className={s.sectionNav} aria-label="Dossier sections">
          {/* Far left — back link, outside the centred section links */}
          {backHref && (
            <Link to={backHref} className={s.navBack}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M10.5 6.5H2.5M5.5 3.5L2.5 6.5L5.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Labs
            </Link>
          )}

          {/* Centre — section content links, flex:1 so they sit between the flanking items */}
          <div className={s.sectionNavInner}>
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`${s.sectionNavLink} ${activeSection === id ? s.active : ''}`}
                onClick={e => { e.preventDefault(); scrollToSection(id) }}
              >
                {label}
              </a>
            ))}
            <select
              className={s.sectionNavSelect}
              value={activeSection}
              onChange={handleSectionNavChange}
              aria-label="Jump to section"
            >
              {SECTIONS.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>

          {/* Far right — Explore / Work view switcher */}
          <div className={s.navActions}>
            <button
              className={`${s.navActionBtn} ${isExploreActive ? s.navActionBtnActive : ''}`}
              onClick={handleExplore}
              aria-pressed={isExploreActive}
            >
              Explore
            </button>
            <button
              className={`${s.navActionBtn} ${isWorkActive ? s.navActionBtnActive : ''}`}
              onClick={handleWork}
              aria-pressed={isWorkActive}
            >
              Work
            </button>
          </div>
        </nav>

        {/* Dossier */}
        <div className={s.dossier}>
          {/* ── Intro / Hero ── */}
          <section id="intro" className={s.heroSection} aria-labelledby="intro-title">
            <div className={s.heroEyebrow}>AS Level History · Topic 1.2</div>
            <h1 id="intro-title" className={s.heroTitle}>From Monarchy to Republic</h1>
            <p className={s.heroQuestion}>How and why did France become a republic by 1792?</p>

            <div className={s.callout}>
              <strong>Key starting point:</strong> France did not automatically become a republic in 1789. Most revolutionaries initially wanted a constitutional monarchy, not a republic. Understanding how and why that settlement collapsed is the central challenge of this topic.
            </div>

            <div className={s.heroScenario}>
              <div className={s.heroScenarioLabel}>Historical scenario</div>
              It is late 1792. France has abolished the monarchy and declared itself a republic. Different observers offer competing explanations. Some blame Louis XVI and the flight to Varennes. Others argue that war made monarchy impossible. Some claim radical groups and popular pressure drove events forward. Others think the reforms of the Revolution destabilised the old order so deeply that monarchy could not survive. Counter-revolutionaries argue that the Revolution itself created chaos, but they have failed to stop it. Your task is to examine the dossier and prepare a historical briefing that explains both <em>how</em> monarchy collapsed and <em>which causes</em> best explain why France became a republic by 1792.
            </div>

            <div className={s.heroMeta}>
              <span className={s.heroMetaItem}><strong>Subject:</strong> AS Level History</span>
              <span className={s.heroMetaItem}><strong>Estimated time:</strong> 35–50 minutes</span>
              <span className={s.heroMetaItem}><strong>Activities:</strong> 9 guided tasks + final judgement</span>
            </div>

            <div style={{ marginTop: 28 }}>
              <div className={s.subHeading}>Spatial context — Paris, 1797</div>
              <p className={s.sectionBody} style={{ marginBottom: 16 }}>
                The map below is dated 1797 — use it for spatial orientation only. It helps locate the Tuileries Palace, the Champ de Mars, and the major faubourgs (suburbs) from which popular pressure came.
              </p>
              <div className={s.vaGrid} style={{ gridTemplateColumns: 'minmax(280px, 560px)' }}>
                <VisualAssetCard va={VISUAL_ASSETS.find(v => v.id === 'VA-007')} />
              </div>
            </div>
          </section>

          {/* ── Chronology ── */}
          <Section
            id="chronology"
            label="Evidence section"
            title="From reform to republic: 1789–1792"
            intro="A compressed view of the key developments. The pattern is not a single leap to republicanism, but a sequence of reform, constitutional settlement, loss of trust, war-time radicalisation, and institutional replacement."
          >
            <div style={{ overflowX: 'auto' }}>
              <table className={s.chronologyTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Event</th>
                    <th>Significance for the inquiry</th>
                  </tr>
                </thead>
                <tbody>
                  {CHRONOLOGY.map((row, i) => (
                    <tr key={i}>
                      <td className={s.chronoDate}>{row.date}</td>
                      <td><div className={s.chronoEvent}>{row.event}</div></td>
                      <td><div className={s.chronoSig}>{row.significance}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ── Pathway ── */}
          <Section
            id="pathway"
            label="Evidence section"
            title="How monarchy collapsed"
            intro="The republic did not emerge from one event. It emerged through a sequence of institutional changes: from the constitutional monarchy created in 1791, through the crisis of 1792, to the formal abolition of monarchy by the National Convention. Click each node to see what drove the transition."
          >
            <PathwayMap />
            <div className={s.tensionCard} style={{ marginTop: 28 }}>
              <div className={s.tensionLabel}>Interpretive tension</div>
              <div className={s.tensionText}>
                Was 10 August 1792 the decisive moment, or was it the culmination of a collapse that had already been set in motion — by Varennes, the war, factional conflict, and popular pressure? Most historians argue the republic was already de facto after 10 August; the Convention simply gave it legal form.
              </div>
            </div>
          </Section>

          {/* ── Groups ── */}
          <Section
            id="groups"
            label="Evidence section"
            title="Revolutionary groups"
            intro='The Revolution was not a unified movement. Different groups had different visions for France after 1789. Understanding how they disagreed — and why no stable centre held — is essential to explaining why constitutional monarchy could not survive. Note: "Girondins" is partly a retrospective label; contemporaries used terms like Brissotins or Rolandins.'
          >
            <div className={s.factionGrid}>
              {FACTIONS.map(f => (
                <div key={f.name} className={s.factionCard}>
                  <div className={s.factionName}>{f.name}</div>
                  <div className={s.factionRow}>
                    <div className={s.factionRowLabel}>Origins and leadership</div>
                    <div className={s.factionRowText}>{f.origins}</div>
                  </div>
                  <div className={s.factionRow}>
                    <div className={s.factionRowLabel}>Attitude to monarchy</div>
                    <div className={s.factionRowText}>{f.attitudeToMonarchy}</div>
                  </div>
                  <div className={s.factionRow}>
                    <div className={s.factionRowLabel}>Social / political base</div>
                    <div className={s.factionRowText}>{f.base}</div>
                  </div>
                  <div className={s.factionRow}>
                    <div className={s.factionRowLabel}>Key importance to the inquiry</div>
                    <div className={s.factionRowText}>{f.importance}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Counter-revolution ── */}
          <Section
            id="counter-revolution"
            label="Evidence section"
            title="Counter-revolution and opposition"
            intro="Counter-revolutionaries aimed to halt or reverse the Revolution. They included émigré nobles, refractory clergy, foreign powers, and domestic royalists. Understanding why they failed — and why their efforts often intensified republican pressure rather than deflecting it — is an explicit part of the AS Level syllabus for this topic."
          >
            <div className={s.sectionBody}>
              <p>The most important form of counter-revolutionary pressure in 1792 was foreign military intervention, co-ordinated with the émigré movement. The Duke of Brunswick's Manifesto of July 1792, threatening Paris with destruction if the royal family were harmed, is the clearest example of counter-revolutionary pressure backfiring: instead of protecting Louis XVI, it convinced many Parisians that the king was aligned with France's enemies.</p>
              <p>Refractory clergy — those who refused the oath to the Civil Constitution — provided a sustained domestic counter-revolutionary network rooted in parishes and local communities across France. Their presence sustained local conflict and gave the Revolution an enemy within as well as without.</p>
              <p>Émigré nobles, organised in armies beyond the Rhine and pressing European courts for military intervention, created the permanent sense of an external counter-revolutionary threat that reinforced the revolutionary logic of emergency, suspicion, and exclusion.</p>
            </div>
            <div className={s.tensionCard}>
              <div className={s.tensionLabel}>Key question</div>
              <div className={s.tensionText}>
                Did counter-revolution cause the republic, or did it fail to prevent one? The strongest historical argument is that counter-revolutionary pressure strengthened the republican case by making monarchy look like foreign collusion — the Brunswick Manifesto is the clearest evidence of this.
              </div>
            </div>
            <h3 className={s.subHeading}>Visual evidence: Brunswick Manifesto caricature</h3>
            <div className={s.vaGrid} style={{ gridTemplateColumns: 'minmax(260px, 400px)' }}>
              <VisualAssetCard va={VISUAL_ASSETS.find(v => v.id === 'VA-006')} />
            </div>
          </Section>

          {/* ── Reforms ── */}
          <Section
            id="reforms"
            label="Evidence section"
            title="Reforms: stabilising or destabilising?"
            intro="Revolutionary reforms aimed to rebuild France: rationalise the state, rescue its finances, and establish rights and law as the foundation of the new political order. But reforms are double-edged. Some of the most important reforms of 1789–1790 also created deep conflicts — especially religious reform — that weakened the Revolution's social basis and sustained counter-revolutionary opposition."
          >
            <div className={s.reformsGrid}>
              {REFORMS.map(r => (
                <div key={r.id} className={s.reformCard}>
                  <div className={s.reformType}>{r.type}</div>
                  <div className={s.reformName}>{r.name}</div>
                  <div className={s.reformDate}>{r.date}</div>
                  <div className={s.reformSummary}>{r.summary}</div>
                </div>
              ))}
            </div>
            <h3 className={s.subHeading}>Visual evidence: Declaration of the Rights of Man, 1789</h3>
            <p className={s.sectionBody} style={{ marginBottom: 16 }}>
              The Declaration established the revolutionary standards — nation, rights, law — against which all later political decisions would be judged. Note that this is a symbolic painted representation, not a neutral document image.
            </p>
            <div className={s.vaGrid} style={{ gridTemplateColumns: 'minmax(260px, 380px)' }}>
              <VisualAssetCard va={VISUAL_ASSETS.find(v => v.id === 'VA-001')} />
            </div>
          </Section>

          {/* ── King Trust ── */}
          <Section
            id="king-trust"
            label="Evidence section"
            title="Royal trust and political instability"
            intro="Constitutional monarchy depended on a double trust: the king's willingness to work within revolutionary constraints, and the revolutionary leadership's belief that he could be relied upon. The Flight to Varennes in June 1791 broke both. It did not immediately abolish monarchy — the Constitution of 1791 still followed — but it fatally damaged the legitimacy that made constitutional monarchy viable."
          >
            <div className={s.evidenceGrid}>
              {['ec-varennes', 'ec-constitution-1791', 'ec-champ-de-mars'].map(id => {
                const card = EVIDENCE_CARDS.find(c => c.id === id)
                return card ? <EvidenceCard key={id} card={card} /> : null
              })}
            </div>
            <div className={s.tensionCard} style={{ marginTop: 24 }}>
              <div className={s.tensionLabel}>Primary source — Louis XVI's declaration at Varennes</div>
              <div className={s.tensionText}>
                Louis XVI left behind a declaration defending his departure, arguing he had been treated as "a prisoner in his own states" and had sought to "place himself in safety." The declaration also criticised the constitution as giving him no real authority. Whether this can be read as a rejection of constitutional monarchy altogether is one of the central interpretive questions of the period.
              </div>
            </div>
            <h3 className={s.subHeading}>Visual evidence: Varennes and Champ de Mars</h3>
            <div className={s.vaGrid}>
              <VisualAssetCard va={VISUAL_ASSETS.find(v => v.id === 'VA-003')} />
              <VisualAssetCard va={VISUAL_ASSETS.find(v => v.id === 'VA-002')} />
            </div>
          </Section>

          {/* ── War Radicalisation ── */}
          <Section
            id="war-radicalisation"
            label="Evidence section"
            title="War, fear, and radicalisation"
            intro="War changed the political atmosphere of the Revolution. It did not cause distrust of the king — that preceded it — but it transformed distrust into emergency. War connected foreign threat, treason fears, popular mobilisation, and executive failure into a single escalating crisis. The Brunswick Manifesto and the fall of the Tuileries are the clearest evidence of how this worked."
          >
            <div className={s.evidenceGrid}>
              {['ec-war-1792', 'ec-brunswick', 'ec-20-june', 'ec-10-august', 'ec-september-massacres'].map(id => {
                const card = EVIDENCE_CARDS.find(c => c.id === id)
                return card ? <EvidenceCard key={id} card={card} /> : null
              })}
            </div>
            <h3 className={s.subHeading}>Visual evidence: Fall of the Tuileries and September Massacres</h3>
            <div className={s.vaGrid}>
              <VisualAssetCard va={VISUAL_ASSETS.find(v => v.id === 'VA-004')} />
              <VisualAssetCard va={VISUAL_ASSETS.find(v => v.id === 'VA-005')} />
            </div>
          </Section>

          {/* ── Turning Points ── */}
          <Section
            id="turning-points"
            label="Evidence section"
            title="Turning point or cumulative collapse?"
            intro="A turning point analysis forces us to ask: was there one decisive event, or did monarchy collapse through accumulated pressures? The table below gives the best historical judgement for each possible turning point. The answer matters for how you construct your final argument."
          >
            <div className={s.turningPointList}>
              {TURNING_POINTS.map(tp => (
                <div key={tp.id} className={s.tpCard}>
                  <div>
                    <div className={s.tpEvent}>{tp.event}</div>
                    <div className={s.tpCol}>
                      <label>Why it matters</label>
                      <div className={s.tpColText}>{tp.whyItMatters}</div>
                    </div>
                  </div>
                  <div>
                    <div className={s.tpCol}>
                      <label>Best judgement</label>
                      <div className={s.tpJudgement}>{tp.bestJudgement}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.tensionCard} style={{ marginTop: 20 }}>
              <div className={s.tensionLabel}>Synthesis point</div>
              <div className={s.tensionText}>
                The strongest single institutional event is 10 August 1792. But 10 August only makes sense as the decisive break if we understand why it was possible — which requires all the prior causes: Varennes, the war, factionalism, religious division, and popular mobilisation. A "cumulative collapse with a decisive accelerant" model is the most defensible synthesis.
              </div>
            </div>
          </Section>

          {/* ── Cause Map ── */}
          <Section
            id="cause-map"
            label="Evidence section"
            title="Cause map and cause-weighing"
            intro="The cause map below organises factors by their causal role: structural pressures (long-term conditions), accelerating factors (developments that turned fragility into crisis), and triggering events (those that produced institutional breakdown). Click any node for a brief explanation."
          >
            <CauseMap />
            <h3 className={s.subHeading}>Cause-weighing guide</h3>
            <p className={s.sectionBody}>
              When you weigh causes in Activity 9, consider these questions for each factor: Was the republic possible without it? Did it weaken monarchy, strengthen republicanism, or both? Was it long-term, short-term, or immediate? Did it interact with other factors to become more or less decisive?
            </p>
            <div className={s.tensionCard} style={{ marginTop: 20 }}>
              <div className={s.tensionLabel}>Avoid this weak explanation</div>
              <div className={s.tensionText}>
                "The French Revolution was republican from the beginning." This misconception treats the republic as inevitable. The 1791 Constitution, accepted by the king and supported by many revolutionaries, shows that constitutional monarchy still had serious defenders a full year after Varennes.
              </div>
            </div>
          </Section>

          {/* ── Glossary ── */}
          <Section
            id="glossary"
            label="Reference"
            title="Key terms"
            intro="Expand any term for a working definition. These terms recur across the constitutional texts, reform debates, and factional summaries in this dossier."
          >
            <div className={s.glossaryGrid}>
              {GLOSSARY.map(g => (
                <details key={g.term} className={s.glossaryItem}>
                  <summary>{g.term}</summary>
                  <div className={s.glossaryDef}>{g.definition}</div>
                </details>
              ))}
            </div>
          </Section>

          {/* ── Synthesis ── */}
          <Section
            id="synthesis"
            label="Final task"
            title="Final judgement and reflection"
            intro="Use this section with the Final task activity. The structured builder in the activity panel will help you pull together your saved notes and construct an AS Level-style historical judgement."
          >
            <div className={s.sectionBody}>
              <p><strong>The central inquiry question:</strong> <em>How and why did France become a republic by 1792?</em></p>
              <p>A strong answer addresses both parts. <strong>How</strong> requires you to explain the political pathway — the mechanism by which constitutional monarchy moved through institutional crisis to the National Convention and formal abolition of monarchy. <strong>Why</strong> requires you to judge which causes were most significant and how they interacted.</p>
              <p>The most defensible synthesis is <strong>cumulative collapse with decisive accelerants</strong>. Varennes mattered because it destroyed trust, but constitutional monarchy still survived for a year after it. War, invasion fear, the Brunswick Manifesto, and the insurrection of 10 August then transformed distrust into political overthrow. The republic was the result of accumulated breakdown, not a single cause.</p>
            </div>
            <div className={s.tensionCard}>
              <div className={s.tensionLabel}>Success criteria for your final response</div>
              <div className={s.tensionText}>
                Uses accurate content knowledge · Supports claims with evidence · Explains the pathway (not only causes) · Shows clear causal reasoning · Weighs competing factors · Makes a justified conclusion · Reflects awareness that the outcome was not inevitable
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <button
                className={s.saveBtn}
                style={{ fontSize: 14, padding: '10px 22px' }}
                onClick={() => openModal('final')}
              >
                Open final task
              </button>
            </div>
          </Section>
        </div>
      </div>

      {/* ── Mobile activity trigger ── */}
      {!isDesktop && (
        <button
          className={s.mobileActivityTrigger}
          onClick={() => setGuideOpen(prev => !prev)}
          aria-label={`${guideOpen ? 'Close' : 'Open'} activity guide`}
          aria-expanded={guideOpen}
        >
          Activities ({completedCount}/{COMPLETION_REQUIRED.length})
        </button>
      )}

      {/* ── Activity panel (FloatingPanel, right side) ── */}
      {isDesktop && (
        <FloatingPanel
          id="france-activity"
          title={activeModal ? (ACTIVITIES.find(a => a.id === activeModal)?.label ?? 'Activity') : 'Activity'}
          side="right"
          width={600}
          defaultDockedWidth={480}
          defaultHeight={700}
          initialState="closed"
          topOffset="var(--fr-nav-height)"
          triggerOpen={activityTrigger}
          triggerDock={activityDockTrigger}
          triggerClose={activityCloseTrigger}
          scrollTopKey={activeModal}
          onClose={() => setActiveModal(null)}
          onDockedChange={handleActivityDockedChange}
          modalFirst
          noTab
          themeVars={FR_THEME_VARS}
        >
          {activeModal && (
            <ActivityModal
              activityId={activeModal}
              responses={responses}
              onSave={handleSave}
              onNavigate={navigateModal}
              scrollToSection={handleScrollToEvidence}
            />
          )}
        </FloatingPanel>
      )}

      {/* ── Mobile: activity modal ── */}
      {!isDesktop && activeModal && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.48)', zIndex: 50 }}
            onClick={() => setActiveModal(null)}
            aria-hidden="true"
          />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 560, zIndex: 51, overflowY: 'auto', background: 'var(--fr-paper, #fff)', borderLeft: '1px solid var(--fr-rule, #e5e7eb)' }}>
            <ActivityModal
              activityId={activeModal}
              responses={responses}
              onSave={handleSave}
              onNavigate={navigateModal}
              onClose={() => setActiveModal(null)}
              showHeader
              scrollToSection={scrollToSection}
            />
          </div>
        </>
      )}
    </div>
  )
}

// ── Evidence card component ──────────────────────────────────────────────────
function EvidenceCard({ card }) {
  return (
    <div className={s.evidenceCard}>
      <div className={s.evidenceCardHeader}>
        <div className={s.evidenceCardType}>{card.type}</div>
        <div className={s.evidenceCardTitle}>{card.title}</div>
        {card.date && <div className={s.evidenceCardDate}>{card.date}</div>}
      </div>
      <div className={s.evidenceCardBody}>
        <div className={s.evidenceText}>{card.evidence}</div>
        <div className={s.evidenceCardWhy}>
          <div className={s.evidenceCardWhyLabel}>Why it matters</div>
          <div className={s.evidenceCardWhyText}>{card.whyItMatters}</div>
        </div>
      </div>
    </div>
  )
}
