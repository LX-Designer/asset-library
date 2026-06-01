import styles from '../RivergateOverflow.module.css'

const EVIDENCE_META = {
  'reference-note':        { stamp: 'Analyst Reference — Section 8', title: 'Efficiency Terms' },
  'engineering-memo':      { stamp: 'Internal Document — North Wessex Water', title: 'Engineering Memo, March 2021' },
  'committee-minutes':     { stamp: 'Internal Document — North Wessex Water', title: 'Finance Committee Minutes, June 2021' },
  'expert-comparison':     { stamp: 'Panel Supplement — Sections 7A & 7B', title: 'Expert Account Comparison' },
}

function ReferenceNote() {
  return (
    <div className={styles.evidenceDocBody}>
      <div className={styles.termBlock}>
        <div className={styles.termName}>Productive efficiency</div>
        <div className={styles.termDef}>
          Occurs when output is produced at the lowest possible cost, given available technology and input prices.
          In firm diagrams, this is often associated with producing at the minimum point of average cost.
        </div>
      </div>
      <div className={styles.termBlock}>
        <div className={styles.termName}>Allocative efficiency</div>
        <div className={styles.termDef}>
          Occurs when resources are allocated to produce the combination of goods and services that maximises social welfare.
          In simple market analysis, this is often associated with price equalling marginal cost. Where externalities exist,
          the relevant comparison is between marginal social benefit and marginal social cost, not just private price and private cost.
        </div>
      </div>
      <div className={styles.termBlock}>
        <div className={styles.termName}>Pareto optimality</div>
        <div className={styles.termDef}>
          Describes a situation where it is not possible to make one person better off without making someone else worse off.
        </div>
      </div>
      <div className={styles.termBlock}>
        <div className={styles.termName}>Dynamic efficiency</div>
        <div className={styles.termDef}>
          Refers to efficiency over time through innovation, investment, improved methods, and better long-run use of resources.
        </div>
      </div>
      <div className={styles.termBlock}>
        <div className={styles.termName}>Market failure</div>
        <div className={styles.termDef}>
          Occurs when the market mechanism leads to an allocation of resources that does not maximise social welfare.
        </div>
      </div>
      <div className={styles.termBlock}>
        <div className={styles.termName}>Reasons for market failure</div>
        <div className={styles.termDef}>
          May include externalities, public goods, merit and demerit goods, imperfect information, market dominance,
          and missing or incomplete markets.
        </div>
      </div>
    </div>
  )
}

function EngineeringMemo() {
  return (
    <div className={styles.evidenceDocBody}>
      <p>
        <strong>To:</strong> Infrastructure Investment Committee<br />
        <strong>From:</strong> Network Engineering Team, North Wessex Water<br />
        <strong>Re:</strong> Rivergate Storage Tunnel &amp; Pump Station — Investment Timing Assessment<br />
        <strong>Date:</strong> March 2021 (internal, not for external distribution)
      </p>
      <span className={styles.evidenceDocSub}>Summary assessment</span>
      <p>
        The East Quay pump station is currently operating close to practical capacity during peak rainfall
        events. The existing combined sewer network in the Rivergate district was designed for lower
        rainfall intensity than is now observed under current climate patterns.
      </p>
      <p>
        If storage is not expanded before the next regulatory period, modelled overflow frequency is
        likely to increase under moderate rainfall scenarios — not only under severe storm conditions.
        The engineering team notes that several overflow events in the past eighteen months have
        occurred at rainfall levels previously considered sub-threshold for overflow operation.
      </p>
      <span className={styles.evidenceDocSub}>Risk summary</span>
      <p>
        Proceeding with the storage tunnel and pump replacement in the current period (2021–22) would
        reduce overflow frequency by increasing temporary storage capacity and improving pump throughput.
        Estimated capital cost at current prices: £18m. Expected effect: materially reduced overflow
        frequency under moderate and severe rainfall scenarios. Customer bill impact: approximately
        £9 per household per year for five years.
      </p>
      <p>
        Deferring the upgrade to the 2025–26 regulatory period reduces near-term capital expenditure but
        carries the following risks: (1) higher estimated future construction cost (current estimate
        £31m in future prices, reflecting inflation and contractor market conditions); (2) increased
        operational and reputational risk from more frequent overflow use; (3) risk that regulator may
        classify increased overflow use as a service failure rather than an emergency relief measure.
      </p>
      <span className={styles.evidenceDocSub}>Recommendation</span>
      <p>
        The engineering team recommends proceeding with the storage tunnel and pump replacement in the
        current regulatory period. The risks associated with deferral are, in the engineering team's
        assessment, material. However, the final decision on investment timing rests with the Board in
        the context of the current price-control settlement and affordability constraints.
      </p>
      <p><em>Eleni Markou, Senior Network Engineer, North Wessex Water</em></p>
    </div>
  )
}

