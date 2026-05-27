import { useState } from 'react'
import styles from '../FastFashion.module.css'

export default function Act3({ initialAnswers, isCompleted, onSubmit, onClose }) {
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
        The data in §03 and §04 present costs that are not reflected in the retail price of a
        Shein garment.
        <span className={styles.signpostNote}>→ Read §03 and §04 before attempting this activity.</span>
      </div>

      <span className={styles.partLabel}>Part A</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        Using specific figures from §03 and/or §04, identify <strong>one</strong> cost that is not
        priced into the garment's retail price. Explain what type of cost this represents in
        economic terms. (2–3 sentences)
      </span>
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="One cost not reflected in the retail price is…"
        value={partA}
        onChange={e => { setPartA(e.target.value); setError('') }}
      />

      <span className={styles.partLabel}>Part B</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        The internal market assessment concluded that the fast fashion market is "productively
        efficient" and therefore requires no policy intervention. At what point does this analysis
        break down? Use the concept of social marginal cost in your answer. (3–4 sentences)
      </span>
      <textarea
        className={styles.textarea}
        rows={5}
        placeholder="The analysis breaks down at the point where…"
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
