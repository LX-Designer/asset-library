import LabShell from '../../lab-shell/LabShell.jsx'
import { GWCtx } from './GWContext.js'
import config from './shell.config.js'
import styles from './index.module.css'
import s from './GlobalWarming.module.css'
import {
  EVIDENCE_CARDS,
  CHRONOLOGY,
  GHG_TABLE,
  GLOSSARY,
  COMPARISON_CRITERIA,
} from './data.js'

// ── Evidence reference list (replaces inline card grids) ─────────────────────
function EvidenceRefs({ cards, onOpen }) {
  if (!cards.length) return null
  return (
    <div className={s.ecRefs}>
      <div className={s.ecRefsLabel}>Evidence in this section</div>
      {cards.map(card => (
        <button key={card.id} className={s.ecRef} onClick={() => onOpen(card.id)}>
          <span className={s.ecRefId}>{card.id.toUpperCase()}</span>
          <span className={s.ecRefTitle}>{card.title}</span>
          <span className={s.ecRefArrow}>→</span>
        </button>
      ))}
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ id, label, title, intro, children }) {
  return (
    <section id={id} className={s.section} aria-labelledby={`${id}-title`}>
      {label && <div className={s.sectionLabel}>{label}</div>}
      <h2 id={`${id}-title`} className={s.sectionTitle}>{title}</h2>
      {intro && <p className={s.sectionIntro}>{intro}</p>}
      <div className={s.sectionBody}>
        {children}
      </div>
    </section>
  )
}

// ── Callout box ───────────────────────────────────────────────────────────────
function Callout({ children, type = 'info' }) {
  return (
    <div className={`${s.callout}${type === 'warn' ? ` ${s.calloutWarn}` : ''}`}>
      {type === 'warn' && <div className={s.calloutWarnLabel}>⚠ Caution</div>}
      {children}
    </div>
  )
}

