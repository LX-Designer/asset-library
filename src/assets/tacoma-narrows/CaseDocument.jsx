import styles from './TacomaNarrows.module.css'
import LabFigure from '../../lab-shell/LabFigure/LabFigure.jsx'

function Trigger({ num, label, sub, done, openActivity }) {
  return (
    <button
      className={`${styles.trigger} ${done ? styles.triggerDone : ''}`}
      onClick={() => openActivity('act-' + num)}
    >
      <span className={styles.triggerNum}>ACT 0{num}</span>
      <span className={styles.triggerContent}>
        <span className={styles.triggerTitle}>{sub}</span>
        <span className={styles.triggerLabel}>{label}</span>
      </span>
      <span className={styles.triggerArrow}>→</span>
    </button>
  )
}

export default function CaseDocument({ openActivity, responses }) {
  const done = (n) => responses['act-' + n] != null

  return (
    <>
      {/* ── DOCUMENT HEADER ── */}
      <header className={styles.docHeader}>
        <div className={styles.docClassification}>
          Official Record · Inquiry Tribunal · Restricted Distribution
        </div>
        <h1 className={styles.docTitle}>The Bridge That Shouldn't Have Failed</h1>
        <p className={styles.docSubtitle}>Engineering Incident Report — Tacoma Narrows Bridge, 1940</p>

        <div className={styles.docMetaRow}>
          <div>
            <span className={styles.docMetaLabel}>Incident date</span>
            <span className={styles.docMetaValue}>07 November 1940</span>
          </div>
          <div>
            <span className={styles.docMetaLabel}>Location</span>
            <span className={styles.docMetaValue}>Tacoma Narrows, Washington State</span>
          </div>
          <div>
            <span className={styles.docMetaLabel}>Classification</span>
            <span className={styles.docMetaValue}>Structural Collapse — Total Loss</span>
          </div>
          <div>
            <span className={styles.docMetaLabel}>File reference</span>
            <span className={styles.docMetaValue}>1940-TN-001</span>
          </div>
        </div>

        <div className={styles.roleBanner}>
          <strong>Your role:</strong> You are a junior analyst assigned to the post-collapse inquiry
          tribunal. All evidence in this case file has been provided to you. Your task is to work
          through the inquiry activities, examine the data, evaluate competing expert claims, and
          ultimately produce a tribunal report explaining the failure mechanism. Use the activities
          in the sidebar to guide your investigation — but read the full case file carefully.
          The answer is in here.
        </div>
      </header>

      <div className={styles.contentWrap}>

        {/* ── BEFORE YOU BEGIN ── */}
        <details className={styles.beforeDetails}>
          <summary className={styles.beforeSummary}>
            ⓘ Before you begin — assumptions and learning goals
          </summary>
          <div className={styles.beforeContent}>
            <div className={styles.beforeGrid}>
              <div className={styles.beforeCard}>
                <span className={styles.beforeCardTitle}>Assumed prior knowledge</span>
                <ul className={styles.beforeList}>
                  <li>Oscillation and frequency (Hz)</li>
                  <li>Basic concept of resonance</li>
                  <li>Newton's laws of motion</li>
                  <li>Concept of damping</li>
                  <li>Reading and interpreting data tables</li>
                  <li>Basic structural forces — tension and compression</li>
                </ul>
              </div>
              <div className={styles.beforeCard}>
                <span className={styles.beforeCardTitle}>You will learn to</span>
                <ul className={styles.beforeList}>
                  <li>Distinguish resonance from aeroelastic flutter as failure mechanisms</li>
                  <li>Use frequency data to evaluate competing physical explanations</li>
                  <li>Identify limitations in an engineering model</li>
                  <li>Analyse how a design decision changes structural behaviour</li>
                  <li>Evaluate expert claims against primary source evidence</li>
                  <li>Construct an evidence-based argument in a formal written format</li>
                </ul>
              </div>
            </div>
          </div>
        </details>

        {/* ── ACTIVITY 1 TRIGGER ── */}
        <Trigger num={1} sub="Before you read" label="Record your initial hypothesis" done={done(1)} openActivity={openActivity} />

        {/* ── § 01  INCIDENT OVERVIEW ── */}
        <section id="tn-overview" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 01</span>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleItalic}`}>Incident Overview</h2>
          </div>

          <p>At 11:10 a.m. on the morning of 7 November 1940, approximately 600 feet of the central span of the Tacoma Narrows Bridge broke free from its suspender cables and fell 190 feet into the cold waters of Puget Sound below. The bridge had been open to traffic for exactly 128 days.</p>

          <p>The wind speed recorded at midspan was 42 miles per hour — a moderate autumn storm, by the standards of the Pacific Northwest. The bridge had been designed to withstand static wind loads far in excess of this figure. On paper, the structure should have been safe.</p>

          <p>The collapse was filmed by University of Washington engineer F.B. Farquharson, who had been stationed at the bridge as part of an ongoing investigation into its unusual behaviour. His footage — still widely circulated today — shows the bridge twisting violently along its length, one side of the roadway rising while the other falls, before sections of the deck tear themselves apart.</p>

          <div className={`${styles.callout} ${styles.calloutDanger}`}>
            <span className={styles.calloutLabel}>⚠ Note for tribunal</span>
            The bridge was closed to vehicle traffic before it collapsed. The only confirmed casualty was a three-legged cocker spaniel named Tubby, left in a vehicle by the last driver to attempt to cross. No human lives were lost.
          </div>

          <LabFigure
            src="/tacoma-narrows/tacoma-narrow-bridge.jpg"
            alt="The Tacoma Narrows Bridge oscillating violently before collapse, 7 November 1940"
            caption="The Tacoma Narrows Bridge mid-oscillation, photographed on the morning of 7 November 1940. The roadway deck is visibly twisted along its length — one side elevated, the other depressed."
          />

          <p>The collapse shocked the engineering world. Tacoma Narrows was not an experimental structure — it had been reviewed by eminent engineers and approved by federal funding authorities. It was the third-longest suspension bridge in the world. Its collapse represented not merely a structural failure, but a failure of the profession's models and assumptions.</p>
        </section>

        <div className={styles.divider}>· · ·</div>

        {/* ── § 02  BRIDGE SPECIFICATIONS ── */}
        <section id="tn-specifications" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 02</span>
            <h2 className={styles.sectionTitle}>Bridge Specifications</h2>
          </div>

          <p>The following technical specifications are drawn from the original engineering records submitted to the Federal Works Agency prior to construction. These figures were publicly available and were reviewed by the engineering board at approval.</p>

          <table className={styles.dataTable}>
            <thead>
              <tr><th>Parameter</th><th>Value</th><th>Notes</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Total bridge length</td><td>1,810 m</td><td>Including approach spans</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td>Main span length</td><td>853 m</td><td>Third longest in world at time of construction</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td>Deck width</td><td>12 m</td><td>Two lanes only — unusually narrow for span length</td>
              </tr>
              <tr>
                <td>Span-to-width ratio</td><td>72 : 1</td><td>Compare Golden Gate: ~47:1</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td>Stiffening girder depth</td><td>2.4 m (solid plate)</td><td>Original design called for 7.6 m open trusses</td>
              </tr>
              <tr>
                <td>Tower height</td><td>130 m</td><td>Above water level</td>
              </tr>
              <tr>
                <td>Dead load (self-weight)</td><td>~7,000 kN/m</td><td>Significantly lighter than conventional designs</td>
              </tr>
              <tr>
                <td>Design static wind load</td><td>Rated to 100+ mph</td><td>Static force calculation; dynamic behaviour not modelled</td>
              </tr>
              <tr>
                <td>Construction cost</td><td>$6.4 million USD</td><td>Approximately 40% less than original conservative estimate</td>
              </tr>
            </tbody>
          </table>

          <LabFigure
            src="/tacoma-narrows/girder-comparison.svg"
            alt="Cross-section comparison: 7.6m open-lattice truss (original design) versus 2.4m solid plate girder (built)"
            caption="Cross-section comparison of the two stiffening girder designs. The open-lattice truss (left) allows wind to pass through; the solid plate girder (right) acts as an aerodynamic surface, generating lift and drag forces the original model did not account for."
          />

          <div className={styles.callout}>
            <span className={styles.calloutLabel}>Design note</span>
            The original Washington State design, prepared by engineer Clark Eldridge, specified 7.6-metre open-lattice trusses beneath the roadway. This design was overruled by federal funding authorities, who engaged New York engineer Leon Moisseiff to produce a less expensive alternative. Moisseiff's design used 2.4-metre solid plate girders — elegant, slender, and, as Moisseiff described it, "the most beautiful bridge in the world."
          </div>
        </section>

        <div className={styles.divider}>· · ·</div>

        {/* ── § 03  WIND & OSCILLATION DATA ── */}
        <section id="tn-data" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 03</span>
            <h2 className={styles.sectionTitle}>Wind and Oscillation Data</h2>
          </div>

          <p>The following data was recorded by instruments and observers on the day of the collapse, and reconstructed from film footage and engineering records in the weeks following. All times are Pacific Standard Time.</p>

          <table className={styles.dataTable}>
            <thead>
              <tr><th>Time</th><th>Wind speed</th><th>Oscillation type</th><th>Frequency</th><th>Amplitude</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>~07:00</td><td>35 mph (56 km/h)</td><td>Vertical (transverse)</td><td>~0.6 Hz</td><td>~0.5 m</td>
              </tr>
              <tr>
                <td>~08:30</td><td>38 mph (61 km/h)</td><td>Vertical (transverse)</td><td>~0.6 Hz</td><td>~1.2 m</td>
              </tr>
              <tr>
                <td>~10:00</td><td>42 mph (68 km/h)</td><td>Mixed — transition</td><td>Irregular</td><td>Increasing</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td>~10:15</td><td>42 mph (68 km/h)</td><td>Torsional (twisting)</td><td>0.2 Hz</td><td>~4 m, growing</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td>~10:45</td><td>42 mph (68 km/h)</td><td>Torsional (twisting)</td><td>0.2 Hz</td><td>~8.5 m — deck at 45°</td>
              </tr>
              <tr>
                <td>11:02</td><td>42 mph (68 km/h)</td><td>Collapse initiating</td><td>—</td><td>Cable failure begins</td>
              </tr>
              <tr>
                <td>11:10</td><td>42 mph (68 km/h)</td><td>—</td><td>—</td><td>Central span collapses</td>
              </tr>
            </tbody>
          </table>

          <p>Additional instrument data recovered from the site after the collapse:</p>

          <table className={styles.dataTable}>
            <thead>
              <tr><th>Measurement</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Estimated natural vertical frequency of bridge</td>
                <td>~0.6 Hz (matches early oscillation data)</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td>Calculated vortex shedding frequency at 42 mph wind</td>
                <td>~1.0 Hz</td>
              </tr>
              <tr className={styles.highlightRow}>
                <td>Observed torsional oscillation frequency at collapse</td>
                <td>0.2 Hz</td>
              </tr>
              <tr>
                <td>Trigger event at ~10:00</td>
                <td>A midspan stay cable slipped, creating asymmetric loading</td>
              </tr>
            </tbody>
          </table>

          <LabFigure
            src="/tacoma-narrows/frequency-diagram.svg"
            alt="Diagram showing the three key frequencies: natural vertical frequency 0.6 Hz, vortex shedding frequency 1.0 Hz, and torsional collapse frequency 0.2 Hz"
            caption="The three critical frequencies. A resonance explanation requires the vortex shedding frequency to match the oscillation frequency at collapse. The data shows they do not."
          />

          <div className={`${styles.callout} ${styles.calloutDanger}`}>
            <span className={styles.calloutLabel}>Data anomaly — flag for tribunal</span>
            Note the discrepancy between the vortex shedding frequency (1.0 Hz) and the torsional oscillation frequency (0.2 Hz) recorded at the time of collapse. These values are not equal. Any complete explanation of the failure mechanism must account for this discrepancy.
          </div>
        </section>

        {/* ── ACTIVITY 2 & 3 TRIGGERS ── */}
        <Trigger num={2} sub="Data analysis"        label="Does the frequency evidence support resonance?" done={done(2)} openActivity={openActivity} />
        <Trigger num={3} sub="Timeline reconstruction" label="Two phases — do they need two explanations?" done={done(3)} openActivity={openActivity} />

        <div className={styles.divider}>· · ·</div>

        {/* ── § 04  ENGINEERING SIGN-OFF ── */}
        <section id="tn-design" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 04</span>
            <h2 className={styles.sectionTitle}>Original Engineering Sign-Off</h2>
          </div>

          <p>The following is an excerpt from the structural engineering assessment prepared by Moisseiff's team, submitted to the Federal Works Agency on 12 April 1938 in support of the design proposal. This document was approved by the reviewing board.</p>

          <div className={styles.witnessBlock}>
            <div className={styles.witnessTag}>Exhibit A — Engineering Assessment (excerpt)</div>
            <div className={styles.witnessName}>Moisseiff &amp; Lienhard, Consulting Engineers</div>
            <div className={styles.witnessRole}>Structural assessment, April 1938</div>
            <div className={styles.witnessText}>
              <p>"The proposed structure has been analysed using the deflection theory, which accounts for the contribution of the main cables in resisting lateral wind loads. Under this method, the stiffness provided by the cable system — acting through the suspenders — absorbs approximately one-half of any applied static wind pressure, transmitting the remainder to the anchorages and towers.</p>
              <p>The proposed plate girder section, at 8 feet in depth, provides adequate stiffness for all anticipated design loads. The structure has been found to be safe under wind forces equivalent to a uniform static pressure of 30 lb/ft² applied to the exposed surface area — corresponding to wind velocities well in excess of any recorded at the Narrows.</p>
              <p>We are satisfied that the proposed design meets or exceeds all applicable safety standards and that no further analysis is required prior to construction approval."</p>
            </div>
          </div>

          <div className={styles.callout}>
            <span className={styles.calloutLabel}>Tribunal context</span>
            The assessment above is technically accurate within its stated assumptions — it correctly applies the deflection theory for static wind loads. The question for this tribunal is not whether the calculation was wrong, but whether the model used was complete.
          </div>
        </section>

        {/* ── ACTIVITY 4 TRIGGER ── */}
        <Trigger num={4} sub="Design analysis" label="What did the solid girder design change?" done={done(4)} openActivity={openActivity} />

        <div className={styles.divider}>· · ·</div>

        {/* ── § 05  EXPERT WITNESSES ── */}
        <section id="tn-experts" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 05</span>
            <h2 className={styles.sectionTitle}>Expert Witness Statements</h2>
          </div>

          <p>Two expert witnesses submitted statements to the tribunal. They were given the same incident data. Their conclusions differ substantially.</p>

          <div className={styles.witnessBlock}>
            <div className={styles.witnessTag}>Expert Witness A</div>
            <div className={styles.witnessName}>Dr. Heinrich Brandt</div>
            <div className={styles.witnessRole}>Professor of Structural Mechanics, Institute of Technology</div>
            <div className={styles.witnessText}>
              <p>"The collapse of the Tacoma Narrows Bridge is, at its core, a classic case of mechanical resonance. Wind flowing past any blunt structure generates alternating pressure vortices — a well-understood phenomenon. These vortices create a periodic oscillating force. When the frequency of this forcing approaches the natural frequency of the structure, energy accumulates in the system and amplitude grows without bound.</p>
              <p>The bridge had a natural frequency of approximately 0.6 Hz. In the conditions recorded on 7 November 1940, the vortex shedding would have produced a forcing function in a similar range. The vertical oscillations seen in the early morning hours are precisely what resonance predicts: steady accumulation of energy, growing amplitude.</p>
              <p>The subsequent torsional motion was a consequence of this resonant buildup reaching the torsional mode of the structure. The fundamental cause remains resonance. This bridge failed for the same reason a wine glass shatters when a singer hits the right note. The engineers simply did not account for the dynamic loading imposed by wind-induced resonance."</p>
            </div>
          </div>

          <div className={styles.witnessBlock}>
            <div className={styles.witnessTag}>Expert Witness B</div>
            <div className={styles.witnessName}>Dr. Amara Osei-Mensah</div>
            <div className={styles.witnessRole}>Specialist in Aeroelastic Systems, National Research Laboratory</div>
            <div className={styles.witnessText}>
              <p>"With respect to my colleague, the resonance explanation is demonstrably incomplete — and the data in this case file is sufficient to show why. For resonance to occur, the external forcing frequency must match or closely approach the natural frequency of the system being excited. The torsional mode of the Tacoma Narrows Bridge oscillated at 0.2 Hz at the time of collapse. The calculated vortex shedding frequency at 42 mph wind speed is approximately 1.0 Hz. These frequencies do not match. The resonance model cannot explain the torsional collapse.</p>
              <p>What actually occurred is a phenomenon called aeroelastic flutter. When the bridge began to twist — triggered by the asymmetric loading from the slipped stay cable — the angle of the solid plate girder relative to the wind changed. This changed the aerodynamic forces acting on the girder. Critically, the changed aerodynamic forces acted in the same direction as the twist, amplifying it further. More twist produced more aerodynamic force. More force produced more twist. The system entered a self-reinforcing feedback loop — what engineers now call negative damping.</p>
              <p>This is qualitatively different from resonance. In resonance, an external force drives a system at its natural frequency. In flutter, the structure itself generates the forces that destroy it. The wind supplies energy; the motion of the structure decides how that energy is applied. No external periodic forcing is required — or present."</p>
            </div>
          </div>
          <LabFigure
            src="/tacoma-narrows/flutter-feedback.svg"
            alt="Diagram of the aeroelastic flutter feedback loop: twist changes aerodynamic force, which amplifies the twist"
            caption="The aeroelastic flutter feedback loop described by Dr. Osei-Mensah. Unlike resonance, flutter is self-sustaining — the structure's own motion generates the forces that destroy it."
          />
        </section>

        {/* ── ACTIVITY 5 TRIGGER ── */}
        <Trigger num={5} sub="Expert evaluation" label="Which account does the evidence support?" done={done(5)} openActivity={openActivity} />

        <div className={styles.divider}>· · ·</div>

        {/* ── § 06  POST-COLLAPSE ── */}
        <section id="tn-investigation" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 06</span>
            <h2 className={styles.sectionTitle}>Post-Collapse Investigation</h2>
          </div>

          <p>In March 1941, the Carmody Board — a panel of senior engineers convened by the Federal Works Agency — published its findings. Three conclusions stood out:</p>

          <p><strong>1.</strong> The principal cause of failure was the bridge's extreme flexibility, resulting from its shallow and narrow design.</p>
          <p><strong>2.</strong> The solid plate girder and deck section acted aerodynamically — generating lift and drag forces that the original model had not accounted for.</p>
          <p><strong>3.</strong> Aerodynamic forces on large flexible structures were poorly understood. Wind tunnel testing of dynamic models should be required for all future long-span bridge designs.</p>

          <div className={styles.callout}>
            <span className={styles.calloutLabel}>Historical note</span>
            The Carmody Board declined to assign individual blame. Leon Moisseiff — whose career was effectively ended by the collapse — was exonerated. The board concluded that the entire engineering profession had operated at the limits of available knowledge. The science of aeroelasticity, as applied to large structures, was born in the aftermath of this failure. The replacement bridge, opened in 1950, was built with open-lattice trusses and has stood without incident ever since.
          </div>

          <p>It later emerged that the PWA field engineer, David L. Glenn, had formally objected to the design and refused to sign off on the bridge before opening. He was overruled by federal officials. He was dismissed from his post approximately two weeks later.</p>
        </section>

        {/* ── ACTIVITY 6 TRIGGER ── */}
        <Trigger num={6} sub="Final task — Tribunal report" label="Write your findings for the inquiry tribunal" done={done(6)} openActivity={openActivity} />

      </div>
    </>
  )
}
