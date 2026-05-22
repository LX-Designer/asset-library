import { useState } from 'react'
import styles from './index.module.css'
import {
  ProductiveEfficiencyDiagram,
  AllocativeEfficiencyDiagram,
  DynamicEfficiencyDiagram,
} from './diagrams.jsx'

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────

const STEP_ORDER = [
  'opening-prior-position',
  'm1-market-functioning',
  'm2-productive-efficiency',
  'm2-allocative-efficiency',
  'm2-dynamic-efficiency',
  'm3-subsidy-position',
  'm3-pareto-application',
  'm3-pareto-limitations',
  'm4-scenario-a',
  'm4-scenario-b',
  'm4-scenario-c',
  'closing-reflection',
]

const SCREEN_FOR_STEP = {
  'opening-prior-position':   'opening',
  'm1-market-functioning':    'm1',
  'm2-productive-efficiency': 'm2a',
  'm2-allocative-efficiency': 'm2b',
  'm2-dynamic-efficiency':    'm2c',
  'm3-subsidy-position':      'm3a',
  'm3-pareto-application':    'm3b',
  'm3-pareto-limitations':    'm3c',
  'm4-scenario-a':            'm4a',
  'm4-scenario-b':            'm4b',
  'm4-scenario-c':            'm4c',
  'closing-reflection':       'closing',
}

const MOVEMENT_FOR_SCREEN = {
  opening: null,
  m1: 1,
  m2a: 2, m2b: 2, m2c: 2,
  m3a: 3, m3b: 3, m3c: 3,
  m4a: 4, m4b: 4, m4c: 4,
  closing: null,
}

const NEXT_SCREEN = {
  opening: 'm1',
  m1: 'm2a',
  m2a: 'm2b',
  m2b: 'm2c',
  m2c: 'm3a',
  m3a: 'm3b',
  m3b: 'm3c',
  m3c: 'm4a',
  m4a: 'm4b',
  m4b: 'm4c',
  m4c: 'closing',
  closing: null,
}

const STEP_FOR_SCREEN = {
  opening: 'opening-prior-position',
  m1:      'm1-market-functioning',
  m2a:     'm2-productive-efficiency',
  m2b:     'm2-allocative-efficiency',
  m2c:     'm2-dynamic-efficiency',
  m3a:     'm3-subsidy-position',
  m3b:     'm3-pareto-application',
  m3c:     'm3-pareto-limitations',
  m4a:     'm4-scenario-a',
  m4b:     'm4-scenario-b',
  m4c:     'm4-scenario-c',
  closing: 'closing-reflection',
}

const NO_FEEDBACK_STEPS = new Set([
  'opening-prior-position',
  'm3-subsidy-position',
  'closing-reflection',
])

