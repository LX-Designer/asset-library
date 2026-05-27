import { useState, useCallback } from 'react'
import Sidebar from './Sidebar.jsx'
import CaseDocument from './CaseDocument.jsx'
import Modal from './Modal.jsx'
import styles from './FastFashion.module.css'

export default function FastFashion({ onResponse, onComplete, savedResponses, isCompleted, onReset }) {
  const [completedSet, setCompletedSet] = useState(() => {
    const s = new Set()
    for (const key of Object.keys(savedResponses ?? {})) {
      const m = key.match(/^act-(\d+)$/)
      if (m) s.add(Number(m[1]))
    }
    return s
  })

  const [answers, setAnswers] = useState(() => {
    const a = {}
    for (const [key, val] of Object.entries(savedResponses ?? {})) {
      const m = key.match(/^act-(\d+)$/)
      if (m) a[Number(m[1])] = val
    }
    return a
  })

  // modalId: number 1–6 (activity) | string 'rana-plaza'|'expert-a'|'expert-b' (doc view)
  const [activeModal, setActiveModal] = useState(null)

  const openModal  = useCallback((id) => setActiveModal(id), [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  const handleSubmit = useCallback(async (actNum, answerData) => {
    await onResponse(`act-${actNum}`, answerData)
    setAnswers(prev => ({ ...prev, [actNum]: answerData }))
    setCompletedSet(prev => {
      const next = new Set([...prev, actNum])
      if (next.size === 6) onComplete(100, { asset: 'fast-fashion' })
      return next
    })
    setActiveModal(null)
  }, [onResponse, onComplete])

  const handleComplete = useCallback(async (actNum, answerData) => {
    await onResponse(`act-${actNum}`, answerData)
    setAnswers(prev => ({ ...prev, [actNum]: answerData }))
    setCompletedSet(prev => {
      const next = new Set([...prev, actNum])
      if (next.size === 6) onComplete(100, { asset: 'fast-fashion' })
      return next
    })
  }, [onResponse, onComplete])

  return (
    <div className={styles.shell}>
      <Sidebar
        completedSet={completedSet}
        isCompleted={isCompleted}
        onOpenModal={openModal}
        onReset={onReset}
      />
      <main className={styles.main}>
        <CaseDocument onOpenModal={openModal} />
      </main>

      {activeModal !== null && (
        <Modal
          modalId={activeModal}
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