// ── Inline GHG table (content version) ───────────────────────────────────────
function GHGTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={s.ghgTable}>
        <thead>
          <tr>
            <th>Gas</th>
            <th>Pre-industrial</th>
            <th>Current</th>
            <th>Atm. lifetime</th>
            <th>GWP₁₀₀</th>
            <th>Main sources</th>
          </tr>
        </thead>
        <tbody>
          {GHG_TABLE.map(row => (
            <tr key={row.gas}>
              <td className={s.ghgGas}>{row.gas}</td>
              <td>{row.preIndustrial}</td>
              <td><strong>{row.current}</strong></td>
              <td>{row.lifetime}</td>
              <td className={s.ghgGwp}>{row.gwp100}</td>
              <td>{row.sources}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Lab content ───────────────────────────────────────────────────────────────
function LabContent({ responses, openEvidenceCard }) {
  const proxyCards        = EVIDENCE_CARDS.filter(c => c.section === 's-proxy')
  const instrumentalCards = EVIDENCE_CARDS.filter(c => c.section === 's-instrumental')
  const greenhouseCards   = EVIDENCE_CARDS.filter(c => c.section === 's-greenhouse')
  const naturalCards      = EVIDENCE_CARDS.filter(c => c.section === 's-natural')
  const anthropoCards     = EVIDENCE_CARDS.filter(c => c.section === 's-anthropogenic')
  const comparisonCards   = EVIDENCE_CARDS.filter(c => c.section === 's-comparison')

  return (
    <GWCtx.Provider value={{ responses }}>

      {/* ── Hero ── */}
      <section className={s.hero} aria-labelledby="lab-title">
        <div className={s.heroEyebrow}>Cambridge AS &amp; A Level Geography · Topic 2.3</div>
        <h1 id="lab-title" className={s.heroTitle}>Global Warming Lab</h1>
        <p className={s.heroQuestion}>
          How much of the warming we can measure is natural — and how much have humans caused? And how can we tell the difference?
        </p>

        <div className={s.heroCols}>
          <div className={s.callout}>
            <strong>The attribution problem:</strong> Detecting that the climate is warming is not the same as explaining why. Temperatures have fluctuated naturally throughout Earth's history — driven by orbital cycles, solar variability, volcanic activity, and more. The scientific and intellectual challenge is not simply to describe the warming trend but to identify its cause. This lab builds the evidence and reasoning needed to make that attribution argument with confidence.
          </div>

          <div className={s.heroScenario}>
            <div className={s.heroScenarioLabel}>Your role</div>
            You are a geographer tasked with producing an evidence-based attribution report for a public briefing. Your job is to assess the evidence, test the natural-cause hypothesis against the anthropogenic hypothesis, and produce a justified conclusion about the dominant cause of post-1950 global warming. You are not being asked for the "official" answer — you are being asked to construct an argument that the evidence supports.
          </div>
        </div>

        <div className={s.heroMeta}>
          <span className={s.heroMetaItem}><strong>Discipline:</strong> Geography (physical)</span>
          <span className={s.heroMetaItem}><strong>Estimated time:</strong> 75–90 minutes</span>
          <span className={s.heroMetaItem}><strong>Activities:</strong> 5 stages + synthesis + reflection</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          S1 — THE ANOMALY
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-anomaly"
        label="Evidence section 1"
        title="The temperature record — the anomaly dataset"
        intro="The global temperature record is the starting point for the attribution question. Before examining it, it helps to understand what the dataset is and how it is constructed."
      >
        <p>
          The temperature record used most commonly as the starting point for the attribution question is the HadCRUT5 dataset, produced jointly by the UK Met Office Hadley Centre and the Climatic Research Unit at the University of East Anglia. It combines land surface air temperature measurements from a network of weather stations with sea surface temperature measurements from ships and buoys, extending back to 1850.
        </p>
        <p>
          Temperature is expressed as an <strong>anomaly</strong> — not the absolute temperature, but the departure from a baseline average. The baseline used is 1850–1900, representing the pre-industrial period before significant fossil fuel combustion. A positive anomaly means warmer than the baseline average; a negative anomaly means cooler. This approach is used because comparing absolute temperatures across thousands of measurement stations is difficult; comparing how much each station has warmed or cooled relative to its own average is more robust.
        </p>
        <p>
          The record covers approximately 170 years of continuous measurement across a global network. It is one of several independent global temperature datasets; others include GISTEMP (NASA) and ERA5 (ECMWF). Independent teams, using different methodologies and data sources, produce records that are consistent with each other within known uncertainty ranges.
        </p>

        <Callout>
          <strong>→ Activity 1:</strong> Examine the temperature record and write a precise description of what you observe. What pattern do you see? When does something appear to change?
        </Callout>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          S2 — PROXY EVIDENCE
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-proxy"
        label="Evidence section 2"
        title="Proxy evidence — reading the climate before thermometers"
        intro="Instrumental records only extend back reliably to the mid-19th century. To understand climate before that — and to place modern warming in long-run context — scientists use proxy records: physical indicators that change in predictable ways with temperature."
      >
        <h3 className={s.subHeading}>Why proxy evidence matters for attribution</h3>
        <p>
          Proxy evidence matters for two reasons. First, it places the modern warming in long-run context — is +1.2°C unprecedented? Second, it reveals the pattern of natural climate variability, which is essential for distinguishing the natural-variability signal from any anthropogenic signal. If modern warming was within the range of natural variability seen in the proxies, the attribution case would be weaker. The proxy record consistently shows that the rate and sustained character of modern warming is exceptional over at least the past millennium.
        </p>

        <Callout type="warn">
          <strong>Read carefully:</strong> Each card below specifies what the evidence shows <em>and</em> what it does not prove. The distinction between detection and attribution applies to each piece of evidence individually. Practise applying it before Activity 2.
        </Callout>

        <EvidenceRefs cards={proxyCards} onOpen={openEvidenceCard} />

        <Callout>
          <strong>→ Activity 2:</strong> Review the full evidence archive (proxy and instrumental sections). For each major piece of evidence, note what it shows and — critically — what it does not prove on its own.
        </Callout>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          S3 — INSTRUMENTAL AND PHYSICAL OBSERVATIONS
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-instrumental"
        label="Evidence section 3"
        title="Instrumental and physical observations — the warming signal in the physical world"
        intro="Physical observations provide direct, measurable evidence that warming is occurring. These are not model outputs or statistical inferences — they are changes in things we can directly observe and measure: ice extent, sea level, glacier volume."
      >
        <h3 className={s.subHeading}>Multiple independent lines of evidence</h3>
        <p>
          A key feature of the detection case is that warming shows up across entirely independent physical systems. Sea level rise, Arctic ice loss, and glacier retreat are driven by different physical mechanisms. The fact that all three are changing in directions consistent with warming — and at rates that have accelerated since the mid-20th century — provides a much stronger signal than any single dataset alone. This convergence across independent lines of evidence is the scientific basis for high confidence in the detection of warming.
        </p>

        <EvidenceRefs cards={instrumentalCards} onOpen={openEvidenceCard} />

        <Callout>
          <strong>→ Activity 2:</strong> Add these physical observations to your evidence assessment. Note the distinction: physical observations confirm that warming is happening across multiple independent systems, but they still do not, by themselves, identify the cause.
        </Callout>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          S4 — CHRONOLOGY
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-chronology"
        label="Reference section"
        title="Chronology — climate, science, and human activity over time"
        intro="Use this timeline to orient yourself. It covers the deep history of natural climate drivers, the industrial period, the development of climate science, and key scientific milestones. Pay attention to timing relationships — they matter for the attribution argument."
      >
        <Callout type="warn">
          <strong>Timescale caution:</strong> This table spans ~100 million years to the present. Events at different timescales operate through different mechanisms. Do not infer cause from proximity alone — check the mechanism.
        </Callout>

        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <table className={s.chronoTable}>
            <thead>
              <tr>
                <th>Date / period</th>
                <th>Event</th>
                <th>Significance for the inquiry</th>
              </tr>
            </thead>
            <tbody>
              {CHRONOLOGY.map((row, i) => (
                <tr key={i}>
                  <td className={s.chronoDate}>{row.date}</td>
                  <td>
                    <div className={s.chronoEvent}>{row.event}</div>
                  </td>
                  <td>
                    <div className={s.chronoSig}>{row.significance}</div>
                    {row.inquiry && <div className={s.chronoInquiry}>{row.inquiry}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          S5 — GREENHOUSE GASES
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-greenhouse"
        label="Evidence section 4"
        title="Greenhouse gases — mechanism and measurement"
        intro="Understanding greenhouse gases is essential for the attribution argument because they are the proposed mechanism for anthropogenic warming. Attribution requires more than correlation — it requires a plausible causal mechanism. The enhanced greenhouse effect is that mechanism."
      >
        <h3 className={s.subHeading}>The natural greenhouse effect</h3>
        <p>
          The greenhouse effect is a natural and essential feature of Earth's atmosphere. Without it, the mean surface temperature would be approximately −18°C rather than +15°C. Greenhouse gases (primarily water vapour, CO₂, methane, and nitrous oxide) absorb outgoing longwave (infrared) radiation from Earth's surface and re-emit it in all directions — including back downward. This traps energy in the lower atmosphere.
        </p>

        <h3 className={s.subHeading}>The enhanced greenhouse effect</h3>
        <p>
          The <em>enhanced</em> greenhouse effect is not a separate mechanism — it is the intensification of the natural mechanism by additional GHGs emitted through human activities (fossil fuel combustion, agriculture, deforestation, industrial processes). As GHG concentrations rise, more longwave radiation is trapped, increasing the energy imbalance at the top of the atmosphere and raising surface temperatures.
        </p>
        <p>
          The relationship between CO₂ and temperature was first quantified by Svante Arrhenius in 1896. Modern radiative transfer physics provides precise estimates: a doubling of atmospheric CO₂ from pre-industrial levels produces a direct forcing of approximately +3.7 W/m² before feedbacks, with an equilibrium climate sensitivity of approximately 2.5–4°C (IPCC AR6 likely range).
        </p>

        <h3 className={s.subHeading}>The four greenhouse gases — a comparison</h3>
        <p>
          The table below compares the four main anthropogenic greenhouse gases. Note that GWP₁₀₀ (100-year global warming potential) measures the warming effect of one unit of a gas relative to CO₂ over 100 years. A high GWP does not automatically mean a gas dominates total forcing — concentration and atmospheric lifetime matter equally.
        </p>
        <GHGTable />

        <EvidenceRefs cards={greenhouseCards} onOpen={openEvidenceCard} />

        <Callout>
          <strong>→ Activity 4:</strong> Use this section to analyse the GHG mechanism in detail. Activity 4 asks you to explain why CO₂ dominates forcing despite methane's higher GWP, and to trace the full causal chain from human activity to surface warming — including the GHG fingerprint.
        </Callout>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          S6 — NATURAL FACTORS
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-natural"
        label="Evidence section 5"
        title="Natural factors — solar variability, volcanic activity, and ENSO"
        intro="A rigorous attribution argument cannot simply assert that humans caused warming — it must demonstrate that natural factors cannot adequately explain the observed trend. This section provides the evidence needed to evaluate the natural-cause hypothesis seriously before testing it."
      >
        <Callout type="warn">
          <strong>Take this evidence seriously:</strong> Natural factors do influence climate. The question is whether they can explain the magnitude, timing, and pattern of post-1950 warming. Do not dismiss this evidence — the attribution argument is stronger if it engages with the strongest version of the natural-cause hypothesis.
        </Callout>

        <h3 className={s.subHeading}>Solar irradiance</h3>
        <p>
          If changes in the Sun's energy output are responsible for recent warming, we would expect to find that the Sun has been getting brighter. Scientists have been measuring total solar irradiance (TSI) directly using satellites since 1978, providing a continuous and precise record.
        </p>
        <p>
          The record clearly shows the 11-year solar cycle — periods of higher and lower solar activity driven by sunspot patterns. Within each cycle, total solar irradiance varies by approximately 0.1%.
        </p>
        <p>
          Beyond the 11-year cycle, the record shows the level of solar output at successive cycle peaks and troughs. The IPCC AR6 estimates solar radiative forcing since 1750 at approximately +0.05 W/m².
        </p>

        <h3 className={s.subHeading}>Volcanic eruptions</h3>
        <p>
          When a large volcano erupts explosively, it can blast sulphur dioxide into the stratosphere, where it reacts with water to form sulphate aerosol droplets. These droplets scatter incoming solar radiation, reducing the amount that reaches the surface.
        </p>
        <p>
          The 1991 eruption of Mt Pinatubo (Philippines) is the best-documented modern example. Following the eruption, global mean surface temperature fell by approximately 0.5°C. This cooling persisted for approximately 2 years, then temperature recovered toward the pre-eruption level.
        </p>
        <p>
          Volcanic CO₂ is also released during eruptions. Estimates of total volcanic CO₂ output are approximately 0.3–0.4 billion tonnes per year globally. Human CO₂ emissions in 2022 were approximately 37 billion tonnes.
        </p>

        <h3 className={s.subHeading}>ENSO</h3>
        <p>
          El Niño–Southern Oscillation (ENSO) is a recurring climate pattern driven by interactions between tropical Pacific sea-surface temperatures and atmospheric circulation. During El Niño, unusually warm sea-surface temperatures in the central and eastern tropical Pacific shift weather patterns globally and raise global mean surface temperature by approximately 0.1–0.2°C. During La Niña, the opposite pattern produces temporary cooling.
        </p>
        <p>
          The record warm years in the global temperature record — 1998, 2016, 2023 — all coincide with strong El Niño events. Climate scientists can statistically remove the ENSO signal from the temperature record to isolate the underlying trend.
        </p>
        <p>
          ENSO operates on interannual timescales — El Niño events typically develop over months and fade within 1–2 years. The ENSO index oscillates between positive (El Niño) and negative (La Niña) phases without a consistent long-term trend in one direction.
        </p>

        <EvidenceRefs cards={naturalCards} onOpen={openEvidenceCard} />

        <Callout>
          <strong>→ Activity 3:</strong> Examine each natural factor in turn. For each one, consider: is there a physical mechanism that could produce sustained warming? Does the timing of this factor's changes match the warming pattern? Is the magnitude of its effect large enough to matter?
        </Callout>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          S7 — ANTHROPOGENIC FACTORS
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-anthropogenic"
        label="Evidence section 6"
        title="Anthropogenic factors — the human contribution to radiative forcing"
        intro="The anthropogenic case for global warming rests on three interconnected pillars: a known mechanism (the enhanced greenhouse effect), a measurable signal (rising GHG concentrations co-occurring with industrialisation), and a distinctive fingerprint that distinguishes GHG forcing from solar or natural forcing."
      >
        <h3 className={s.subHeading}>The GHG emissions pathway</h3>
        <p>
          Anthropogenic GHG emissions arise from three principal categories:
        </p>
        <ul className={s.evidenceList}>
          <li><strong>Fossil fuel combustion:</strong> burning coal, oil, and natural gas for energy (electricity generation, transport, heating) releases CO₂ and methane. This is the single largest source of anthropogenic GHG emissions — approximately 75% of total global emissions.</li>
          <li><strong>Agriculture and land use:</strong> rice cultivation and livestock (especially ruminants) produce methane; synthetic nitrogen fertilisers produce nitrous oxide; deforestation releases stored carbon. Together these contribute approximately 20–25% of total forcing.</li>
          <li><strong>Industrial processes:</strong> cement production, steel manufacturing, and synthetic refrigerant gases (HFCs) contribute the remainder, including a disproportionate contribution to forcing from fluorinated gases (very high GWP).</li>
        </ul>

        <h3 className={s.subHeading}>Land-use change and albedo modification</h3>
        <p>
          Deforestation and urban expansion alter surface albedo (the proportion of incoming solar radiation that is reflected). Forests are darker than grassland or cropland and absorb more solar radiation. Replacing forest with lighter surfaces produces a small local cooling effect — but this is far outweighed by the warming from the CO₂ released during deforestation. Net, land-use change is a warming influence.
        </p>

        <h3 className={s.subHeading}>Atmospheric fingerprints</h3>
        <p>
          Climate scientists look for <strong>fingerprints</strong> — physical patterns that different forcing mechanisms would be expected to produce in different parts of the climate system. The idea is that if two explanations (e.g. solar forcing vs. GHG forcing) both predict warming near the surface, but predict different patterns in other parts of the system, those differences can be used to test which explanation is operating.
        </p>
        <p>
          Radiosonde balloons have been measuring temperatures at various altitudes since the mid-20th century. The <strong>troposphere</strong> (0–approximately 12 km) is where weather occurs and where surface heat exchange takes place. The <strong>stratosphere</strong> (approximately 12–50 km) contains the ozone layer. Satellite microwave sounding instruments have been monitoring atmospheric temperatures in both layers since 1979.
        </p>
        <p>
          Additional fingerprints observed in the record include: <strong>polar amplification</strong> (the Arctic is warming significantly faster than the global average); and <strong>diurnal warming asymmetry</strong> (whether daytime highs and night-time lows are warming at the same rate or at different rates).
        </p>

        <EvidenceRefs cards={anthropoCards} onOpen={openEvidenceCard} />

        <Callout>
          <strong>→ Activity 4:</strong> Use this section to build the positive anthropogenic case. Focus on the mechanism and the fingerprint — these are what make the attribution argument intellectually defensible rather than merely correlational.
        </Callout>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          S8 — COMPARISON FRAMEWORK
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-comparison"
        label="Attribution framework"
        title="Comparison framework — testing natural vs. anthropogenic explanations"
        intro="Attribution science uses a structured comparative methodology: both natural and anthropogenic explanations are tested against the same set of criteria simultaneously. The explanation that best fits the evidence across all criteria, especially timing and magnitude in the post-1950 period, is preferred."
      >
        <h3 className={s.subHeading}>The three attribution criteria</h3>
        <p>
          Use the three criteria below to compare natural and anthropogenic factors. For each criterion, consider how each set of factors performs against the evidence from sections S5, S6, and S7. Complete this framework in Activity 5.
        </p>

        <div className={s.compSection}>
          <div className={s.compHeader}>
            <div>Criterion</div>
            <div className={s.compColNatural}>Natural factors</div>
            <div className={s.compColAnthro}>Anthropogenic factors</div>
          </div>
          {COMPARISON_CRITERIA.map(c => (
            <div key={c.criterion} className={s.compRow}>
              <div className={s.compCriterion}>
                <strong>{c.criterion}</strong>
                <div className={s.compQuestion}>{c.question}</div>
              </div>
              <div className={`${s.compCell} ${s.compColNatural}`} />
              <div className={`${s.compCell} ${s.compColAnthro}`} />
            </div>
          ))}
        </div>

        <EvidenceRefs cards={comparisonCards} onOpen={openEvidenceCard} />

        <Callout>
          <strong>→ Activity 5:</strong> Work through all three criteria, then write your attribution verdict. Which explanation fits the evidence better — and why? Pay specific attention to the post-1950 divergence as the critical test.
        </Callout>
      </Section>

      {/* ══════════════════════════════════════════════════════════
          S9 — GLOSSARY
      ══════════════════════════════════════════════════════════ */}
      <Section
        id="s-glossary"
        label="Reference"
        title="Glossary of key terms"
        intro="These terms appear throughout the lab. Each entry gives a precise definition and an example of how the term applies in this inquiry."
      >
        <div className={s.glossaryGrid}>
          {GLOSSARY.map(item => (
            <details key={item.term} className={s.glossaryItem}>
              <summary className={s.glossaryTerm}>{item.term}</summary>
              <div className={s.glossaryDef}>{item.definition}</div>
              {item.example && (
                <div className={s.glossaryExample}><em>Example:</em> {item.example}</div>
              )}
            </details>
          ))}
        </div>
      </Section>

    </GWCtx.Provider>
  )
}

// ── Lab export ────────────────────────────────────────────────────────────────
export default function GlobalWarmingLab({
  onResponse, onComplete, savedResponses, isCompleted, onReset, backHref,
}) {
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
      {({ responses, openEvidenceCard }) => (
        <LabContent responses={responses} openEvidenceCard={openEvidenceCard} />
      )}
    </LabShell>
  )
}
