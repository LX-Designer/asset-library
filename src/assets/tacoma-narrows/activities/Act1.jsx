import { useState } from 'react'
import styles from '../TacomaNarrows.module.css'

export default function Act1({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [hypothesis, setHypothesis] = useState(initialAnswers?.hypothesis ?? '')
  const [error, setError]           = useState('')

  function handleSubmit() {
    if (hypothesis.trim().length <= 10) {
      setError('Please write at least a sentence before continuing.')
      return
    }
    setError('')
    onSubmit({ hypothesis: hypothesis.trim() })
  }

  return (
    <>
      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task</span>
        Before examining any data, write a single sentence explaining why you think the Tacoma
        Narrows Bridge collapsed on 7 November 1940. What is your initial hypothesis? There are
        no wrong answers here — this is a record of your starting point.
      </div>

      <label className={styles.inputLabel} htmlFor="act1-input">Your hypothesis</label>
      <textarea
        id="act1-input"
        className={styles.textarea}
        rows={4}
        placeholder="In my view, the bridge collapsed because…"
        value={hypothesis}
        onChange={e => { setHypothesis(e.target.value); setError('') }}
      />

      {error && <p style={{ color: 'var(--tn-accent)', fontSize: 13, marginTop: 6 }}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.btn} onClick={onClose}>Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit}>
          Record hypothesis →
        </button>
      </div>
    </>
  )
}
