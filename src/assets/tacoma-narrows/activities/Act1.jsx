import { useState } from 'react'
import styles from '../TacomaNarrows.module.css'

export default function Act1({ initialAnswers, onSubmit, onSave }) {
  const [hypothesis, setHypothesis]     = useState(initialAnswers?.hypothesis ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)

  const ready = hypothesis.trim().length > 0

  function handleSubmit() {
    if (!ready) return
    onSubmit({ hypothesis: hypothesis.trim() })
    setSubmitLocked(true)
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
        onChange={e => { setHypothesis(e.target.value); setSubmitLocked(false) }}
        onBlur={() => onSave?.({ hypothesis: hypothesis.trim() })}
      />

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          type="button"
          disabled={!ready || submitLocked}
        >
          {submitLocked ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>
    </>
  )
}
