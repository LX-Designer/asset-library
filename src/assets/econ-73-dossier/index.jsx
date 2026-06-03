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
            <p>You are an economic adviser reviewing the market for electric scooters in a growing city. Use the case file as your evidence base, open the Economist's Toolkit when you need to check and apply economic concepts, and make a recommendation to the city government about how to deal with the growing use of electric scooters.</p>
          </div>
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
            <div className="section-kicker">How to use this investigation</div>
            <h2>Case file first. Concepts when you need them.</h2>
            <p className="lead">
              The main page is the <strong>Market Case File</strong>: it contains the scooter market, data, stakeholders, policy options, and evidence. The economics theory sits separately in the <strong>Economist's Toolkit</strong>. Use the economic concepts contained within to analyse the case and support your recommendations.
            </p>
            <div className="stage-map" aria-label="Investigation stages">
              <article className="stage-card"><span className="stage-label">Stage 1</span><h3>Build the evidence base</h3><p>Identify the evidence that suggests the market may be working efficiently or failing. Tag the evidence cards accordingly to support your claims.</p></article>
              <article className="stage-card"><span className="stage-label">Stage 2</span><h3>Test the efficiency claim</h3><p>Use the concepts of productive, allocative, and dynamic efficiency to decide if the market appears efficient.</p></article>
              <article className="stage-card"><span className="stage-label">Stage 3</span><h3>Test for possible market failure</h3><p>Examine whether the market creates inefficient resource allocation, then identify the strongest possible causes.</p></article>
              <article className="stage-card"><span className="stage-label">Stage 4</span><h3>Weigh policy trade-offs</h3><p>Use the concepts of Pareto optimality and dynamic efficiency to judge whether intervention could improve outcomes, and if so, who will win and who may lose.</p></article>
              <article className="stage-card"><span className="stage-label">Stage 5</span><h3>Make and reflect on your judgement</h3><p>Write a recommendation, then reflect on how the evidence and concepts shaped your reasoning.</p></article>
            </div>
            <div className="callout">
              <strong>Tip:</strong> Use the <strong>Activities</strong> and <strong>Concepts</strong> tabs in the guide panel to open tasks or access the Economist's Toolkit without losing your place in the case file.
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
                <ul className="tradeoff-list"><li>Low regulation</li><li>Low risk to innovation</li><li>High risk that external costs remain</li></ul>
              </article>
              <article className="policy-card">
                <h3>Option B: Parking zones and safety rules</h3>
                <p>Require geofenced parking, speed limits in crowded areas, and clearer safety messaging. This targets external costs without banning scooters.</p>
                <ul className="tradeoff-list"><li>Targeted regulation</li><li>Some convenience cost</li><li>Possible safety benefit</li></ul>
              </article>
              <article className="policy-card">
                <h3>Option C: Per-ride levy</h3>
                <p>Add a small charge to each ride to fund pavement repair, safety enforcement, and public-space management. Prices would move closer to social cost.</p>
                <ul className="tradeoff-list"><li>Creates a price signal</li><li>May reduce demand</li><li>Funds public costs</li></ul>
              </article>
              <article className="policy-card">
                <h3>Option D: Firm permits and fleet caps</h3>
                <p>Limit the number of operators or scooters allowed in the city. This could reduce clutter, but it might weaken competition and reduce availability.</p>
                <ul className="tradeoff-list"><li>Stricter control</li><li>Risk of weaker competition</li><li>Possible clutter reduction</li><li>Concentration risk: fewer permitted operators may acquire monopoly power — connect to your market concentration evidence</li></ul>
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
                      <div className="evidence-title">{item.title}</div>
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
                      {selected && <span className={`tag-badge ${tag.className}`}>{tag.label}</span>}
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
