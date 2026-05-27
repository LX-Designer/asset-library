import { useEffect } from 'react'
import { ACTIVITIES } from '../data/activities.js'
import styles from '../RivergateOverflow.module.css'
import Act1 from '../activities/Act1InitialJudgement.jsx'
import Act2 from '../activities/Act2EfficiencyClaims.jsx'
import Act3 from '../activities/Act3Discontinuity.jsx'
import Act4 from '../activities/Act4MarketFailureDiagnosis.jsx'
import Act5 from '../activities/Act5ExpertAccounts.jsx'
import Act6 from '../activities/Act6JudgementNote.jsx'

const COMPONENTS = { 1: Act1, 2: Act2, 3: Act3, 4: Act4, 5: Act5, 6: Act6 }

export default function ActivityModal({ actNum, answers, completedSet, onClose, onSubmit, onSave }) {
  const meta = ACTIVITIES.find(a => a.num === actNum)
  const ActivityComponent = COMPONENTS[actNum]
  const isCompleted = completedSet.has(actNum)

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

  if (!meta || !ActivityComponent) return null

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="act-modal-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalRef}>Task {String(actNum).padStart(2, '0')} — Analyst Response Form</span>
          <h2 className={styles.modalTitle} id="act-modal-title">{meta.title}</h2>
          <span className={styles.modalSignpost}>↳ Evidence: {meta.signpost}</span>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close task">Close ✕</button>
        </div>
        <div className={styles.modalBody}>
          <ActivityComponent
            initialAnswers={answers[actNum]}
            isCompleted={isCompleted}
            onSubmit={(data) => onSubmit(actNum, data)}
            onSave={(data) => onSave(actNum, data)}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  )
}
