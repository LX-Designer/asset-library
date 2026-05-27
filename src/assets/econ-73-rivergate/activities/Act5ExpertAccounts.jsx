import { useState } from 'react'
import styles from '../RivergateOverflow.module.css'

export default function Act5ExpertAccounts({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [evaluation, setEvaluation] = useState(initialAnswers?.evaluation ?? '')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (evaluation.trim().split(/\s+/).length < 40) {
      setError('Write at least 5–6 sentences before submitting.')
      return
    }
    setError('')
    onSubmit({ evaluation: evaluation.trim() })
  }

  return (
    <>
      {isCompleted && (
        <div className={styles.submittedNote}>Response recorded — you may edit and resubmit.</div>
      )}

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Task prompt</span>
        <p className={styles.formPrompt}>
          Two experts have interpreted the same evidence differently.
        </p>
        <div className={styles.formPromptEm}>
          Account A: The delayed upgrade was a constrained but efficient decision that protected bill-payers.
        </div>
        <div className={styles.formPromptEm}>
          Account B: The delayed upgrade was a market failure because private cost savings shifted costs onto society.
        </div>
        <p className={styles.formPrompt}>
          Which account is better supported by the evidence? You may acknowledge strengths in both,
          but you must make a judgement.
        </p>
      </div>

      <div className={styles.formSection}>
        <label className={styles.formLabel} htmlFor="act5-evaluation">
          Your evaluation (5–6 sentences)
        </label>
        <p className={styles.formPrompt} style={{ marginBottom: 8 }}>
          Refer to at least two pieces of evidence from the case file.
        </p>
        <textarea
          id="act5-evaluation"
          className={`${styles.textarea} ${styles.textareaLg}`}
          rows={8}
          placeholder="Account A has some support because… However, Account B is better supported because…"
          value={evaluation}
          onChange={e => { setEvaluation(e.target.value); setError('') }}
        />
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.actionsRow}>
        <button className={styles.btn} onClick={onClose} type="button">Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit} type="button">
          Submit evaluation →
        </button>
      </div>
    </>
  )
}
