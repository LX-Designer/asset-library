import React, { useState } from 'react'
import LabShell from '../../lab-shell/LabShell.jsx'
import config from './shell.config.js'
import styles from './index.module.css'
import TemperatureProxyChart from './TemperatureProxyChart.jsx'
import GlobalTemperatureChart from './GlobalTemperatureChart.jsx'
import TemperatureCO2Chart from './TemperatureCO2Chart.jsx'
import EnergyBudgetDiagram from './EnergyBudgetDiagram.jsx'
import GHGComparisonTable from './GHGComparisonTable.jsx'
import CO2eCalculator from './CO2eCalculator.jsx'

// ---------------------------------------------------------------------------
// Static reference data
// ---------------------------------------------------------------------------

export const EVIDENCE_STARTER_CARDS = [
  {
    id: 'ec-01',
    type: 'Instrumental record',
    title: 'Global mean surface temperature (GMST) 1850–2024',
    observable: 'HadCRUT5 and NASA GISS datasets show a warming trend of approximately +1.1–1.2 °C above the pre-industrial (1850–1900) average by the 2011–2020 decade.',
    limitation: 'Pre-1950 coverage is sparse over oceans and southern hemisphere; different methodologies between datasets produce slightly different absolute values.',
    question: 'What does the rate of change in GMST tell us compared with natural variability in earlier centuries?',
  },
  {
    id: 'ec-02',
    type: 'Proxy record',
    title: 'Antarctic and Greenland ice core CO₂ record (800,000 years)',
    observable: 'Ice cores show CO₂ oscillated between ~180 ppm (glacial) and ~280 ppm (interglacial) over eight ice-age cycles. Post-1850 values (now ~427 ppm) lie far above this range.',
    limitation: 'Ice core records have lower time resolution for recent centuries; gas transport and diffusion in firn can smooth rapid changes.',
    question: 'How does the current CO₂ concentration compare with the range observed during previous warm periods?',
  },
  {
    id: 'ec-03',
    type: 'Satellite observation',
    title: 'Arctic sea-ice extent (NSIDC, 1979–2024)',
    observable: 'Satellite data show Arctic sea-ice extent in September (summer minimum) has declined at a rate of approximately −13% per decade relative to the 1981–2010 average.',
    limitation: 'Satellite record only begins in 1979; passive microwave sensors have known biases near the ice margin; some studies use different sea-ice concentration thresholds.',
    question: 'What proportion of the observed Arctic sea-ice decline could be explained by natural variability alone?',
  },
  {
    id: 'ec-04',
    type: 'Direct measurement',
    title: 'Atmospheric CO₂ — Keeling Curve (Mauna Loa, 1958–2025)',
    observable: 'Continuous measurements at Mauna Loa, Hawaii since 1958 show CO₂ rising from 316 ppm to 427 ppm (2025). The annual seasonal cycle is superimposed on a long-term upward trend.',
    limitation: 'A single site; Mauna Loa volcanic activity occasionally contaminates readings (flagged and removed). Now corroborated by ~130 global monitoring stations.',
    question: 'How does the rate of CO₂ increase at Mauna Loa compare with the historical rate reconstructed from ice cores?',
  },
  {
    id: 'ec-05',
    type: 'Glaciological measurement',
    title: 'Glacier mass balance (World Glacier Monitoring Service)',
    observable: 'Global glacier mass balance data from ~40 reference glaciers show near-continuous net mass loss since the 1970s. Cumulative loss 1970–2020 is approximately −28 m water equivalent.',
    limitation: 'Reference glaciers are not a random sample — they are skewed towards Northern Hemisphere; many remote glaciers have no direct measurement and rely on remote sensing estimates.',
    question: 'Which regions show the fastest glacier retreat, and what other factors besides temperature might contribute?',
  },
  {
    id: 'ec-06',
    type: 'Satellite altimetry',
    title: 'Global mean sea level (GMSL) 1993–2024',
    observable: 'TOPEX/Poseidon and follow-on satellite altimeters show GMSL rising at ~3.7 mm yr⁻¹ since 1993, an acceleration from the ~1.5 mm yr⁻¹ rate estimated from tide gauges for 1901–1990.',
    limitation: 'Satellite record is only ~30 years; regional sea-level change varies substantially from the global mean due to ocean circulation, land subsidence, and gravitational effects.',
    question: 'What fraction of sea-level rise is attributable to thermal expansion, and what fraction to melting ice?',
  },
  {
    id: 'ec-07',
    type: 'Ocean measurement',
    title: 'Ocean heat content (Argo float array, 2000–2024)',
    observable: 'Argo floats show the upper 2,000 m of the ocean has been warming consistently since 2000. The ocean has absorbed ~93% of the net energy gain in the Earth system since the 1970s.',
    limitation: 'Argo network only became near-global after 2006; deeper ocean (>2000 m) monitoring is still incomplete; historical ocean temperature data before Argo are sparse and biased.',
    question: 'How does the rate of ocean warming compare with atmospheric warming, and what does this tell us about the energy imbalance?',
  },
  {
    id: 'ec-08',
    type: 'Carbon isotope analysis',
    title: 'Atmospheric ¹³C/¹²C ratio and ¹⁴C content',
    observable: 'The ratio of ¹³C to ¹²C in atmospheric CO₂ has declined since industrialisation, consistent with fossil-fuel origin (isotopically light carbon). ¹⁴C content has also declined (fossil carbon contains no ¹⁴C).',
    limitation: 'Isotopic signatures require highly precise instrumentation; ocean outgassing and land-use change also affect isotopic ratios, requiring careful attribution.',
    question: 'How do isotopic signatures allow scientists to distinguish between CO₂ from fossil fuels and CO₂ from other sources?',
  },
  {
    id: 'ec-09',
    type: 'Radiative forcing data',
    title: 'IPCC AR6 forcing estimates (1750–2019)',
    observable: 'Total anthropogenic radiative forcing from 1750 to 2019 is estimated at +2.72 W/m² (likely range: 1.96–3.48 W/m²). CO₂ alone contributes approximately +2.16 W/m².',
    limitation: 'Aerosol forcing carries the largest uncertainty in the total; indirect effects (cloud seeding) are especially poorly constrained.',
    question: 'How does the magnitude of anthropogenic forcing compare with estimated natural forcings (solar and volcanic) over the same period?',
  },
  {
    id: 'ec-10',
    type: 'Paleoclimate record',
    title: 'Holocene temperature reconstruction (last 12,000 years)',
    observable: 'Multiple pollen, lake sediment, and speleothem records suggest Holocene temperatures were relatively stable (within ~0.5 °C) for thousands of years before the industrial era.',
    limitation: 'Seasonal and regional biases in different proxy types make global synthesis challenging; the "Holocene Thermal Maximum" debate shows uncertainty in absolute temperatures.',
    question: 'How does the rate of 20th/21st century warming compare with natural temperature changes across the Holocene?',
  },
  {
    id: 'ec-11',
    type: 'Atmospheric measurement',
    title: 'Methane and nitrous oxide concentration trends',
    observable: 'Atmospheric CH₄ has more than doubled since pre-industrial times (from ~720 ppb to ~1,936 ppb in 2025). N₂O has risen from ~270 ppb to ~339 ppb. Both are at their highest concentrations in at least 800,000 years.',
    limitation: 'Attributing observed increases to specific source sectors (agriculture, wetlands, fossil fuels) remains uncertain; natural wetland emissions vary with temperature, creating feedback complications.',
    question: 'How do the warming contributions of CH₄ and N₂O compare with CO₂ despite their much lower atmospheric concentrations?',
  },
  {
    id: 'ec-12',
    type: 'Climate model output',
    title: 'CMIP6 detection and attribution experiments',
    observable: 'When CMIP6 models are run with natural forcings only, they cannot reproduce observed 20th–21st century warming. When anthropogenic forcings are added, model ensembles closely track observations.',
    limitation: 'Models simplify physical processes; ensemble spread reflects model structural uncertainty; internal variability can mask or amplify forcing signals on decadal timescales.',
    question: 'What does the failure of natural-forcing-only model runs to match observations tell us about the role of human activity?',
  },
  {
    id: 'ec-13',
    type: 'Permafrost monitoring',
    title: 'Arctic permafrost temperature and extent (1980–2024)',
    observable: 'Ground temperatures in Arctic permafrost have increased by 0.3–1.0 °C per decade in recent decades. Active layer thickening and thermokarst lake formation are observable across Siberia and northern Canada.',
    limitation: 'Monitoring networks are sparse in remote Arctic regions; ground heterogeneity makes extrapolation difficult; feedback dynamics with carbon release are not fully quantified.',
    question: 'Why might permafrost thaw constitute a positive feedback on global warming, and how significant is the carbon stored in permafrost?',
  },
]

