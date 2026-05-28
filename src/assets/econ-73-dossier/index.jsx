import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './index.module.css'
import { evidenceItems, tagOptions, conceptTools, activities, compareGuidance, relevanceRows } from './data.js'

const ASSET_ID = 'econ-73-dossier'
const CHECKPOINTS_KEY = 'econ73_checkpoints_v1'

function cx(...args) { return args.filter(Boolean).join(' ') }

function loadCheckpoints() {
  try { return JSON.parse(localStorage.getItem(CHECKPOINTS_KEY) || '{}') } catch { return {} }
}
function saveCheckpoints(cp) {
  try { localStorage.setItem(CHECKPOINTS_KEY, JSON.stringify(cp)) } catch {}
}

// ── Concept tool visuals ──────────────────────────────────────────────────────

function VisualProductive() {
  return (
    <article className="visual-card toolkit-visual">
      <h3>Productive efficiency visual</h3>
      <div className="bar-chart" aria-label="Bar chart: average cost per ride falling 22% after better fleet management.">
        <div className="bar-row"><strong>Before</strong><div className="bar-track"><div className="bar-fill blue" style={{width:'100%'}}></div></div><span>$3.10</span></div>
        <div className="bar-row"><strong>After</strong><div className="bar-track"><div className="bar-fill" style={{width:'78%'}}></div></div><span>$2.42</span></div>
      </div>
      <p className="visual-caption">Lower average cost may support productive efficiency. It does not prove the number of rides is socially efficient.</p>
    </article>
  )
}

function VisualSocialCost() {
  return (
    <article className="visual-card toolkit-visual">
      <span className="figure-label">Cost visual</span>
      <h3>Allocative efficiency and market failure visual</h3>
      <p className="figure-context">This compares the private price paid by riders with the estimated social cost once external costs are included.</p>
      <div className="cost-gap" aria-label="Comparison: private scooter price $4.20, estimated social cost $5.30 ($4.20 + $1.10 external).">
        <div className="cost-line"><strong>Private price paid by rider</strong><div className="cost-box"><span className="segment private" style={{width:'79%'}}>$4.20</span></div></div>
        <div className="cost-line"><strong>Estimated social cost</strong><div className="cost-box"><span className="segment private" style={{width:'79%'}}>$4.20</span><span className="segment external" style={{width:'21%'}}>+$1.10</span></div></div>
        <div className="visual-legend" aria-hidden="true">
          <span className="legend-item"><span className="legend-swatch private"></span>Private price</span>
          <span className="legend-item"><span className="legend-swatch external"></span>Estimated external cost</span>
          <span className="legend-item">Total estimated social cost: <strong>$5.30</strong></span>
        </div>
      </div>
      <p className="visual-caption">If social cost is higher than private price, the market price may encourage too many rides.</p>
    </article>
  )
}

function VisualTradeoff() {
  return (
    <article className="visual-card toolkit-visual">
      <h3>Pareto trade-off visual</h3>
      <div className="svg-wrap" role="img" aria-label="Diagram: policy benefits for pedestrians and costs for some scooter users and firms.">
        <svg viewBox="0 0 420 170" aria-hidden="true">
          <rect x="20" y="40" width="150" height="80" rx="4" fill="#dcfae6" stroke="#abefc6" strokeWidth="2"/>
          <text x="42" y="73" fill="#067647" fontSize="15" fontWeight="800">Better off</text>
          <text x="42" y="96" fill="#475569" fontSize="13">pedestrians, city</text>
          <line x1="178" y1="80" x2="242" y2="80" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
          <polygon points="242,80 230,72 230,88" fill="#94a3b8"/>
          <rect x="250" y="40" width="150" height="80" rx="4" fill="#fff3dc" stroke="#fed7aa" strokeWidth="2"/>
          <text x="276" y="73" fill="#b45309" fontSize="15" fontWeight="800">Worse off?</text>
          <text x="276" y="96" fill="#475569" fontSize="13">some users, firms</text>
          <text x="100" y="148" textAnchor="middle" fill="#475569" fontSize="12">Not a Pareto improvement if anyone loses</text>
        </svg>
      </div>
      <p className="visual-caption">Many policies are not Pareto improvements, even when they may improve overall welfare.</p>
    </article>
  )
}

function VisualInnovation() {
  return (
    <article className="visual-card toolkit-visual">
      <h3>Dynamic efficiency timeline</h3>
      <div className="svg-wrap" role="img" aria-label="Timeline showing innovation from current scooters to safer designs and better batteries.">
        <svg viewBox="0 0 430 180" aria-hidden="true">
          <line x1="50" y1="92" x2="380" y2="92" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="70" cy="92" r="13" fill="#c9362d"/>
          <circle cx="210" cy="92" r="13" fill="#c9362d"/>
          <circle cx="350" cy="92" r="13" fill="#c9362d"/>
          <text x="38" y="128" fill="#10162d" fontSize="13" fontWeight="800">Now</text>
          <text x="152" y="128" fill="#10162d" fontSize="13" fontWeight="800">Safer design</text>
          <text x="297" y="128" fill="#10162d" fontSize="13" fontWeight="800">Better batteries</text>
          <text x="48" y="62" fill="#475569" fontSize="13">current fleet</text>
          <text x="166" y="62" fill="#475569" fontSize="13">investment</text>
          <text x="300" y="62" fill="#475569" fontSize="13">long-run gain</text>
        </svg>
      </div>
      <p className="visual-caption">Dynamic efficiency asks how today's rules affect future innovation and investment.</p>
    </article>
  )
}

