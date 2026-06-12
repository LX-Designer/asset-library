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
        title="The temperature record — what does the anomaly show?"
        intro="Before investigating causes, we need to describe what is actually happening to global temperature. The word 'anomaly' has a precise meaning here: it is the difference between the observed temperature and a long-run average (the baseline period 1850–1900 is used as the pre-industrial reference)."
      >
        <h3 className={s.subHeading}>Reading the global temperature anomaly</h3>
        <p>
          The HadCRUT5 (Hadley Centre / Climatic Research Unit) and NASA GISTEMP datasets are the two most widely cited global surface temperature records. Both combine ocean and land-surface measurements from a network of weather stations, ocean buoys, and ships going back to the 1850s. Independent research groups using different methodologies produce consistent results — this agreement across independent datasets is an important piece of evidence in itself.
        </p>
        <p>
          Key pattern in the record:
        </p>
        <ul className={s.evidenceList}>
          <li><strong>1850–1940:</strong> approximately +0.2–0.3°C above baseline with significant year-to-year variability.</li>
          <li><strong>1940–1970:</strong> a period of relatively stable or slightly cooling temperatures, partly attributed to industrial aerosol emissions masking warming.</li>
          <li><strong>1970–present:</strong> a steep, sustained acceleration. By 2021, the global mean surface temperature was approximately <strong>+1.1–1.2°C</strong> above the 1850–1900 pre-industrial average (IPCC AR6, 2021).</li>
          <li><strong>Each of the last four decades</strong> has been successively warmer than any decade since 1850.</li>
        </ul>

        <Callout type="warn">
          <strong>Detection vs. attribution:</strong> The temperature record tells us <em>that</em> warming is occurring. It does not tell us <em>why</em>. Detecting a signal in the climate record is a different intellectual step from attributing it to a cause. The rest of this lab builds the evidence needed for that attribution argument.
        </Callout>

        <h3 className={s.subHeading}>What the anomaly does and does not show</h3>
        <p>
          The temperature record shows a clear upward trend that is very unlikely to be explained by measurement error or station siting issues alone — independent research teams using different methodologies (satellite data, ocean heat content, glacier mass balance) converge on the same signal. What the record does not show, by itself, is mechanism. A trend does not prove a cause. Natural factors — solar variability, volcanic activity, ocean circulation changes — can and do drive temperature changes. The task of this inquiry is to assess whether they can account for the magnitude and timing of the post-1950 warming.
        </p>

        <Callout>
          <strong>→ Activity 1:</strong> Examine the temperature record and write a precise description of what it shows. What specific features would need to be explained by any causal hypothesis?
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

        <h3 className={s.subHeading}>Solar irradiance variability</h3>
        <p>
          The sun is the primary energy source for Earth's climate system. Small variations in solar output (total solar irradiance, TSI) occur on approximately 11-year cycles (the Schwabe cycle) and longer-period variations. Solar variability has been measured directly by satellites since 1978 and reconstructed for earlier periods using sunspot records and cosmogenic isotopes (¹⁰Be, ¹⁴C). The IPCC AR6 estimates that solar forcing since 1750 is approximately <strong>+0.05 W/m²</strong> — very small compared to anthropogenic forcing.
        </p>
        <p>
          The critical observation for attribution: satellite measurements show that solar irradiance has been <em>flat or slightly declining</em> since approximately 1980, while global mean surface temperature has continued to rise sharply. This post-1950 divergence is one of the most important pieces of evidence in the attribution case.
        </p>

        <h3 className={s.subHeading}>Volcanic eruptions</h3>
        <p>
          Major volcanic eruptions inject sulphur dioxide (SO₂) into the stratosphere, where it converts to sulphate aerosols that reflect incoming solar radiation. This produces a detectable cooling signal in the temperature record, typically lasting 1–3 years. The 1991 eruption of Mt Pinatubo produced a cooling of approximately 0.5°C globally. However, volcanic forcing is episodic and short-lived — it cannot explain the sustained, multi-decadal warming trend.
        </p>

        <h3 className={s.subHeading}>El Niño–Southern Oscillation (ENSO)</h3>
        <p>
          ENSO drives significant year-to-year temperature variability. El Niño events (warm phase) redistribute heat from the Pacific Ocean to the atmosphere, temporarily raising global mean surface temperature by 0.1–0.2°C. La Niña events (cool phase) have the opposite effect. ENSO explains much of the variability around the long-term trend — but it does not explain the trend itself, because ENSO is a redistribution of existing heat, not a source of additional energy to the system.
        </p>

        <EvidenceRefs cards={naturalCards} onOpen={openEvidenceCard} />

        <Callout type="warn">
          <strong>The post-1950 divergence — the decisive test:</strong> If natural factors were the dominant cause of recent warming, we would expect solar irradiance to have increased alongside temperature. The satellite record shows it has not. This divergence — temperature rising while solar output is flat — is the single most important piece of evidence for testing the natural-cause hypothesis.
        </Callout>

        <Callout>
          <strong>→ Activity 3:</strong> Evaluate each natural factor (solar, volcanic, ENSO) in turn. For each one, assess: is the mechanism capable of producing sustained warming? Does the timing match post-1950 observations? Is the magnitude sufficient?
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

        <h3 className={s.subHeading}>The GHG fingerprint — distinguishing anthropogenic from solar forcing</h3>
        <p>
          The most scientifically compelling evidence for anthropogenic attribution is the GHG <em>fingerprint</em>: the characteristic spatial pattern of warming that distinguishes enhanced greenhouse forcing from solar forcing.
        </p>
        <ul className={s.evidenceList}>
          <li><strong>Tropospheric warming + stratospheric cooling:</strong> GHG forcing warms the lower atmosphere (troposphere) while simultaneously cooling the upper atmosphere (stratosphere) — because GHGs trap heat in the troposphere and reduce radiation reaching the stratosphere. Solar forcing, in contrast, would warm both layers. Satellites measuring stratospheric temperatures show cooling consistent with GHG forcing, not solar forcing.</li>
          <li><strong>Polar amplification:</strong> GHG warming is amplified at the poles due to ice-albedo feedback. Arctic warming has been approximately 3–4× faster than the global average — consistent with GHG mechanism, not solar forcing.</li>
          <li><strong>Night-time warming faster than daytime:</strong> Under solar forcing, daytime warming should dominate. GHG forcing retains heat at night as well, producing a pattern of faster minimum temperature rise — which is observed.</li>
        </ul>

        <p>
          IPCC AR6 (2021) concluded: "It is <em>unequivocal</em> that human influence has warmed the atmosphere, ocean and land." Total anthropogenic radiative forcing is estimated at approximately <strong>+2.7 W/m²</strong> since 1750, compared to approximately +0.05 W/m² from solar forcing — a ratio of approximately 54:1.
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
          Use the three criteria below to assess both natural and anthropogenic factors. Apply each criterion to the evidence from Sections 5 and 6. The post-1950 divergence (solar irradiance flat while temperatures rise sharply) is the decisive test for the timing criterion.
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
              <div className={`${s.compCell} ${s.compColNatural}`}>
                <div className={s.compHint}>{c.natural}</div>
              </div>
              <div className={`${s.compCell} ${s.compColAnthro}`}>
                <div className={s.compHint}>{c.anthropogenic}</div>
              </div>
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