export const EVIDENCE_CHRONOLOGY = [
  { year: 1824, event: 'Fourier proposes the atmosphere acts like a "hot box", retaining heat near Earth\'s surface — an early description of the greenhouse effect.' },
  { year: 1859, event: 'Tyndall demonstrates experimentally that CO₂ and water vapour absorb infrared radiation; CO₂-free air is transparent to heat.' },
  { year: 1896, event: 'Arrhenius calculates that doubling atmospheric CO₂ would warm the Earth by approximately 5–6 °C — the first quantitative climate sensitivity estimate.' },
  { year: 1938, event: 'Callendar compiles the first global temperature dataset and argues that fossil-fuel CO₂ is already warming the planet.' },
  { year: 1958, event: 'Keeling begins continuous CO₂ measurements at Mauna Loa Observatory (Hawaii); the "Keeling Curve" becomes the most famous graph in climate science.' },
  { year: 1979, event: 'First World Climate Conference (WMO, Geneva) concludes that human activity is likely changing the climate. Calls for international monitoring and research.' },
  { year: 1988, event: 'IPCC established by WMO and UNEP. NASA scientist James Hansen testifies to the US Senate that anthropogenic warming is detected with high confidence.' },
  { year: 1995, event: 'IPCC Second Assessment Report states "the balance of evidence suggests a discernible human influence on global climate" — first formal detection and attribution statement.' },
  { year: 2015, event: 'Paris Agreement adopted by 196 parties: goal to limit global warming to well below 2 °C above pre-industrial levels, pursuing efforts to limit to 1.5 °C.' },
  { year: 2021, event: 'IPCC Sixth Assessment Report (AR6 WGI): "It is unequivocal that human influence has warmed the atmosphere, ocean and land." Global surface temperature in 2011–2020 was 1.09 °C above 1850–1900.' },
]

