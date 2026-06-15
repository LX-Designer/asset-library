import { useState, useRef } from 'react'
import styles from '../TacomaNarrows.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function Act6({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [report, setReport]             = useState(initialAnswers?.report ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const [everSubmitted, setEverSubmitted] = useState(!!initialAnswers?._submitted || !!initialAnswers?.feedback)
  const textRef = useRef(null)

  const ready = report.trim().length > 0

  const appendStarter = (starter) => {
    setReport(prev => prev ? `${prev}\n\n${starter}` : starter)
    setSubmitLocked(false)
    setTimeout(() => textRef.current?.focus(), 50)
  }

  function handleSubmit() {
    if (!ready) return
    onSubmit({ report: report.trim() })
    setSubmitLocked(true)
    setEverSubmitted(true)
  }

  const label = submitLocked
    ? 'Submitted ✓'
    : everSubmitted
      ? 'Resubmit for feedback →'
      : 'Submit for feedback →'

  return (
    <>
      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task — Final report</span>
        You have examined all the evidence in this case file. Now write your report for the inquiry
        tribunal. Your report should be approximately 200 words and must address three things:
        <ol>
          <li>What was the actual mechanism of failure? (Not what was assumed — what the evidence shows.)</li>
          <li>Where was the engineers' model incomplete? What did it fail to account for?</li>
          <li>What single design change would you recommend to prevent a recurrence?</li>
        </ol>
      </div>

      <label className={styles.inputLabel} htmlFor="tribunal-text">
        Tribunal Report — Case 1940-TN-001
      </label>
      <StarterChips starters={sentenceStarters} onInsert={appendStarter} />
      <textarea
        id="tribunal-text"
        ref={textRef}
        className={`${styles.textarea} ${styles.textareaLg}`}
        rows={10}
        value={report}
        onChange={e => { setReport(e.target.value); setSubmitLocked(false) }}
        onBlur={() => onSave?.({ report: report.trim() })}
      />

      <div className={styles.actions} style={{ marginTop: 10 }}>
        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          onClick={handleSubmit}
          type="button"
          disabled={!ready || submitLocked}
        >
          {label}
        </button>
      </div>
    </>
  )
}
