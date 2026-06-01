import { useState } from 'react'
import styles from '../TacomaNarrows.module.css'

function wordCount(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

function wordCountLabel(n) {
  if (n === 0)   return '0 words'
  if (n < 150)   return `${n} words — aim for ~200`
  if (n > 280)   return `${n} words — consider trimming`
  return `${n} words ✓`
}

export default function Act6({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [report,    setReport]    = useState(initialAnswers?.report   ?? '')
  const [error,     setError]     = useState('')
  // Track whether feedback has been requested this session or was previously saved
  const [submitted, setSubmitted] = useState(!!initialAnswers?.feedback)

  const wc = wordCount(report)

  function handleSubmitForFeedback() {
    if (wc < 50) {
      setError('Please write at least 50 words before submitting for feedback.')
      return
    }
    setError('')
    setSubmitted(true)
    onSubmit({ report: report.trim() })
  }

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
      <textarea
        id="tribunal-text"
        className={`${styles.textarea} ${styles.textareaLg}`}
        rows={10}
        placeholder={"To the inquiry tribunal,\n\nHaving reviewed the evidence in this case file, I find that…"}
        value={report}
        onChange={e => { setReport(e.target.value); setError('') }}
      />
      <div className={styles.wordCount}>{wordCountLabel(wc)}</div>

      {error && <p style={{ color: 'var(--tn-accent)', fontSize: 13, marginTop: 8 }}>{error}</p>}

      <div className={styles.actions} style={{ marginTop: 10 }}>
        <button className={styles.btn} onClick={onClose} type="button">
          Save &amp; close
        </button>
        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          onClick={handleSubmitForFeedback}
          type="button"
        >
          {submitted ? 'Resubmit for feedback →' : 'Submit for feedback →'}
        </button>
      </div>
    </>
  )
}
