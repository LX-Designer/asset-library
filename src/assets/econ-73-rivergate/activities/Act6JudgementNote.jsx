import { useState, useCallback } from 'react'
import { SYSTEM_PROMPT } from '../data/feedbackPrompt.js'
import styles from '../RivergateOverflow.module.css'

function wordCount(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

function wordCountLabel(n) {
  if (n === 0)   return '0 words'
  if (n < 120)   return `${n} words — aim for ~200`
  if (n > 300)   return `${n} words — consider trimming`
  return `${n} words ✓`
}

export default function Act6JudgementNote({ initialAnswers, isCompleted, onSave, onClose }) {
  const [note,     setNote]     = useState(initialAnswers?.note     ?? '')
  const [feedback, setFeedback] = useState(initialAnswers?.feedback ?? '')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [hasFeedback, setHasFeedback] = useState(!!initialAnswers?.feedback)

  const wc = wordCount(note)

  const handleSubmitForFeedback = useCallback(async () => {
    if (wc < 50) {
      setError('Write at least 50 words before submitting for feedback.')
      return
    }
    setError('')
    setLoading(true)
    setFeedback('')

    const userMessage = `Here is the student's economic judgement note:\n\n"${note.trim()}"`

    try {
      const res = await fetch('/api/ai-feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ system: SYSTEM_PROMPT, userMessage }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      const fb = data.text ?? 'Unable to retrieve feedback. Please try again.'
      setFeedback(fb)
      setHasFeedback(true)
      onSave({ note: note.trim(), feedback: fb })
    } catch {
      setError('Unable to retrieve feedback at this time. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [note, wc, onSave])

  return (
    <>
      {isCompleted && (
        <div className={styles.submittedNote}>Judgement note submitted — you may revise and resubmit for feedback.</div>
      )}

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Task prompt — Economic Judgement Note</span>
        <p className={styles.formPrompt}>
          You are writing a short economic judgement note for the Rivergate Review Panel.
        </p>
        <div className={styles.formPromptEm}>
          Did North Wessex Water's decision to delay the Rivergate sewer upgrade represent efficient
          resource allocation, or does the evidence show market failure?
        </div>
        <p className={styles.formPrompt}>
          Write approximately 200 words. Your response should:
        </p>
        <ul style={{ fontSize: 13.5, color: 'var(--rg-ink)', lineHeight: 1.8, paddingLeft: 20, marginBottom: 16 }}>
          <li>make a clear judgement;</li>
          <li>distinguish productive efficiency from allocative efficiency;</li>
          <li>refer to Pareto optimality;</li>
          <li>explain dynamic efficiency;</li>
          <li>identify at least two reasons for market failure;</li>
          <li>use specific evidence from the case file.</li>
        </ul>
      </div>

      <div className={styles.formSection}>
        <label className={styles.formLabel} htmlFor="act6-note">
          Economic Judgement Note — Case RG/7.3/NWW/Overflow
        </label>
        <textarea
          id="act6-note"
          className={`${styles.textarea} ${styles.textareaLg}`}
          rows={12}
          placeholder={"To: Rivergate Economic Review Panel\nFrom: Junior Economic Analyst\nRe: RG/7.3/NWW/Overflow — Economic Judgement\n\n"}
          value={note}
          onChange={e => { setNote(e.target.value); setError('') }}
        />
        <div className={styles.wordCount}>{wordCountLabel(wc)}</div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.actionsRow}>
        <button className={styles.btn} onClick={onClose} type="button">
          Save &amp; close
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmitForFeedback}
          disabled={loading}
          type="button"
        >
          {loading ? 'Reviewing…' : hasFeedback ? 'Resubmit for feedback →' : 'Submit for feedback →'}
        </button>
      </div>

      {(loading || feedback) && (
        <div className={styles.feedbackPanel}>
          <div className={styles.feedbackPanelHeader}>
            <span className={styles.feedbackPanelLabel}>Tutor Feedback</span>
            <span className={styles.feedbackPanelSub}>AI-generated formative feedback</span>
          </div>
          <div className={styles.feedbackPanelBody}>
            {loading ? (
              <div className={styles.feedbackLoading}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
                <span style={{ marginLeft: 8 }}>Reviewing your judgement note…</span>
              </div>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{feedback}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
