import styles from '../RivergateOverflow.module.css'

const SECTIONS = [
  { id: 'section-1',  label: '§1 Background' },
  { id: 'section-2',  label: '§2 Performance' },
  { id: 'section-3',  label: '§3 Overflow Data' },
  { id: 'section-4',  label: '§4 Investment' },
  { id: 'section-5',  label: '§5 External Costs' },
  { id: 'section-6',  label: '§6 Distribution' },
  { id: 'section-7a', label: '§7A Expert A' },
  { id: 'section-7b', label: '§7B Expert B' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function CaseDocument({ onOpenEvidence }) {
  return (
    <>
      {/* Sticky section nav */}
      <nav className={styles.sectionNav} aria-label="Evidence sections">
        <span className={styles.sectionNavDivider}>Sections</span>
        {SECTIONS.map(({ id, label }) => (
          <button key={id} className={styles.sectionNavBtn} onClick={() => scrollTo(id)}>
            {label}
          </button>
        ))}
        <button className={styles.sectionNavRef} onClick={() => onOpenEvidence('reference-note')}>
          § Ref. Note
        </button>
      </nav>

      <div className={styles.docContent}>
        {/* ── SCENARIO HEADER ────────────────────────────────────── */}
        <div className={styles.docHeaderBlock}>
          <span className={styles.docHeaderStamp}>Evidence File · Public Utility Performance Review</span>
          <div className={styles.docHeaderTitle}>Rivergate Economic Review Panel — Evidence File RG/7.3</div>
          <div className={styles.docHeaderMeta}>
            <span className={styles.docHeaderKey}>Classification</span>
            <span className={styles.docHeaderVal}>Public utility performance review</span>
            <span className={styles.docHeaderKey}>Case reference</span>
            <span className={styles.docHeaderVal}>RG/7.3/NWW/Overflow</span>
            <span className={styles.docHeaderKey}>Review date</span>
            <span className={styles.docHeaderVal}>14 May 2026</span>
            <span className={styles.docHeaderKey}>District</span>
            <span className={styles.docHeaderVal}>Rivergate Estuary, North Wessex Region</span>
            <span className={styles.docHeaderKey}>Prepared for</span>
            <span className={styles.docHeaderVal}>Rivergate Economic Review Panel</span>
            <span className={styles.docHeaderKey}>Analyst role</span>
            <span className={styles.docHeaderVal}>Junior economic analyst</span>
          </div>
          <div className={styles.docHeaderRole}>
            You have been appointed as a junior economic analyst to assist the Rivergate Economic Review Panel.
            The panel is reviewing whether North Wessex Water's decision to delay the Rivergate sewer upgrade
            was an efficient use of scarce resources or evidence of market failure.
            <br /><br />
            Your task is not to decide whether pollution is "good" or "bad". Your task is to examine the
            economic evidence: costs, benefits, incentives, external effects, investment timing, and the
            distribution of gains and losses.
          </div>
        </div>

        {/* ── SECTION 1 ───────────────────────────────────────────── */}
        <div className={styles.sectionBlock} id="section-1">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>Section 1</span>
            <span className={styles.sectionTitle}>Background to the case</span>
          </div>
          <p className={styles.docParagraph}>
            North Wessex Water is the sole wastewater provider for the Rivergate coastal district. The company
            operates under a price-control settlement that limits the revenue it can recover from customer bills
            during each regulatory period.
          </p>
          <p className={styles.docParagraph}>
            The Rivergate district uses a combined sewer system. In normal conditions, wastewater is carried to
            the treatment works at East Quay. During intense rainfall, stormwater enters the same network. If
            the network becomes overloaded, storm overflows can release diluted wastewater into the Rivergate
            Estuary to prevent sewage backing up into homes, streets, and businesses.
          </p>
          <p className={styles.docParagraph}>
            Storm overflows are permitted as emergency relief points. They are not intended to operate frequently
            under ordinary rainfall conditions.
          </p>
          <p className={styles.docParagraph}>
            In 2021, North Wessex Water considered a major upgrade to the Rivergate storage tunnel and pump
            station. The upgrade was intended to increase temporary storage capacity during rainfall events
            and reduce overflow operation. The company deferred the upgrade to the next regulatory period,
            citing affordability concerns and uncertainty over future rainfall patterns.
          </p>
          <p className={styles.docParagraph}>
            The panel has asked whether this delay was economically efficient.
          </p>
        </div>

        {/* ── SECTION 2 ───────────────────────────────────────────── */}
        <div className={styles.sectionBlock} id="section-2">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>Section 2</span>
            <span className={styles.sectionTitle}>Company performance summary</span>
          </div>

          <div className={styles.excerptBlock}>
            <span className={styles.excerptLabel}>Extract from North Wessex Water Performance Submission, 2024</span>
            <div className={styles.excerptText}>
              <p>North Wessex Water has delivered strong cost control for customers. Operating cost per household connection remains below the regional allowance, and the average annual wastewater bill remains below the benchmark for comparable coastal districts. In a period of high construction costs, the decision to phase the Rivergate upgrade protected customers from unnecessary bill increases while preserving funds for higher-priority network risks.</p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <span className={styles.tableLabel}>Table 1 — Selected company performance indicators</span>
            <table className={styles.evidenceTable}>
              <thead>
                <tr>
                  <th>Indicator</th>
                  <th>2021</th>
                  <th>2022</th>
                  <th>2023</th>
                  <th>2024</th>
                  <th>Reg. benchmark 2024</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Operating cost per household connection</td>
                  <td>£84</td>
                  <td>£83</td>
                  <td>£82</td>
                  <td>£82</td>
                  <td>£89</td>
                </tr>
                <tr>
                  <td>Average annual wastewater bill</td>
                  <td>£386</td>
                  <td>£389</td>
                  <td>£392</td>
                  <td>£396</td>
                  <td>£408</td>
                </tr>
                <tr>
                  <td>Customer satisfaction score /100</td>
                  <td>78</td>
                  <td>76</td>
                  <td>72</td>
                  <td>69</td>
                  <td>74</td>
                </tr>
                <tr>
                  <td>Capital maintenance spend, Rivergate network</td>
                  <td>£6.2m</td>
                  <td>£5.8m</td>
                  <td>£5.4m</td>
                  <td>£5.1m</td>
                  <td>£7.5m planned</td>
                </tr>
                <tr>
                  <td>Dividend payment to shareholders</td>
                  <td>£18m</td>
                  <td>£19m</td>
                  <td>£17m</td>
                  <td>£18m</td>
                  <td>Not applicable</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.tableNote}>
              Panel note: The figures above show private company performance indicators. They do not, by themselves, show social cost or social benefit.
            </p>
          </div>
        </div>

        {/* ── SECTION 3 ───────────────────────────────────────────── */}
        <div className={styles.sectionBlock} id="section-3">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>Section 3</span>
            <span className={styles.sectionTitle}>Rivergate overflow and service data</span>
          </div>
          <p className={styles.docParagraph}>
            The Rivergate Estuary has four monitored storm overflows. The East Quay overflow is the largest
            and is closest to the public beach, marina, and shellfish beds.
          </p>

          <div className={styles.tableWrapper}>
            <span className={styles.tableLabel}>Table 2 — East Quay overflow operation and local service effects</span>
            <table className={styles.evidenceTable}>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Overflow events</th>
                  <th>Total duration</th>
                  <th>Beach closure days</th>
                  <th>Shellfish restriction days</th>
                  <th>Public complaints</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2021</td>
                  <td>14</td>
                  <td>96 hours</td>
                  <td>2</td>
                  <td>0</td>
                  <td>18</td>
                </tr>
                <tr>
                  <td>2022</td>
                  <td>18</td>
                  <td>124 hours</td>
                  <td>3</td>
                  <td>4</td>
                  <td>27</td>
                </tr>
                <tr>
                  <td>2023</td>
                  <td>46</td>
                  <td>392 hours</td>
                  <td>11</td>
                  <td>19</td>
                  <td>86</td>
                </tr>
                <tr>
                  <td>2024</td>
                  <td>49</td>
                  <td>407 hours</td>
                  <td>14</td>
                  <td>23</td>
                  <td>104</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.docParagraph}>
            The district council notes that rainfall was higher than average in 2023 and 2024. However, the
            council's environmental health team also reports that several overflow events occurred after
            moderate rainfall, not only after severe storms.
          </p>

          <div className={styles.calloutBox}>
            <span className={styles.calloutLabel}>Monitoring caution</span>
            <p className={styles.calloutText}>
              Event duration monitoring records when an overflow operates and for how long. It does not
              directly measure the volume of discharge, the precise pollutant load, or all ecological effects.
            </p>
          </div>
        </div>

        {/* ── SECTION 4 ───────────────────────────────────────────── */}
        <div className={styles.sectionBlock} id="section-4">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>Section 4</span>
            <span className={styles.sectionTitle}>Internal investment record</span>
          </div>

          <div className={styles.excerptBlock}>
            <span className={styles.excerptLabel}>Extract from internal engineering memo, North Wessex Water, March 2021</span>
            <div className={styles.excerptText}>
              <p>The East Quay pump station is operating close to practical capacity during peak rainfall. If storage is not expanded before the next regulatory period, modelled overflow frequency is likely to increase under moderate rainfall scenarios. The deferral option reduces near-term capital expenditure but increases operational and reputational risk. The engineering team recommends proceeding with the storage tunnel and pump replacement in the current period.</p>
            </div>
          </div>

          <button className={styles.evidenceTrigger} onClick={() => onOpenEvidence('engineering-memo')}>
            Full engineering memo →
          </button>

          <div className={styles.tableWrapper} style={{ marginTop: 20 }}>
            <span className={styles.tableLabel}>Table 3 — Upgrade timing options considered in 2021</span>
            <table className={styles.evidenceTable}>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Capital cost (2021 prices)</th>
                  <th>Expected effect</th>
                  <th>Bill impact</th>
                  <th>Risk noted</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Proceed 2021–22</td>
                  <td>£18m</td>
                  <td>Reduces overflow frequency by increasing storage and pump capacity</td>
                  <td>+£9/household/yr for 5 years</td>
                  <td>Construction disruption; immediate affordability concerns</td>
                </tr>
                <tr>
                  <td>Defer to 2025–26</td>
                  <td>£31m (estimated future cost)</td>
                  <td>Maintains current capacity until next period</td>
                  <td>No immediate increase</td>
                  <td>Higher overflow frequency; higher future cost; reputational risk</td>
                </tr>
                <tr>
                  <td>Minor maintenance only</td>
                  <td>£4m</td>
                  <td>Repairs screens and sensors; does not increase capacity</td>
                  <td>+£2/household/yr for 2 years</td>
                  <td>Does not address capacity constraint</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.excerptBlock} style={{ marginTop: 20 }}>
            <span className={styles.excerptLabel}>Extract from finance committee minutes, June 2021</span>
            <div className={styles.excerptText}>
              <p>The Board agreed that the Rivergate upgrade should be deferred. The immediate bill impact is difficult to justify when overflow exceedance remains uncertain and when the current price-control settlement rewards cost discipline. The decision will be reviewed if monitored events increase materially.</p>
            </div>
          </div>

          <button className={styles.evidenceTrigger} onClick={() => onOpenEvidence('committee-minutes')}>
            Full committee minutes →
          </button>
        </div>

        {/* ── SECTION 5 ───────────────────────────────────────────── */}
        <div className={styles.sectionBlock} id="section-5">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>Section 5</span>
            <span className={styles.sectionTitle}>Estimated external costs</span>
          </div>
          <p className={styles.docParagraph}>
            The district council commissioned an estimate of local external costs associated with repeated
            overflow events. The estimate is incomplete and conservative. It includes reported business
            losses and council expenditure but excludes unpriced ecological damage and non-reported
            household impacts.
          </p>

          <div className={styles.tableWrapper}>
            <span className={styles.tableLabel}>Table 4 — Estimated local external costs linked to overflow events</span>
            <table className={styles.evidenceTable}>
              <thead>
                <tr>
                  <th>External cost category</th>
                  <th>2022</th>
                  <th>2023</th>
                  <th>2024</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Shellfish harvesting restrictions</td>
                  <td>£0.2m</td>
                  <td>£1.4m</td>
                  <td>£1.7m</td>
                  <td>Lost harvest days and additional testing</td>
                </tr>
                <tr>
                  <td>Tourism and visitor spending loss</td>
                  <td>£0.4m</td>
                  <td>£1.2m</td>
                  <td>£1.3m</td>
                  <td>Beach closure and reputation effects</td>
                </tr>
                <tr>
                  <td>Council clean-up and public health monitoring</td>
                  <td>£0.3m</td>
                  <td>£0.6m</td>
                  <td>£0.7m</td>
                  <td>Signage, water testing, staff time</td>
                </tr>
                <tr>
                  <td>Reported illness-related costs</td>
                  <td>£0.1m</td>
                  <td>£0.2m</td>
                  <td>£0.2m</td>
                  <td>GP visits and lost work estimates</td>
                </tr>
                <tr>
                  <td>Ecological harm estimate</td>
                  <td>Not monetised</td>
                  <td>Not monetised</td>
                  <td>Not monetised</td>
                  <td>Habitat effects not included</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>Total monetised external costs</td>
                  <td>£1.0m</td>
                  <td>£3.4m</td>
                  <td>£3.9m</td>
                  <td>Conservative estimate</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className={styles.panelNote}>
            <span className={styles.panelNoteLabel}>Panel note</span>
            <p className={styles.panelNoteText}>
              The external cost estimate is not a precise measure of total social cost. It is an estimate
              of some costs borne outside the company's own accounts.
            </p>
          </div>
        </div>

        {/* ── SECTION 6 ───────────────────────────────────────────── */}
        <div className={styles.sectionBlock} id="section-6">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>Section 6</span>
            <span className={styles.sectionTitle}>Distribution of gains and losses</span>
          </div>
          <p className={styles.docParagraph}>
            North Wessex Water estimates that deferring the upgrade avoided an immediate average bill increase
            of <strong>£9 per household per year</strong> for five years. Rivergate has approximately{' '}
            <strong>132,000 household connections</strong>. The avoided bill increase therefore saved households
            about <strong>£1.19m per year</strong> in the short run.
          </p>
          <p className={styles.docParagraph}>
            However, the council's external cost estimate for 2024 alone is <strong>£3.9m</strong>, excluding
            ecological harm that has not been monetised.
          </p>

          <div className={styles.tableWrapper}>
            <span className={styles.tableLabel}>Table 5 — Short-run distributional evidence, 2024</span>
            <table className={styles.evidenceTable}>
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Apparent gain or loss from deferral</th>
                  <th>Evidence in case file</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Average household bill-payer</td>
                  <td>Gain of ~£9/year from avoided bill increase</td>
                  <td>Company bill estimate</td>
                </tr>
                <tr>
                  <td>Shellfish businesses</td>
                  <td>Loss from harvest restrictions and testing</td>
                  <td>23 restriction days; £1.7m estimated loss</td>
                </tr>
                <tr>
                  <td>Beach users and swimmers</td>
                  <td>Loss of access and possible health risk</td>
                  <td>14 beach closure days; illness reports</td>
                </tr>
                <tr>
                  <td>Local council</td>
                  <td>Higher monitoring and clean-up costs</td>
                  <td>£0.7m council cost estimate</td>
                </tr>
                <tr>
                  <td>North Wessex Water shareholders</td>
                  <td>Continued dividend payments</td>
                  <td>£18m dividend in 2024</td>
                </tr>
                <tr>
                  <td>Estuary ecosystem</td>
                  <td>Harm not fully monetised</td>
                  <td>Ecological harm noted but not priced</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.panelQuestion}>
            <span className={styles.panelQuestionLabel}>Panel question</span>
            <p className={styles.panelQuestionText}>
              If some groups gain while others lose, can the outcome be described as Pareto optimal simply
              because average household bills are lower?
            </p>
          </div>
        </div>

        {/* ── SECTION 7A ──────────────────────────────────────────── */}
        <div className={styles.sectionBlock} id="section-7a">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>Section 7A</span>
            <span className={styles.sectionTitle}>Expert account A — Company efficiency account</span>
          </div>

          <div className={styles.expertStatement}>
            <div className={styles.expertMeta}>
              <span className={styles.expertPosition}>Statement to the Rivergate Economic Review Panel</span>
              <div className={styles.expertName}>Jonas Reeve</div>
              <div className={styles.expertTitle}>Operations Director, North Wessex Water</div>
            </div>
            <div className={styles.expertQuote}>
              <p>
                The panel should avoid judging the 2021 decision with hindsight. At the time, the company
                faced real scarcity. Construction costs were rising, households were already under pressure,
                and several network risks across the region competed for funding. The Rivergate upgrade was
                not cancelled; it was phased into the next period.
              </p>
              <p>
                The company kept operating cost per connection below the regulatory allowance and held bills
                below the regional benchmark. That is evidence of disciplined resource use. It would not
                have been efficient to raise bills immediately for a project whose benefits depended on
                uncertain rainfall and demand forecasts.
              </p>
              <p>
                Since then, North Wessex Water has introduced better monitoring, targeted maintenance, and a
                planned smart-storage programme. These measures show that the company is pursuing long-run
                improvement rather than simply spending more for its own sake.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 7B ──────────────────────────────────────────── */}
        <div className={styles.sectionBlock} id="section-7b">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>Section 7B</span>
            <span className={styles.sectionTitle}>Expert account B — Social cost market failure account</span>
          </div>

          <div className={styles.expertStatement}>
            <div className={styles.expertMeta}>
              <span className={styles.expertPosition}>Statement to the Rivergate Economic Review Panel</span>
              <div className={styles.expertName}>Dr Lena Ortiz</div>
              <div className={styles.expertTitle}>Environmental Economist, Rivergate University</div>
            </div>
            <div className={styles.expertQuote}>
              <p>
                The company's argument uses a narrow definition of efficiency. Lower private operating costs
                do not prove that society's resources have been allocated efficiently. The evidence shows that
                costs avoided by the company were partly shifted onto shellfish producers, beach users, the
                council, and the estuary itself.
              </p>
              <p>
                This is a classic market failure problem. The firm is a regional monopoly, customers cannot
                choose a rival wastewater provider, and many environmental costs are not priced into the
                company's decision. The company also had internal engineering evidence that deferral increased
                risk, while the public could not observe the full risk at the time.
              </p>
              <p>
                The decision may have protected average bills in the short run, but it did not maximise social
                welfare. Nor does it show dynamic efficiency. Delaying capacity investment increased future
                costs and allowed service quality to deteriorate.
              </p>
            </div>
          </div>

          <button className={styles.evidenceTrigger} onClick={() => onOpenEvidence('expert-comparison')}>
            Expert account comparison →
          </button>
        </div>
      </div>
    </>
  )
}
