import { useState, useEffect, useRef, useCallback } from 'react'
import './tokens.css'
import LabNav from './LabNav/LabNav.jsx'
import LabRail from './LabRail/LabRail.jsx'
import ActivityBody from './ActivityPanel/ActivityBody.jsx'
import EvidenceViewer from './EvidenceViewer/EvidenceViewer.jsx'
import ConceptsModal from './ConceptsModal/ConceptsModal.jsx'
import { useIsDesktop } from './hooks/useIsDesktop.js'
import s from './LabShell2.module.css'

const RAIL_LABELS = {
  cards:      'Cards',
  evidence:   'Evidence',
  chronology: 'Timeline',
  glossary:   'Glossary',
  units:      'Units',
}

function CollapsibleBackground({ title = 'Background', children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={s.bg}>
      <button className={s.bgToggle} onClick={() => setOpen(v => !v)} aria-expanded={open}>
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

  // ── Response state ────────────────────────────────────────────────────────────
  const [responses, setResponses] = useState(savedResponses ?? {})

  // ── Evidence viewer state ─────────────────────────────────────────────────────
  const [activeEvidenceId, setActiveEvidenceId] = useState(null)
  const [evidenceViewerOpen, setEvidenceViewerOpen] = useState(false)
  const [visitedEvidence, setVisitedEvidence] = useState(() => new Set())

  // ── Card viewer state ─────────────────────────────────────────────────────────
  const [activeCardId, setActiveCardId] = useState(null)
  const [cardViewerOpen, setCardViewerOpen] = useState(false)
  const [visitedCards, setVisitedCards] = useState(() => new Set())

  // ── Single-section overlays ───────────────────────────────────────────────────
  const [chronologyOpen, setChronologyOpen] = useState(false)
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [unitsOpen, setUnitsOpen] = useState(false)

  // ── Concepts modal (optional) ─────────────────────────────────────────────────
  const [activeConceptId, setActiveConceptId]         = useState(null)
  const [conceptTrigger, setConceptTrigger]           = useState(0)
  const [conceptCloseTrigger, setConceptCloseTrigger] = useState(0)

  // ── Section nav tracking ──────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState(config.nav?.sections?.[0]?.id ?? null)

  const isDesktop        = useIsDesktop()
  const prevCompletedRef = useRef(false)

  // ── Completion tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isCompleted || prevCompletedRef.current) return
    const required = config.activities.filter(a => a.required !== false)
    const allDone  = required.every(a => config.getActivityStatus(a.id, responses) === 'complete')
    if (allDone && required.length > 0) {
      prevCompletedRef.current = true
      onComplete(100, { asset: labId })
    }
  }, [responses, isCompleted, onComplete, config, labId])

  useEffect(() => {
    if (activeConceptId) setConceptTrigger(t => t + 1)
  }, [activeConceptId])

  // ── Section intersection observer ────────────────────────────────────────────
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

  // ── handleSave ────────────────────────────────────────────────────────────────
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

  // ── Close all overlays ────────────────────────────────────────────────────────
  const closeAllOverlays = useCallback(() => {
    setEvidenceViewerOpen(false)
    setCardViewerOpen(false)
    setChronologyOpen(false)
    setGlossaryOpen(false)
    setUnitsOpen(false)
  }, [])

  // ── Evidence viewer ───────────────────────────────────────────────────────────
  const openEvidence = useCallback((id) => {
    closeAllOverlays()
    setActiveEvidenceId(id)
    setEvidenceViewerOpen(true)
    setVisitedEvidence(prev => new Set([...prev, id]))
  }, [closeAllOverlays])

  const navigateEvidence = useCallback((id) => {
    setActiveEvidenceId(id)
    setVisitedEvidence(prev => new Set([...prev, id]))
  }, [])

  const closeEvidence = useCallback(() => setEvidenceViewerOpen(false), [])

  // ── Card viewer ───────────────────────────────────────────────────────────────
  const openCard = useCallback((id) => {
    closeAllOverlays()
    setActiveCardId(id)
    setCardViewerOpen(true)
    setVisitedCards(prev => new Set([...prev, id]))
  }, [closeAllOverlays])

  const navigateCard = useCallback((id) => {
    setActiveCardId(id)
    setVisitedCards(prev => new Set([...prev, id]))
  }, [])

  const closeCard = useCallback(() => setCardViewerOpen(false), [])

  // ── Concepts ──────────────────────────────────────────────────────────────────
  const openConcept   = useCallback((id) => setActiveConceptId(id), [])
  const navigateConcept = useCallback((id) => setActiveConceptId(id), [])

  // ── Rail sections ─────────────────────────────────────────────────────────────
  const tabs = config.sidebar?.tabs ?? []
  const firstEvidenceId = config.evidence?.documents?.[0]?.id
  const firstCardId     = config.cards?.documents?.[0]?.id

  const railSections = tabs
    .filter(id => RAIL_LABELS[id])
    .map(id => ({
      id,
      label:        RAIL_LABELS[id],
      isOpen:
        (id === 'cards'      && cardViewerOpen) ||
        (id === 'evidence'   && evidenceViewerOpen) ||
        (id === 'chronology' && chronologyOpen) ||
        (id === 'glossary'   && glossaryOpen) ||
        (id === 'units'      && unitsOpen),
      visitedCount:
        id === 'cards'    ? visitedCards.size :
        id === 'evidence' ? visitedEvidence.size : 0,
    }))

  const handleRailSelect = useCallback((id) => {
    const isCurrentlyOpen =
      (id === 'cards'      && cardViewerOpen)      ||
      (id === 'evidence'   && evidenceViewerOpen)  ||
      (id === 'chronology' && chronologyOpen)      ||
      (id === 'glossary'   && glossaryOpen)        ||
      (id === 'units'      && unitsOpen)

    closeAllOverlays()

    if (!isCurrentlyOpen) {
      if      (id === 'cards')      openCard(activeCardId ?? firstCardId)
      else if (id === 'evidence')   openEvidence(activeEvidenceId ?? firstEvidenceId)
      else if (id === 'chronology') setChronologyOpen(true)
      else if (id === 'glossary')   setGlossaryOpen(true)
      else if (id === 'units')      setUnitsOpen(true)
    }
  }, [
    cardViewerOpen, evidenceViewerOpen, chronologyOpen, glossaryOpen, unitsOpen,
    activeCardId, activeEvidenceId, firstCardId, firstEvidenceId,
    closeAllOverlays, openCard, openEvidence,
  ])

  // ── Mobile bottom bar section selection ───────────────────────────────────────
  const handleMobileSelect = handleRailSelect

  // ── Derived values ────────────────────────────────────────────────────────────
  const requiredActs   = config.activities.filter(a => a.required !== false)
  const completedCount = requiredActs.filter(a => config.getActivityStatus(a.id, responses) === 'complete').length
  const totalCount     = requiredActs.length
  const themeVars      = config.themeVars ?? []
  const IntroComponent = config.introComponent ?? null

  // Lazy-load per-section overlay components from config
  const ChronologyOverlay = config.chronologyComponent ?? null
  const GlossaryOverlay   = config.glossaryComponent   ?? null
  const UnitsOverlay      = config.unitsComponent      ?? null

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

      {/* ── Permanent vertical nav rail (desktop) ── */}
      {isDesktop && tabs.length > 0 && (
        <LabRail sections={railSections} onSelect={handleRailSelect} />
      )}

      {/* ── Main content: the activity stack ── */}
      <div className={`${s.main} ${isDesktop && tabs.length > 0 ? s.mainWithRail : ''}`}>
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

      {/* ── Mobile bottom tab bar ── */}
      {!isDesktop && tabs.length > 0 && (
        <div className={s.mobileBar} role="navigation" aria-label="Reference sections">
          {railSections.map(sec => (
            <button
              key={sec.id}
              className={`${s.mobileBarBtn} ${sec.isOpen ? s.mobileBarBtnActive : ''}`}
              onClick={() => handleMobileSelect(sec.id)}
              aria-pressed={sec.isOpen}
            >
              {sec.label}
            </button>
          ))}
        </div>
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

      {/* ── Single-document overlays ── */}
      {ChronologyOverlay && (
        <ChronologyOverlay isOpen={chronologyOpen} onClose={() => setChronologyOpen(false)} />
      )}
      {GlossaryOverlay && (
        <GlossaryOverlay isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
      )}
      {UnitsOverlay && (
        <UnitsOverlay isOpen={unitsOpen} onClose={() => setUnitsOpen(false)} />
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