const SYSTEM_PROMPTS = {
  'm1-market-functioning': `You are an economics tutor evaluating a student's response to a task about market functioning. The student was asked to argue both sides — that the Nexavir pharmaceutical market is functioning correctly and that it is not — and then state which they find more persuasive.

Evaluate their response across three dimensions:
1. Did they identify relevant evidence from the scenario for both sides?
2. Did they reason economically (even without formal concepts yet) rather than just morally?
3. Is their stated position supported by their own arguments?

Give specific, substantive feedback. Tell them what an economist would notice in their response that is strong, and what an economist would push back on. Do not give them the 'answer'. Do not introduce formal economic concepts yet — they will encounter those in the next section. Keep your response to 150-200 words. Write in clear, direct prose — no bullet points.`,

  'm2-productive-efficiency': `You are an economics tutor. A Cambridge A-Level student has applied the concept of productive efficiency to a pharmaceutical market case.

Evaluate whether they have: correctly understood and defined productive efficiency; applied it accurately to the evidence provided; and — most importantly — recognised that productive efficiency is a narrow concept that says nothing about whether the price or quantity is socially optimal.

The key insight you want to surface if they haven't: a firm can be productively efficient and still charge a price that excludes most consumers. Productive efficiency is about HOW goods are produced, not WHETHER the right quantity reaches the right people.

Give specific feedback on their response. 150 words maximum. No bullet points.`,

  'm2-allocative-efficiency': `You are an economics tutor. A Cambridge A-Level student has analysed allocative efficiency in a pharmaceutical market.

Strong responses will: correctly identify that P > MC signals allocative inefficiency; identify the excluded consumers as the key harm; recognise that allocative efficiency (P = MC) would mean pricing at $180, which would make R&D cost recovery impossible — creating a genuine tension between static and dynamic efficiency.

Weaker responses will: correctly identify the P > MC condition but not think about who is excluded; or argue the market is efficient because all units are sold.

Give specific feedback. If they have spotted the tension with dynamic efficiency before you've introduced it, acknowledge that explicitly — it's sophisticated thinking. 150-200 words. No bullet points.`,

  'm2-dynamic-efficiency': `You are an economics tutor. A Cambridge A-Level student has written a summary of the efficiency of a pharmaceutical market across three efficiency concepts.

This is a synthesis task. Evaluate whether they have: addressed all three concepts accurately; identified the genuine conflict between allocative and dynamic efficiency; avoided the temptation to declare the market simply 'efficient' or 'inefficient' without qualification.

The strongest responses will hold the tension rather than resolving it prematurely — acknowledging that the market is productively efficient, allocatively inefficient, but that the allocative inefficiency may be the necessary cost of dynamic efficiency.

This maps directly to Cambridge AO3 evaluation skills. Tell them explicitly if their response demonstrates evaluation rather than just description.

200 words maximum. No bullet points.`,

  'm3-pareto-application': `You are an economics tutor. A Cambridge A-Level student has applied Pareto optimality to a pharmaceutical market case.

The key analytical moves you are looking for:
- Situation A (current market): This IS likely Pareto optimal. You cannot make unaffordable-patients better off (give them the drug) without making Veridian worse off (reducing their revenue) or taxpayers worse off (funding a subsidy). The student should reach this conclusion and find it uncomfortable.
- Situation B (with subsidy): The subsidy makes excluded patients better off but makes levy-payers worse off. It is therefore NOT a Pareto improvement from Situation A — it fails the Pareto criterion.
- The reveal: the current situation, in which people die from a preventable illness, may be Pareto optimal. This is the conceptual shock.

Many students will resist this conclusion or get confused. Acknowledge the difficulty explicitly. Confirm their analysis if correct. If they've avoided the uncomfortable conclusion, point them toward it directly but without mockery.

Tell them: if their analysis is right, what does that imply about Pareto optimality as a framework for policy decisions?

200 words. No bullet points.`,

  'm3-pareto-limitations': `You are an economics tutor evaluating a Cambridge A-Level student's critical evaluation of the Pareto optimality framework.

This is a pure AO3 task — Cambridge's highest-order assessment objective. You are looking for:

1. Recognition that Pareto optimality takes the existing distribution of income and wealth as given — it asks whether improvement is possible FROM HERE, not whether HERE is just or desirable.
2. Recognition that the framework is morally neutral — it cannot distinguish between a situation that is optimal-and-just and one that is optimal-and-monstrous.
3. A maintained or revised position that is consistent with the student's own reasoning — you are not marking them on which side they take, only on whether their position follows from their argument.

Strong responses will explicitly name the normative assumption embedded in Pareto (that the status quo distribution is the baseline) and identify this as the key limitation.

This is sophisticated work for A-Level. Tell them directly if they have achieved genuine evaluation here. 200-250 words. No bullet points.`,

  'm4-scenario-a': `You are an economics tutor. A Cambridge A-Level student has analysed a congestion/externality case.

You are looking for:
- Identification of negative externality (each driver imposes costs — congestion, pollution, health impacts — on others who did not choose to bear them)
- The mechanism: private cost of driving (petrol, time, wear) does not include the external cost imposed on others; therefore the market (road use) is over-consumed relative to the social optimum
- Identification of who bears unchosen costs: other drivers, businesses, residents, future patients
- Ideally: mention of the divergence between marginal private cost and marginal social cost

Stronger responses will also note this is a public good / common resource problem — roads are non-excludable and rival at peak times, leading to the tragedy of the commons dynamic.

If they identify only one dimension (e.g. pollution but not congestion, or congestion but not the externality mechanism), point them to what they missed.

150-200 words. No bullet points.`,

  'm4-scenario-b': `You are an economics tutor. A Cambridge A-Level student has analysed an education market failure case.

This case involves merit goods and positive externalities. You are looking for:

- Recognition that education generates positive externalities: benefits to society (higher productivity, lower crime, stronger civic institutions) that the individual student cannot capture or be compensated for
- Because of these uncaptured external benefits, the private market undersupplies education relative to the social optimum — individuals invest up to the point where private benefit equals private cost, but this is less than the socially optimal quantity
- Merit good dimension: education is under-consumed relative to what is socially desirable, partly due to imperfect information (families may not fully appreciate long-term returns) and partly due to inability to pay
- The GDP calculation in the scenario is a proxy for the positive externality — it shows that the social return exceeds the private return

Weaker responses will say 'it's a market failure because poor people can't afford it' — this is insufficient. Push them toward the externality mechanism.

Some students may argue it is NOT a market failure — that the market is simply reflecting ability to pay, which is an allocatively efficient outcome given the income distribution. This is technically defensible. Acknowledge it but ask them to evaluate the assumption it rests on (that the income distribution is given and just — connecting back to Movement 3).

200 words. No bullet points.`,

  'm4-scenario-c': `You are an economics tutor. A Cambridge A-Level student has analysed a social media market failure case. This is the most complex scenario and requires synthesis.

You are looking for application of multiple concepts:

1. Information asymmetry / imperfect information: users do not know the extent to which the platform is engineered to maximise compulsive use, or the full costs to their wellbeing. This undermines the 'revealed preference' argument — choice is only a valid signal of preference when the chooser has adequate information.

2. Negative externality / demerit good: the platform may be over-consumed relative to what users would choose with full information. The 'product' being sold is user attention and data — users are not the customer, they are the resource. This inverts normal market logic.

3. The price signal problem: because the price is zero, conventional efficiency analysis breaks down. There is no price mechanism to signal over or under consumption. This is a structural feature of the market, not an incidental one.

4. Possible public good / common pool dimensions: attention is rivalrous (finite) and the platform extracts it — this is closer to a common pool resource problem than a standard goods market.

Strongest responses will note that the company's revealed preference argument fails specifically because of information asymmetry — users cannot reveal true preferences about costs they cannot observe.

If a student applies only one concept adequately, acknowledge it and point to what else is available. 200-250 words. No bullet points.`,
}

