import { useState, useCallback } from 'react'
import Sidebar from './Sidebar.jsx'
import CaseDocument from './CaseDocument.jsx'
import Modal from './Modal.jsx'
import styles from './TacomaNarrows.module.css'

/**
 * TacomaNarrows — root component.
 *
 * Receives standard AssetWrapper props:
 *   onResponse(questionId, data)  — saves a single activity's answers
 *   onComplete(score, metadata)   — called when all 6 activities are done
 *   savedResponses                — previously saved answers keyed by questionId
 *   isCompleted                   — whether the asset was already completed
 */
export default function TacomaNarrows({ onResponse, onComplete, savedResponses, isCompleted }) {
  // Restore completed activity numbers from savedResponses
  const [completedSet, setCompletedSet] = useState(() => {
    const s = new Set()
    for (const key of Object.keys(savedResponses ?? {})) {
      const m = key.match(/^act-(\d+)$/)
      if (m) s.add(Number(m[1]))
    }
    return s
  })

  // Restore saved answers per activity
  const [answers, setAnswers] = useState(() => {
    const a = {}
    for (const [key, val] of Object.entries(savedResponses ?? {})) {
      const m = key.match(/^act-(\d+)$/)
      if (m) a[Number(m[1])] = val
    }
    return a
  })

  // null | 0 (before-you-begin) | 1–6 (activity)
  const [activeModal, setActiveModal] = useState(null)

  const openModal  = useCallback((num) => setActiveModal(num), [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  /**
   * Called by Act 1–5 when the learner submits.
   * Saves to Supabase, marks complete, closes the modal.
   */
  const handleSubmit = useCallback(async (actNum, answerData) => {
    await onResponse(`act-${actNum}`, answerData)
    setAnswers(prev => ({ ...prev, [actNum]: answerData }))
    setCompletedSet(prev => {
      const next = new Set([...prev, actNum])
      if (next.size === 6) onComplete(100, { asset: 'tacoma-narrows' })
      return next
    })
    setActiveModal(null)
  }, [onResponse, onComplete])

  /**
   * Called by Act 6 after feedback is received.
   * Saves and marks complete but does NOT close the modal
   * (the learner stays to read their feedback).
   */
  const handleComplete = useCallback(async (actNum, answerData) => {
    await onResponse(`act-${actNum}`, answerData)
    setAnswers(prev => ({ ...prev, [actNum]: answerData }))
    setCompletedSet(prev => {
      const next = new Set([...prev, actNum])
      if (next.size === 6) onComplete(100, { asset: 'tacoma-narrows' })
      return next
    })
    // Modal stays open — caller controls close via onClose
  }, [onResponse, onComplete])

  return (
    <div className={styles.shell}>
      <Sidebar
        completedSet={completedSet}
        onOpenModal={openModal}
      />
      <main className={styles.main}>
        <CaseDocument
          completedSet={completedSet}
          onOpenModal={openModal}
        />
      </main>

      {activeModal !== null && (
        <Modal
          actNum={activeModal}
          answers={answers}
          completedSet={completedSet}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}
