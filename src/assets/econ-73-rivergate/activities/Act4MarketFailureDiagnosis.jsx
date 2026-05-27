import { useState } from 'react'
import styles from '../RivergateOverflow.module.css'

const REASONS = [
  { id: 'externalities',    text: 'Negative externalities from overflow discharges' },
  { id: 'imperfect-info',  text: 'Imperfect information about the true risk and cost of delay' },
  { id: 'monopoly',        text: 'Market dominance / natural monopoly in wastewater services' },
  { id: 'missing-market',  text: 'Missing or incomplete market for clean estuary quality' },
  { id: 'public-good',     text: 'Public good characteristics of environmental quality' },
  { id: 'no-failure',      text: 'A normal competitive market with no market failure' },
]

export default function Act4MarketFailureDiagnosis({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [selected, setSelected] = useState(() => new Set(initialAnswers?.selected ?? []))
  const [explanation, setExplanation] = useState(initialAnswers?.explanation ?? '')
  const [error, setError] = useState('')

  function toggleReason(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setError('')
  }

  function handleSubmit() {
    if (selected.size === 0) {
      setError('Select at least one reason before submitting.')
      return
    }
    if (explanation.trim().split(/\s+/).length < 20) {
      setError('Explain two selected reasons in a few sentences before submitting.')
      return
    }
    setError('')
    onSubmit({ selected: Array.from(selected), explanation: explanation.trim() })
  }

  return (
    <>
      {isCompleted && (
        <div className={styles.submittedNote}>Response recorded — you may edit and resubmit.</div>
      )}

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Task prompt</span>
        <p className={styles.formPrompt}>
          Which reasons for market failure are present in the Rivergate case?
          Select all that are supported by evidence in the case file.
        </p>
      </div>

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Part A — Select all reasons supported by the evidence</span>
        <div className={styles.checkGroup}>
          {REASONS.map(({ id, text }) => {
            const checked = selected.has(id)
            return (
              <button
                key={id}
                className={`${styles.checkOption} ${checked ? styles.checkOptionSelected : ''}`}
                onClick={() => toggleReason(id)}
                type="button"
              >
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={checked}
                  readOnly
                  tabIndex={-1}
                />
                <span className={styles.checkText}>{text}</span>
              </button>
            )
          })}
        </div>
      </div>

      <hr className={styles.formDivider} />

      <div className={styles.formSection}>
        <label className={styles.formLabel} htmlFor="act4-explanation">
          Part B — Explain two of your selected reasons
        </label>
        <p className={styles.formPrompt} style={{ marginBottom: 8 }}>
          For each, explain how it appears in the case file evidence.
        </p>
        <textarea
          id="act4-explanation"
          className={`${styles.textarea} ${styles.textareaLg}`}
          rows={6}
          placeholder="First reason: negative externalities appear because… Second reason: imperfect information is shown by…"
          value={explanation}
          onChange={e => { setExplanation(e.target.value); setError('') }}
        />
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.actionsRow}>
        <button className={styles.btn} onClick={onClose} type="button">Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit} type="button">
          Submit diagnosis →
        </button>
      </div>
    </>
  )
}
