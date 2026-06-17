import { useState, useEffect, useRef, useCallback } from 'react'
import './tokens.css'
import LabNav from './LabNav/LabNav.jsx'
import LabSidebar, { TAB_LABELS } from './LabSidebar/LabSidebar.jsx'
import ActivityBody from './ActivityPanel/ActivityBody.jsx'
import EvidenceViewer from './EvidenceViewer/EvidenceViewer.jsx'
import ConceptsModal from './ConceptsModal/ConceptsModal.jsx'
import { useIsDesktop } from './hooks/useIsDesktop.js'
import s from './LabShell2.module.css'

/**
 * LabShellInquiry — "activity-primary" variant of LabShell.
 *
 * Inverts the content/activity relationship: the scrollable main column IS the
 * sequence of activities (each rendered full-width via ActivityBody stacked
 * mode), while evidence/reference lives in surfaces — a left sidebar (cards,
 * chronology, glossary, units) and a right-side EvidenceViewer overlay (full dossier).
 *
 * The logic layer (response persistence, completion tracking, section nav) is
 * identical to LabShell; only the layout and the location of activities vs
 * evidence differ. LabShell itself is untouched.
 */
function CollapsibleBackground({ title = 'Background', children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={s.bg}>
      <button
        className={s.bgToggle}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className={`${s.bgChevron}${open ? ` ${s.bgChevronOpen}` : ''}`}>▶</span>
        {title}
      </button>
      {open && <div className={s.bgBody}>{children}</div>}
    </div>
  )
}

