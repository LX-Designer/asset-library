import { useEffect } from 'react'
import styles from './FastFashion.module.css'
import Act1 from './activities/Act1.jsx'
import Act2 from './activities/Act2.jsx'
import Act3 from './activities/Act3.jsx'
import Act4 from './activities/Act4.jsx'
import Act5 from './activities/Act5.jsx'
import Act6 from './activities/Act6.jsx'

const ACTIVITY_META = {
  1: { label: 'Task 01 — Prior Thinking',              title: 'Record your initial position'        },
  2: { label: 'Task 02 — Efficiency Criteria',         title: 'Apply the conditions for efficiency' },
  3: { label: 'Task 03 — The Discontinuity',           title: 'Where the analysis breaks down'      },
  4: { label: 'Task 04 — The Mechanism',               title: 'Why the market does not self-correct' },
  5: { label: 'Task 05 — Expert Evaluation',           title: 'Which account is better supported?'  },
  6: { label: 'Task 06 — Culminating Task',            title: 'Write the corrected briefing note'   },
}

const ACTIVITY_COMPONENTS = { 1: Act1, 2: Act2, 3: Act3, 4: Act4, 5: Act5, 6: Act6 }

function RanaPlazaView({ onClose }) {
  return (
    <div className={styles.docViewBody}>
      <div className={styles.docViewMeta}>
        <div className={styles.docViewMetaItem}>
          <span className={styles.docViewMetaLabel}>Location</span>
          <span className={styles.docViewMetaValue}>Savar, Dhaka, Bangladesh</span>
        </div>
        <div className={styles.docViewMetaItem}>
          <span className={styles.docViewMetaLabel}>Date</span>
          <span className={styles.docViewMetaValue}>23–24 April 2013</span>
        </div>
        <div className={styles.docViewMetaItem}>
          <span className={styles.docViewMetaLabel}>Deaths</span>
          <span className={styles.docViewMetaValue}>1,134</span>
        </div>
        <div className={styles.docViewMetaItem}>
          <span className={styles.docViewMetaLabel}>Injured</span>
          <span className={styles.docViewMetaValue}>2,500+</span>
        </div>
      </div>

      <p>
        Rana Plaza was an eight-storey commercial building in Savar, a suburb of Dhaka, housing
        five garment factories. The factories produced clothing for a range of western brands
        including Primark, Mango, Benetton, and Walmart. The building had been illegally extended
        from its original four-storey design. The additional floors were constructed without
        engineering approval, using materials and methods not rated for the load of industrial
        machinery.
      </p>

      <div className={styles.docViewSubtitle}>23 April 2013</div>
      <p>
        Structural engineers identified significant cracks throughout the building's columns and
        walls. The shops and bank on the lower floors immediately closed and sent their staff home.
        Factory managers on the upper floors were informed. Workers requested to leave. Factory
        managers, under pressure to meet production schedules, assessed the damage as non-critical
        and instructed workers to return to their posts.
      </p>

      <div className={styles.docViewSubtitle}>24 April 2013, 05:00–08:00 a.m.</div>
      <p>
        Workers gathered outside the building in the early morning, many visibly distressed. Some
        refused to enter. Witnesses report that supervisors threatened workers with loss of a
        month's wages — approximately $36 at the then-current minimum wage — if they did not
        return to work. Workers who could not afford to lose the income complied.
      </p>

      <div className={styles.docViewSubtitle}>08:57 a.m.</div>
      <p>
        The building's generators, switched on when local power failed — a routine occurrence in
        Savar — created vibration loads the compromised structure could not sustain. Rana Plaza
        collapsed in under two minutes. <strong>1,134 workers were killed. More than 2,500 were
        injured.</strong>
      </p>

      <div className={styles.docViewSubtitle}>Economic context of the decision</div>
      <p>
        The decision made on the morning of 24 April — to send workers into a building that
        engineers had assessed as unsafe — was rational from the perspective of the factory owners.
        The cost of pausing production was immediate and certain: lost revenue, missed shipment
        deadlines, potential contract termination by brand buyers. The cost of the structural risk
        was uncertain and, in the event of collapse, would be borne primarily by the workers — not
        by the factory owners, not by the brand buyers, and not by the consumers who had purchased
        the garments those workers had made.
      </p>
      <p>
        This is the logic of externalised cost made explicit. The market transaction between
        Shein's suppliers and their buyers does not create any mechanism by which the risk of
        unsafe construction is priced into the garment. The party bearing the risk — the worker —
        is not a party to the transaction.
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
            <td>Minimal — risk externalised to workers</td>
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

      <div className={styles.docViewClose}>
        <button className={styles.btn} onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

function ExpertView({ expert, onClose }) {
  const isA = expert === 'expert-a'

  return (
    <div className={`${styles.docViewBody} ${styles.docViewStmt}`}>
      {isA ? (
        <>
          <p>
            The case for market intervention in fast fashion rests on an implicit assumption that
            the market is failing consumers. The evidence does not support this. UK clothing prices,
            in real terms, are substantially lower today than they were twenty years ago. Consumers
            at every income level — but particularly those on lower incomes, for whom clothing
            represented a meaningful share of household expenditure — are materially better off.
            They have access to a wider range of styles, more frequently renewed, at prices that
            were unimaginable in the 1990s. This is what a productively efficient market looks like.
          </p>
          <p>
            The arguments about externalities are not wrong, but they are not the right basis for
            a conclusion that the market is failing. Carbon emissions from the fashion industry are
            a real problem — but they are a problem shared across many industries, and the solution
            is economy-wide carbon pricing, not selective intervention in fashion. Labour conditions
            in Bangladesh are improving: the minimum wage was raised by 56% in 2023. The Accord on
            Fire and Building Safety has made Bangladeshi factories significantly safer. Markets can
            and do respond to pressure.
          </p>
          <p>
            To describe a market that has reduced prices, increased access, and generated employment
            for millions in emerging economies as a "market failure" requires a much higher
            evidential bar than this dossier provides.
          </p>
        </>
      ) : (
        <>
          <p>
            Dr Mehta's statement is internally consistent. It is also analytically incomplete, in a
            way that matters precisely because of its consistency.
          </p>
          <p>
            The condition for allocative efficiency is not P&nbsp;≈&nbsp;MPC. It is
            P&nbsp;=&nbsp;SMC. Social marginal cost includes all costs of production — not only
            those borne by the producing firm. This dossier presents data on several categories of
            cost that are not reflected in the retail price of fast fashion garments: carbon
            emissions (approximately $1.26 billion per year in social cost for Shein alone, using
            conservative carbon pricing), water pollution, textile waste disposal, and a wage
            structure in which the gap between the minimum wage and a living wage in Bangladesh
            amounts to approximately $337 per worker per month. None of these costs appear in the
            price of a garment.
          </p>
          <p>
            This is not a point about values or distribution. It is a point about prices. When
            P&nbsp;&lt;&nbsp;SMC, the price signal that guides resource allocation in a market
            economy is giving the wrong signal. Consumers are buying more fast fashion than they
            would if the price reflected what the production actually costs society. Resources are
            being over-allocated to this market. That is the definition of allocative inefficiency.
            And it is the definition of market failure.
          </p>
          <p>
            Dr Mehta is right that productive efficiency has been achieved. She is wrong to treat
            this as sufficient for a conclusion that the market is working well. The original
            assessment made the same error. That is why this review was requested.
          </p>
        </>
      )}

      <div className={styles.docViewClose}>
        <button className={styles.btn} onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default function Modal({ modalId, answers, completedSet, onClose, onSubmit, onComplete }) {
  const isDocModal  = typeof modalId === 'string'
  const isActivity  = typeof modalId === 'number'

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const docLabels = {
    'rana-plaza': { label: 'Case Attachment — Section 05', title: 'The Rana Plaza Collapse' },
    'expert-a':   { label: 'Expert Statement A',           title: 'Dr Priya Mehta' },
    'expert-b':   { label: 'Expert Statement B',           title: 'Dr Kwame Asante' },
  }

  let label, title
  if (isDocModal) {
    label = docLabels[modalId]?.label ?? ''
    title = docLabels[modalId]?.title ?? ''
  } else {
    label = ACTIVITY_META[modalId]?.label ?? ''
    title = ACTIVITY_META[modalId]?.title ?? ''
  }

  const ActivityComponent = isActivity ? ACTIVITY_COMPONENTS[modalId] : null
  const isCompleted       = isActivity ? completedSet.has(modalId) : false

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`${styles.modal} ${isDocModal ? styles.modalDoc : ''}`}>
        <div className={styles.modalHeader}>
          <span className={`${styles.modalActLabel} ${isDocModal ? styles.modalDocLabel : ''}`}>
            {label}
          </span>
          <h2 className={styles.modalTitle} id="modal-title">{title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">Close ✕</button>
        </div>

        <div className={styles.modalBody}>
          {isDocModal && modalId === 'rana-plaza' && (
            <RanaPlazaView onClose={onClose} />
          )}
          {isDocModal && (modalId === 'expert-a' || modalId === 'expert-b') && (
            <ExpertView expert={modalId} onClose={onClose} />
          )}
          {isActivity && ActivityComponent && (
            <ActivityComponent
              initialAnswers={answers[modalId]}
              act1Answers={answers[1]}
              isCompleted={isCompleted}
              onSubmit={(data) => onSubmit(modalId, data)}
              onComplete={(data) => onComplete(modalId, data)}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}
