import { useState, useEffect, useRef, useCallback } from 'react'
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

// ── Guide panel content ──────────────────────────────────────────────────────
function GuideContent({ responses, completedCount, totalCount, progressPct, openModal, onViewNotes, onReset }) {
  return (
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

      <div className={s.guideFooter}>
        <button className={s.guideFooterBtn} onClick={onViewNotes}>View my notes</button>
        {onReset && (
          <button
            className={s.guideFooterBtn}
            onClick={() => {
              if (window.confirm('Clear all your responses and start again? The dossier will not be changed.')) {
                onReset()
              }
            }}
          >
            Start again
          </button>
        )}
      </div>
    </>
  )
}

// ── Notes panel content ──────────────────────────────────────────────────────
function NotesContent({ responses }) {
  return (
    <div className={s.notesBody}>
      {ACTIVITIES.filter(a => a.id !== 'init' && a.id !== 'reflection').map(act => {
        const responseKey = act.id === 'final' ? 'final-response' : `${act.id}-response`
        const value = responses[responseKey]
        const hasContent = typeof value === 'string' && value.trim().length > 0
        return (
          <div key={act.id} className={s.notesItem}>
            <div className={s.notesItemLabel}>{act.label}</div>
            <div className={s.notesItemTitle}>{act.title}</div>
            <div className={s.notesItemText}>
              {hasContent ? value : <span className={s.notesEmpty}>Not yet completed</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main asset ───────────────────────────────────────────────────────────────
export default function FranceRepublic1792({ onResponse, onComplete, savedResponses, isCompleted, onReset }) {
  const [responses, setResponses] = useState(savedResponses ?? {})
  const [activeModal, setActiveModal] = useState(null)
  const [activeSection, setActiveSection] = useState('intro')
  const [guideOpen, setGuideOpen] = useState(false)      // mobile only
  const [notesOpen, setNotesOpen] = useState(false)      // mobile only
  const [notesDocked, setNotesDocked] = useState(false)  // desktop notes panel docked state
  const isDesktop = useIsDesktop()
  const prevCompletedRef = useRef(false)
  const notesFloatingRef = useRef(null)

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
    setActiveModal(id)
    setGuideOpen(false)
  }, [])

  const closeModal = useCallback((nextActivityId) => {
    setActiveModal(null)
    if (nextActivityId) setTimeout(() => setActiveModal(nextActivityId), 50)
  }, [])

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'smooth', block: 'start' })
  }, [])

  const handleSectionNavChange = (e) => {
    scrollToSection(e.target.value)
    setActiveSection(e.target.value)
  }

  const completedCount = COMPLETION_REQUIRED.filter(id => getActivityStatus(id, responses) === 'complete').length
  const progressPct = Math.round((completedCount / COMPLETION_REQUIRED.length) * 100)

  const guideProps = {
    responses,
    completedCount,
    totalCount: COMPLETION_REQUIRED.length,
    progressPct,
    openModal,
    onViewNotes: () => isDesktop ? (notesFloatingRef.current?.open?.()) : setNotesOpen(true),
    onReset,
  }

  return (
    <div
      className={s.shell}
      style={notesDocked ? { '--notes-panel-width': '320px' } : {}}
    >
      {/* ── Activity Guide ── */}
      {isDesktop ? (
        <FloatingPanel
          id="france-guide"
          title="Activity Guide"
          tabLabel="Guide"
          side="left"
          width={260}
          defaultHeight={600}
          initialState="docked"
        >
          <GuideContent {...guideProps} />
        </FloatingPanel>
      ) : (
        <nav className={`${s.guide} ${guideOpen ? s.open : ''}`} aria-label="Activity guide">
          <GuideContent {...guideProps} />
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

      {/* ── Main content ── */}
      <div
        className={s.main}
        style={notesDocked ? { paddingRight: 'var(--notes-panel-width, 0px)' } : {}}
      >
        {/* Section nav */}
        <nav className={s.sectionNav} aria-label="Dossier sections">
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

      {/* ── Desktop notes panel ── */}
      {isDesktop && (
        <FloatingPanel
          id="france-notes"
          title="My Notes"
          tabLabel="Notes"
          side="right"
          width={320}
          defaultHeight={560}
          initialState="closed"
          onDockedChange={setNotesDocked}
        >
          <NotesContent responses={responses} />
        </FloatingPanel>
      )}

      {/* ── Mobile notes drawer ── */}
      {!isDesktop && notesOpen && (
        <>
          <div className={s.notesOverlay} onClick={() => setNotesOpen(false)} aria-hidden="true" />
          <div className={s.notesDrawer} role="complementary" aria-label="My saved notes">
            <div className={s.notesHeader}>
              <div className={s.notesTitle}>My notes</div>
              <button
                className={s.modalClose}
                onClick={() => setNotesOpen(false)}
                aria-label="Close notes"
                style={{ position: 'static' }}
              >×</button>
            </div>
            <NotesContent responses={responses} />
          </div>
        </>
      )}

      {/* ── Activity modal ── */}
      {activeModal && (
        <ActivityModal
          activityId={activeModal}
          responses={responses}
          onSave={handleSave}
          onClose={closeModal}
          scrollToSection={scrollToSection}
        />
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