export default function LabShell2({
  config,
  onResponse,
  onComplete,
  savedResponses,
  isCompleted,
  onReset,
  backHref,
  className,
  children,
}) {
  const labId = config.labId

  // ── Response state ──────────────────────────────────────────────────────────
  const [responses, setResponses] = useState(savedResponses ?? {})

  // ── Guide sidebar state (left — evidence/reference tabs) ─────────────────────
  const [guideActiveTab, setGuideActiveTab] = useState(config.sidebar.defaultTab ?? 'cards')
  const [guideDesktopOpen, setGuideDesktopOpen] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`fp_${labId}-guide`) ?? 'null')
      return stored?.state === 'docked'
    } catch { return false }
  })
  const [guideIsFloating, setGuideIsFloating] = useState(false)
  const [guideDockTrigger, setGuideDockTrigger]   = useState(0)
  const [guideCloseTrigger, setGuideCloseTrigger] = useState(0)
  const [guideOpen, setGuideOpen] = useState(false)  // mobile drawer

  // ── Evidence viewer state ────────────────────────────────────────────────────
  const [activeEvidenceId, setActiveEvidenceId] = useState(null)
  const [evidenceViewerOpen, setEvidenceViewerOpen] = useState(false)
  const [visitedEvidence, setVisitedEvidence] = useState(() => new Set())

  // ── Card viewer state ─────────────────────────────────────────────────────────
  const [activeCardId, setActiveCardId] = useState(null)
  const [cardViewerOpen, setCardViewerOpen] = useState(false)
  const [visitedCards, setVisitedCards] = useState(() => new Set())

  // ── Concepts modal state (optional) ──────────────────────────────────────────
  const [activeConceptId, setActiveConceptId]     = useState(null)
  const [conceptTrigger, setConceptTrigger]       = useState(0)
  const [conceptCloseTrigger, setConceptCloseTrigger] = useState(0)

  // ── Section nav tracking ─────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState(config.nav?.sections?.[0]?.id ?? null)

  const isDesktop        = useIsDesktop()
  const prevCompletedRef = useRef(false)

  // ── Completion tracking (identical to LabShell) ──────────────────────────────
  useEffect(() => {
    if (isCompleted || prevCompletedRef.current) return
    const required = config.activities.filter(a => a.required !== false)
    const allDone  = required.every(a => config.getActivityStatus(a.id, responses) === 'complete')
    if (allDone && required.length > 0) {
      prevCompletedRef.current = true
      onComplete(100, { asset: labId })
    }
  }, [responses, isCompleted, onComplete, config, labId])

  // ── Concepts open animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (activeConceptId) setConceptTrigger(t => t + 1)
  }, [activeConceptId])

  // ── IntersectionObserver: highlight active section in nav ───────────────────
  useEffect(() => {
    const sections = config.nav?.sections
    if (!sections?.length) return
    const observers = []
    sections.forEach(({ id }) => {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── handleSave (identical to LabShell) ───────────────────────────────────────
  const handleSave = useCallback(async (key, value) => {
    if (value === null) {
      setResponses(prev => { const next = { ...prev }; delete next[key]; return next })
      await onResponse(key, null)
      return
    }
    setResponses(prev => ({ ...prev, [key]: value }))
    await onResponse(key, value)
  }, [onResponse])

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const navHeight = parseFloat(getComputedStyle(el).getPropertyValue('--lab-nav-height')) || 44
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16
    window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced ? 'instant' : 'smooth' })
  }, [])

  // ── Evidence viewer ──────────────────────────────────────────────────────────
  const openEvidence = useCallback((id) => {
    setCardViewerOpen(false)
    setActiveEvidenceId(id)
    setEvidenceViewerOpen(true)
    setVisitedEvidence(prev => new Set([...prev, id]))
  }, [])

  const navigateEvidence = useCallback((id) => {
    setActiveEvidenceId(id)
    setVisitedEvidence(prev => new Set([...prev, id]))
  }, [])

  const closeEvidence = useCallback(() => setEvidenceViewerOpen(false), [])

  // ── Card viewer ───────────────────────────────────────────────────────────────
  const openCard = useCallback((id) => {
    setEvidenceViewerOpen(false)
    setActiveCardId(id)
    setCardViewerOpen(true)
    setVisitedCards(prev => new Set([...prev, id]))
  }, [])

  const navigateCard = useCallback((id) => {
    setActiveCardId(id)
    setVisitedCards(prev => new Set([...prev, id]))
  }, [])

  const closeCard = useCallback(() => setCardViewerOpen(false), [])

  // ── Guide sidebar handlers ───────────────────────────────────────────────────
  const handleGuideDockedChange = useCallback((docked) => {
    setGuideDesktopOpen(docked)
    if (docked) setGuideIsFloating(false)
  }, [])

  // ── Concepts ─────────────────────────────────────────────────────────────────
  const openConcept   = useCallback((id) => setActiveConceptId(id), [])
  const navigateConcept = useCallback((id) => setActiveConceptId(id), [])

  // ── Derived values ───────────────────────────────────────────────────────────
  const requiredActs   = config.activities.filter(a => a.required !== false)
  const completedCount = requiredActs.filter(a => config.getActivityStatus(a.id, responses) === 'complete').length
  const totalCount     = requiredActs.length

  const tabs      = config.sidebar.tabs ?? ['cards']
  const themeVars = config.themeVars ?? []

  const IntroComponent = config.introComponent ?? null

  // ── Custom sidebar tab content ───────────────────────────────────────────────
  function renderTabContent() {
    const TabComponent = config.customTabs?.[guideActiveTab]
    if (!TabComponent) return null
    return (
      <TabComponent
        onOpenEvidence={openEvidence}
        onOpenCard={openCard}
        onOpenConcept={openConcept}
        visitedEvidence={visitedEvidence}
        visitedCards={visitedCards}
        evidenceDocuments={config.evidence?.documents ?? []}
      />
    )
  }

  const sectionIdFor = (activity) => `s-${activity.id}`

  return (
    <div className={`${s.shell} ${className ?? ''}`}>
      <LabNav
        config={config}
        backHref={backHref}
        isExploreActive={false}
        isWorkActive={false}
        onExplore={() => {}}
        onWork={() => {}}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      {/* ── Left guide sidebar (evidence/reference tabs) ── */}
      {isDesktop && (
        <LabSidebar
          config={config}
          labId={labId}
          triggerDock={guideDockTrigger}
          triggerClose={guideCloseTrigger}
          activeTab={guideActiveTab}
          onTabChange={setGuideActiveTab}
          onDockedChange={handleGuideDockedChange}
          onFloat={() => setGuideIsFloating(true)}
          onClose={() => setGuideIsFloating(false)}
          themeVars={themeVars}
        >
          {renderTabContent()}
        </LabSidebar>
      )}

      {/* ── Mobile guide drawer ── */}
      {!isDesktop && (
        <>
          <LabSidebar
            config={config}
            labId={labId}
            isMobile
            guideOpen={guideOpen}
            onMobileClose={() => setGuideOpen(false)}
            activeTab={guideActiveTab}
            onTabChange={setGuideActiveTab}
          >
            {renderTabContent()}
          </LabSidebar>
          {guideOpen && (
            <div className={s.mobileBackdrop} onClick={() => setGuideOpen(false)} aria-hidden="true" />
          )}
        </>
      )}

      {/* ── Desktop side tabs (shown when guide is closed) ── */}
      {isDesktop && !guideDesktopOpen && (
        <div className={`${s.sideTabs} ${guideIsFloating ? s.sideTabsTucked : ''}`} aria-label="Open reference">
          {tabs.map(tab => (
            <button
              key={tab}
              className={s.sideTab}
              onClick={() => { setGuideActiveTab(tab); setGuideDockTrigger(t => t + 1) }}
            >
              {TAB_LABELS[tab] ?? tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* ── Main content: the activity stack ── */}
      <div className={s.main}>
        <div className={s.content} style={{ maxWidth: config.content?.maxWidth ?? '880px' }}>
          {IntroComponent && (
            <section id="s-intro" className={s.introSection}>
              <IntroComponent openEvidence={openEvidence} />
            </section>
          )}

          {config.activities.map((activity, i) => {
            const Background = config.activityBackgrounds?.[activity.id] ?? null
            const status     = config.getActivityStatus(activity.id, responses)
            return (
              <section key={activity.id} id={sectionIdFor(activity)} className={s.activitySection}>
                {Background && (
                  <CollapsibleBackground title="Background & evidence">
                    <Background openEvidence={openEvidence} />
                  </CollapsibleBackground>
                )}
                <div className={s.activityCard}>
                  <ActivityBody
                    config={config}
                    activity={activity}
                    actIndex={i}
                    responses={responses}
                    isCompleted={status === 'complete'}
                    handleSave={handleSave}
                    onNavigate={null}
                    onScrollTo={scrollToSection}
                    onOpenEvidence={openEvidence}
                    onOpenConcept={openConcept}
                    onClose={null}
                    stacked
                    hideNav
                  />
                </div>
              </section>
            )
          })}

          {typeof children === 'function'
            ? children({ openEvidence, openConcept, responses, scrollToSection, onSave: handleSave })
            : children}
        </div>
      </div>

      {/* ── Mobile reference trigger ── */}
      {!isDesktop && (
        <button
          className={s.mobileTrigger}
          onClick={() => setGuideOpen(p => !p)}
          aria-label={`${guideOpen ? 'Close' : 'Open'} reference`}
          aria-expanded={guideOpen}
        >
          Reference
        </button>
      )}

      {/* ── Evidence viewer overlay ── */}
      {config.evidenceComponent && (
        <EvidenceViewer
          documents={config.evidence?.documents ?? []}
          EvidenceComponent={config.evidenceComponent}
          activeId={activeEvidenceId}
          onNavigate={navigateEvidence}
          onClose={closeEvidence}
          isOpen={evidenceViewerOpen}
          visitedIds={visitedEvidence}
        />
      )}

      {/* ── Card viewer overlay ── */}
      {config.cardComponent && (
        <EvidenceViewer
          documents={config.cards?.documents ?? []}
          EvidenceComponent={config.cardComponent}
          activeId={activeCardId}
          onNavigate={navigateCard}
          onClose={closeCard}
          isOpen={cardViewerOpen}
          visitedIds={visitedCards}
          dossierLabel="Evidence cards"
        />
      )}

      {/* ── Concepts modal (optional) ── */}
      {config.concepts && (
        <ConceptsModal
          config={config}
          labId={labId}
          activeConceptId={activeConceptId}
          onNavigateConcept={navigateConcept}
          onClose={() => setActiveConceptId(null)}
          triggerOpen={conceptTrigger}
          triggerClose={conceptCloseTrigger}
          themeVars={themeVars}
        />
      )}
    </div>
  )
}
