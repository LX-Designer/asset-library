import { useState, useEffect, useRef, useCallback } from 'react'
import './tokens.css'
import LabNav from './LabNav/LabNav.jsx'
import LabSidebar, { TAB_LABELS } from './LabSidebar/LabSidebar.jsx'
import ActivitiesTab from './LabSidebar/tabs/ActivitiesTab.jsx'
import ConceptsTab from './LabSidebar/tabs/ConceptsTab.jsx'
import NotesTab from './LabSidebar/tabs/NotesTab.jsx'
import ActivityPanel from './ActivityPanel/ActivityPanel.jsx'
import ConceptsModal from './ConceptsModal/ConceptsModal.jsx'
import EvidencePanel from './EvidencePanel/EvidencePanel.jsx'
import ActivityBody from './ActivityPanel/ActivityBody.jsx'
import SpeechInput from '../components/SpeechInput/SpeechInput.jsx'
import { useIsDesktop } from './hooks/useIsDesktop.js'
import s from './LabShell.module.css'

export default function LabShell({
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

  // ── Activity panel state ────────────────────────────────────────────────────
  const [activeActivityId, setActiveActivityId] = useState(null)
  const [activityTrigger, setActivityTrigger]       = useState(0)
  const [activityDockTrigger, setActivityDockTrigger]   = useState(0)
  const [activityCloseTrigger, setActivityCloseTrigger] = useState(0)
  const [activityDockedWidth, setActivityDockedWidth]   = useState(0)
  const activityIsDocked = useRef(false)
  const lastActivityRef  = useRef(null)

  // ── Guide sidebar state ─────────────────────────────────────────────────────
  const [guideActiveTab, setGuideActiveTab] = useState(config.sidebar.defaultTab ?? 'activities')
  // Initialise from localStorage so the first render agrees with FloatingPanel,
  // eliminating the side-tab flash on mount.
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

  // ── Concepts modal state ────────────────────────────────────────────────────
  const [activeConceptId, setActiveConceptId]     = useState(null)
  const [conceptTrigger, setConceptTrigger]       = useState(0)
  const [conceptCloseTrigger, setConceptCloseTrigger] = useState(0)

  // ── Evidence panel state ─────────────────────────────────────────────────────
  const [activeEvidenceId, setActiveEvidenceId] = useState(null)
  const [evidenceTrigger, setEvidenceTrigger]   = useState(0)

  // ── Section nav active tracking ─────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState(
    config.nav?.sections?.[0]?.id ?? null
  )

  // ── Notes ───────────────────────────────────────────────────────────────────
  const notesValue = typeof responses['lab-notes'] === 'string' ? responses['lab-notes'] : ''

  // ── Misc ────────────────────────────────────────────────────────────────────
  const isDesktop       = useIsDesktop()
  const prevCompletedRef = useRef(false)

  // ── Completion tracking ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isCompleted || prevCompletedRef.current) return
    const required = config.activities.filter(a => a.required !== false)
    const allDone  = required.every(a => {
      const status = config.getActivityStatus(a.id, responses)
      return status === 'complete'
    })
    if (allDone && required.length > 0) {
      prevCompletedRef.current = true
      onComplete(100, { asset: labId })
    }
  }, [responses, isCompleted, onComplete, config, labId])

  // ── Open concept modal when activeConceptId changes ─────────────────────────
  useEffect(() => {
    if (activeConceptId) setConceptTrigger(t => t + 1)
  }, [activeConceptId])

  // Note: evidenceTrigger is NOT incremented on every activeEvidenceId change —
  // only openEvidence() triggers the open animation. navigateEvidence() just
  // swaps the content without re-centering or re-running the modal-first animation.

  // ── IntersectionObserver: highlight active section in nav ───────────────────
  // Runs once on mount — config is a stable imported constant.
  // rootMargin shrinks the viewport to a band in the upper half so a section
  // becomes "active" as its top edge scrolls into reading position.
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

  // ── handleSave ──────────────────────────────────────────────────────────────
  const handleSave = useCallback(async (key, value) => {
    if (value === null) {
      setResponses(prev => { const next = { ...prev }; delete next[key]; return next })
      await onResponse(key, null)
      return
    }
    setResponses(prev => ({ ...prev, [key]: value }))
    await onResponse(key, value)
  }, [onResponse])

  // ── Open / navigate activities ──────────────────────────────────────────────
  const openActivity = useCallback((id) => {
    lastActivityRef.current = id
    setActiveActivityId(id)
    if (activeActivityId === null) {
      // Panel is closed — trigger the open animation, which will close the sidebar.
      setActivityTrigger(t => t + 1)
    }
    // If panel is already open, just swap the content in-place. Leave sidebar alone.
    setGuideOpen(false) // always close the mobile drawer
  }, [activeActivityId])

  const navigateActivity = useCallback((id) => {
    lastActivityRef.current = id
    setActiveActivityId(id)
  }, [])

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Offset by the fixed nav height (read from CSS var so it works for any lab)
    // plus 16px breathing room so the heading clears the nav comfortably.
    const navHeight = parseFloat(getComputedStyle(el).getPropertyValue('--lab-nav-height')) || 44
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16
    window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced ? 'instant' : 'smooth' })
  }, [])

  const handleScrollToEvidence = useCallback((sectionId) => {
    const panelAlreadyDocked = activityDockedWidth > 0
    if (isDesktop) setActivityDockTrigger(t => t + 1)

    if (panelAlreadyDocked) {
      // Panel was already docked — no layout transition fires, so one
      // animation frame is enough for React to commit before measuring.
      requestAnimationFrame(() => scrollToSection(sectionId))
    } else {
      // Panel is floating and will now dock. Docking triggers a CSS transition
      // on padding-right (duration: --lab-transition ≈ 160ms) plus an instant
      // guide-sidebar grid collapse. Wait until both have settled so the
      // scroll target is measured against the final layout, not a mid-
      // transition state that shifts the section position.
      setTimeout(() => scrollToSection(sectionId), 200)
    }
  }, [scrollToSection, isDesktop, activityDockedWidth])

  // ── Guide docked-change handler ─────────────────────────────────────────────
  const handleGuideDockedChange = useCallback((docked) => {
    setGuideDesktopOpen(docked)
    if (docked) setGuideIsFloating(false)
  }, [])

  // ── Activity docked-change handler ──────────────────────────────────────────
  // Fires guideCloseTrigger only on the FIRST transition TO docked (not on
  // width resize events while already docked).
  const handleActivityDockedChange = useCallback((isDocked, width) => {
    setActivityDockedWidth(isDocked ? width : 0)
    if (isDocked && !activityIsDocked.current) {
      setGuideCloseTrigger(t => t + 1)
    }
    activityIsDocked.current = isDocked
  }, [])

  // ── Explore / Work mode ─────────────────────────────────────────────────────
  const handleExplore = useCallback(() => {
    setActivityCloseTrigger(t => t + 1)
    setConceptCloseTrigger(t => t + 1)
    setGuideActiveTab('activities')
    setGuideDockTrigger(t => t + 1)
  }, [])

  // Work mode: lowest in-progress activity has priority, then lowest not-started.
  // "Lowest" = first occurrence in the config.activities array (lowest index).
  const handleWork = useCallback(() => {
    const acts = config.activities
    const target =
      acts.find(a => config.getActivityStatus(a.id, responses) === 'inprogress')?.id ??
      acts.find(a => config.getActivityStatus(a.id, responses) === 'not-started')?.id ??
      acts[0]?.id
    if (!target) return
    lastActivityRef.current = target
    setActiveActivityId(target)
    setConceptCloseTrigger(t => t + 1)
    setActivityDockTrigger(t => t + 1)
  }, [config, responses])

  // ── Concepts ────────────────────────────────────────────────────────────────
  const openConcept = useCallback((id) => {
    setActiveConceptId(id)
  }, [])

  const openEvidence = useCallback((id) => {
    setActiveEvidenceId(id)
    setEvidenceTrigger(t => t + 1)   // triggers the modal-first open animation
  }, [])

  const navigateEvidence = useCallback((id) => {
    setActiveEvidenceId(id)           // content swap only — no re-open animation
  }, [])

  const navigateConcept = useCallback((id) => {
    setActiveConceptId(id)
  }, [])

  // ── Derived values ──────────────────────────────────────────────────────────
  const requiredActs   = config.activities.filter(a => a.required !== false)
  const completedCount = requiredActs.filter(a => config.getActivityStatus(a.id, responses) === 'complete').length
  const totalCount     = requiredActs.length

  const isExploreActive = guideDesktopOpen && activityDockedWidth === 0
  const isWorkActive    = activityDockedWidth > 0

  const tabs     = config.sidebar.tabs ?? ['activities']
  const themeVars = config.themeVars ?? []

  // ── Tab content ─────────────────────────────────────────────────────────────
  function renderTabContent() {
    return (
      <>
        {guideActiveTab === 'activities' && (
          <ActivitiesTab
            activities={config.activities}
            responses={responses}
            getActivityStatus={config.getActivityStatus}
            completedCount={completedCount}
            totalCount={totalCount}
            labTitle={config.nav?.title}
            labSubtitle={config.nav?.subtitle}
            accentHeader={config.sidebar.accentHeader ?? false}
            statusLabels={config.sidebar.statusLabels ?? {}}
            eyebrow={config.sidebar.header?.eyebrow}
            sidebarTitle={config.sidebar.header?.title}
            sidebarSubtitle={config.sidebar.header?.subtitle}
            onOpenActivity={openActivity}
            onReset={onReset}
          />
        )}
        {guideActiveTab === 'concepts' && config.concepts && (
          <ConceptsTab
            concepts={config.concepts}
            onOpenConcept={openConcept}
            intro={config.sidebar?.conceptsIntro}
          />
        )}
        {guideActiveTab === 'notes' && config.features?.notes && (
          <NotesTab
            value={notesValue}
            onSave={val => handleSave('lab-notes', val)}
          />
        )}
      </>
    )
  }

  return (
    <div className={`${s.shell} ${className ?? ''}`}>
      {/* ── Nav ── */}
      <LabNav
        config={config}
        backHref={backHref}
        isExploreActive={isExploreActive}
        isWorkActive={isWorkActive}
        onExplore={handleExplore}
        onWork={handleWork}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      {/* ── Desktop guide sidebar ── */}
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
            <div
              className={s.mobileBackdrop}
              onClick={() => setGuideOpen(false)}
              aria-hidden="true"
            />
          )}
        </>
      )}

      {/* ── Desktop side tabs (shown when guide is closed) ── */}
      {isDesktop && !guideDesktopOpen && (
        <div
          className={`${s.sideTabs} ${guideIsFloating ? s.sideTabsTucked : ''}`}
          aria-label="Open activity guide"
        >
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

      {/* ── Main content ── */}
      <div
        className={s.main}
        style={isDesktop && activityDockedWidth ? { paddingRight: `${activityDockedWidth}px` } : undefined}
      >
        <div
          className={s.content}
          style={{ maxWidth: config.content?.maxWidth ?? '960px' }}
        >
          {typeof children === 'function' ? children({ openEvidence, openActivity, openConcept, responses, scrollToSection, onSave: handleSave }) : children}
        </div>
      </div>

      {/* ── Mobile trigger button ── */}
      {!isDesktop && (
        <button
          className={s.mobileTrigger}
          onClick={() => setGuideOpen(p => !p)}
          aria-label={`${guideOpen ? 'Close' : 'Open'} activity guide`}
          aria-expanded={guideOpen}
        >
          Activities ({completedCount}/{totalCount})
        </button>
      )}

      {/* ── Desktop activity panel ── */}
      {isDesktop && (
        <ActivityPanel
          config={config}
          labId={labId}
          activeActivityId={activeActivityId}
          responses={responses}
          completedSet={new Set(
            config.activities
              .filter(a => config.getActivityStatus(a.id, responses) === 'complete')
              .map(a => a.id)
          )}
          handleSave={handleSave}
          onNavigate={navigateActivity}
          onScrollTo={handleScrollToEvidence}
          onOpenConcept={openConcept}
          triggerOpen={activityTrigger}
          triggerDock={activityDockTrigger}
          triggerClose={activityCloseTrigger}
          onDockedChange={handleActivityDockedChange}
          onClose={() => setActiveActivityId(null)}
          accentHeader={config.activityPanel?.accentHeader ?? false}
          themeVars={themeVars}
        />
      )}

      {/* ── Mobile activity panel ── */}
      {!isDesktop && activeActivityId && (() => {
        const activity  = config.activities.find(a => a.id === activeActivityId)
        if (!activity) return null
        const actIndex    = config.activities.indexOf(activity)
        const isCompleted = config.getActivityStatus(activeActivityId, responses) === 'complete'
        return (
          <>
            <div
              className={s.mobileActivityBackdrop}
              onClick={() => setActiveActivityId(null)}
              aria-hidden="true"
            />
            <div className={s.mobileActivityPanel}>
              <ActivityBody
                config={config}
                activity={activity}
                actIndex={actIndex}
                responses={responses}
                isCompleted={isCompleted}
                handleSave={handleSave}
                onNavigate={navigateActivity}
                onScrollTo={scrollToSection}
                onOpenConcept={openConcept}
                onClose={() => setActiveActivityId(null)}
              />
            </div>
          </>
        )
      })()}

      {/* ── Concepts modal ── */}
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

      {/* ── Evidence panel ── */}
      {config.evidenceComponent && (
        <EvidencePanel
          labId={labId}
          activeEvidenceId={activeEvidenceId}
          evidenceOrder={config.evidenceOrder}
          evidenceMeta={config.evidenceMeta}
          EvidenceComponent={config.evidenceComponent}
          onClose={() => setActiveEvidenceId(null)}
          onNavigate={navigateEvidence}
          triggerOpen={evidenceTrigger}
          themeVars={themeVars}
        />
      )}

      {/* ── Voice to text ── */}
      {config.features?.voiceToText && <SpeechInput />}
    </div>
  )
}
