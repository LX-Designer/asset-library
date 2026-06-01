import { useState } from 'react'
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

export default function Act6JudgementNote({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [note,      setNote]      = useState(initialAnswers?.note ?? '')
  const [error,     setError]     = useState('')
  // Track whether feedback has been requested this session or was previously saved,
  // so the button label can switch from "Submit" to "Resubmit".
  const [submitted, setSubmitted] = useState(!!initialAnswers?.feedback)

  const wc = wordCount(note)

  function handleSubmitForFeedback() {
    if (wc < 50) {
      setError('Write at least 50 words before submitting for feedback.')
      return
    }
    setError('')
    setSubmitted(true)
    onSubmit({ note: note.trim() })
  }

  return (
    <>
      {isCompleted && (
        <div className={styles.submittedNote}>
          Judgement note submitted — you may revise and resubmit for feedback.
        </div>
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
          type="button"
        >
          {submitted ? 'Resubmit for feedback →' : 'Submit for feedback →'}
        </button>
      </div>
    </>
  )
}