export const EVIDENCE_WEIGHTING = [
  {
    id: 'ew-A',
    label: 'A',
    title: 'IPCC AR6 WGI detection & attribution synthesis',
    type: 'Scientific synthesis',
    summary: 'The IPCC AR6 Working Group I report synthesises thousands of peer-reviewed studies. It states it is "unequivocal" that human influence has warmed the climate system. Each finding is assigned a likelihood level based on evidence quality and expert judgment.',
    keyStrength: 'Comprehensive; peer-reviewed; expert consensus; explicitly quantified uncertainty',
    keyWeakness: 'Summary documents may simplify nuance; process dependent on author selection',
  },
  {
    id: 'ew-B',
    label: 'B',
    title: 'Fossil carbon isotope fingerprinting (δ¹³C and Δ¹⁴C)',
    type: 'Isotopic evidence',
    summary: 'The observed decline in ¹³C/¹²C ratio and ¹⁴C content of atmospheric CO₂ is a direct chemical fingerprint. Fossil fuels are depleted in both isotopes; their combustion dilutes these isotopes in the atmosphere.',
    keyStrength: 'Direct mechanistic evidence linking fossil fuels to atmospheric CO₂ increase; independent of temperature records',
    keyWeakness: 'Isotopic mixing from ocean and biosphere also affects ratios; requires careful modelling to isolate fossil signal',
  },
  {
    id: 'ew-C',
    label: 'C',
    title: 'Climate model detection-attribution experiments (CMIP6)',
    type: 'Climate modelling',
    summary: 'CMIP6 experiments run models with natural forcings only vs. natural + anthropogenic forcings. Only the combined-forcing runs reproduce the observed 20th–21st century warming pattern.',
    keyStrength: 'Directly tests hypotheses about cause; physically based; global scope',
    keyWeakness: 'Models have known biases; ensemble spread reflects structural uncertainty; internal variability can mask or amplify signals on decadal timescales',
  },
  {
    id: 'ew-D',
    label: 'D',
    title: 'Multi-dataset temperature record agreement (HadCRUT5, NASA GISS, NOAA, Berkeley Earth)',
    type: 'Instrumental record',
    summary: 'Four independent global surface temperature datasets, produced by different institutions using different methodologies, show closely agreeing warming trends over 1850–2024.',
    keyStrength: 'Independent replication; globally distributed measurements; long temporal coverage',
    keyWeakness: 'All share some station-data overlap; urban heat island and coverage biases require correction; pre-1950 data sparser',
  },
  {
    id: 'ew-E',
    label: 'E',
    title: 'Ocean heat content and global energy imbalance (Argo)',
    type: 'Ocean measurement',
    summary: 'The ocean has absorbed ~93% of the net energy gain in the Earth system since the 1970s. A positive energy imbalance (more energy in than out) is the thermodynamic signature of greenhouse-forced warming.',
    keyStrength: 'Ocean heat uptake is the most direct measure of planetary energy imbalance; less affected by ENSO or regional variability',
    keyWeakness: 'Pre-Argo (before ~2006) ocean data are sparse and inhomogeneous; deeper ocean monitoring still incomplete',
  },
  {
    id: 'ew-F',
    label: 'F',
    title: 'Stratospheric cooling alongside tropospheric warming',
    type: 'Atmospheric pattern',
    summary: 'As greenhouse gases trap more infrared in the lower atmosphere, the stratosphere (above ~12 km) should cool — this is a distinct fingerprint of GHG forcing not expected from solar or volcanic causes alone. Satellite and radiosonde data confirm stratospheric cooling since ~1979.',
    keyStrength: 'Pattern uniquely distinguishes GHG forcing from solar forcing; corroborated by multiple sensor types',
    keyWeakness: 'Ozone depletion also cools the stratosphere; separating GHG and ozone contributions requires careful attribution',
  },
  {
    id: 'ew-G',
    label: 'G',
    title: 'Solar irradiance satellite record (1978–2025)',
    type: 'Natural forcing data',
    summary: 'Total Solar Irradiance (TSI) measured by satellites since 1978 shows no statistically significant upward trend. Solar cycle 24 (2008–2019) was one of the weakest on record, yet 2014–2023 was the warmest decade in the instrument record.',
    keyStrength: 'Direct satellite measurement of solar output; independent of ground-based records',
    keyWeakness: 'Record only spans ~46 years; longer-term solar reconstructions (from cosmogenic isotopes) carry larger uncertainties',
  },
  {
    id: 'ew-H',
    label: 'H',
    title: 'Diverging regional warming patterns (polar amplification)',
    type: 'Spatial pattern',
    summary: 'The Arctic is warming approximately 2–4 times faster than the global average (Arctic amplification). This pattern is consistent with GHG forcing and ice-albedo feedback predictions; it is not expected from uniform solar brightening.',
    keyStrength: 'Spatial fingerprint of warming; consistent across multiple datasets; physical mechanism well understood',
    keyWeakness: 'Some amplification may reflect internal variability (e.g., ocean heat transport); short observational record in remote Arctic',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export function EvidenceStarterCard({ card }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.evidenceStarterCard}>
      <button
        className={styles.cardHeader}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <div className={styles.cardHeaderText}>
          <span className={styles.cardType}>{card.type}</span>
          <h4 className={styles.cardTitle}>{card.title}</h4>
        </div>
        <span className={`${styles.cardChevron}${open ? ` ${styles.cardChevronOpen}` : ''}`}>▼</span>
      </button>
      {open && (
        <div className={styles.cardBody}>
          <div className={styles.cardField}>
            <span className={styles.cardFieldLabel}>Observable</span>
            <p>{card.observable}</p>
          </div>
          <div className={styles.cardField}>
            <span className={styles.cardFieldLabel}>Limitation</span>
            <p>{card.limitation}</p>
          </div>
          <div className={styles.cardField}>
            <span className={styles.cardFieldLabel}>Guiding question</span>
            <p><em>{card.question}</em></p>
          </div>
        </div>
      )}
    </div>
  )
}

