import styles from './FastFashion.module.css'

function SectionHead({ num, title }) {
  return (
    <>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNum}>Section {num}</span>
        <div className={styles.sectionRule} />
      </div>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </>
  )
}

export default function CaseDocument({ onOpenModal }) {
  return (
    <>
      {/* ── MEMO HEADER ── */}
      <div className={styles.docMemo}>
        <div className={styles.memoType}>Internal Memorandum — Not for External Distribution</div>

        <div className={styles.memoGrid}>
          <span className={styles.memoLabel}>To</span>
          <span className={styles.memoValue}>Reviewing Analyst, Consumer Markets Division</span>

          <span className={styles.memoLabel}>From</span>
          <span className={styles.memoValue}>Dr K. Asante, Director of Research</span>

          <span className={styles.memoLabel}>Re</span>
          <span className={styles.memoValue}>CTF-2024-0047-INT — Market Assessment Correction Request</span>

          <span className={styles.memoLabel}>Date</span>
          <span className={styles.memoValue}>November 2024</span>

          <span className={styles.memoLabel}>Classification</span>
          <span className={styles.memoValue}>Internal Review</span>
        </div>

        <div className={styles.memoBody}>
          <p>
            The Consumer Markets Division has prepared a market assessment concluding that the fast
            fashion sector — and Shein in particular — operates with high productive efficiency and
            delivers net consumer welfare gains. The assessment recommends no policy intervention.
          </p>
          <p>
            I have flagged this assessment for correction. My concern is not with the facts it
            presents. It is with the analytical framework it applies — and, consequently, the
            question it fails to ask.
          </p>
          <p>
            You have been assigned this review. Your task is to examine the evidence in this dossier
            and prepare a corrected briefing note. The evidence is complete. The question is whether
            the right standard of analysis has been applied.
          </p>
        </div>
      </div>

      <div className={styles.contentWrap}>

        {/* ── SECTION 01 ── */}
        <section className={styles.section} id="s01">
          <SectionHead num="01" title="The Market Assessment Under Review" />

          <p>
            The Consumer Markets Division assessment, prepared in October 2024, evaluated the fast
            fashion sector against standard efficiency criteria. Its key findings were as follows.
          </p>

          <div className={styles.sectionSubtitle}>Output and cost performance</div>
          <p>
            Shein, the sector's dominant firm, produced approximately 6,000 new garment styles per
            day in 2023. Its average retail price across all categories was approximately £9 in the
            UK market, with many items priced below £5. The company generated $32.5 billion in
            global revenue in 2023, a 43% increase on 2022. Its net income of $2 billion in 2023
            represented a 185% increase on the prior year. These figures indicate a firm producing
            at high volume and low unit cost, consistent with productive efficiency.
          </p>

          <div className={styles.sectionSubtitle}>Price trends</div>
          <p>
            Real clothing prices in OECD economies have fallen significantly since the late 1990s.
            UK consumers now spend a smaller share of household income on clothing than at any point
            in the past 40 years. This reflects both falling production costs and intense market
            competition, consistent with the conditions under which productive efficiency is achieved
            in competitive markets.
          </p>

          <div className={styles.sectionSubtitle}>Consumer access</div>
          <p>
            The assessment noted that fast fashion has substantially widened access to clothing,
            particularly among lower-income households. This was treated as a welfare gain.
          </p>

          <div className={styles.sectionSubtitle}>Conclusion of the flagged assessment</div>
          <p>
            The market is productively efficient. No market failure has been identified. Policy
            intervention is not warranted.
          </p>
        </section>

        {/* ── SECTION 02 ── */}
        <section className={styles.section} id="s02">
          <SectionHead num="02" title="Shein: Production Data and Cost Structure" />

          <div className={styles.sectionSubtitle}>Production model</div>
          <p>
            Shein operates what analysts describe as an "ultra-fast fashion" or "real-time fashion"
            model. Unlike traditional retailers who produce in advance of known demand, Shein uses
            algorithmic demand forecasting to identify trending styles and produces initial runs of
            50–100 units per style, scaling up only for proven sellers. This minimises unsold
            inventory and reduces average production costs substantially.
          </p>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>New styles added per day</td><td>~6,000 (2023)</td></tr>
              <tr><td>Time from design to on-sale</td><td>Under 10 days</td></tr>
              <tr><td>Average retail price (UK, all categories)</td><td>~£9</td></tr>
              <tr><td>Estimated unit production cost (supplier)</td><td>~£3–5</td></tr>
              <tr><td>2023 global revenue</td><td>$32.5 billion</td></tr>
              <tr><td>2023 net income</td><td>$2 billion</td></tr>
              <tr><td>Global fast fashion market share</td><td>~18% (2023)</td></tr>
              <tr><td>Active shoppers</td><td>~88.8 million</td></tr>
            </tbody>
          </table>

          <div className={styles.sectionSubtitle}>Supply chain structure</div>
          <p>
            Shein does not own its factories. It operates through a network of approximately 3,000
            contracted suppliers, concentrated in Guangzhou, China. Suppliers compete for contracts
            on cost and speed. Shein's algorithmic platform monitors sales in near-real-time and
            redistributes orders dynamically between suppliers. The competitive pressure on suppliers
            to reduce costs and accelerate production is a structural feature of the model.
          </p>

          <div className={styles.sectionSubtitle}>Productive efficiency assessment (from the flagged analysis)</div>
          <p>
            The flagged assessment concluded that Shein's production model meets the standard
            conditions for productive efficiency: it produces at or near minimum average cost,
            employs the most cost-effective available technology, and achieves scale economies
            through volume. On the standard definition — production at the lowest possible cost —
            this conclusion is not contested.
          </p>
        </section>

        {/* ── SECTION 03 ── */}
        <section className={styles.section} id="s03">
          <SectionHead num="03" title="Environmental Costs: The Unpriced Account" />

          <div className={styles.sectionSubtitle}>Carbon emissions</div>
          <p>
            Shein's supply chain generates approximately 6.3 million tonnes of CO₂ equivalent per
            year — an amount comparable to the annual emissions of 180 coal-fired power plants.
            Between 2021 and 2023, Shein's absolute emissions grew by 81%, against revenue growth
            of 43% in the same period. Emissions intensity per unit of revenue increased — the
            company grew its environmental cost faster than its output.
          </p>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Period</th>
                <th>Scope 3 emissions growth</th>
                <th>Revenue growth</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>2021–2022</td><td>+52%</td><td>+44%</td></tr>
              <tr><td>2022–2023</td><td>+12%</td><td>+43%</td></tr>
              <tr className={styles.highlightRow}>
                <td>2021–2023 cumulative</td><td>+81%</td><td>+43%</td>
              </tr>
            </tbody>
          </table>

          <p>
            The social cost of carbon ranges from $51 (US federal estimate) to over $1,000 per
            tonne in high-impact scenarios. Using a conservative mid-range estimate of $200 per
            tonne, Shein's annual carbon externality is approximately <strong>$1.26 billion</strong>
            — against a 2023 net income of $2 billion. This cost does not appear in any garment's
            price.
          </p>

          <div className={styles.sectionSubtitle}>Water consumption and pollution</div>
          <p>
            The global fashion industry is the second-largest industrial consumer of water, using
            approximately 79–93 billion cubic metres annually. A single pair of jeans requires
            approximately 7,500 litres of water to produce; a cotton t-shirt approximately 2,700
            litres. Textile dyeing is the world's second-largest industrial water polluter.
            Untreated dye effluent is routinely discharged into waterways near production facilities
            in Bangladesh, China, and Vietnam. These costs are borne by communities proximate to
            production facilities. They are not reflected in the price of the garment.
          </p>

          <div className={styles.sectionSubtitle}>Waste</div>
          <p>
            The fashion industry produces approximately 92 million tonnes of textile waste per year.
            Consumers now buy 60% more clothing than 15 years ago but keep each item for half as
            long. Approximately 85% of textiles end up in landfill or incineration. The downstream
            costs — landfill space, methane emissions, incineration pollutants — are borne by
            municipal governments and local populations, not by the firms that produced the garments.
          </p>

          <div className={styles.analystNote}>
            <span className={styles.analystNoteLabel}>Analyst note</span>
            The figures in this section represent costs incurred as a consequence of fast fashion
            production and consumption. None are priced into the transaction between Shein and its
            customers. The question for the reviewing analyst is what the economic term for this is,
            and what it implies for the allocative efficiency analysis in the flagged assessment.
          </div>
        </section>

        {/* ── SECTION 04 ── */}
        <section className={styles.section} id="s04">
          <SectionHead num="04" title="Labour Costs and the Wage Gap" />

          <div className={styles.sectionSubtitle}>The Bangladesh garment sector</div>
          <p>
            Bangladesh is the world's second-largest garment exporter after China. Its ready-made
            garments sector accounts for approximately 84% of national export earnings, employing
            4–5 million workers, of whom approximately 80% are women.
          </p>

          <table className={styles.dataTable}>
            <thead>
              <tr><th>Metric</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Bangladesh garment minimum wage (2023)</td><td>$113/month (12,500 taka)</td></tr>
              <tr><td>Estimated living wage (Asia Floor Wage, 2022)</td><td>$450/month (53,104 taka)</td></tr>
              <tr className={styles.highlightRow}>
                <td>Gap between minimum wage and living wage</td><td>$337/month (approx. 75%)</td>
              </tr>
              <tr><td>Bangladesh government employee minimum wage</td><td>$182/month</td></tr>
              <tr><td>Workers earning below minimum wage (est.)</td><td>&gt;30% of garment workforce</td></tr>
            </tbody>
          </table>

          <p>
            The minimum wage set in December 2023 represents the first revision since 2018, when
            the rate was 8,000 taka ($96/month). Between 2018 and 2023, real wages in the sector
            fell — the nominal minimum wage was unchanged while inflation eroded purchasing power.
          </p>

          <div className={styles.sectionSubtitle}>The wage gap as an externality</div>
          <p>
            When a garment is sold for £9, the wage paid to the worker who produced it is
            approximately $1–2 (based on reported per-piece rates of $0.04–0.30 per item). The
            difference between this wage and a living wage is not absorbed by the brand or the
            consumer — it is borne by the worker, their family, and their community. This gap is
            a cost of production that is externalised from the market transaction.
          </p>

          <div className={styles.analystNote}>
            <span className={styles.analystNoteLabel}>Analyst note</span>
            The wage gap described here is not simply a distributional issue. It is an efficiency
            issue. If wages reflected the full social cost of labour, the production cost of fast
            fashion garments would be higher, output would be lower, and the market would reach a
            different equilibrium. The gap between actual wages and living wages is one component
            of the divergence between private and social marginal cost.
          </div>
        </section>

        {/* ── SECTION 05 ── */}
        <section className={styles.section} id="s05">
          <SectionHead num="05" title="The Rana Plaza Collapse" />

          <p>
            On the morning of 24 April 2013, a garment factory building in Savar, Bangladesh —
            already flagged by engineers as structurally unsafe — collapsed. The decision to keep
            workers inside was rational within the private cost framework: the factory owners bore
            the cost of pausing production, not the cost of structural failure. That cost was borne
            by the workers.
          </p>

          <div className={styles.attachmentCard}>
            <div className={styles.attachmentMeta}>
              <span className={styles.attachmentType}>Case Attachment</span>
              <span className={styles.attachmentTitle}>The Rana Plaza Collapse</span>
              <span className={styles.attachmentSub}>Savar, Bangladesh · 24 April 2013 · 1,134 deaths · 2,500+ injured</span>
              <span className={styles.attachmentDesc}>
                A detailed account of the events of 23–24 April 2013, the economic logic of the
                decision to send workers into an unsafe building, and a stakeholder analysis of
                who bore the cost and who did not.
              </span>
            </div>
            <button className={styles.attachmentBtn} onClick={() => onOpenModal('rana-plaza')}>
              Open case →
            </button>
          </div>
        </section>

        {/* ── SECTION 06 ── */}
        <section className={styles.section} id="s06">
          <SectionHead num="06" title="Why the Market Does Not Self-Correct" />

          <p>
            A standard argument against intervention in markets with negative externalities is that,
            once information about production conditions becomes available, consumers will adjust
            their behaviour — switching to ethical brands or demanding lower prices. The evidence
            suggests this self-correction argument has not operated effectively in fast fashion.
          </p>

          <div className={styles.sectionSubtitle}>Information asymmetry</div>
          <p>
            Fast fashion supply chains involve multiple tiers of contractors and sub-contractors
            across multiple countries. A brand may contract with a first-tier supplier, who
            sub-contracts to a second-tier facility, who sub-contracts component production to a
            third-tier facility. The brand may have no knowledge of conditions at tiers two and
            three. Consumers have no access to this information and no mechanism to obtain it.
          </p>

          <div className={styles.sectionSubtitle}>Price competition eliminates quality differentiation</div>
          <p>
            In a market where the dominant dynamic is downward pressure on prices, ethical
            production practices — which cost more — become a competitive disadvantage. Brands
            that invest in supply chain auditing, higher wages, or safer facilities face higher
            unit costs and lose market share to competitors who do not. The market structure
            rewards the externalisation of costs, not its internalisation.
          </p>

          <div className={styles.sectionSubtitle}>The Rana Plaza aftermath</div>
          <p>
            Following the 2013 collapse, over 200 brands signed the Accord on Fire and Building
            Safety. Shein — which was operating but smaller in 2013 — was not among them. The
            global fast fashion market continued to grow throughout 2013–2023, reaching a scale
            (Shein: $32.5 billion in revenue in 2023) that dwarfed anything that existed in 2013.
            The market, left to itself, did not correct. It scaled.
          </p>
        </section>

        {/* ── SECTION 07 ── */}
        <section className={styles.section} id="s07">
          <SectionHead num="07" title="Expert Statements" />

          <p>
            Two economists were asked to review this dossier and assess whether the fast fashion
            market constitutes a market failure. Both have access to the same evidence.
          </p>

          <div className={styles.expertCardGrid}>
            <div className={`${styles.expertCard} ${styles.expertCardA}`}>
              <span className={styles.expertCardTag}>Expert Statement A</span>
              <span className={styles.expertCardName}>Dr Priya Mehta</span>
              <span className={styles.expertCardRole}>Senior Economist, Global Markets Institute</span>
              <span className={styles.expertCardExcerpt}>
                "The fast fashion market has delivered extraordinary consumer welfare gains… This is
                what a productively efficient market looks like."
              </span>
              <button className={styles.expertCardBtn} onClick={() => onOpenModal('expert-a')}>
                Read statement →
              </button>
            </div>

            <div className={`${styles.expertCard} ${styles.expertCardB}`}>
              <span className={styles.expertCardTag}>Expert Statement B</span>
              <span className={styles.expertCardName}>Dr Kwame Asante</span>
              <span className={styles.expertCardRole}>Director of Research, Centre for Sustainable Economics</span>
              <span className={styles.expertCardExcerpt}>
                "Dr Mehta's statement is internally consistent. It is also analytically incomplete,
                in a way that matters precisely because of its consistency."
              </span>
              <button className={styles.expertCardBtn} onClick={() => onOpenModal('expert-b')}>
                Read statement →
              </button>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
