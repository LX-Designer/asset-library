import { useState, useCallback } from 'react'
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

export default function Act6({ initialAnswers, isCompleted, onComplete, onClose }) {
  const [report,   setReport]   = useState(initialAnswers?.report   ?? '')
  const [feedback, setFeedback] = useState(initialAnswers?.feedback ?? '')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(!!initialAnswers?.feedback)

  const wc = wordCount(report)

  const handleSubmitFeedback = useCallback(async () => {
    if (wc < 50) {
      setError('Please write at least 50 words before submitting for feedback.')
      return
    }
    setError('')
    setLoading(true)
    setFeedback('')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: report.trim() }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      const fb = data.feedback ?? 'Unable to retrieve feedback. Please try again.'
      setFeedback(fb)
      setHasSubmitted(true)
      onComplete({ report: report.trim(), feedback: fb })
    } catch (err) {
      setError('Unable to retrieve feedback at this time. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [report, wc, onComplete])

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
        <button className={styles.btn} onClick={onClose}>
          Save &amp; close
        </button>
        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          onClick={handleSubmitFeedback}
          disabled={loading}
        >
          {loading ? 'Analysing…' : hasSubmitted ? 'Resubmit for feedback →' : 'Submit for feedback →'}
        </button>
      </div>

      {(loading || feedback) && (
        <div className={styles.feedbackPanel}>
          <div className={styles.feedbackHeader}>
            <span>Tribunal Feedback</span>
            <span className={styles.feedbackHeaderNote}>AI-generated formative feedback</span>
          </div>
          <div className={styles.feedbackBody}>
            {loading ? (
              <div className={styles.feedbackLoading}>
                <div className={styles.feedbackDot} />
                <div className={styles.feedbackDot} />
                <div className={styles.feedbackDot} />
                <span style={{ marginLeft: 6 }}>Analysing your report…</span>
              </div>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, margin: 0 }}>{feedback}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
