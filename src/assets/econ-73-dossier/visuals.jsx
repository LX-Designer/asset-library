// Toolkit visual components for the Market Investigation Dossier.
// Rendered inside ConceptsModal (FloatingPanel portal) — uses scoped CSS
// with --econ-* vars forwarded through themeVars.
import s from './visuals.module.css'

export function VisualProductive() {
  return (
    <article className={s.wrap}>
      <h3>Productive efficiency visual</h3>
      <div className={s.barChart} aria-label="Bar chart: average cost per ride falling 22% after better fleet management.">
        <div className={s.barRow}>
          <strong>Before</strong>
          <div className={s.barTrack}>
            <div className={`${s.barFill} ${s.barFillBlue}`} style={{ width: '100%' }} />
          </div>
          <span>$3.10</span>
        </div>
        <div className={s.barRow}>
          <strong>After</strong>
          <div className={s.barTrack}>
            <div className={s.barFill} style={{ width: '78%' }} />
          </div>
          <span>$2.42</span>
        </div>
      </div>
      <p className={s.caption}>Lower average cost may support productive efficiency. It does not prove the number of rides is socially efficient.</p>
    </article>
  )
}

export function VisualSocialCost() {
  return (
    <article className={s.wrap}>
      <span className={s.figureLabel}>Cost visual</span>
      <h3>Allocative efficiency and market failure visual</h3>
      <p className={s.figureContext}>This compares the private price paid by riders with the estimated social cost once external costs are included.</p>
      <div className={s.costGap} aria-label="Comparison: private scooter price $4.20, estimated social cost $5.30 ($4.20 + $1.10 external).">
        <div className={s.costLine}>
          <strong>Private price paid by rider</strong>
          <div className={s.costBox}>
            <span className={`${s.segment} ${s.segmentPrivate}`} style={{ width: '79%' }}>$4.20</span>
          </div>
        </div>
        <div className={s.costLine}>
          <strong>Estimated social cost</strong>
          <div className={s.costBox}>
            <span className={`${s.segment} ${s.segmentPrivate}`} style={{ width: '79%' }}>$4.20</span>
            <span className={`${s.segment} ${s.segmentExternal}`} style={{ width: '21%' }}>+$1.10</span>
          </div>
        </div>
        <div className={s.legend} aria-hidden="true">
          <span className={s.legendItem}><span className={`${s.legendSwatch} ${s.legendSwatchPrivate}`} />Private price</span>
          <span className={s.legendItem}><span className={`${s.legendSwatch} ${s.legendSwatchExternal}`} />Estimated external cost</span>
          <span className={s.legendItem}>Total estimated social cost: <strong>$5.30</strong></span>
        </div>
      </div>
      <p className={s.caption}>If social cost is higher than private price, the market price may encourage too many rides.</p>
    </article>
  )
}

export function VisualTradeoff() {
  return (
    <article className={s.wrap}>
      <h3>Pareto trade-off visual</h3>
      <div className={s.svgWrap} role="img" aria-label="Diagram: policy benefits for pedestrians and costs for some scooter users and firms.">
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
      <p className={s.caption}>Many policies are not Pareto improvements, even when they may improve overall welfare.</p>
    </article>
  )
}

export function VisualInnovation() {
  return (
    <article className={s.wrap}>
      <h3>Dynamic efficiency timeline</h3>
      <div className={s.svgWrap} role="img" aria-label="Timeline showing innovation from current scooters to safer designs and better batteries.">
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
      <p className={s.caption}>Dynamic efficiency asks how today's rules affect future innovation and investment.</p>
    </article>
  )
}
