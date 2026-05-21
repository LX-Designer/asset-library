import { useEffect } from 'react'
import styles from './TacomaNarrows.module.css'
import Act1 from './activities/Act1.jsx'
import Act2 from './activities/Act2.jsx'
import Act3 from './activities/Act3.jsx'
import Act4 from './activities/Act4.jsx'
import Act5 from './activities/Act5.jsx'
import Act6 from './activities/Act6.jsx'

const META = {
  0: { label: 'Case File Overview',          title: 'Before you begin'                     },
  1: { label: 'Activity 01 — Before you read', title: 'Record your initial hypothesis'       },
  2: { label: 'Activity 02 — Data analysis',   title: 'Does the frequency data support resonance?' },
  3: { label: 'Activity 03 — Timeline',         title: 'Two phases — two explanations?'       },
  4: { label: 'Activity 04 — Design analysis',  title: 'What did the solid girder design change?' },
  5: { label: 'Activity 05 — Expert evaluation','title': 'Evaluate the expert witnesses'     },
  6: { label: 'Activity 06 — Final assessment', title: 'Write your tribunal report'          },
}

// Correct answer keys used for restoring radio selections from savedAnswers
const ACTIVITY_COMPONENTS = { 1: Act1, 2: Act2, 3: Act3, 4: Act4, 5: Act5, 6: Act6 }

function BeforeYouBegin({ onClose }) {
  return (
    <>
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
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onClose}>
          Begin the case file →
        </button>
      </div>
    </>
  )
}

export default function Modal({ actNum, answers, completedSet, onClose, onSubmit, onComplete }) {
  const meta = META[actNum]

  // Trap Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent scroll on body while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const ActivityComponent = ACTIVITY_COMPONENTS[actNum]
  const isCompleted       = completedSet.has(actNum)

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalActLabel}>{meta.label}</div>
          <h2 className={styles.modalTitle} id="modal-title">{meta.title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕ Close</button>
        </div>

        <div className={styles.modalBody}>
          {actNum === 0 ? (
            <BeforeYouBegin onClose={onClose} />
          ) : ActivityComponent ? (
            <ActivityComponent
              initialAnswers={answers[actNum]}
              isCompleted={isCompleted}
              onSubmit={(data) => onSubmit(actNum, data)}
              onComplete={(data) => onComplete(actNum, data)}
              onClose={onClose}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