function CommitteeMinutes() {
  return (
    <div className={styles.evidenceDocBody}>
      <p>
        <strong>North Wessex Water — Finance &amp; Investment Committee</strong><br />
        <strong>Minutes — item 4: Rivergate Infrastructure Investment Decision</strong><br />
        <strong>Meeting date:</strong> June 2021 (internal, approved for panel disclosure)
      </p>
      <span className={styles.evidenceDocSub}>Discussion</span>
      <p>
        The Committee reviewed the engineering team's assessment and the three investment options
        presented (proceed 2021–22; defer to 2025–26; minor maintenance only). The Chief Financial
        Officer noted that the current Ofwat price-control settlement rewards cost discipline and that
        the company's cost performance relative to the regulatory allowance is a material factor in
        the upcoming performance review.
      </p>
      <p>
        The Operations Director noted that the engineering team's modelling was based on rainfall
        projections that carried significant uncertainty over a five-year horizon. He suggested
        that committing £18m to address a risk that might not materialise within the current period
        would be difficult to justify to regulators or shareholders in the absence of a stronger
        evidence base.
      </p>
      <p>
        The Director of Customer Experience noted that customer satisfaction scores were currently
        above the regional benchmark and that an immediate bill increase of £9 per year was
        "difficult to communicate" in the current cost-of-living environment.
      </p>
      <span className={styles.evidenceDocSub}>Decision</span>
      <p>
        The Board agreed that the Rivergate upgrade should be deferred to the 2025–26 regulatory
        period. The immediate bill impact is difficult to justify when overflow exceedance remains
        uncertain and when the current price-control settlement rewards cost discipline. The decision
        will be reviewed if monitored overflow events increase materially.
      </p>
      <p>
        Action: Engineering team to continue monitoring overflow operation and to flag if event
        frequency departs materially from modelled projections. Legal team to confirm regulatory
        compliance position on overflow frequency.
      </p>
    </div>
  )
}

function ExpertComparison() {
  return (
    <div className={styles.evidenceDocBody}>
      <p style={{ color: 'var(--rg-muted)', fontSize: 12, marginBottom: 18 }}>
        Prepared for the Rivergate Economic Review Panel. Summarises the two competing expert
        interpretations of the upgrade deferral decision.
      </p>
      <span className={styles.evidenceDocSub}>Account A — Company efficiency account</span>
      <p>
        <strong>Speaker:</strong> Jonas Reeve, Operations Director, North Wessex Water
      </p>
      <p>
        Core argument: the delayed upgrade was a constrained but efficient decision. The company kept
        operating costs below the regulatory allowance and household bills below the regional
        benchmark. Deferral protected consumers from unnecessary bill increases under uncertain
        conditions. The company is pursuing long-run improvement through a smart-storage programme,
        demonstrating dynamic efficiency.
      </p>
      <p>
        Key evidence relied upon: operating cost per household connection below £89 benchmark;
        average bill £396 against £408 regional benchmark; new monitoring and storage programme.
      </p>
      <span className={styles.evidenceDocSub}>Account B — Social cost market failure account</span>
      <p>
        <strong>Speaker:</strong> Dr Lena Ortiz, Environmental Economist, Rivergate University
      </p>
      <p>
        Core argument: the decision was not efficient in the wider economic sense. Private cost
        savings were achieved by shifting costs onto shellfish producers, beach users, the local
        council, and the environment. The firm's monopoly position, imperfect information, weak
        incentives, and unpriced externalities meant the market outcome did not maximise social
        welfare. The delay also undermined dynamic efficiency.
      </p>
      <p>
        Key evidence relied upon: external cost estimate £3.9m in 2024; 23 shellfish restriction
        days; 14 beach closure days; internal engineering warning; dividend payments continuing
        at £18m per year.
      </p>
      <span className={styles.evidenceDocSub}>Panel note on evidence weight</span>
      <p>
        Both accounts draw on the same evidence file. The panel will assess which account is better
        supported by the balance of evidence, taking into account both the private performance
        indicators and the external cost and service data.
      </p>
    </div>
  )
}

const CONTENT_MAP = {
  'reference-note':    ReferenceNote,
  'engineering-memo':  EngineeringMemo,
  'committee-minutes': CommitteeMinutes,
  'expert-comparison': ExpertComparison,
}

/**
 * EvidenceContent — renders the content body for a given evidenceId.
 * Chrome (FloatingPanel, overlay, close button) is provided by LabShell's EvidencePanel.
 */
export default function EvidenceContent({ evidenceId }) {
  const meta = EVIDENCE_META[evidenceId]
  const ContentComponent = CONTENT_MAP[evidenceId]
  if (!meta || !ContentComponent) return null

  return (
    <div>
      <div className={styles.evidenceDocHeader}>
        <div className={styles.evidenceDocStamp}>{meta.stamp}</div>
        <h2 className={styles.evidenceDocTitle}>{meta.title}</h2>
      </div>
      <ContentComponent />
    </div>
  )
}