export function WeightingCard({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.weightingCard}>
      <button
        className={styles.weightingHeader}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className={styles.weightingBadge}>{item.label}</span>
        <div className={styles.weightingHeaderText}>
          <span className={styles.cardType}>{item.type}</span>
          <p className={styles.weightingTitle}>{item.title}</p>
        </div>
        <span className={`${styles.cardChevron}${open ? ` ${styles.cardChevronOpen}` : ''}`}>▼</span>
      </button>
      {open && (
        <div className={styles.weightingBody}>
          <p className={styles.weightingSummary}>{item.summary}</p>
          <div className={styles.weightingStrength}>
            <span className={styles.cardFieldLabel}>Key strength</span>
            <p>{item.keyStrength}</p>
          </div>
          <div className={styles.weightingWeakness}>
            <span className={styles.cardFieldLabel}>Key weakness</span>
            <p>{item.keyWeakness}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main lab component
// ---------------------------------------------------------------------------

export default function GlobalWarmingLab({ onResponse, onComplete, savedResponses, isCompleted, onReset, backHref }) {
  return (
    <LabShell
      config={config}
      onResponse={onResponse}
      onComplete={onComplete}
      savedResponses={savedResponses}
      isCompleted={isCompleted}
      onReset={onReset}
      backHref={backHref}
      className={styles.lab}
    >
      {({ openActivity }) => (
        <>
          {/* ================================================================
              SECTION: Introduction
          ================================================================ */}
          <section id="s-intro" className={styles.section}>
            <div className={styles.labHero}>
              <p className={styles.eyebrow}>Cambridge AS Level Geography · 2.3.1 &amp; 2.3.2</p>
              <h1 className={styles.labTitle}>Global Warming and Climate Change</h1>
              <p className={styles.labSubtitle}>
                A seven-stage guided inquiry into the evidence, mechanisms, and significance of recent global warming
              </p>
              <div className={styles.inquiryQuestion}>
                <span className={styles.iqLabel}>Inquiry question</span>
                <p className={styles.iqText}>
                  How convincing is the scientific evidence that recent global warming is primarily caused by human activity?
                </p>
              </div>
            </div>

            <div className={styles.labIntro}>
              <p>
                Global mean surface temperature has risen by approximately 1.1–1.2 °C above the pre-industrial average. Understanding <em>whether</em> this warming is unusual, <em>what</em> is causing it, and <em>how confident</em> we can be in that explanation requires examining multiple independent lines of evidence and thinking carefully about their quality.
              </p>
              <p>
                This lab guides you through the same reasoning process used by climate scientists. You will evaluate proxy and instrumental records, weigh competing causal hypotheses, analyse the greenhouse mechanism, and ultimately construct a structured argument in response to the inquiry question.
              </p>
            </div>

            <h2 className={styles.sectionTitle}>Lab overview</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Activity</th>
                    <th>Thinking move</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1', 'Noticing and questioning the temperature record', 'Observe → question'],
                    ['2', 'Evaluating proxy evidence', 'Evaluate sources'],
                    ['3', 'Triangulating multiple evidence lines', 'Synthesise evidence'],
                    ['4', 'Causal mechanisms — what is driving the warming?', 'Reason causally'],
                    ['5', 'The greenhouse mechanism and forcing agents', 'Analyse mechanisms'],
                    ['6', 'Weighing the evidence — how convinced should we be?', 'Evaluate and judge'],
                    ['7', 'Constructing a structured argument', 'Write → reflect'],
                  ].map(([n, a, t]) => (
                    <tr key={n}>
                      <td><strong>{n}</strong></td>
                      <td>{a}</td>
                      <td>{t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className={styles.sectionTitle}>Evidence starter cards</h2>
            <p>Thirteen evidence types are available throughout this lab. Each card describes what is observable, what limitations affect confidence, and a guiding question for inquiry.</p>
            <div className={styles.evidenceCardGrid}>
              {EVIDENCE_STARTER_CARDS.slice(0, 4).map(c => <EvidenceStarterCard key={c.id} card={c} />)}
            </div>
            <div className={styles.scaffoldNote}>
              All 13 evidence cards are available in the Reference section. You will work with specific cards in Activities 3 and 6.
            </div>
          </section>

          {/* ================================================================
              SECTION: Activity 1 — Noticing and questioning
          ================================================================ */}
          <section id="s-act1" className={styles.section}>
            <h2 className={styles.sectionTitle}>Stage 1 — Noticing and questioning the temperature record</h2>
            <p className={styles.subheading}>Thinking move: observe → question</p>

            <div className={styles.background}>
              <h3>Background: What does the temperature record tell us?</h3>
              <p>
                The global mean surface temperature (GMST) record combines measurements from thousands of land stations and ocean buoys. Four independent research groups (NASA GISS, NOAA, Hadley Centre/CRU, Berkeley Earth) each produce their own dataset using different methodologies — yet their long-term trends closely agree.
              </p>
              <p>
                The record shows warming of approximately +1.1–1.2 °C above the pre-industrial (1850–1900) average by the 2011–2020 decade. The rate of warming has increased: the past decade (2015–2024) contains nine of the ten hottest years since records began.
              </p>
              <p>
                Importantly, the temperature record is not a smooth upward line. It shows year-to-year variability superimposed on a longer trend. Individual years can be warmer or cooler than their neighbours due to factors such as El Niño events and volcanic eruptions — yet the underlying trend is upward.
              </p>
            </div>

            <TemperatureProxyChart />

            <div className={styles.contentBlock}>
              <p>The chart above shows two complementary records:</p>
              <ul>
                <li><strong>Proxy reconstruction</strong> (grey dashed line, shaded uncertainty band): Temperature reconstructed from tree rings, ice cores, corals, and lake sediments (PAGES 2k Consortium, 2019). Covers the last 2,000 years.</li>
                <li><strong>Instrumental record</strong> (dark blue solid line): HadCRUT5 global mean surface temperature anomaly relative to the 1961–1990 average.</li>
              </ul>
              <p>The two records overlap from 1850, allowing their consistency to be assessed. The uncertainty band on the proxy record reflects the range of possible reconstructions.</p>
            </div>

            <div className={styles.activityCta}>
              <p><strong>Activity 1</strong> — Record what you notice and wonder about the temperature record, and reflect on what this evidence alone can and cannot tell us.</p>
              <button onClick={() => openActivity('act-1')}>Open Activity 1</button>
            </div>
          </section>

          {/* ================================================================
              SECTION: Activity 2 — Evaluating proxy evidence
          ================================================================ */}
          <section id="s-act2" className={styles.section}>
            <h2 className={styles.sectionTitle}>Stage 2 — Evaluating proxy evidence</h2>
            <p className={styles.subheading}>Thinking move: evaluate sources</p>

            <div className={styles.background}>
              <h3>Background: How do we know about past climates?</h3>
              <p>
                Instrumental temperature records only extend back to approximately 1850, and global coverage only improves substantially after 1950. To understand whether recent warming is unusual in a longer-term context, scientists use <strong>proxy records</strong> — natural archives that preserve indirect signals of past climate.
              </p>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Proxy type</th>
                      <th>How it records climate</th>
                      <th>Typical time resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Tree rings (dendrochronology)', 'Ring width and density reflect growing-season temperature and precipitation', 'Annual'],
                      ['Ice cores (Antarctic, Greenland)', 'Trapped air bubbles preserve atmospheric CO₂; oxygen isotope ratios record temperature', 'Annual to decadal'],
                      ['Ocean sediment cores', 'Foraminifera shell chemistry reflects ocean temperature and pH at time of formation', 'Centennial to millennial'],
                      ['Coral skeletons', 'Strontium/calcium ratios and growth bands reflect sea-surface temperature', 'Seasonal to annual'],
                      ['Speleothems (stalagmites)', 'Oxygen isotope ratios in cave deposits record rainfall amount and temperature', 'Annual to decadal'],
                      ['Pollen records', 'Changes in plant species composition reflect temperature and moisture zones', 'Decadal to centennial'],
                    ].map(([type, how, res]) => (
                      <tr key={type}>
                        <td><strong>{type}</strong></td>
                        <td>{how}</td>
                        <td>{res}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.aggiNote}>
                <strong>Key point for source evaluation:</strong> Each proxy type has different strengths and limitations. A strong climate reconstruction uses multiple independent proxies from different geographic regions that converge on the same signal.
              </div>
            </div>

            <div className={styles.activityCta}>
              <p><strong>Activity 2</strong> — Evaluate three proxy types, then assess a specific source using a structured evaluation framework.</p>
              <button onClick={() => openActivity('act-2')}>Open Activity 2</button>
            </div>
          </section>

          {/* ================================================================
              SECTION: Activity 3 — Triangulating evidence
          ================================================================ */}
          <section id="s-act3" className={styles.section}>
            <h2 className={styles.sectionTitle}>Stage 3 — Triangulating multiple evidence lines</h2>
            <p className={styles.subheading}>Thinking move: synthesise evidence</p>

            <div className={styles.background}>
              <h3>Background: Beyond temperature — what else is changing?</h3>
              <p>
                Temperature records alone might be questioned on methodological grounds. The power of the case for global warming comes from multiple <em>independent</em> evidence types, all showing consistent changes in the expected direction.
              </p>
              <p>
                Evidence triangulation asks: if the hypothesis is correct, what should we observe across different systems? When the expected signatures appear independently in Arctic sea ice, glacier mass balance, sea level, ocean heat content, CO₂ concentration, and global temperature, the convergence substantially increases confidence.
              </p>
            </div>

            <div className={styles.contentBlock}>
              <h3>Six lines of evidence</h3>
              <div className={styles.evidenceCardGrid}>
                {[
                  EVIDENCE_STARTER_CARDS.find(c => c.id === 'ec-03'),
                  EVIDENCE_STARTER_CARDS.find(c => c.id === 'ec-05'),
                  EVIDENCE_STARTER_CARDS.find(c => c.id === 'ec-06'),
                  EVIDENCE_STARTER_CARDS.find(c => c.id === 'ec-07'),
                  EVIDENCE_STARTER_CARDS.find(c => c.id === 'ec-04'),
                  EVIDENCE_STARTER_CARDS.find(c => c.id === 'ec-01'),
                ].map(c => c && <EvidenceStarterCard key={c.id} card={c} />)}
              </div>
            </div>

            <div className={styles.activityCta}>
              <p><strong>Activity 3</strong> — Sort these six evidence types by their relationship to the hypothesis, then complete a triangulation matrix and write a summary judgement.</p>
              <button onClick={() => openActivity('act-3')}>Open Activity 3</button>
            </div>
          </section>

          {/* ================================================================
              SECTION: Activity 4 — Causal mechanisms
          ================================================================ */}
          <section id="s-act4" className={styles.section}>
            <h2 className={styles.sectionTitle}>Stage 4 — Causal mechanisms</h2>
            <p className={styles.subheading}>Thinking move: reason causally</p>

            <div className={styles.background}>
              <h3>Background: What could be causing the warming?</h3>
              <p>
                Establishing that warming has occurred is not the same as establishing its cause. A rigorous scientific approach considers all plausible hypotheses and tests each against the observed pattern of change. The evidence must be able to distinguish between competing explanations.
              </p>
              <p>
                Five candidate causes are commonly examined in attribution science:
              </p>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Candidate cause</th>
                      <th>What pattern would we expect?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Solar output increase (TSI)', 'Warming at all atmospheric levels including the stratosphere; warming correlated with solar cycle'],
                      ['Greenhouse gas increase (anthropogenic)', 'Stratospheric cooling + tropospheric warming; polar amplification; warming not correlated with solar cycle'],
                      ['Volcanic activity', 'Short-term cooling (1–3 years) after major eruptions; no long-term warming trend'],
                      ['Internal variability (e.g., ENSO, PDO)', 'Decade-scale fluctuations around a stable mean; no persistent multi-decadal trend'],
                      ['Changes in land use / urban heat islands (UHI)', 'Warming concentrated in urbanising areas; rural sites show less warming'],
                    ].map(([cause, pattern]) => (
                      <tr key={cause}>
                        <td><strong>{cause}</strong></td>
                        <td>{pattern}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.aggiNote}>
                In Activity 4 you will examine each candidate cause against the observed evidence pattern. The goal is not to find one cause in isolation, but to assess which hypotheses are consistent with the full evidence set.
              </div>
            </div>

            <div className={styles.activityCta}>
              <p><strong>Activity 4</strong> — Complete a pattern-matching table for each candidate cause, then rank them by explanatory power.</p>
              <button onClick={() => openActivity('act-4')}>Open Activity 4</button>
            </div>
          </section>

          {/* ================================================================
              SECTION: Activity 5 — Greenhouse mechanism
          ================================================================ */}
          <section id="s-act5" className={styles.section}>
            <h2 className={styles.sectionTitle}>Stage 5 — The greenhouse mechanism and forcing agents</h2>
            <p className={styles.subheading}>Thinking move: analyse mechanisms</p>

            <div className={styles.background}>
              <h3>Background: The global energy budget</h3>
              <p>
                The Earth maintains a temperature balance between incoming solar radiation and outgoing infrared (longwave) radiation. Greenhouse gases disrupt this balance by absorbing outgoing infrared and re-emitting it, including back towards the surface — an effect known as radiative forcing.
              </p>
              <p>
                Study the energy budget diagram below. Six key processes ([1]–[6]) are marked. Your task in Activity 5 is to identify and explain each one.
              </p>
            </div>

            <EnergyBudgetDiagram />

            <h3 className={styles.subheading}>Key greenhouse gases</h3>
            <p>
              Not all greenhouse gases are equal in their warming effect. The table below compares six gases by concentration, GWP-100, and atmospheric lifetime. Use the sort buttons to explore different perspectives.
            </p>

            <GHGComparisonTable />

            <h3 className={styles.subheading}>CO₂ equivalent calculator</h3>
            <p>
              The CO₂ equivalent (CO₂e) concept allows different greenhouse gases to be compared on a common warming scale. Use the calculator to explore the CO₂e of different gases — including the example used in the activity (SF₆).
            </p>

            <CO2eCalculator />

            <div className={styles.activityCta}>
              <p><strong>Activity 5</strong> — Label the six energy budget processes, then answer questions about greenhouse gas forcing and CO₂ equivalent calculations.</p>
              <button onClick={() => openActivity('act-5')}>Open Activity 5</button>
            </div>
          </section>

          {/* ================================================================
              SECTION: Activity 6 — Weighing the evidence
          ================================================================ */}
          <section id="s-act6" className={styles.section}>
            <h2 className={styles.sectionTitle}>Stage 6 — Weighing the evidence</h2>
            <p className={styles.subheading}>Thinking move: evaluate and judge</p>

            <div className={styles.background}>
              <h3>Background: How do scientists assess the weight of evidence?</h3>
              <p>
                Evaluating the strength of a scientific case requires more than counting evidence items. It requires assessing the <em>quality</em>, <em>independence</em>, and <em>convergence</em> of the evidence, as well as considering counter-evidence and alternative explanations.
              </p>
              <p>
                The IPCC uses a formal system for expressing confidence: a calibrated combination of evidence quality (robust/medium/limited) and agreement among lines of evidence (high/medium/low). This produces confidence levels from "very low" to "very high."
              </p>
              <p>
                Below is the global temperature record alongside CO₂ concentration for the instrument era. Use the toggle buttons to add overlays for volcanic events, ENSO phases, and the solar output note — factors that have been proposed as alternative or contributing explanations.
              </p>
            </div>

            <GlobalTemperatureChart />

            <TemperatureCO2Chart />

            <div className={styles.contentBlock}>
              <h3>Eight evidence tiles for evaluation</h3>
              <p>In Activity 6, you will evaluate eight evidence tiles (A–H) by drag-and-drop weighing and an evaluation table. Background information on each tile is given below.</p>
              <div className={styles.evidenceCardGrid}>
                {EVIDENCE_WEIGHTING.map(item => <WeightingCard key={item.id} item={item} />)}
              </div>
            </div>

            <div className={styles.activityCta}>
              <p><strong>Activity 6</strong> — Sort the eight evidence tiles by strength, complete an evaluation table, and write a comparative judgement.</p>
              <button onClick={() => openActivity('act-6')}>Open Activity 6</button>
            </div>
          </section>

          {/* ================================================================
              SECTION: Activity 7 — Constructing the argument
          ================================================================ */}
          <section id="s-act7" className={styles.section}>
            <h2 className={styles.sectionTitle}>Stage 7 — Constructing a structured argument</h2>
            <p className={styles.subheading}>Thinking move: write → reflect</p>

            <div className={styles.background}>
              <h3>Background: What makes a strong scientific argument?</h3>
              <p>
                A well-constructed argument in response to the inquiry question has four components: a clear <strong>claim</strong> that directly answers the question, <strong>evidence</strong> that supports the claim, <strong>reasoning</strong> that links the evidence to the claim, and acknowledgement of <strong>counter-evidence or limitations</strong> that qualifies the conclusion.
              </p>
              <p>
                Cambridge AS Geography mark schemes reward responses that are precise (use data and named evidence), balanced (acknowledge limitations and uncertainty), and well-structured. A response of 350–500 words is appropriate for this type of inquiry question.
              </p>
              <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Argument section</th>
                      <th>Purpose</th>
                      <th>Target length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Claim', 'State your overall conclusion directly, with a confidence qualifier', '1–2 sentences'],
                      ['Evidence', 'Cite 2–4 specific evidence items with data', '80–100 words'],
                      ['Reasoning', 'Explain how and why the evidence supports your claim', '100–120 words'],
                      ['Counter-evidence / limitation', 'Identify the strongest counter-argument and address it', '60–80 words'],
                      ['Conclusion', 'Restate your claim in light of the whole argument; add a qualifying statement', '30–50 words'],
                    ].map(([section, purpose, length]) => (
                      <tr key={section}>
                        <td><strong>{section}</strong></td>
                        <td>{purpose}</td>
                        <td>{length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.activityCta}>
              <p><strong>Activity 7</strong> — Select your best evidence, write a structured argument using the writing frame, and complete the self-check before submitting.</p>
              <button onClick={() => openActivity('act-7')}>Open Activity 7</button>
            </div>
          </section>

          {/* ================================================================
              SECTION: Reference
          ================================================================ */}
          <section id="s-reference" className={styles.section}>
            <h2 className={styles.sectionTitle}>Reference</h2>

            {/* All 13 evidence cards */}
            <h3 className={styles.subheading}>All evidence cards</h3>
            <div className={styles.evidenceCardGrid}>
              {EVIDENCE_STARTER_CARDS.map(c => <EvidenceStarterCard key={c.id} card={c} />)}
            </div>

            {/* Evidence chronology */}
            <h3 className={styles.subheading}>Evidence chronology</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr><th>Year</th><th>Development</th></tr>
                </thead>
                <tbody>
                  {EVIDENCE_CHRONOLOGY.map(e => (
                    <tr key={e.year}>
                      <td><strong>{e.year}</strong></td>
                      <td>{e.event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>
        </>
      )}
    </LabShell>
  )
}
