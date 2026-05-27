import styles from './FastFashion.module.css'

function Trigger({ num, label, sub, done, onOpen }) {
  return (
    <button
      className={`${styles.trigger} ${done ? styles.triggerDone : ''}`}
      onClick={() => onOpen(num)}
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

export default function CaseDocument({ completedSet, onOpenModal }) {
  const done = (n) => completedSet.has(n)

  return (
    <>
      {/* ── DOCUMENT HEADER ── */}
      <header className={styles.docHeader}>
        <div className={styles.docClassification}>
          Internal Review — Not for External Distribution
        </div>
        <div className={styles.docRef}>CTF-2024-0047-INT · November 2024</div>
        <h1 className={styles.docTitle}>The Price of Fast Fashion</h1>
        <p className={styles.docSubtitle}>
          Market Assessment Correction Request — Fast Fashion Sector
        </p>

        <div className={styles.docMetaRow}>
          <div>
            <span className={styles.docMetaLabel}>File reference</span>
            <span className={styles.docMetaValue}>CTF-2024-0047-INT</span>
          </div>
          <div>
            <span className={styles.docMetaLabel}>Date</span>
            <span className={styles.docMetaValue}>November 2024</span>
          </div>
          <div>
            <span className={styles.docMetaLabel}>Classification</span>
            <span className={styles.docMetaValue}>Internal Review</span>
          </div>
          <div>
            <span className={styles.docMetaLabel}>Prepared for</span>
            <span className={styles.docMetaValue}>Senior Economist, Consumer Markets Division</span>
          </div>
        </div>

        <div className={styles.roleBanner}>
          <span className={styles.roleBannerTo}>To the Reviewing Analyst</span>
          The Consumer Markets Division has prepared a market assessment concluding that the fast
          fashion sector — and Shein in particular — operates with high productive efficiency and
          delivers net consumer welfare gains. The assessment recommends no policy intervention.
          <br /><br />
          I have flagged this assessment for correction. My concern is not with the facts it presents.
          It is with the analytical framework it applies — and, consequently, the question it fails
          to ask.
          <br /><br />
          You have been assigned this review. Your task is to examine the evidence in this dossier
          and prepare a corrected briefing note. The evidence is complete. The question is whether
          the right standard of analysis has been applied.
          <br /><br />
          <em>Dr K. Asante, Director of Research</em>
        </div>
      </header>

      <div className={styles.contentWrap}>

        {/* ── ACTIVITY 1 TRIGGER ── */}
        <Trigger
          num={1}
          sub="Prior Thinking — Before you read"
          label="Record your initial position"
          done={done(1)}
          onOpen={onOpenModal}
        />

        {/* ── § 01 ── */}
        <section className={styles.section} id="s01">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 01</span>
            <h2 className={styles.sectionTitle}>The Market Assessment Under Review</h2>
          </div>

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

        {/* ── ACTIVITY 2 TRIGGER ── */}
        <Trigger
          num={2}
          sub="Activity 02 — Read §01 and §02 first"
          label="Apply the efficiency criteria"
          done={done(2)}
          onOpen={onOpenModal}
        />

        {/* ── § 02 ── */}
        <section className={styles.section} id="s02">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 02</span>
            <h2 className={styles.sectionTitle}>Shein: Production Data and Cost Structure</h2>
          </div>

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

        {/* ── ACTIVITY 3 TRIGGER ── */}
        <Trigger
          num={3}
          sub="Activity 03 — Read §03 and §04 first"
          label="Identify the discontinuity"
          done={done(3)}
          onOpen={onOpenModal}
        />

        {/* ── § 03 ── */}
        <section className={styles.section} id="s03">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 03</span>
            <h2 className={styles.sectionTitle}>Environmental Costs: The Unpriced Account</h2>
          </div>

          <div className={styles.sectionSubtitle}>Carbon emissions</div>
          <p>
            Shein's supply chain generates approximately 6.3 million tonnes of CO₂ equivalent per
            year — an amount comparable to the annual emissions of 180 coal-fired power plants.
            Between 2021 and 2023, Shein's absolute emissions grew by 81%, against revenue growth
            of 43% in the same period. Emissions intensity (per unit of revenue) increased — the
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
            The social cost of carbon — the estimated economic damage caused by one tonne of CO₂
            — ranges from $51 (US federal estimate) to over $1,000 per tonne in high-impact
            scenarios. Using a conservative mid-range estimate of $200 per tonne, Shein's annual
            carbon externality is approximately <strong>$1.26 billion</strong> — against a 2023
            net income of $2 billion. This cost does not appear in any garment's price.
          </p>

          <div className={styles.sectionSubtitle}>Water consumption and pollution</div>
          <p>
            The global fashion industry is the second-largest industrial consumer of water, using
            approximately 79–93 billion cubic metres annually. A single pair of jeans requires
            approximately 7,500 litres of water to produce; a cotton t-shirt approximately 2,700
            litres. Textile dyeing — a core production process in fast fashion — is the world's
            second-largest industrial water polluter. Untreated dye effluent is routinely discharged
            into waterways near production facilities in Bangladesh, China, and Vietnam, with
            documented effects on local water quality, agricultural productivity, and public health.
            These costs are borne by communities proximate to production facilities. They are not
            reflected in the price of the garment.
          </p>

          <div className={styles.sectionSubtitle}>Waste</div>
          <p>
            The fashion industry produces approximately 92 million tonnes of textile waste per year.
            Consumer behaviour in fast fashion is characterised by accelerating turnover: consumers
            now buy 60% more clothing than 15 years ago but keep each item for half as long.
            Approximately 85% of textiles end up in landfill or incineration. The downstream costs
            of waste disposal — landfill space, methane emissions from decomposing textiles,
            incineration pollutants — are borne by municipal governments and local populations, not
            by the firms that produced the garments.
          </p>

          <div className={styles.analystNote}>
            <span className={styles.analystNoteLabel}>Analyst note</span>
            The figures in this section represent costs that are incurred as a consequence of fast
            fashion production and consumption. None of them are priced into the transaction between
            Shein and its customers. The question for the reviewing analyst is what the economic
            term for this is, and what it implies for the allocative efficiency analysis in the
            flagged assessment.
          </div>
        </section>

        {/* ── § 04 ── */}
        <section className={styles.section} id="s04">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 04</span>
            <h2 className={styles.sectionTitle}>Labour Costs and the Wage Gap</h2>
          </div>

          <div className={styles.sectionSubtitle}>The Bangladesh garment sector</div>
          <p>
            Bangladesh is the world's second-largest garment exporter after China. Its ready-made
            garments sector accounts for approximately 84% of national export earnings, employing
            4–5 million workers, of whom approximately 80% are women.
          </p>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Bangladesh garment minimum wage (2023)</td><td>$113/month (12,500 taka)</td></tr>
              <tr><td>Estimated living wage (Asia Floor Wage, 2022)</td><td>$450/month (53,104 taka)</td></tr>
              <tr className={styles.highlightRow}>
                <td>Gap between minimum wage and living wage</td><td>$337/month (approx. 75%)</td>
              </tr>
              <tr><td>Bangladesh government employee minimum wage</td><td>$182/month (15,250 taka)</td></tr>
              <tr><td>Workers earning below minimum wage (est.)</td><td>&gt;30% of garment workforce</td></tr>
            </tbody>
          </table>

          <p>
            The minimum wage set in December 2023 represents the first revision since 2018, when
            the rate was 8,000 taka ($96/month). Between 2018 and 2023, real wages in the sector
            fell — the nominal minimum wage was unchanged while inflation eroded purchasing power.
            By 2022, the 8,000 taka minimum had fallen below the World Bank poverty line for a
            two- to three-person household.
          </p>

          <div className={styles.sectionSubtitle}>The wage gap as an externality</div>
          <p>
            When a garment is sold for £9, the wage paid to the worker who produced it is
            approximately $1–2 (based on reported per-piece rates of $0.04–0.30 per item across
            different production stages). The difference between this wage and a living wage is not
            absorbed by the brand or the consumer — it is borne by the worker, their family, and
            their community, in the form of inadequate housing, nutrition, healthcare, and
            education. This gap between the wage paid and the wage needed for a dignified life is
            a cost of production that is externalised from the market transaction.
          </p>

          <div className={styles.analystNote}>
            <span className={styles.analystNoteLabel}>Analyst note</span>
            The wage gap described here is not simply a distributional issue. It is an efficiency
            issue. If wages reflected the full social cost of labour — including adequate
            compensation for working conditions, health risks, and foregone alternatives — the
            production cost of fast fashion garments would be higher, output would be lower, and
            the market would reach a different equilibrium. The gap between actual wages and living
            wages is one component of the divergence between private and social marginal cost.
          </div>
        </section>

        {/* ── ACTIVITY 4 TRIGGER ── */}
        <Trigger
          num={4}
          sub="Activity 04 — Read §05 and §06 first"
          label="Analyse the mechanism"
          done={done(4)}
          onOpen={onOpenModal}
        />

        {/* ── § 05 ── */}
        <section className={styles.section} id="s05">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 05</span>
            <h2 className={styles.sectionTitle}>The Rana Plaza Collapse: A Case Study in Externalised Cost</h2>
          </div>

          <div className={styles.sectionSubtitle}>Savar, Bangladesh — 23–24 April 2013</div>
          <p>
            Rana Plaza was an eight-storey commercial building in Savar, a suburb of Dhaka, housing
            five garment factories. The factories produced clothing for a range of western brands
            including Primark, Mango, Benetton, and Walmart. The building had been illegally
            extended from its original four-storey design. The additional floors were constructed
            without engineering approval, using materials and methods not rated for the load of
            industrial machinery.
          </p>

          <div className={styles.ranaTimestamp}>23 April 2013</div>
          <p>
            Structural engineers identified significant cracks throughout the building's columns
            and walls. The shops and bank on the lower floors immediately closed and sent their
            staff home. Factory managers on the upper floors were informed. Workers requested to
            leave. Factory managers, under pressure to meet production schedules, assessed the
            damage as non-critical and instructed workers to return to their posts.
          </p>

          <div className={styles.ranaTimestamp}>24 April 2013, 05:00–08:00 a.m.</div>
          <p>
            Workers gathered outside the building in the early morning, many visibly distressed.
            Some refused to enter. Witnesses report that supervisors threatened workers with loss
            of a month's wages — approximately $36 at the then-current minimum wage — if they did
            not return to work. Workers who could not afford to lose the income complied.
          </p>

          <div className={styles.ranaTimestamp}>08:57 a.m.</div>
          <p>
            The building's generators, switched on when local power failed — a routine occurrence
            in Savar — created vibration loads the compromised structure could not sustain. Rana
            Plaza collapsed in under two minutes.
          </p>

          <p>
            <strong>Deaths: 1,134. Injured: more than 2,500.</strong>
          </p>

          <div className={styles.sectionSubtitle}>Economic context of the decision</div>
          <p>
            The decision made on the morning of 24 April — to send workers into a building that
            engineers had assessed as unsafe — was rational from the perspective of the factory
            owners. The cost of pausing production was immediate and certain (lost revenue, missed
            shipment deadlines, potential contract termination by brand buyers). The cost of the
            structural risk was uncertain and, in the event of collapse, would be borne primarily
            by the workers — not by the factory owners, not by the brand buyers, and not by the
            consumers who had purchased the garments those workers had made.
          </p>
          <p>
            This is the logic of externalised cost made explicit. The market transaction between
            Shein's suppliers and their buyers does not create any mechanism by which the risk of
            unsafe construction is priced into the garment. The party bearing the risk — the worker
            — is not a party to the transaction.
          </p>

          <table className={styles.stakeTable}>
            <thead>
              <tr>
                <th>Stakeholder</th>
                <th>Benefit from the transaction</th>
                <th>Cost borne</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Brand buyer</td>
                <td>Low unit cost, fast delivery</td>
                <td>Reputational risk (uncertain)</td>
              </tr>
              <tr>
                <td>Factory owner</td>
                <td>Contract revenue</td>
                <td>Minimal — risk borne by workers</td>
              </tr>
              <tr>
                <td>Consumer</td>
                <td>Low retail price</td>
                <td>None</td>
              </tr>
              <tr>
                <td>Worker</td>
                <td>Wage (below living wage)</td>
                <td>Structural risk, health risk, wage penalty for refusal</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── § 06 ── */}
        <section className={styles.section} id="s06">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 06</span>
            <h2 className={styles.sectionTitle}>Why the Market Does Not Self-Correct</h2>
          </div>

          <div className={styles.sectionSubtitle}>The consumer sovereignty argument and its limits</div>
          <p>
            A standard argument against intervention in markets with negative externalities is that,
            once information about production conditions becomes available, consumers will adjust
            their behaviour: they will demand ethical sourcing, switch to brands with better supply
            chain practices, or discount the products of brands associated with harm. This is the
            self-correction argument.
          </p>
          <p>
            The evidence suggests it has not operated effectively in fast fashion, for three
            structural reasons.
          </p>

          <div className={styles.sectionSubtitle}>Information asymmetry</div>
          <p>
            The supply chains of fast fashion firms involve multiple tiers of contractors and
            sub-contractors across multiple countries. A brand may contract with a first-tier
            supplier, who sub-contracts to a second-tier facility, who sub-contracts component
            production to a third-tier facility. The brand may have no knowledge of conditions at
            tiers two and three. Consumers have no access to this information and no mechanism to
            obtain it. The information required for consumer sovereignty to function is not available.
          </p>

          <div className={styles.sectionSubtitle}>Price competition eliminates quality differentiation</div>
          <p>
            In a market where the dominant dynamic is downward pressure on prices, ethical
            production practices — which cost more — become a competitive disadvantage. Brands
            that invest in supply chain auditing, higher wages, or safer facilities face higher unit
            costs and lose market share to competitors who do not. The market structure rewards the
            externalisation of costs, not its internalisation.
          </p>

          <div className={styles.sectionSubtitle}>The Rana Plaza aftermath</div>
          <p>
            Following the 2013 collapse, over 200 brands signed the Accord on Fire and Building
            Safety, committing to factory safety inspections. Shein — which was operating but
            smaller in 2013 — was not among them. The global fast fashion market continued to grow
            throughout the period 2013–2023, reaching a scale in 2023 (with Shein generating
            $32.5 billion in revenue) that dwarfed anything that existed in 2013. The market, left
            to itself, did not correct. It scaled.
          </p>
        </section>

        {/* ── ACTIVITY 5 TRIGGER ── */}
        <Trigger
          num={5}
          sub="Activity 05 — Read §07 first"
          label="Evaluate the expert positions"
          done={done(5)}
          onOpen={onOpenModal}
        />

        {/* ── § 07 ── */}
        <section className={styles.section} id="s07">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCode}>§ 07</span>
            <h2 className={styles.sectionTitle}>Expert Statements</h2>
          </div>

          <div className={`${styles.expertBlock} ${styles.expertBlockA}`}>
            <span className={`${styles.expertTag} ${styles.expertTagA}`}>Statement A</span>
            <span className={styles.expertName}>Dr Priya Mehta</span>
            <span className={styles.expertRole}>Senior Economist, Global Markets Institute</span>
            <div className={styles.expertBody}>
              <p>
                The case for market intervention in fast fashion rests on an implicit assumption
                that the market is failing consumers. The evidence does not support this. UK
                clothing prices, in real terms, are substantially lower today than they were twenty
                years ago. Consumers at every income level — but particularly those on lower
                incomes, for whom clothing represented a meaningful share of household expenditure
                — are materially better off. They have access to a wider range of styles, more
                frequently renewed, at prices that were unimaginable in the 1990s. This is what a
                productively efficient market looks like.
              </p>
              <p>
                The arguments about externalities are not wrong, but they are not the right basis
                for a conclusion that the market is failing. Carbon emissions from the fashion
                industry are a real problem — but they are a problem shared across many industries,
                and the solution is economy-wide carbon pricing, not selective intervention in
                fashion. Labour conditions in Bangladesh are improving: the minimum wage was raised
                by 56% in 2023. The Accord on Fire and Building Safety has made Bangladeshi
                factories significantly safer. Markets can and do respond to pressure.
              </p>
              <p>
                To describe a market that has reduced prices, increased access, and generated
                employment for millions in emerging economies as a "market failure" requires a much
                higher evidential bar than this dossier provides.
              </p>
            </div>
          </div>

          <div className={`${styles.expertBlock} ${styles.expertBlockB}`}>
            <span className={`${styles.expertTag} ${styles.expertTagB}`}>Statement B</span>
            <span className={styles.expertName}>Dr Kwame Asante</span>
            <span className={styles.expertRole}>Director of Research, Centre for Sustainable Economics</span>
            <div className={styles.expertBody}>
              <p>
                Dr Mehta's statement is internally consistent. It is also analytically incomplete,
                in a way that matters precisely because of its consistency.
              </p>
              <p>
                The condition for allocative efficiency is not P&nbsp;≈&nbsp;MPC. It is
                P&nbsp;=&nbsp;SMC. Social marginal cost includes all costs of production — not only
                those borne by the producing firm. This dossier presents data on several categories
                of cost that are not reflected in the retail price of fast fashion garments: carbon
                emissions (approximately $1.26 billion per year in social cost for Shein alone,
                using conservative carbon pricing), water pollution, textile waste disposal, and a
                wage structure in which the gap between the minimum wage and a living wage in
                Bangladesh amounts to approximately $337 per worker per month. None of these costs
                appear in the price of a garment.
              </p>
              <p>
                This is not a point about values or distribution. It is a point about prices. When
                P&nbsp;&lt;&nbsp;SMC, the price signal that guides resource allocation in a market
                economy is giving the wrong signal. Consumers are buying more fast fashion than they
                would if the price reflected what the production actually costs society. Resources
                are being over-allocated to this market. That is the definition of allocative
                inefficiency. And it is the definition of market failure.
              </p>
              <p>
                Dr Mehta is right that productive efficiency has been achieved. She is wrong to
                treat this as sufficient for a conclusion that the market is working well. The
                original assessment made the same error. That is why this review was requested.
              </p>
            </div>
          </div>
        </section>

        {/* ── ACTIVITY 6 TRIGGER ── */}
        <Trigger
          num={6}
          sub="Activity 06 — Draws on all sections"
          label="Write the corrected briefing note"
          done={done(6)}
          onOpen={onOpenModal}
        />

      </div>
    </>
  )
}
