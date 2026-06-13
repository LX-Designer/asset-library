import { useState } from 'react'
import LabShell from '../../lab-shell/LabShell.jsx'
import config from './shell.config.js'
import styles from './index.module.css'
import { evidenceItems, tagOptions } from './data.js'

const CHECKPOINTS_KEY = 'econ73_checkpoints_v1'

function loadCheckpoints() {
  try { return JSON.parse(localStorage.getItem(CHECKPOINTS_KEY) || '{}') } catch { return {} }
}
function saveCheckpoints(cp) {
  try { localStorage.setItem(CHECKPOINTS_KEY, JSON.stringify(cp)) } catch {}
}

function EvidenceCard({ item, selected, tag, onTagChange }) {
  const [open, setOpen] = useState(false)

  function toggle() { setOpen(o => !o) }

  return (
    <article
      id={item.id}
      className={`evidence-card${open ? ' open' : ''}`}
      onClick={toggle}
      role="button"
      aria-expanded={open}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }}
    >
      <div className="evidence-header">
        <div className="evidence-title">{item.title}</div>
        <span className={`expand-btn${open ? ' open' : ''}`} aria-hidden="true" />
      </div>
      {!open && selected && <span className={`tag-badge ${tag.className}`}>{tag.label}</span>}
      {open && (
        <>
          <p>{item.text}</p>
          <div className="tracker-row" onClick={e => e.stopPropagation()}>
            <label htmlFor={`tag-${item.id}`}>What does this evidence suggest?</label>
            <select
              id={`tag-${item.id}`}
              value={selected}
              onChange={e => { onTagChange(item.id, e.target.value); setOpen(false) }}
            >
              {tagOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {selected && <span className={`tag-badge ${tag.className}`}>{tag.label}</span>}
          </div>
        </>
      )}
    </article>
  )
}

const policyOptions = [
  {
    title: 'Option A: No new intervention',
    description: 'Let firms continue competing and innovating. This may protect dynamic efficiency, but external costs may remain unpriced.',
    tradeoffs: [
      'Preserves market incentives for innovation and competition',
      'External costs remain unpriced — riders do not pay the full social cost',
      'No revenue generated to offset public costs such as accidents and pavement damage',
    ],
  },
  {
    title: 'Option B: Parking zones and safety rules',
    description: 'Require geofenced parking, speed limits in crowded areas, and clearer safety messaging. This targets external costs without banning scooters.',
    tradeoffs: [
      'Reduces the most visible externalities without restricting market entry or access',
      'Does not close the gap between private price and social cost',
      'Enforcement adds administrative cost with uncertain compliance',
    ],
  },
  {
    title: 'Option C: Per-ride levy',
    description: 'Add a small charge to each ride to fund pavement repair, safety enforcement, and public-space management. Prices would move closer to social cost.',
    tradeoffs: [
      'Brings private price closer to social cost — directly addresses the core market failure',
      'Generates revenue that can fund public cost recovery',
      'May reduce access for price-sensitive users who benefit most from low-cost transport',
    ],
  },
  {
    title: 'Option D: Firm permits and fleet caps',
    description: 'Limit the number of operators or scooters allowed in the city. This could reduce clutter, but it might weaken competition and reduce availability.',
    tradeoffs: [
      'May reduce pavement clutter and improve public space management',
      'Fewer permitted operators weakens competition, potentially raising prices and reducing innovation',
      'Concentration risk: limited permits may entrench market power among remaining firms',
    ],
  },
]

