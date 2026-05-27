import { useState } from 'react'
import styles from '../FastFashion.module.css'

export default function Act2({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [partA, setPartA] = useState(initialAnswers?.partA ?? '')
  const [partB, setPartB] = useState(initialAnswers?.partB ?? '')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (partA.trim().length < 20 || partB.trim().length < 20) {
      setError('Please answer both parts before submitting.')
      return
    }
    setError('')
    onSubmit({ partA: partA.trim(), partB: partB.trim() })
  }

  return (
    <>
      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task</span>
        Use the data in §01 and §02 to answer the following questions about productive and
        allocative efficiency.
        <span className={styles.signpostNote}>→ Read §01 and §02 before attempting this activity.</span>
      </div>

      <span className={styles.partLabel}>Part A</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        Using the data in §02, explain whether Shein meets the conditions for productive efficiency.
        Be precise about what the condition requires and whether the data supports it. (2–3 sentences)
      </span>
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="The condition for productive efficiency requires…"
        value={partA}
        onChange={e => { setPartA(e.target.value); setError('') }}
      />

      <span className={styles.partLabel}>Part B</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        The condition for allocative efficiency is P = MC (or, at the economy-wide level, P = SMC).
        The case file reports that a Shein garment retails at an average of £9 in the UK. Does this
        price reflect the social marginal cost of production? What information would you need to
        answer this question fully, and where in the case file would you look for it? (3–4 sentences)
      </span>
      <textarea
        className={styles.textarea}
        rows={5}
        placeholder="The £9 retail price reflects…"
        value={partB}
        onChange={e => { setPartB(e.target.value); setError('') }}
      />

      {error && <p style={{ color: 'var(--ff-accent-warm)', fontSize: 13, marginTop: 8 }}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.btn} onClick={onClose}>Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit}>
          Submit →
        </button>
      </div>
    </>
  )
}
