import { useState, useCallback } from 'react'
import CaseDocument from './components/CaseDocument.jsx'
import ActivitySidebar from './components/ActivitySidebar.jsx'
import ActivityModal from './components/ActivityModal.jsx'
import EvidenceModal from './components/EvidenceModal.jsx'
import styles from './RivergateOverflow.module.css'

export default function RivergateOverflow({
  onResponse,
  onComplete,
  savedResponses,
  isCompleted,
  onReset,
}) {
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

  const [activeActivity, setActiveActivity] = useState(null)
  const [activeEvidence, setActiveEvidence] = useState(null)

  const openActivity = useCallback((num) => setActiveActivity(num), [])
  const closeActivity = useCallback(() => setActiveActivity(null), [])
  const openEvidence = useCallback((id) => setActiveEvidence(id), [])
  const closeEvidence = useCallback(() => setActiveEvidence(null), [])

  // Saves response and closes the activity modal (used by Acts 1–5)
  const handleSubmit = useCallback(async (actNum, data) => {
    await onResponse(`act-${actNum}`, data)
    setAnswers(prev => ({ ...prev, [actNum]: data }))
    setCompletedSet(prev => {
      const next = new Set([...prev, actNum])
      if (next.size === 6) onComplete(100, { asset: 'econ-73-rivergate' })
      return next
    })
    setActiveActivity(null)
  }, [onResponse, onComplete])

  // Saves response without closing — used by Act 6 after AI feedback is received
  const handleSave = useCallback(async (actNum, data) => {
    await onResponse(`act-${actNum}`, data)
    setAnswers(prev => ({ ...prev, [actNum]: data }))
    setCompletedSet(prev => {
      const next = new Set([...prev, actNum])
      if (next.size === 6) onComplete(100, { asset: 'econ-73-rivergate' })
      return next
    })
  }, [onResponse, onComplete])

  const completedCount = completedSet.size
  const progressPct = Math.round((completedCount / 6) * 100)

  return (
    <div className={styles.shell}>
      {/* Top document bar */}
      <div className={styles.docBar}>
        <div className={styles.docBarLeft}>
          <span className={styles.docBarRef}>RG/7.3/NWW/Overflow</span>
          <span className={styles.docBarSep}>·</span>
          <span className={styles.docBarTitle}>Rivergate Economic Review Panel — Evidence File</span>
        </div>
        <div className={styles.docBarRight}>
          <span className={styles.docBarProgressLabel}>{completedCount} / 6 tasks</span>
          <div className={styles.docBarBar}>
            <div className={styles.docBarBarFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className={styles.mainArea}>
        <main className={styles.docPanel} aria-label="Case file">
          <CaseDocument onOpenEvidence={openEvidence} />
        </main>
        <ActivitySidebar
          completedSet={completedSet}
          isCompleted={isCompleted}
          onOpenActivity={openActivity}
          onReset={onReset}
        />
      </div>

      {activeActivity !== null && (
        <ActivityModal
          actNum={activeActivity}
          answers={answers}
          completedSet={completedSet}
          onClose={closeActivity}
          onSubmit={handleSubmit}
          onSave={handleSave}
        />
      )}

      {activeEvidence !== null && (
        <EvidenceModal
          evidenceId={activeEvidence}
          onClose={closeEvidence}
        />
      )}
    </div>
  )
}
