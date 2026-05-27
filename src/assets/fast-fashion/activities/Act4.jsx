import { useState } from 'react'
import styles from '../FastFashion.module.css'

export default function Act4({ initialAnswers, isCompleted, onSubmit, onClose }) {
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
        §05 describes the Rana Plaza collapse of April 2013. §06 explains why the conditions that
        led to Rana Plaza persist across the fast fashion supply chain.
        <span className={styles.signpostNote}>→ Read §05 and §06 before attempting this activity.</span>
      </div>

      <span className={styles.partLabel}>Part A</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        Explain, in economic terms, why the cost of unsafe factory construction was not reflected
        in the retail price of garments produced at Rana Plaza. Use the concept of externalities
        in your answer. (2–3 sentences)
      </span>
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="The cost of unsafe construction was not reflected in the retail price because…"
        value={partA}
        onChange={e => { setPartA(e.target.value); setError('') }}
      />

      <span className={styles.partLabel}>Part B</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        A student argues: <em>"If consumers knew how garments were produced, they would demand
        lower prices to compensate for the moral harm, or switch to ethical brands. The market
        would self-correct."</em> Use evidence from §06 to evaluate this argument. (3–4 sentences)
      </span>
      <textarea
        className={styles.textarea}
        rows={5}
        placeholder="The self-correction argument fails because…"
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
