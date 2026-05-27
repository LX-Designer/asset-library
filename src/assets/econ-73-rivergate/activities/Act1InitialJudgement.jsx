import { useState } from 'react'
import styles from '../RivergateOverflow.module.css'

const OPTIONS = [
  {
    key: 'A',
    text: 'The decision was efficient because lower cost means productive efficiency.',
  },
  {
    key: 'B',
    text: 'The decision was efficient because lower bills mean consumers are better off.',
  },
  {
    key: 'C',
    text: 'The evidence is not enough yet; low private cost does not prove wider economic efficiency.',
  },
  {
    key: 'D',
    text: 'The decision was inefficient only if the company made abnormal profit.',
  },
]

export default function Act1InitialJudgement({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [choice,    setChoice]    = useState(initialAnswers?.choice    ?? '')
  const [reasoning, setReasoning] = useState(initialAnswers?.reasoning ?? '')
  const [error,     setError]     = useState('')

  function handleSubmit() {
    if (!choice) {
      setError('Select an option before submitting.')
      return
    }
    if (reasoning.trim().length < 20) {
      setError('Write a short explanation (at least a sentence) before submitting.')
      return
    }
    setError('')
    onSubmit({ choice, reasoning: reasoning.trim() })
  }

  return (
    <>
      {isCompleted && (
        <div className={styles.submittedNote}>Response recorded — you may edit and resubmit.</div>
      )}

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Task prompt</span>
        <p className={styles.formPrompt}>
          North Wessex Water claims it acted efficiently because it kept operating costs and household
          bills below the regional benchmark.
        </p>
        <p className={styles.formPrompt}>
          Before reviewing the full evidence, what is your initial judgement?
        </p>
      </div>

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Part A — Select your initial position</span>
        <div className={styles.choiceGroup}>
          {OPTIONS.map(({ key, text }) => (
            <button
              key={key}
              className={`${styles.choiceOption} ${choice === key ? styles.choiceOptionSelected : ''}`}
              onClick={() => { setChoice(key); setError('') }}
              type="button"
            >
              <span className={`${styles.choiceKey} ${choice === key ? styles.choiceKeySelected : ''}`}>{key}</span>
              <span className={styles.choiceText}>{text}</span>
            </button>
          ))}
        </div>
      </div>

      <hr className={styles.formDivider} />

      <div className={styles.formSection}>
        <label className={styles.formLabel} htmlFor="act1-reasoning">
          Part B — Explain your choice (2–3 sentences)
        </label>
        <p className={styles.formPrompt} style={{ marginBottom: 8 }}>
          What extra evidence would you need before making a final judgement?
        </p>
        <textarea
          id="act1-reasoning"
          className={styles.textarea}
          rows={4}
          placeholder="My reasoning is that…"
          value={reasoning}
          onChange={e => { setReasoning(e.target.value); setError('') }}
        />
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.actionsRow}>
        <button className={styles.btn} onClick={onClose} type="button">Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit} type="button">
          Record position →
        </button>
      </div>
    </>
  )
}
