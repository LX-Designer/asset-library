import { useEffect } from 'react'
import styles from './FastFashion.module.css'
import Act1 from './activities/Act1.jsx'
import Act2 from './activities/Act2.jsx'
import Act3 from './activities/Act3.jsx'
import Act4 from './activities/Act4.jsx'
import Act5 from './activities/Act5.jsx'
import Act6 from './activities/Act6.jsx'

const META = {
  1: { label: 'Activity 01 — Prior Thinking',              title: 'Record your initial position'           },
  2: { label: 'Activity 02 — Efficiency Criteria',         title: 'Apply the conditions for efficiency'    },
  3: { label: 'Activity 03 — The Discontinuity',           title: 'Where the analysis breaks down'         },
  4: { label: 'Activity 04 — The Mechanism',               title: 'Why the market does not self-correct'   },
  5: { label: 'Activity 05 — Expert Evaluation',           title: 'Which account is better supported?'     },
  6: { label: 'Activity 06 — Culminating Task',            title: 'Write the corrected briefing note'      },
}

const ACTIVITY_COMPONENTS = { 1: Act1, 2: Act2, 3: Act3, 4: Act4, 5: Act5, 6: Act6 }

export default function Modal({ actNum, answers, completedSet, onClose, onSubmit, onComplete }) {
  const meta = META[actNum]

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const ActivityComponent = ACTIVITY_COMPONENTS[actNum]
  const isCompleted       = completedSet.has(actNum)

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  if (!ActivityComponent) return null

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalActLabel}>{meta.label}</div>
          <h2 className={styles.modalTitle} id="modal-title">{meta.title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕ Close</button>
        </div>

        <div className={styles.modalBody}>
          <ActivityComponent
            initialAnswers={answers[actNum]}
            act1Answers={answers[1]}
            isCompleted={isCompleted}
            onSubmit={(data) => onSubmit(actNum, data)}
            onComplete={(data) => onComplete(actNum, data)}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  )
}