function ConceptVisual({ type }) {
  if (type === 'productive') return <VisualProductive />
  if (type === 'social-cost') return <VisualSocialCost />
  if (type === 'tradeoff') return <VisualTradeoff />
  if (type === 'innovation') return <VisualInnovation />
  return null
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EconDossier({ onResponse, onComplete, savedResponses, onReset }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [responses, setResponses] = useState(() => {
    const sr = savedResponses || {}
    const r = {}
    activities.forEach(a => { if (sr[`act-${a.id}`] !== undefined) r[a.id] = sr[`act-${a.id}`] })
    return r
  })
  const [evidenceTags, setEvidenceTags] = useState(() => (savedResponses || {})['evidence-tags'] || {})
  const [checkpoints, setCheckpoints] = useState(loadCheckpoints)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('contents')
  const [activeActivityId, setActiveActivityId] = useState(null)
  const [activeConceptId, setActiveConceptId] = useState(null)
  const [draftResponse, setDraftResponse] = useState('')
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const saveStatusTimer = useRef(null)
  const lastFocusRef = useRef(null)

  // ── Derived values ─────────────────────────────────────────────────────────
  const savedCount = activities.filter(a => (responses[a.id] || '').trim()).length
  const taggedCount = Object.keys(evidenceTags).length
  const isDirty = draftResponse !== (responses[activeActivityId] || '')

  // ── Checkpoint ─────────────────────────────────────────────────────────────
  function toggleCheckpoint(key) {
    const next = { ...checkpoints }
    if (next[key]) delete next[key]
    else next[key] = true
    setCheckpoints(next)
    saveCheckpoints(next)
  }

  // ── Investigation panel ────────────────────────────────────────────────────
  function openPanel(tab = 'contents') {
    setPanelOpen(true)
    setActiveTab(tab)
  }
  function closePanel() {
    setPanelOpen(false)
  }
  function togglePanel(tab = 'contents') {
    if (panelOpen && activeTab === tab) closePanel()
    else openPanel(tab)
  }
  function scrollToSection(id) {
    closePanel()
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, panelOpen ? 240 : 0)
  }

  // ── Activity modal ─────────────────────────────────────────────────────────
  function openActivity(id) {
    lastFocusRef.current = document.activeElement
    setActiveActivityId(id)
    setDraftResponse(responses[id] || '')
    setShowUnsavedWarning(false)
    setSaveStatus('')
  }
  function closeActivity() {
    setActiveActivityId(null)
    setDraftResponse('')
    setShowUnsavedWarning(false)
    setSaveStatus('')
    lastFocusRef.current?.focus()
  }
  function maybeCloseActivity() {
    if (isDirty) { setShowUnsavedWarning(true); return }
    closeActivity()
  }
  async function handleSaveResponse() {
    if (!activeActivityId) return
    const text = draftResponse
    const newResponses = { ...responses, [activeActivityId]: text }
    setResponses(newResponses)
    setShowUnsavedWarning(false)
    if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current)
    setSaveStatus('Saved')
    saveStatusTimer.current = setTimeout(() => setSaveStatus(''), 1800)
    await onResponse(`act-${activeActivityId}`, text)
    const allDone = activities.every(a => (newResponses[a.id] || '').trim())
    if (allDone) onComplete(100, { asset: ASSET_ID })
  }
  function saveAndClose() {
    handleSaveResponse().then(() => closeActivity())
  }

  // ── Concept modal ──────────────────────────────────────────────────────────
  function openConcept(id) {
    lastFocusRef.current = document.activeElement
    setActiveConceptId(id)
  }
  function closeConcept() {
    setActiveConceptId(null)
    lastFocusRef.current?.focus()
  }
  function openConceptFromActivity(id) {
    setActiveConceptId(id)
  }

  // ── Evidence tags ──────────────────────────────────────────────────────────
  async function handleTagChange(itemId, value) {
    const newTags = { ...evidenceTags }
    if (value) newTags[itemId] = value
    else delete newTags[itemId]
    setEvidenceTags(newTags)
    await onResponse('evidence-tags', newTags)
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  async function doReset() {
    setShowResetConfirm(false)
    saveCheckpoints({})
    await onReset()
  }

  // ── Keyboard handlers ──────────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        if (activeConceptId) { closeConcept(); return }
        if (showResetConfirm) { setShowResetConfirm(false); return }
        if (activeActivityId) { maybeCloseActivity(); return }
        if (panelOpen) { closePanel(); return }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  })

  // ── Helpers ────────────────────────────────────────────────────────────────
  function getTagMeta(value) { return tagOptions.find(o => o.value === value) || tagOptions[0] }
  function getTool(id) { return conceptTools.find(t => t.id === id) }

  function evidenceGroups() {
    const g = { efficiency: [], failure: [], both: [], unclear: [], untagged: [] }
    evidenceItems.forEach(item => {
      const tag = evidenceTags[item.id]
      if (g[tag]) g[tag].push(item)
      else g.untagged.push(item)
    })
    return g
  }

  // ── Concept modal content ─────────────────────────────────────────────────
  function renderConceptContent(tool) {
    if (!tool) return null
    return (
      <>
        <p className="toolkit-intro">Use this concept as an analytical lens for the case file. It is not extra evidence; it helps you decide what the evidence means.</p>
        <div className="toolkit-detail-header">
          <h3>{tool.title}</h3>
          <p>{tool.summary}</p>
        </div>
        {tool.cards && (
          <div className="toolkit-card-grid">
            {tool.cards.map(card => (
              <article key={card.label} className={`concept-card ${card.type}`}>
                <span className="concept-label">{card.label}</span>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        )}
        {tool.id === 'reasons' && (
          <section className="relevance-section" aria-labelledby="relevance-title">
            <h3 id="relevance-title">Which reasons are strongest in this case?</h3>
            <p>This case includes all syllabus reasons, but they are not equally central. Use this table to prioritise your diagnosis.</p>
            <div className="table-scroll">
              <table className="relevance-table">
                <thead><tr><th>Reason</th><th>Case relevance</th><th>How to use it</th></tr></thead>
                <tbody>
                  {relevanceRows.map(row => (
                    <tr key={row[0]}><td>{row[0]}</td><td><strong>{row[1]}</strong></td><td>{row[2]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {tool.reasons && (
          <div className="reason-grid">
            {tool.reasons.map(r => (
              <article key={r.title} className="reason-card">
                <h3>{r.title}</h3><p>{r.text}</p>
              </article>
            ))}
          </div>
        )}
        {tool.visual && <ConceptVisual type={tool.visual} />}
      </>
    )
  }

  // ── Activity modal support elements ───────────────────────────────────────
  function renderActivitySupport(activity) {
    return (
      <>
        {activity.stage && <div className="activity-stage-note">{activity.stage}</div>}
        {activity.responseGuide && (
          <div className="response-guidance">
            <strong>Response guidance</strong>
            <p>{activity.responseGuide}</p>
          </div>
        )}
        {activity.miniExample && (
          <div className="mini-example">
            <strong>Mini-example</strong>
            <p>{activity.miniExample}</p>
          </div>
        )}
        {activity.answerFrame && (
          <div className="answer-frame">
            <strong>Suggested answer structure</strong>
            <ul>{activity.answerFrame.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </div>
        )}
        {activity.rankingFrame && (
          <div className="answer-frame ranking-frame">
            <strong>Ranking scaffold</strong>
            <p>Use this to decide which reasons for market failure are strongest, rather than listing everything.</p>
            <ul>{activity.rankingFrame.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </div>
        )}
      </>
    )
  }

  // ── Final synthesis content ────────────────────────────────────────────────
  function renderSynthesis() {
    const groups = evidenceGroups()
    function EvidenceList({ items }) {
      if (!items.length) return <p className="empty-state">No evidence tagged here yet.</p>
      return (
        <ul className="evidence-list">
          {items.map(item => <li key={item.id}><strong>{item.title}:</strong> {item.text}</li>)}
        </ul>
      )
    }
    return (
      <>
        <article className="synthesis-card">
          <h3>Adviser briefing: evidence pattern</h3>
          <div className="count-row">
            <span className="count-badge">Market efficiency: {groups.efficiency.length}</span>
            <span className="count-badge">Market failure: {groups.failure.length}</span>
            <span className="count-badge">Both: {groups.both.length}</span>
            <span className="count-badge">Unclear: {groups.unclear.length}</span>
            <span className="count-badge">Untagged: {groups.untagged.length}</span>
          </div>
          <div className="table-scroll">
            <table className="briefing-table">
              <thead><tr><th>Evidence direction</th><th>What this might mean for the recommendation</th></tr></thead>
              <tbody>
                <tr><td>Evidence of market efficiency ({groups.efficiency.length})</td><td>Use this to acknowledge where the market appears to work well: consumer value, lower costs, innovation, or productive efficiency.</td></tr>
                <tr><td>Evidence of market failure ({groups.failure.length})</td><td>Use this to explain why private decisions may not match social welfare, especially where external costs or information gaps are present.</td></tr>
                <tr><td>Evidence of both ({groups.both.length})</td><td>Use this to show judgement. Some evidence can support efficiency in one sense but market failure in another.</td></tr>
                <tr><td>Unclear / needs more analysis ({groups.unclear.length})</td><td>Use this to identify uncertainty, missing data, or evidence that needs careful interpretation.</td></tr>
              </tbody>
            </table>
          </div>
        </article>
        <article className="synthesis-card">
          <h3>Saved investigation notes</h3>
          <p className="empty-state">Use these notes to build your adviser recommendation. Edit earlier tasks any time if your judgement changes.</p>
        </article>
        {[['1','Activity 1 — Efficiency claims'],['2','Activity 2 — Productive and allocative efficiency'],['3','Activity 3 — Possible market failure'],['4','Activity 4 — Policy trade-offs'],['5','Activity 5 — Dynamic efficiency']].map(([id, label]) => {
          const text = (responses[id] || '').trim()
          return (
            <article key={id} className="synthesis-card">
              <h3>{label}</h3>
              {text ? <div className="response-snippet">{text}</div> : <p className="empty-state">No response saved yet.</p>}
            </article>
          )
        })}
        <article className="synthesis-card"><h3>Evidence tagged as suggesting market efficiency</h3><EvidenceList items={groups.efficiency} /></article>
        <article className="synthesis-card"><h3>Evidence tagged as suggesting market failure</h3><EvidenceList items={groups.failure} /></article>
        <article className="synthesis-card"><h3>Evidence tagged as suggesting both</h3><EvidenceList items={groups.both} /></article>
        <article className="synthesis-card"><h3>Evidence tagged as unclear / needs more analysis</h3><EvidenceList items={groups.unclear} /></article>
      </>
    )
  }

  // ── Compare guidance ──────────────────────────────────────────────────────
  function renderCompareGuidance(activityId) {
    const g = compareGuidance[activityId]
    if (!g) return null
    return (
      <details className="compare-box">
        <summary>Compare your reasoning</summary>
        <p className="compare-intro">{g.intro}</p>
        <ul>{g.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
        {g.caution && <p className="common-misconception"><strong>Common trap:</strong> {g.caution}</p>}
      </details>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const activeTool = activeConceptId ? getTool(activeConceptId) : null
  const activeActivity = activeActivityId ? activities.find(a => a.id === activeActivityId) : null

  return (
    <div className={cx(styles.root, panelOpen && styles.panelOpen)}>
      <a className="skip-link" href="#main">Skip to dossier</a>

      {/* ── Header ── */}
      <header className="site-header document-bar">
        <div className="header-inner">
          <div className="brand" aria-label="Document identity">
            <span className="eyebrow masthead-name">Economic Brief</span>
            <span className="brand-title">Market Investigation Dossier · A Level Economics 7.3 · Efficiency and market failure</span>
          </div>
          <div className="top-actions" aria-label="Document actions">
            <button className="btn small warning" type="button" onClick={() => setShowResetConfirm(true)} aria-label="Reset saved work">Reset</button>
          </div>
        </div>
      </header>

      {/* ── Scrim ── */}
      {panelOpen && (
        <div className="sidebar-scrim active" aria-hidden="true" onClick={closePanel} />
      )}

      {/* ── Investigation side tabs ── */}
      <div className="investigation-side-tabs" aria-label="Open investigation panel">
        {['contents','tasks','toolkit'].map(tab => (
          <button
            key={tab}
            className={cx('investigation-side-tab', panelOpen && activeTab === tab && 'active')}
            type="button"
            onClick={() => togglePanel(tab)}
            aria-expanded={panelOpen && activeTab === tab}
            aria-controls="investigationPanel"
          >
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* ── Investigation panel ── */}
      <aside className="investigation-panel" id="investigationPanel" aria-label="Investigation panel" aria-hidden={!panelOpen}>
        <div className="investigation-panel-header">
          <div>
            <span className="eyebrow">Investigation tools</span>
            <h2>Case support</h2>
            <p>Choose a tab to jump through the case file, open tasks, or access economic concepts.</p>
          </div>
          <button className="modal-close panel-close" type="button" onClick={closePanel} aria-label="Close investigation panel">×</button>
        </div>

        <div className="investigation-tabs" role="tablist" aria-label="Investigation panel sections">
          {['contents','tasks','toolkit'].map(tab => (
            <button
              key={tab}
              className={cx('investigation-tab', activeTab === tab && 'active')}
              type="button" role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="investigation-panel-body">
          {/* Contents tab */}
          <section
            className={cx('investigation-tab-panel', activeTab === 'contents' && 'active')}
            role="tabpanel"
            hidden={activeTab !== 'contents'}
          >
            <p className="panel-intro">Jump to a section of the market case file.<span className="intro-extra"> The case file is the evidence base for your recommendation.</span></p>
            <nav className="contents-list" aria-label="Case file contents">
              {[['case-overview','Case overview'],['how-to-investigate','How to investigate'],['market-data','Market data'],['stakeholders','Stakeholders'],['policy-options','Policy options'],['evidence','Evidence board'],['final-decision','Adviser briefing']].map(([id, label]) => (
                <button key={id} className="contents-button" type="button" onClick={() => scrollToSection(id)}>
                  <span>{label}</span><span aria-hidden="true">›</span>
                </button>
              ))}
            </nav>
          </section>

          {/* Tasks tab */}
          <section
            className={cx('investigation-tab-panel', activeTab === 'tasks' && 'active')}
            role="tabpanel"
            hidden={activeTab !== 'tasks'}
          >
            <p className="panel-intro">Open a task, then use the case file and toolkit to build your adviser notes.</p>
            <div className="task-list">
              {activities.map(activity => {
                const hasResponse = Boolean((responses[activity.id] || '').trim())
                return (
                  <button
                    key={activity.id}
                    className="task-button"
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => { closePanel(); setTimeout(() => openActivity(activity.id), 50) }}
                  >
                    <span className="task-num">{activity.id}</span>
                    <span className="task-text">
                      {activity.stage && <span className="task-stage">{activity.stage}</span>}
                      <span className="task-title">{activity.title}</span>
                      <span className={cx('task-status', hasResponse && 'saved')}>
                        {hasResponse ? 'Response saved' : 'Not yet saved'}
                      </span>
                    </span>
                    <span className="task-chevron" aria-hidden="true">›</span>
                  </button>
                )
              })}
            </div>
            <div className="panel-footer">
              <div className="progress-pill">
                {savedCount}/{activities.length} tasks · {taggedCount}/{evidenceItems.length} evidence tagged
              </div>
              <button className="btn warning" type="button" onClick={() => setShowResetConfirm(true)}>Reset saved work</button>
            </div>
          </section>

          {/* Toolkit tab */}
          <section
            className={cx('investigation-tab-panel', activeTab === 'toolkit' && 'active')}
            role="tabpanel"
            hidden={activeTab !== 'toolkit'}
          >
            <p className="panel-intro">These are analytical tools, not extra case evidence.<span className="intro-extra"> Use them to interpret the market data, stakeholder views, policy options, and evidence cards.</span></p>
            <div className="toolkit-list" aria-label="Economics concept tools">
              {conceptTools.map(tool => (
                <button
                  key={tool.id}
                  className="toolkit-button"
                  type="button"
                  onClick={() => openConcept(tool.id)}
                >
                  <span>{tool.title}</span><span aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="layout">

        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <span className="eyebrow">Policy briefing file</span>
            <h1 id="hero-title">When does a market outcome look efficient, and when does it fail?</h1>
            <p>You are an economic adviser reviewing the market for electric scooters in a growing city. Use the case file as your evidence base, open the Economist's Toolkit when you need the concepts, and build a recommendation for the city government.</p>
          </div>
        </section>

        <nav className="sticky-nav" aria-label="Case file navigation">
          {[['#case-overview','Case'],['#how-to-investigate','How to investigate'],['#market-data','Data'],['#stakeholders','Stakeholders'],['#policy-options','Policy'],['#evidence','Evidence'],['#final-decision','Briefing']].map(([href, label]) => (
            <a key={href} className="nav-link" href={href}>{label}</a>
          ))}
        </nav>

        <main id="main">

          {/* Case overview */}
          <section id="case-overview" className="dossier-section">
            <div className="section-kicker">Case overview</div>
            <h2>The electric scooter market</h2>
            <p className="lead">
              Electric scooters have grown quickly in Metroville, a fictional city with crowded inner suburbs, busy public transport hubs, and rising demand for short-distance travel. Consumers value scooters because they are cheap, flexible, and available through phone apps. Firms compete to place scooters where demand is highest.
            </p>
            <div className="callout">
              <strong>Your role:</strong> Decide whether the market outcome is efficient, whether there is evidence of market failure, and whether government intervention could be justified.
            </div>
            <div className="card-grid" style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'0.8rem',marginTop:'1rem'}}>
              <article className="concept-card example">
                <span className="concept-label">Market benefits</span>
                <p>Consumers gain fast short-distance transport, some commuters save money, and firms have incentives to improve apps, batteries, and fleet management.</p>
              </article>
              <article className="concept-card judgement">
                <span className="concept-label">Market concerns</span>
                <p>The city is experiencing accidents, pavement clutter, pressure on public spaces, and environmental trade-offs. Some benefits and costs are not fully reflected in the market price.</p>
              </article>
            </div>
          </section>

          {/* How to investigate */}
          <section id="how-to-investigate" className="dossier-section">
            <div className="section-kicker">How to use this investigation</div>
            <h2>Case file first. Concepts when you need them.</h2>
            <p className="lead">
              The main page is the <strong>Market Case File</strong>: it contains the scooter market, data, stakeholders, policy options, and evidence. The economics theory sits separately in the <strong>Economist's Toolkit</strong>, because those concepts are the tools you use to analyse the case — not the case evidence itself.
            </p>
            <div className="stage-map" aria-label="Investigation stages">
              <article className="stage-card"><span className="stage-label">Stage 1</span><h3>Build the evidence base</h3><p>Identify what suggests the market may be working efficiently, then tag evidence that complicates that claim.</p></article>
              <article className="stage-card"><span className="stage-label">Stage 2</span><h3>Test the efficiency claim</h3><p>Use productive, allocative, and dynamic efficiency to decide how far the market appears efficient.</p></article>
              <article className="stage-card"><span className="stage-label">Stage 3</span><h3>Test for possible market failure</h3><p>Examine whether the market creates inefficient resource allocation, then identify the strongest possible causes.</p></article>
              <article className="stage-card"><span className="stage-label">Stage 4</span><h3>Weigh policy trade-offs</h3><p>Use Pareto optimality and dynamic efficiency to judge whether intervention could improve outcomes and who may lose.</p></article>
              <article className="stage-card"><span className="stage-label">Stage 5</span><h3>Make and reflect on your judgement</h3><p>Write a recommendation, then reflect on how the evidence and concepts shaped your reasoning.</p></article>
            </div>
            <div className="callout">
              <strong>Tip:</strong> Use the Contents, Tasks, and Toolkit buttons to jump through the case file, open tasks, or access the Economist's Toolkit without losing your place.
            </div>
          </section>

          {/* Market data */}
          <section id="market-data" className="dossier-section">
            <div className="section-kicker">Market data file</div>
            <h2>Data snapshot: what is happening in the market?</h2>
            <p className="lead">These figures are fictional, but they give you enough case evidence to test different efficiency claims. The data is deliberately mixed: some evidence suggests the market is working well, while other evidence points to possible market failure.</p>
            <div className="metric-row">
              <article className="metric-card">
                <span className="concept-label">Demand growth</span>
                <div className="metric-value">26,000</div>
                <p>Daily scooter trips, up from 8,000 two years ago.</p>
              </article>
              <article className="metric-card">
                <span className="concept-label">Average price</span>
                <div className="metric-value">$4.20</div>
                <p>Average scooter trip price, compared with about $14 for a short taxi trip.</p>
              </article>
              <article className="metric-card">
                <span className="concept-label">Council cost</span>
                <div className="metric-value">$1.2m</div>
                <p>Estimated annual public cost for scooter clearing, pavement repair, and safety management. Note: Visual 2 uses a separate per-ride estimate of social cost, calculated differently.</p>
              </article>
            </div>
            <div className="visual-grid three">
              {/* Visual 1 */}
              <article className="visual-card">
                <span className="figure-label">Demand visual</span>
                <h3>Visual 1: daily scooter trips, Year 1 to Year 3</h3>
                <p className="figure-context">Daily rides rose from <strong>8,000</strong> to <strong>26,000</strong> over two years. Rapid growth may signal consumer value — but consider whether it also amplifies external costs and pressure on public space.</p>
                <div className="svg-wrap" role="img" aria-label="Line chart: daily scooter trips rising from 8,000 in Year 1 to 26,000 in Year 3.">
                  <svg viewBox="0 0 360 210" aria-hidden="true">
                    <line x1="54" y1="158" x2="320" y2="158" stroke="#94a3b8" strokeWidth="2"/>
                    <line x1="54" y1="36" x2="54" y2="158" stroke="#94a3b8" strokeWidth="2"/>
                    <line x1="54" y1="117" x2="320" y2="117" stroke="#94a3b8" strokeWidth="1" opacity="0.45"/>
                    <line x1="54" y1="77" x2="320" y2="77" stroke="#94a3b8" strokeWidth="1" opacity="0.45"/>
                    <line x1="54" y1="36" x2="320" y2="36" stroke="#94a3b8" strokeWidth="1" opacity="0.35"/>
                    <text className="axis-label" x="54" y="22">Daily scooter trips</text>
                    <text className="tick-label" x="18" y="161">0</text>
                    <text className="tick-label" x="13" y="120">10k</text>
                    <text className="tick-label" x="13" y="80">20k</text>
                    <text className="tick-label" x="13" y="39">30k</text>
                    <polyline points="72,126 174,86 302,52" fill="none" stroke="#c9362d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="72" cy="126" r="6" fill="#c9362d"/>
                    <circle cx="302" cy="52" r="6" fill="#c9362d"/>
                    <text className="tick-label" x="55" y="181">Year 1</text>
                    <text className="tick-label" x="156" y="181">Year 2</text>
                    <text className="tick-label" x="278" y="181">Year 3</text>
                    <rect x="78" y="101" width="34" height="20" rx="3" fill="#f7f3e8" opacity="0.98"/>
                    <text x="95" y="115" textAnchor="middle" fill="#10162d" fontSize="14" fontWeight="900">8k</text>
                    <rect x="258" y="28" width="38" height="20" rx="3" fill="#f7f3e8" opacity="0.98"/>
                    <text x="277" y="42" textAnchor="middle" fill="#10162d" fontSize="14" fontWeight="900">26k</text>
                    <text className="data-note" x="116" y="200">Two-year growth in usage</text>
                  </svg>
                </div>
                <p className="visual-caption">Growth could suggest consumer value and market efficiency, but high usage can also amplify external costs.</p>
              </article>
              {/* Visual 2 */}
              <article className="visual-card">
                <span className="figure-label">Cost visual</span>
                <h3>Visual 2: private price vs estimated social cost</h3>
                <p className="figure-context">This compares what riders pay with an estimate of the wider cost once external costs are included.</p>
                <div className="cost-gap" aria-label="Comparison: private scooter price $4.20, estimated social cost $5.30.">
                  <div className="cost-line">
                    <strong>Private price paid by rider</strong>
                    <div className="cost-box"><span className="segment private" style={{width:'79%'}}>$4.20</span></div>
                  </div>
                  <div className="cost-line">
                    <strong>Estimated social cost</strong>
                    <div className="cost-box"><span className="segment private" style={{width:'79%'}}>$4.20</span><span className="segment external" style={{width:'21%'}}>+$1.10</span></div>
                  </div>
                  <div className="visual-legend" aria-hidden="true">
                    <span className="legend-item"><span className="legend-swatch private"></span>Private price</span>
                    <span className="legend-item"><span className="legend-swatch external"></span>Estimated external cost</span>
                    <span className="legend-item">Total estimated social cost: <strong>$5.30</strong></span>
                  </div>
                </div>
                <p className="visual-caption">This gap is a clue for allocative efficiency: if social cost is higher than private price, the market may overprovide rides.</p>
              </article>
              {/* Visual 3 */}
              <article className="visual-card">
                <span className="figure-label">Market structure visual</span>
                <h3>Visual 3: scooter rental market share</h3>
                <p className="figure-context">The red section shows the share of scooter rentals controlled by the two largest firms.</p>
                <div className="donut-wrap" role="img" aria-label="Donut chart: top two firms control 82% of rentals.">
                  <div className="donut">
                    <div className="donut-inner">82%<br/><span style={{fontSize:'0.72rem',color:'#64748b'}}>top 2 firms</span></div>
                  </div>
                  <div>
                    <p className="donut-explainer">Two firms control <strong>82%</strong> of scooter rentals. Smaller providers struggle to access popular parking and charging locations.</p>
                    <div className="donut-legend" aria-hidden="true">
                      <span className="legend-item"><span className="legend-swatch red"></span>Top two firms: 82%</span>
                      <span className="legend-item"><span className="legend-swatch other"></span>Other firms: 18%</span>
                    </div>
                  </div>
                </div>
                <p className="visual-caption">Concentration does not prove monopoly power, but it raises questions about competition, pricing, and access to prime locations.</p>
              </article>
            </div>
          </section>

          {/* Stakeholders */}
          <section id="stakeholders" className="dossier-section">
            <div className="section-kicker">Stakeholder evidence</div>
            <h2>Who gains, who loses, and who is affected?</h2>
            <p className="lead">A market can look efficient from one perspective and problematic from another. Use these stakeholders to think beyond the immediate buyer-seller transaction.</p>
            <div className="stakeholder-grid">
              <article className="stakeholder-card"><h3>Scooter users</h3><p>Many users value scooters because they fill short gaps between home, work, public transport, and nightlife areas. Some low-income workers say scooters help when buses are infrequent late at night.</p></article>
              <article className="stakeholder-card"><h3>Pedestrians and local residents</h3><p>Residents complain about scooters blocking footpaths and creating hazards for older people, wheelchair users, and people with prams.</p></article>
              <article className="stakeholder-card"><h3>Scooter firms</h3><p>Firms argue that competition is pushing them to lower operating costs, improve safety features, and invest in better battery technology.</p></article>
              <article className="stakeholder-card"><h3>City government</h3><p>The city wants flexible transport options, but it also pays some costs of damaged pavement, safety enforcement, complaint handling, and public-space management.</p></article>
            </div>
          </section>

          {/* Policy options */}
          <section id="policy-options" className="dossier-section">
            <div className="section-kicker">Policy options file</div>
            <h2>Possible city responses</h2>
            <p className="lead">The city is not deciding between perfect market freedom and total control. It can choose light-touch, targeted, or stricter interventions. Each option creates trade-offs.</p>
            <div className="policy-grid">
              <article className="policy-card">
                <h3>Option A: No new intervention</h3>
                <p>Let firms continue competing and innovating. This may protect dynamic efficiency, but external costs may remain unpriced.</p>
                <ul className="tradeoff-list" aria-label="Trade-off notes"><li>Low regulation</li><li>Low risk to innovation</li><li>High risk that external costs remain</li></ul>
              </article>
              <article className="policy-card">
                <h3>Option B: Parking zones and safety rules</h3>
                <p>Require geofenced parking, speed limits in crowded areas, and clearer safety messaging. This targets external costs without banning scooters.</p>
                <ul className="tradeoff-list" aria-label="Trade-off notes"><li>Targeted regulation</li><li>Some convenience cost</li><li>Possible safety benefit</li></ul>
              </article>
              <article className="policy-card">
                <h3>Option C: Per-ride levy</h3>
                <p>Add a small charge to each ride to fund pavement repair, safety enforcement, and public-space management. Prices would move closer to social cost.</p>
                <ul className="tradeoff-list" aria-label="Trade-off notes"><li>Creates a price signal</li><li>May reduce demand</li><li>Funds public costs</li></ul>
              </article>
              <article className="policy-card">
                <h3>Option D: Firm permits and fleet caps</h3>
                <p>Limit the number of operators or scooters allowed in the city. This could reduce clutter, but it might weaken competition and reduce availability.</p>
                <ul className="tradeoff-list" aria-label="Trade-off notes"><li>Stricter control</li><li>Risk of weaker competition</li><li>Possible clutter reduction</li><li>Concentration risk: fewer permitted operators may acquire monopoly power — connect to your market concentration evidence</li></ul>
              </article>
            </div>
          </section>

          {/* Evidence board */}
          <section id="evidence" className="dossier-section">
            <div className="section-kicker">Evidence file</div>
            <h2>Evidence cards</h2>
            <p className="lead">Tag each evidence card according to what it suggests for your investigation. You can change your tags later as your judgement develops. Your tags feed into the final recommendation.</p>
            <div className="evidence-grid" aria-live="polite">
              {evidenceItems.map(item => {
                const selected = evidenceTags[item.id] || ''
                const tag = getTagMeta(selected)
                return (
                  <article key={item.id} id={item.id} className="evidence-card">
                    <div className="evidence-header">
                      <div>
                        <div className="evidence-title">{item.title}</div>
                      </div>
                      {selected && <span className={`tag-badge ${tag.className}`}>{tag.label}</span>}
                    </div>
                    <p>{item.text}</p>
                    <div className="tracker-row">
                      <label htmlFor={`tag-${item.id}`}>What does this evidence suggest?</label>
                      <select
                        id={`tag-${item.id}`}
                        value={selected}
                        onChange={e => handleTagChange(item.id, e.target.value)}
                      >
                        {tagOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Adviser briefing */}
          <section id="final-decision" className="dossier-section">
            <div className="section-kicker">Adviser briefing</div>
            <h2>Final decision area</h2>
            <p className="lead">Return to your opening brief: <strong>is the market efficient, failing, or producing a mixed outcome — and is intervention justified?</strong> Use your saved notes and tagged evidence below to build your recommendation.</p>
            <div className="callout">Your final recommendation should use productive efficiency, allocative efficiency, Pareto optimality, dynamic efficiency, and market failure. It should refer to evidence from the dossier and explain whether government intervention is justified.</div>
            <div className="outcome-checkpoint" aria-labelledby="checkpoint-title">
              <h3 id="checkpoint-title">Before you advise the city: check your economic reasoning</h3>
              <p>Use this as a self-check before writing your final recommendation. The strongest responses do not just name concepts; they use each concept to interpret the case evidence.</p>
              <div className="checkpoint-grid">
                {[
                  ['productive','Productive efficiency','Have you explained whether firms are producing at the lowest possible average cost?'],
                  ['allocative','Allocative efficiency','Have you considered whether price reflects marginal cost, or whether MSB equals MSC once social costs are included?'],
                  ['pareto','Pareto optimality','Have you identified who may be better off and who may be worse off under a policy change?'],
                  ['dynamic','Dynamic efficiency','Have you considered innovation, investment, and long-run improvement?'],
                  ['failure','Market failure','Have you explained why the free market may allocate resources inefficiently?'],
                  ['reasons','Reasons for failure','Have you identified specific causes, rather than just saying "market failure"?'],
                ].map(([key, title, desc]) => (
                  <label key={key} className="checkpoint-card">
                    <input
                      type="checkbox"
                      checked={Boolean(checkpoints[key])}
                      onChange={() => toggleCheckpoint(key)}
                    />
                    <span><strong>{title}</strong>{desc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="synthesis-grid" aria-live="polite">
              {renderSynthesis()}
            </div>
            <div style={{display:'flex',gap:'0.6rem',flexWrap:'wrap',marginTop:'1rem'}}>
              <button className="btn primary" type="button" onClick={() => openActivity('6')}>Write recommendation</button>
              <button className="btn" type="button" onClick={() => openActivity('7')}>Reflect on reasoning</button>
            </div>
          </section>

        </main>
      </div>

      <footer>
        <p>A Level Economics 7.3 — Market Investigation Dossier. Your investigation notes are saved automatically and will be here when you return.</p>
      </footer>

      {/* ── Reset confirm modal ── */}
      <div className={cx('reset-confirm-backdrop', showResetConfirm && 'open')} id="resetConfirmBackdrop">
        <div className="reset-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="resetConfirmTitle">
          <h3 id="resetConfirmTitle">Reset all saved work?</h3>
          <p>This will clear all saved task responses and evidence tags. This cannot be undone.</p>
          <div className="reset-confirm-actions">
            <button className="btn" type="button" onClick={() => setShowResetConfirm(false)}>Cancel</button>
            <button className="btn danger" type="button" onClick={doReset}>Reset everything</button>
          </div>
        </div>
      </div>

      {/* ── Activity modal ── */}
      <div
        className={cx('modal-backdrop', activeActivity && 'open')}
        id="modalBackdrop"
        onClick={e => { if (e.target.id === 'modalBackdrop') maybeCloseActivity() }}
      >
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalPrompt">
          <div className="modal-header">
            <div>
              <span className="eyebrow" style={{color:'rgba(255,255,255,0.76)'}}>Investigation task</span>
              <h2 id="modalTitle">{activeActivity ? `${activeActivity.id}. ${activeActivity.title}` : ''}</h2>
            </div>
            <button className="modal-close" type="button" onClick={maybeCloseActivity} aria-label="Close dialog">×</button>
          </div>
          {showUnsavedWarning && (
            <div className="unsaved-warning">
              <span>You have unsaved text — your response will be lost.</span>
              <div className="unsaved-actions">
                <button className="btn" type="button" onClick={closeActivity}>Discard and close</button>
                <button className="btn primary" type="button" onClick={saveAndClose}>Save and close</button>
              </div>
            </div>
          )}
          <div className="modal-body" id="modalBody">
            {activeActivity && (
              <>
                <section className="modal-card prompt" id="modalPrompt">
                  <h3>Problem</h3>
                  <p>{activeActivity.prompt}</p>
                </section>
                <section className="modal-card task">
                  <h3>Your task</h3>
                  <p>{activeActivity.task}</p>
                  {renderActivitySupport(activeActivity)}
                  {activeActivity.tools?.length > 0 && (
                    <>
                      <h3 style={{marginTop:'1rem'}}>Suggested economist tools</h3>
                      <div className="toolkit-links" aria-label="Suggested Economist's Toolkit concepts">
                        {activeActivity.tools.map(toolId => {
                          const t = getTool(toolId)
                          return t ? (
                            <button key={toolId} type="button" onClick={() => openConceptFromActivity(toolId)}>{t.title}</button>
                          ) : null
                        })}
                      </div>
                    </>
                  )}
                  <h3 style={{marginTop:'1rem'}}>Suggested case file sections</h3>
                  <div className="review-links" aria-label="Suggested case file sections">
                    {activeActivity.review.map(link => (
                      <button key={link.target} type="button" onClick={() => { closeActivity(); setTimeout(() => document.getElementById(link.target)?.scrollIntoView({behavior:'smooth',block:'start'}), 50) }}>
                        {link.label}
                      </button>
                    ))}
                  </div>
                </section>
                <section className="modal-card">
                  <label htmlFor="activityResponse"><strong>Your response</strong></label>
                  <p className="empty-state">Use evidence from the case file and concepts from the Economist's Toolkit. This is not a quiz answer; it is an adviser note.</p>
                  <textarea
                    id="activityResponse"
                    placeholder="Write your response here..."
                    value={draftResponse}
                    onChange={e => { setDraftResponse(e.target.value); setShowUnsavedWarning(false) }}
                  />
                </section>
                {renderCompareGuidance(activeActivity.id)}
                <div className="modal-actions">
                  <div style={{display:'flex',gap:'0.6rem',flexWrap:'wrap'}}>
                    <button className="btn primary" type="button" onClick={handleSaveResponse}>Save response</button>
                    <button className="btn" type="button" onClick={maybeCloseActivity}>Close</button>
                  </div>
                  <span className="save-status" role="status" aria-live="polite">{saveStatus}</span>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* ── Concept modal ── */}
      <div
        className={cx('modal-backdrop', 'concept-backdrop', activeTool && 'open')}
        id="conceptModalBackdrop"
        onClick={e => { if (e.target.id === 'conceptModalBackdrop') closeConcept() }}
      >
        <section className="modal concept-modal" role="dialog" aria-modal="true" aria-labelledby="conceptModalTitle" aria-describedby="conceptModalIntro">
          <div className="modal-header">
            <div>
              <span className="eyebrow" style={{color:'rgba(255,255,255,0.76)'}}>Economist's Toolkit</span>
              <h2 id="conceptModalTitle">{activeTool?.title ?? ''}</h2>
            </div>
            <button className="modal-close" type="button" onClick={closeConcept} aria-label="Close concept dialog">×</button>
          </div>
          <div className="modal-body" id="conceptModalBody">
            {activeTool && renderConceptContent(activeTool)}
          </div>
        </section>
      </div>

    </div>
  )
}