// ─────────────────────────────────────────────────────────────────
// STATE INITIALISATION
// ─────────────────────────────────────────────────────────────────

function computeInitialScreen(savedResponses) {
  for (const stepId of STEP_ORDER) {
    if (!savedResponses[stepId]) return SCREEN_FOR_STEP[stepId]
  }
  return 'closing'
}

// ─────────────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <span className={styles.loadingDots} aria-hidden="true">
      <span /><span /><span />
    </span>
  )
}

function ProgressBar({ movement }) {
  return (
    <div className={styles.progressBar} role="status" aria-label={`Movement ${movement} of 4`}>
      <div className={styles.progressLabel}>Movement {movement} of 4</div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${movement * 25}%` }} />
      </div>
    </div>
  )
}

function TaskPrompt({ children }) {
  return (
    <div className={styles.taskPrompt}>
      <span className={styles.taskLabel}>Your task</span>
      <div className={styles.taskText}>{children}</div>
    </div>
  )
}

function FeedbackPanel({ loading, error, text }) {
  if (!loading && !error && !text) return null
  return (
    <div className={styles.feedback} aria-live="polite">
      {loading && (
        <div className={styles.feedbackLoading}>
          Analysing your response <LoadingDots />
        </div>
      )}
      {!loading && error && (
        <p className={styles.feedbackError}>
          Feedback is temporarily unavailable. Continue when you're ready.
        </p>
      )}
      {!loading && text && (
        <>
          <span className={styles.feedbackLabel}>Analysis</span>
          <p className={styles.feedbackText}>{text}</p>
        </>
      )}
    </div>
  )
}

function ExpandableDoc({ title, docRef, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.docItem}>
      <button
        className={styles.docToggle}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <div className={styles.docToggleRight}>
          {docRef && <span className={styles.docRef}>{docRef}</span>}
          <span className={styles.docToggleIcon}>{open ? '−' : '+'}</span>
        </div>
      </button>
      {open && <div className={styles.docContent}>{children}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function EconEfficiency({ onResponse, onComplete, savedResponses }) {
  const saved = savedResponses ?? {}

  const [screen, setScreen] = useState(() => computeInitialScreen(saved))
  const [texts, setTexts] = useState({})
  const [submitted, setSubmitted] = useState(() => {
    const s = {}
    for (const stepId of STEP_ORDER) {
      if (saved[stepId] != null) s[stepId] = saved[stepId]
    }
    return s
  })
  const [feedbacks, setFeedbacks] = useState({})
  const [feedbackLoading, setFeedbackLoading] = useState({})
  const [feedbackError, setFeedbackError] = useState({})

  function setText(stepId, val) {
    setTexts(prev => ({ ...prev, [stepId]: val }))
  }

  function canContinue(stepId) {
    if (!submitted[stepId]) return false
    if (NO_FEEDBACK_STEPS.has(stepId)) return true
    return !!feedbacks[stepId] || !!feedbackError[stepId]
  }

  async function callAI(stepId, userText) {
    setFeedbackLoading(prev => ({ ...prev, [stepId]: true }))
    setFeedbackError(prev => ({ ...prev, [stepId]: false }))
    try {
      const res = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPTS[stepId], userMessage: userText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'API error')
      setFeedbacks(prev => ({ ...prev, [stepId]: data.text }))
    } catch {
      setFeedbackError(prev => ({ ...prev, [stepId]: true }))
    } finally {
      setFeedbackLoading(prev => ({ ...prev, [stepId]: false }))
    }
  }

  async function handleSubmit(stepId) {
    const text = (texts[stepId] ?? '').trim()
    if (!text) return
    await onResponse(stepId, text)
    setSubmitted(prev => ({ ...prev, [stepId]: text }))

    if (stepId === 'opening-prior-position') {
      setScreen('m1')
    } else if (stepId === 'm3-subsidy-position') {
      setScreen('m3b')
    } else if (stepId === 'closing-reflection') {
      await onComplete(null, { asset: 'econ-73-efficiency' })
    } else {
      callAI(stepId, text)
    }
  }

  function handleContinue() {
    const next = NEXT_SCREEN[screen]
    if (next) setScreen(next)
  }

  // Standard step: textarea when not submitted, read-only + feedback + continue when done
  function renderStep(stepId, continueLabel) {
    const done = !!submitted[stepId]
    const text = texts[stepId] ?? ''

    if (!done) {
      return (
        <div>
          <label htmlFor={`ta-${stepId}`} className={styles.textareaLabel}>Your response</label>
          <textarea
            id={`ta-${stepId}`}
            className={styles.textarea}
            value={text}
            onChange={e => setText(stepId, e.target.value)}
            placeholder="Write your response here…"
            rows={7}
          />
          <button
            className={styles.btn}
            onClick={() => handleSubmit(stepId)}
            disabled={!text.trim()}
          >
            Submit
          </button>
        </div>
      )
    }

    return (
      <>
        <div className={styles.submittedResponse}>{submitted[stepId]}</div>
        <FeedbackPanel
          loading={!!feedbackLoading[stepId]}
          error={!!feedbackError[stepId]}
          text={feedbacks[stepId]}
        />
        {canContinue(stepId) && (
          <button className={`${styles.btn} ${styles.btnContinue}`} onClick={handleContinue}>
            {continueLabel ?? 'Continue'}
          </button>
        )}
      </>
    )
  }

  const movement = MOVEMENT_FOR_SCREEN[screen]

  // ─── OPENING ───────────────────────────────────────────────────

  if (screen === 'opening') {
    const stepId = 'opening-prior-position'
    const text = texts[stepId] ?? ''
    return (
      <div className={styles.root}>
        <div className={styles.fullscreen}>
          <div className={styles.fullscreenInner}>
            <p className={styles.openingQuestion}>
              "You need medication to survive. The company that makes it charges $50,000 per dose.
              You cannot afford it. The company sells every dose it produces. Is anything wrong here
              — and if so, what?"
            </p>
            <label htmlFor="ta-opening" className={styles.fullscreenLabel}>
              Your initial position
            </label>
            <textarea
              id="ta-opening"
              className={`${styles.textarea} ${styles.textareaDark}`}
              value={text}
              onChange={e => setText(stepId, e.target.value)}
              rows={6}
            />
            <p className={styles.fullscreenHelper}>
              Write freely. There is no correct answer yet. You will return to this at the end.
            </p>
            <button
              className={`${styles.btn} ${styles.btnInverted}`}
              onClick={() => handleSubmit(stepId)}
              disabled={!text.trim()}
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 1 ────────────────────────────────────────────────

  if (screen === 'm1') {
    const stepId = 'm1-market-functioning'
    return (
      <div className={styles.root}>
        <ProgressBar movement={1} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 1</p>
          <h2 className={styles.sectionTitle}>The Market Working</h2>

          <div className={styles.narrative}>
            <p>You have just been appointed as an economist at a government health ministry. On your first week, a policy brief lands on your desk: the ministry has been asked to evaluate whether the market for Nexavir — a treatment for a rare genetic condition called Harmon Syndrome — is functioning correctly.</p>
            <p>Nexavir was developed by Veridian Pharmaceuticals over twelve years at a cost of $2.1 billion in research and development. The company holds a twenty-year patent on the drug, with fourteen years still remaining. Harmon Syndrome affects approximately 8,400 patients globally — a small but devastated population with no alternative treatment available.</p>
            <p>At the current price of $50,000 per annual course of treatment, Veridian sells every unit it produces. The company's marginal cost of production is approximately $180 per course. In raw terms, the market appears to clear: supply meets demand at the prevailing price. But not everyone is satisfied.</p>
            <p>A patient advocacy group — the Harmon Syndrome Patient Alliance — has written to the ministry describing the price as "a moral obscenity." Veridian's CEO has responded publicly, arguing that without the ability to recover research and development costs, the drug would never have been developed in the first place. You must now evaluate who, if either, is right.</p>
          </div>

          <div className={styles.docList}>
            <ExpandableDoc title="Ministry Market Data Summary" docRef="MIN/MKT/001">
              <table className={styles.dataTable}>
                <thead>
                  <tr><th>Metric</th><th>Value</th></tr>
                </thead>
                <tbody>
                  <tr><td>Units produced annually</td><td>8,400</td></tr>
                  <tr><td>Units sold annually</td><td>8,400</td></tr>
                  <tr><td>Price per annual course</td><td>$50,000</td></tr>
                  <tr><td>Marginal cost per course</td><td>$180</td></tr>
                  <tr><td>Patent years remaining</td><td>14</td></tr>
                </tbody>
              </table>
            </ExpandableDoc>

            <ExpandableDoc title="Letter from the Harmon Syndrome Patient Alliance" docRef="HSA/PAT/002">
              <p>We write to you as advocates for the 8,400 individuals and families living with Harmon Syndrome worldwide. The current pricing of Nexavir — at $50,000 per annual course — has effectively created a two-tier system of survival: one for those fortunate enough to live in countries with funded reimbursement schemes or the personal wealth to afford treatment, and another for the majority of patients in low- and middle-income countries who have no access whatsoever.</p>
              <p>We do not dispute that pharmaceutical development requires significant investment. What we dispute is the principle that human need should be subordinate to ability to pay. A market that clears at a price that excludes the majority of patients who need the drug is not, in any meaningful sense, a market that is working. It is a market that is rationing survival. We urge the ministry to consider what it means for a market to "function correctly" when the outcome is preventable death.</p>
            </ExpandableDoc>

            <ExpandableDoc title="Statement from the CEO of Veridian Pharmaceuticals" docRef="VER/CEO/003">
              <p>Veridian Pharmaceuticals invested $2.1 billion over twelve years to bring Nexavir to patients. That investment was made in full knowledge that the market for Harmon Syndrome treatments is small — fewer than 9,000 patients globally. The only reason that investment was made at all is that our patent allows us to price the drug in a way that makes the R&D economically viable. Without that pricing freedom, Nexavir would not exist. Patients who receive treatment today do so because of the incentive structures that our critics wish to dismantle.</p>
              <p>Veridian reinvests 40% of its revenues into further R&D, including ongoing research into rare and neglected diseases. The alternative to our model is not cheaper drugs — it is no drugs. Governments and advocacy groups are entitled to their views, but any policy that undermines the commercial logic of pharmaceutical innovation will have consequences for patients that extend far beyond Nexavir. We would ask the ministry to weigh those consequences carefully before pursuing regulatory intervention.</p>
            </ExpandableDoc>
          </div>

          <TaskPrompt>
            <p>Using only the information provided, make the case that this market is functioning correctly. Then make the case that it is not. Which case do you find more persuasive, and why?</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to Movement 2')}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 2A — Productive Efficiency ───────────────────────

  if (screen === 'm2a') {
    const stepId = 'm2-productive-efficiency'
    return (
      <div className={styles.root}>
        <ProgressBar movement={2} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 2 — What Does Working Mean?</p>
          <h2 className={styles.sectionTitle}>2A: Productive Efficiency</h2>

          <div className={styles.narrative}>
            <p>The ministry has asked you to apply formal economic analysis. Economists use specific frameworks to evaluate whether markets are producing the right outcomes. You will now work through three of them — each one a different lens on the same market.</p>
            <p>We begin with productive efficiency. A firm is productively efficient when it produces its output at the lowest possible average cost — technically, when it operates on the long-run average cost curve at the point where average cost is minimised. What this means in practice is that no resources are being wasted: inputs are fully utilised, processes are as lean as they can be, and there is no slack in the system.</p>
            <p>To assess productive efficiency, we ask a specific question: is the firm producing at the minimum point of its average cost curve? If average costs could be reduced by reorganising production, by adopting better technology, or by eliminating internal waste (what economists call X-inefficiency), then the firm is not productively efficient. It is using more resources than it needs to produce what it produces.</p>
            <p>Productive efficiency says nothing about the price charged to consumers, nor about whether the right quantity is reaching the right people. It is a narrow technical concept about how goods are produced, not whether the right amount of them is produced at the right price. Keeping that boundary in mind matters for what follows.</p>
            <p>New information from the ministry's research team: Veridian operates two manufacturing facilities running at 94% capacity. Independent analysis suggests their average cost per unit is approximately $12,400 — close to the industry minimum for this type of biologic drug. There is no evidence of significant X-inefficiency in their operations.</p>
          </div>

          <ProductiveEfficiencyDiagram />

          <TaskPrompt>
            <p>Apply the concept of productive efficiency to the Nexavir market. Is Veridian productively efficient? What evidence supports your conclusion? Does productive efficiency tell us whether the market is working well for society?</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to 2B')}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 2B — Allocative Efficiency ───────────────────────

  if (screen === 'm2b') {
    const stepId = 'm2-allocative-efficiency'
    return (
      <div className={styles.root}>
        <ProgressBar movement={2} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 2 — What Does Working Mean?</p>
          <h2 className={styles.sectionTitle}>2B: Allocative Efficiency</h2>

          <div className={styles.narrative}>
            <p>Productive efficiency tells us whether a firm is producing without waste. But a firm can eliminate every inefficiency in its operations and still produce the wrong quantity, at the wrong price, distributed to the wrong people. For that, we need a different concept: allocative efficiency.</p>
            <p>A market is allocatively efficient when resources are directed to their highest-valued uses — when the goods produced are the goods that people most want, in the quantities they most want them. Economists have a precise condition for this: allocative efficiency occurs when price equals marginal cost (P = MC). At this point, the cost to society of producing one more unit exactly equals the value that consumers place on it. Below that quantity, there are consumers who value the good more than it costs to produce — gains that go unrealised. Above it, resources are being used to produce units that cost more than they're worth.</p>
            <p>Think about who is not in the market. Allocative efficiency is as much about the excluded as about those who transact. Every person who would willingly pay more than the marginal cost to produce a good, but cannot or will not pay the market price, represents a gap between private and social value — a source of what economists call deadweight loss.</p>
            <p>Consider the Nexavir figures directly. Veridian's price is $50,000. Its marginal cost is $180. The gap is $49,820. There are patients — potentially many of them — who would willingly pay more than $180 for treatment but cannot afford $50,000. They are entirely excluded from this market. They receive no treatment. From a purely allocative standpoint, this gap matters enormously.</p>
          </div>

          <AllocativeEfficiencyDiagram />

          <TaskPrompt>
            <p>Is the Nexavir market allocatively efficient? Show your reasoning. Who is harmed by allocative inefficiency in this case, and how? What would allocative efficiency actually look like here — and would it be desirable?</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to 2C')}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 2C — Dynamic Efficiency ──────────────────────────

  if (screen === 'm2c') {
    const stepId = 'm2-dynamic-efficiency'
    return (
      <div className={styles.root}>
        <ProgressBar movement={2} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 2 — What Does Working Mean?</p>
          <h2 className={styles.sectionTitle}>2C: Dynamic Efficiency</h2>

          <div className={styles.narrative}>
            <p>Both productive and allocative efficiency are static concepts — they ask whether a market is working well at a given moment in time. But markets also operate across time. Dynamic efficiency asks whether an economy is producing the right amount of innovation, improvement, and new development over the long run.</p>
            <p>The key mechanism is profit as incentive. When firms expect to profit from innovation — from developing new products, new processes, new treatments — they invest. When profit is absent or uncertain, investment falls. This is why patents exist: not to reward firms for past innovation, but to create the expectation of future profit that makes risky, expensive innovation worthwhile in the first place. A patent is a deliberate grant of temporary monopoly power in exchange for the knowledge disclosed and the innovation delivered.</p>
            <p>This creates a fundamental dilemma. Allocative efficiency requires P = MC. But for a pharmaceutical firm that has spent $2.1 billion developing a drug, pricing at marginal cost means pricing at $180 — a price that recovers production costs but recovers nothing of the research investment. No rational firm invests $2.1 billion in drug development if it expects to earn $180 per unit. The patent and the high price are not incidental to the drug's existence. They may be constitutive of it. You cannot simultaneously have a drug priced at marginal cost and the incentive system that produced the drug. Something has to give.</p>
          </div>

          <DynamicEfficiencyDiagram />

          <TaskPrompt>
            <p>Having now considered all three efficiency concepts, write a paragraph that an economist might write summarising the efficiency of the Nexavir market. Your summary must address all three concepts and acknowledge where they conflict with each other.</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to Movement 3')}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 3A — Subsidy Position ────────────────────────────

  if (screen === 'm3a') {
    const stepId = 'm3-subsidy-position'
    const done = !!submitted[stepId]
    const text = texts[stepId] ?? ''
    return (
      <div className={styles.root}>
        <ProgressBar movement={3} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 3 — The Pareto Problem</p>
          <h2 className={styles.sectionTitle}>Commit to a Position</h2>

          <div className={styles.narrative}>
            <p>The ministry has received a formal proposal. A charitable foundation has offered to fund a subsidy program that would make Nexavir available to all 8,400 patients globally who need it, regardless of ability to pay. The program would cost $420 million annually, funded by a levy on pharmaceutical company revenues. Veridian has confirmed they would maintain their current price — they will not reduce it. The full cost of the subsidy falls on the levy.</p>
            <p>Before you encounter the analytical framework that will be introduced next, you are asked to state your position.</p>
          </div>

          <TaskPrompt>
            <p>Should the ministry support this proposal? Make your case. Use the economic reasoning you have developed so far. State your position clearly and defend it.</p>
          </TaskPrompt>

          {!done ? (
            <div>
              <label htmlFor={`ta-${stepId}`} className={styles.textareaLabel}>Your response</label>
              <textarea
                id={`ta-${stepId}`}
                className={styles.textarea}
                value={text}
                onChange={e => setText(stepId, e.target.value)}
                placeholder="Write your response here…"
                rows={7}
              />
              <button
                className={styles.btn}
                onClick={() => handleSubmit(stepId)}
                disabled={!text.trim()}
              >
                Submit
              </button>
            </div>
          ) : (
            <div className={styles.ackMessage}>
              Your position has been recorded. Now encounter a framework that may challenge it.
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 3B — Pareto Application ──────────────────────────

  if (screen === 'm3b') {
    const stepId = 'm3-pareto-application'
    return (
      <div className={styles.root}>
        <ProgressBar movement={3} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 3 — The Pareto Problem</p>
          <h2 className={styles.sectionTitle}>Pareto Optimality</h2>

          <div className={styles.narrative}>
            <p>Economists use a specific framework to evaluate whether a given situation can be improved upon: Pareto optimality. A situation is said to be Pareto optimal when it is impossible to make any one person better off without making at least one other person worse off. Conversely, a Pareto improvement is a change that makes at least one person better off and nobody worse off.</p>
            <p>Notice what this definition does and does not say. It does not say the situation is fair, just, or even remotely desirable. It says only that no change can be made without creating losers. A highly unequal distribution of resources can be Pareto optimal. If redistributing income from rich to poor makes the rich worse off — which it does, by definition — it fails the Pareto criterion, even if the redistribution strikes most observers as just.</p>
            <p>This is not a quirk of the framework. It is central to it. Pareto optimality asks whether change is possible without creating losers, not whether the current situation is good. The baseline — the existing distribution of resources, wealth, and entitlements — is taken as given. From that baseline, the framework asks: can we do better for someone without doing worse for anyone else? If the answer is no, the situation is Pareto optimal, regardless of what it looks like.</p>
            <p>The implications of this framework are not always comfortable. They can be applied to the Nexavir case directly.</p>
          </div>

          <TaskPrompt>
            <p>Apply the Pareto framework to two situations:</p>
            <p><strong>Situation A:</strong> The current market — Veridian charges $50,000, all 8,400 patients who can afford it receive treatment, patients who cannot afford it go without.</p>
            <p><strong>Situation B:</strong> The proposed subsidy — all 8,400 patients receive treatment, funded by a levy on pharmaceutical revenues.</p>
            <p>For each situation, ask: is it Pareto optimal? Is a Pareto improvement possible from this situation?</p>
            <p>Then answer: what does your analysis reveal about the current market situation?</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to 3C')}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 3C — Pareto Limitations ──────────────────────────

  if (screen === 'm3c') {
    const stepId = 'm3-pareto-limitations'
    return (
      <div className={styles.root}>
        <ProgressBar movement={3} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 3 — The Pareto Problem</p>
          <h2 className={styles.sectionTitle}>The Limits of the Framework</h2>

          <div className={styles.narrative}>
            <p>Earlier in this movement, you committed to a position on the subsidy proposal, using the economic reasoning you had developed. Then you applied the Pareto framework — and found, if your analysis was correct, that the current market situation in which patients go without treatment may be Pareto optimal. That the subsidy, because it imposes costs on levy-payers, fails the Pareto criterion.</p>
            <p>You are now asked to do something with the tension between your earlier position and what the framework reveals. A framework that tells you a situation is optimal while people are dying from a preventable illness is a framework worth examining carefully.</p>
          </div>

          <TaskPrompt>
            <p>Your Pareto analysis may have confirmed that the current market situation — in which patients die — is Pareto optimal. Does this mean the ministry should not support the subsidy?</p>
            <p>Write a response that: states whether you maintain or revise your position from earlier; explains what the Pareto framework can and cannot tell a policymaker; and identifies at least one assumption embedded in the Pareto framework that limits its usefulness as a guide to policy.</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to Movement 4')}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 4A — Scenario: Congestion ────────────────────────

  if (screen === 'm4a') {
    const stepId = 'm4-scenario-a'
    return (
      <div className={styles.root}>
        <ProgressBar movement={4} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 4 — When Markets Fail</p>
          <h2 className={styles.sectionTitle}>Three Cases</h2>

          <div className={styles.narrative}>
            <p>You have now developed a rigorous understanding of market efficiency and its limits. This movement asks you to apply those tools to three new cases without guidance. Each case surfaces a different reason for market failure. Your task is to diagnose, explain, and evaluate.</p>
            <p>Work through each scenario in order. For each one, identify what kind of market failure is occurring (if any), explain the mechanism, and evaluate the significance of the failure.</p>
          </div>

          <hr className={styles.divider} />

          <div className={styles.scenarioCard}>
            <p className={styles.scenarioHeader}>Scenario A: The City Road</p>
            <p className={styles.scenarioText}>A major city has no congestion pricing scheme. All roads are free to use at all times. During peak hours (7–9am and 5–7pm), average traffic speeds fall to 8km/h. The city's transport authority estimates that commuters collectively lose 2.3 million hours per week to congestion. Local businesses report that late deliveries cost them an estimated $340 million annually. Air quality in the city centre breaches WHO guidelines on 180 days per year, contributing to elevated rates of respiratory illness. A proposal to introduce a congestion charge of $12 per vehicle during peak hours has been rejected by the city council following public opposition.</p>
          </div>

          <TaskPrompt>
            <p>Identify the market failure(s) present in this case. Explain the mechanism by which the market is failing — what is it not accounting for, and why? Who bears costs they did not choose? What does this tell us about the relationship between private and social costs?</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to Scenario B')}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 4B — Scenario: Education ─────────────────────────

  if (screen === 'm4b') {
    const stepId = 'm4-scenario-b'
    return (
      <div className={styles.root}>
        <ProgressBar movement={4} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 4 — When Markets Fail</p>
          <h2 className={styles.sectionTitle}>Scenario B</h2>

          <div className={styles.scenarioCard}>
            <p className={styles.scenarioHeader}>Scenario B: Education</p>
            <p className={styles.scenarioText}>A low-income country has no state education system. All schooling is provided by private schools on a fee-paying basis. Families who can afford fees — approximately 35% of the population — send their children to school. The remaining 65% do not attend school. The national literacy rate is 41%. Independent economists estimate that if literacy rates reached 80%, GDP per capita would increase by approximately 23% over 20 years, generating tax revenues that would more than fund a universal public education system. The government has proposed introducing free state schooling. Private school operators are lobbying against it, arguing it will destroy their market.</p>
          </div>

          <TaskPrompt>
            <p>Is this a market failure? If so, what kind, and what is the mechanism? If not, why not? Consider: who benefits from education beyond the individual student? What does this imply about the market's ability to produce the optimal quantity of education?</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to Scenario C')}
        </div>
      </div>
    )
  }

  // ─── MOVEMENT 4C — Scenario: Social Media ──────────────────────

  if (screen === 'm4c') {
    const stepId = 'm4-scenario-c'
    return (
      <div className={styles.root}>
        <ProgressBar movement={4} />
        <div className={styles.content}>
          <p className={styles.sectionLabel}>Movement 4 — When Markets Fail</p>
          <h2 className={styles.sectionTitle}>Scenario C</h2>

          <div className={styles.scenarioCard}>
            <p className={styles.scenarioHeader}>Scenario C: The Platform</p>
            <p className={styles.scenarioText}>A social media platform has 2.3 billion monthly active users. The platform is free to use. It generates $94 billion in annual revenue by selling highly targeted advertising based on detailed behavioural data collected from users. Internal research documents (leaked to the press) show the company's own scientists concluded the platform's recommendation algorithm is designed to maximise 'engagement' — defined as time on platform — and that this correlates with increased anxiety, loneliness, and compulsive use, particularly in users aged 13–17. Users report wanting to use the platform less but feeling unable to stop. Regulators in several countries are considering intervention. The company argues it provides a free service that billions of people choose to use, and that choice implies revealed preference — people use it because they value it.</p>
          </div>

          <TaskPrompt>
            <p>Apply at least two economic concepts from this topic to evaluate whether this market is failing. Consider: what does 'free' mean in this context? Who is the customer and who is the product? What information do users have about the costs they are bearing? Is the company's 'revealed preference' argument valid?</p>
          </TaskPrompt>

          {renderStep(stepId, 'Continue to Closing')}
        </div>
      </div>
    )
  }

  // ─── CLOSING ───────────────────────────────────────────────────

  if (screen === 'closing') {
    const stepId = 'closing-reflection'
    const done = !!submitted[stepId]
    const text = texts[stepId] ?? ''
    const originalResponse = submitted['opening-prior-position'] ?? saved['opening-prior-position'] ?? ''

    return (
      <div className={styles.root}>
        <div className={styles.fullscreen}>
          <div className={styles.fullscreenInner}>
            {originalResponse && (
              <>
                <span className={styles.closingOriginalLabel}>You wrote this before you began.</span>
                <div className={styles.closingOriginalBlock}>
                  <p className={styles.closingOriginalText}>{originalResponse}</p>
                </div>
              </>
            )}

            {!done ? (
              <>
                <span className={styles.closingTaskLabel}>Final reflection</span>
                <p className={styles.closingTaskText}>
                  Now read what you wrote.
                  <br /><br />
                  Write a response that addresses three things: How has your thinking changed — and what specifically changed it? What can you now say about the original question that you could not say before? What questions do you still have — what does this inquiry leave unresolved for you?
                </p>
                <label htmlFor="ta-closing" className={styles.fullscreenLabel}>
                  Your reflection
                </label>
                <textarea
                  id="ta-closing"
                  className={`${styles.textarea} ${styles.textareaDark}`}
                  value={text}
                  onChange={e => setText(stepId, e.target.value)}
                  rows={7}
                />
                <button
                  className={`${styles.btn} ${styles.btnInverted}`}
                  onClick={() => handleSubmit(stepId)}
                  disabled={!text.trim()}
                  style={{ marginTop: 12 }}
                >
                  Submit
                </button>
              </>
            ) : (
              <div className={styles.closingStatement}>
                <p>"The question you began with has no clean answer. That is not a failure of economics — it is economics doing its job. Markets are not neutral. Efficiency is not the same as justice. And the frameworks you now have are tools for thinking, not algorithms for deciding.</p>
                <p>You have done the work."</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
