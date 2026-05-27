import { useState } from 'react'
import styles from '../RivergateOverflow.module.css'

export default function Act3Discontinuity({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [explanation, setExplanation] = useState(initialAnswers?.explanation ?? '')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (explanation.trim().split(/\s+/).length < 30) {
      setError('Write at least a few sentences before submitting.')
      return
    }
    setError('')
    onSubmit({ explanation: explanation.trim() })
  }

  return (
    <>
      {isCompleted && (
        <div className={styles.submittedNote}>Response recorded — you may edit and resubmit.</div>
      )}

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Task prompt</span>
        <p className={styles.formPrompt}>
          The company's simple efficiency story is:
        </p>
        <div className={styles.formPromptEm}>
          "We kept costs and bills low, so resources were used efficiently."
        </div>
        <p className={styles.formPrompt}>
          Use the case file to identify where this story breaks down.
        </p>
      </div>

      <div className={styles.formSection}>
        <label className={styles.formLabel} htmlFor="act3-explanation">
          Your response (4–5 sentences)
        </label>
        <p className={styles.formPrompt} style={{ marginBottom: 8 }}>
          Your response should refer to: one piece of cost or bill evidence; one piece of external
          cost or service failure evidence; and whether the outcome appears Pareto optimal.
        </p>
        <textarea
          id="act3-explanation"
          className={`${styles.textarea} ${styles.textareaLg}`}
          rows={7}
          placeholder="The simple efficiency story breaks down because…"
          value={explanation}
          onChange={e => { setExplanation(e.target.value); setError('') }}
        />
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.actionsRow}>
        <button className={styles.btn} onClick={onClose} type="button">Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit} type="button">
          Submit response →
        </button>
      </div>
    </>
  )
}