function PolicyCard({ title, description, tradeoffs }) {
  const [open, setOpen] = useState(false)
  function toggle() { setOpen(o => !o) }
  return (
    <article
      className="policy-card"
      onClick={toggle}
      role="button"
      aria-expanded={open}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      {open && (
        <>
          <p className="tradeoff-heading">Benefits and costs</p>
          <ul className="tradeoff-list">
            {tradeoffs.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </>
      )}
      <span className="tradeoffs-pill" aria-hidden="true">
        {open ? 'Hide benefits and costs' : 'Benefits and costs'}
        <span className={`expand-btn${open ? ' open' : ''}`} aria-hidden="true" />
      </span>
    </article>
  )
}

// ── Dossier content ───────────────────────────────────────────────────────────
// Rendered as children of LabShell. Manages only checkpoint state (localStorage)
// — all response state is owned by the shell and passed down via render props.

function DossierContent({ responses, onSave, openActivity }) {
  const [checkpoints, setCheckpoints] = useState(loadCheckpoints)

  const evidenceTags = responses['evidence-tags'] || {}

  function handleTagChange(itemId, value) {
    const newTags = { ...evidenceTags }
    if (value) newTags[itemId] = value
    else delete newTags[itemId]
    onSave('evidence-tags', newTags)
  }

  function toggleCheckpoint(key) {
    const next = { ...checkpoints }
    if (next[key]) delete next[key]
    else next[key] = true
    setCheckpoints(next)
    saveCheckpoints(next)
  }

  function getTagMeta(value) { return tagOptions.find(o => o.value === value) || tagOptions[0] }

  function evidenceGroups() {
    const g = { efficiency: [], failure: [], both: [], unclear: [], untagged: [] }
    evidenceItems.forEach(item => {
      const tag = evidenceTags[item.id]
      if (g[tag]) g[tag].push(item)
      else g.untagged.push(item)
    })
    return g
  }

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
        {[
          ['act-1', 'Activity 1 — Efficiency claims'],
          ['act-2', 'Activity 2 — Productive and allocative efficiency'],
          ['act-3', 'Activity 3 — Possible market failure'],
          ['act-4', 'Activity 4 — Policy trade-offs'],
          ['act-5', 'Activity 5 — Dynamic efficiency'],
        ].map(([id, label]) => {
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

  return (
    <div className={styles.root}>
      <a className="skip-link" href="#main">Skip to dossier</a>

      <div className={styles.contentGrid}>

        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <span className="eyebrow">Policy briefing file</span>
            <h1 id="hero-title">When is a market working efficiently, and when does it fail?</h1>
            <div className="hero-brief">
              <span className="hero-brief-label">Your brief</span>
              <p>You are an economic adviser reviewing the market for electric scooters in a growing city. Use the case file as your evidence base, open the Economist's Toolkit when you need to check and apply economic concepts, and make a recommendation to the city government about how to deal with the growing use of electric scooters.</p>
            </div>
          </div>
          <svg className="hero-skyline" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            {/* Background city layer — semi-transparent, creates depth */}
            <path fill="rgba(16,22,45,0.32)" d="M 0 200 L 0 148 L 45 148 L 45 130 L 90 130 L 90 108 L 115 108 L 115 90 L 145 90 L 145 108 L 185 108 L 185 128 L 225 128 L 225 105 L 268 105 L 268 138 L 298 138 L 298 55 L 310 55 L 310 43 L 330 43 L 330 55 L 340 55 L 340 95 L 380 95 L 380 122 L 415 122 L 415 92 L 460 92 L 460 68 L 492 68 L 492 28 L 498 28 L 498 18 L 512 18 L 512 28 L 520 28 L 520 52 L 555 52 L 555 35 L 560 35 L 560 28 L 585 28 L 585 35 L 592 35 L 592 62 L 630 62 L 630 48 L 702 48 L 702 15 L 715 15 L 715 8 L 725 8 L 725 15 L 732 15 L 732 48 L 758 48 L 758 70 L 810 70 L 810 62 L 858 62 L 858 92 L 905 92 L 905 115 L 955 115 L 955 95 L 998 95 L 998 118 L 1045 118 L 1045 135 L 1088 135 L 1088 115 L 1132 115 L 1132 138 L 1178 138 L 1178 150 L 1200 150 L 1200 200 Z" />
            {/* Foreground city silhouette */}
            <path fill="#10162d" d="M 0 200 L 0 163 L 72 163 L 72 145 L 122 145 L 122 127 L 132 127 L 132 113 L 148 113 L 148 127 L 160 127 L 160 145 L 200 145 L 200 122 L 252 122 L 252 155 L 282 155 L 282 73 L 287 73 L 287 59 L 310 59 L 310 73 L 315 73 L 315 107 L 362 107 L 362 138 L 402 138 L 402 110 L 448 110 L 448 87 L 477 87 L 477 47 L 480 47 L 480 39 L 502 39 L 502 47 L 505 47 L 505 74 L 537 74 L 537 52 L 542 52 L 542 43 L 568 43 L 568 52 L 572 52 L 572 80 L 613 80 L 613 63 L 683 63 L 683 31 L 687 31 L 687 19 L 695 19 L 695 31 L 699 31 L 699 63 L 708 63 L 708 87 L 753 87 L 753 113 L 796 113 L 796 80 L 848 80 L 848 111 L 893 111 L 893 132 L 942 132 L 942 112 L 982 112 L 982 135 L 1027 135 L 1027 150 L 1072 150 L 1072 130 L 1116 130 L 1116 152 L 1162 152 L 1162 165 L 1200 165 L 1200 200 Z" />
            {/* Antenna on tallest building */}
            <line x1="691" y1="5" x2="691" y2="19" stroke="#10162d" strokeWidth="2"/>
            <circle cx="691" cy="5" r="2" fill="#10162d"/>
            {/* Windows — glass reflection style */}
            <g fill="rgba(255,255,255,0.13)">
              {/* Tallest building */}
              <rect x="684" y="22" width="4" height="4"/><rect x="691" y="22" width="4" height="4"/>
              <rect x="684" y="29" width="4" height="4"/><rect x="691" y="29" width="4" height="4"/>
              <rect x="684" y="36" width="4" height="4"/><rect x="691" y="36" width="4" height="4"/>
              <rect x="684" y="43" width="4" height="4"/><rect x="691" y="43" width="4" height="4"/>
              <rect x="684" y="50" width="4" height="4"/><rect x="691" y="50" width="4" height="4"/>
              <rect x="684" y="57" width="4" height="4"/><rect x="691" y="57" width="4" height="4"/>
              {/* Left skyscraper cluster */}
              <rect x="482" y="42" width="5" height="4"/><rect x="490" y="42" width="5" height="4"/><rect x="498" y="42" width="5" height="4"/>
              <rect x="482" y="49" width="5" height="4"/><rect x="490" y="49" width="5" height="4"/><rect x="498" y="49" width="5" height="4"/>
              <rect x="482" y="56" width="5" height="4"/><rect x="490" y="56" width="5" height="4"/><rect x="498" y="56" width="5" height="4"/>
              <rect x="482" y="63" width="5" height="4"/><rect x="490" y="63" width="5" height="4"/><rect x="498" y="63" width="5" height="4"/>
              {/* Second skyscraper */}
              <rect x="544" y="46" width="6" height="4"/><rect x="553" y="46" width="6" height="4"/><rect x="562" y="46" width="5" height="4"/>
              <rect x="544" y="53" width="6" height="4"/><rect x="553" y="53" width="6" height="4"/><rect x="562" y="53" width="5" height="4"/>
              <rect x="544" y="60" width="6" height="4"/><rect x="553" y="60" width="6" height="4"/><rect x="562" y="60" width="5" height="4"/>
              <rect x="544" y="67" width="6" height="4"/><rect x="553" y="67" width="6" height="4"/><rect x="562" y="67" width="5" height="4"/>
              {/* Left tower */}
              <rect x="289" y="62" width="6" height="4"/><rect x="300" y="62" width="6" height="4"/>
              <rect x="289" y="69" width="6" height="4"/><rect x="300" y="69" width="6" height="4"/>
              <rect x="289" y="76" width="6" height="4"/><rect x="300" y="76" width="6" height="4"/>
              <rect x="289" y="83" width="6" height="4"/><rect x="300" y="83" width="6" height="4"/>
              <rect x="289" y="90" width="6" height="4"/><rect x="300" y="90" width="6" height="4"/>
              <rect x="289" y="97" width="6" height="4"/><rect x="300" y="97" width="6" height="4"/>
              {/* Right tower */}
              <rect x="800" y="83" width="8" height="4"/><rect x="813" y="83" width="8" height="4"/><rect x="826" y="83" width="8" height="4"/>
              <rect x="800" y="90" width="8" height="4"/><rect x="813" y="90" width="8" height="4"/><rect x="826" y="90" width="8" height="4"/>
              <rect x="800" y="97" width="8" height="4"/><rect x="813" y="97" width="8" height="4"/><rect x="826" y="97" width="8" height="4"/>
              <rect x="800" y="104" width="8" height="4"/><rect x="813" y="104" width="8" height="4"/><rect x="826" y="104" width="8" height="4"/>
            </g>
          </svg>
        </section>

        <main id="main">

          {/* Case overview */}
          <section id="case-overview" className="dossier-section">
            <div className="section-kicker">Case overview</div>
            <h2>The electric scooter market</h2>
            <p className="lead">
              Electric scooters have grown quickly in Metroville, a fictional city with crowded inner suburbs, busy public transport hubs, and rising demand for short-distance travel. Consumers value scooters because they are cheap, flexible, and available through phone apps. Companies compete to place scooters where demand is highest.
            </p>
            <div className="callout">
              <strong>Your role:</strong> Decide whether the market is working efficiently, whether there is evidence of market failure, and whether government intervention could be justified.
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
            <div className="section-kicker">Case file guide</div>
            <h2>How to use this investigation</h2>
            <p className="lead">
              The main page is the <strong>Market Case File</strong>: it contains information about the scooter market, data, stakeholders, policy options, and evidence. The economics theory sits separately in the <strong>Economist's Toolkit</strong>. Use the economic concepts contained within to analyse the case and support your recommendations.
            </p>
            <ol className="stage-steps" aria-label="Investigation stages">
              <li className="stage-step"><div className="step-num" aria-hidden="true">1</div><div className="step-body"><h3>Build the evidence base</h3><p>Identify the evidence that suggests the market may be working efficiently or failing. Tag the evidence cards accordingly to support your claims.</p></div></li>
              <li className="stage-step"><div className="step-num" aria-hidden="true">2</div><div className="step-body"><h3>Test the efficiency claim</h3><p>Use the concepts of productive, allocative, and dynamic efficiency to decide if the market appears efficient.</p></div></li>
              <li className="stage-step"><div className="step-num" aria-hidden="true">3</div><div className="step-body"><h3>Test for possible market failure</h3><p>Examine whether the market creates inefficient resource allocation, then identify the strongest possible causes.</p></div></li>
              <li className="stage-step"><div className="step-num" aria-hidden="true">4</div><div className="step-body"><h3>Weigh policy trade-offs</h3><p>Use the concepts of Pareto optimality and dynamic efficiency to judge whether intervention could improve outcomes, and if so, who will win and who may lose.</p></div></li>
              <li className="stage-step"><div className="step-num" aria-hidden="true">5</div><div className="step-body"><h3>Make and reflect on your judgement</h3><p>Write a recommendation, then reflect on how the evidence and concepts shaped your reasoning.</p></div></li>
            </ol>
            <div className="callout">
              <strong>Tip:</strong> Use the <strong>Activities</strong> and <strong>Toolkit</strong> tabs in the guide panel to open tasks or access the Economist's Toolkit without losing your place in the case file.
            </div>
          </section>

          {/* Market data */}
          <section id="market-data" className="dossier-section">
            <div className="section-kicker">Market data file</div>
            <h2>Data snapshot: what is happening in the market?</h2>
            <p className="lead">These figures provide case evidence to test different efficiency claims. The data is mixed: some evidence suggests the market is working well, while other evidence points to possible market failure.</p>
            <div className="data-grid">

              {/* Panel 1: Demand growth */}
              <article className="data-panel">
                <span className="data-kicker">Demand growth</span>
                <div className="data-headline">26,000</div>
                <p className="data-headline-sub">Daily scooter trips in Year 3, up from <strong>8,000</strong> two years earlier — a 225% increase. Average trip price is <strong>$4.20</strong>, compared with about $14 for a short taxi trip.</p>
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
                <div className="data-lens">
                  <strong>Economic lens:</strong> Does rapid growth signal consumer value and productive efficiency, or does it amplify unpriced external costs and pressure on public space?
                </div>
              </article>

              {/* Panel 2: Price vs social cost */}
              <article className="data-panel">
                <span className="data-kicker">Price vs social cost</span>
                <div className="data-headline">$4.20 <span className="data-headline-vs">vs $5.30</span></div>
                <p className="data-headline-sub">Riders pay <strong>$4.20</strong> per trip. The estimated social cost — including pavement damage, safety enforcement, and hospital treatment — is <strong>$5.30</strong>. That is a gap of $1.10 per ride.</p>
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
                <div className="data-lens">
                  <strong>Economic lens:</strong> If price falls below social marginal cost, the market may be overproviding rides. Does this gap point to allocative inefficiency?
                </div>
              </article>

              {/* Panel 3: Market structure — full width */}
              <article className="data-panel data-panel-full">
                <span className="data-kicker">Market structure</span>
                <div className="data-panel-split">
                  <div className="data-panel-split-text">
                    <div className="data-headline">82%</div>
                    <p className="data-headline-sub">Top two firms control 82% of scooter rentals. Smaller providers struggle to access popular parking and charging locations. The city also spends an estimated <strong>$1.2m per year</strong> on scooter clearing, pavement repair, and safety enforcement — costs not priced into each ride.</p>
                  </div>
                  <div className="donut-wrap" role="img" aria-label="Donut chart: top two firms control 82% of rentals.">
                    <div className="donut">
                      <div className="donut-inner">82%<br/></div>
                    </div>
                    <div>
                      <p className="donut-explainer">Two firms control <strong>82%</strong> of scooter rentals. Smaller providers struggle to access popular parking and charging locations.</p>
                      <div className="donut-legend" aria-hidden="true">
                        <span className="legend-item"><span className="legend-swatch red"></span>Top two firms: 82%</span>
                        <span className="legend-item"><span className="legend-swatch other"></span>Other firms: 18%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="data-lens">
                  <strong>Economic lens:</strong> Does concentration weaken price competition and reduce dynamic efficiency? Does the $1.2m public cost represent an unpriced negative externality — a sign of market failure?
                </div>
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
            <p className="lead">The city is not deciding between perfect market freedom and total control. It can choose light-touch, targeted, or stricter interventions. Each option has its own benefits and costs.</p>
            <div className="policy-grid">
              {policyOptions.map((opt, i) => (
                <PolicyCard key={i} {...opt} />
              ))}
            </div>
          </section>

          {/* Evidence board */}
          <section id="evidence" className="dossier-section">
            <div className="section-kicker">Evidence file</div>
            <h2>Examine the case evidence</h2>
            <p className="lead">Each card contains a finding from the Metroville scooter market — a data point, a claim, or a stakeholder observation. Read each one and decide what it suggests: does it point toward a market working efficiently, a market failing, or something more mixed? This classification is the foundation of your economic argument.</p>
            <div className="evidence-grid" aria-live="polite">
              {evidenceItems.map(item => {
                const selected = evidenceTags[item.id] || ''
                const tag = getTagMeta(selected)
                return (
                  <EvidenceCard
                    key={item.id}
                    item={item}
                    selected={selected}
                    tag={tag}
                    onTagChange={handleTagChange}
                  />
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
              <button className="btn primary" type="button" onClick={() => openActivity('act-6')}>Write recommendation</button>
              <button className="btn" type="button" onClick={() => openActivity('act-7')}>Reflect on reasoning</button>
            </div>
          </section>

        </main>
      </div>

      <footer>
        <p>A Level Economics 7.3 — Market Investigation Dossier. Your investigation notes are saved automatically and will be here when you return.</p>
      </footer>
    </div>
  )
}

// ── Exported lab component ────────────────────────────────────────────────────

export default function EconDossier({ onResponse, onComplete, savedResponses, isCompleted, onReset, backHref }) {
  return (
    <LabShell
      config={config}
      onResponse={onResponse}
      onComplete={onComplete}
      savedResponses={savedResponses}
      isCompleted={isCompleted}
      onReset={onReset}
      backHref={backHref}
      className={styles.labShell}
    >
      {({ openActivity, responses, onSave }) => (
        <DossierContent
          responses={responses}
          onSave={onSave}
          openActivity={openActivity}
        />
      )}
    </LabShell>
  )
}
