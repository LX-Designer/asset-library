import { useState } from 'react'
import styles from '../FastFashion.module.css'

export default function Act5({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [partA, setPartA] = useState(initialAnswers?.partA ?? '')
  const [partB, setPartB] = useState(initialAnswers?.partB ?? '')
  const [partC, setPartC] = useState(initialAnswers?.partC ?? '')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (partA.trim().length < 15 || partB.trim().length < 15 || partC.trim().length < 10) {
      setError('Please answer all three parts before submitting.')
      return
    }
    setError('')
    onSubmit({ partA: partA.trim(), partB: partB.trim(), partC: partC.trim() })
  }

  return (
    <>
      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task</span>
        §07 contains two expert statements from Dr Priya Mehta (Expert A) and Dr Kwame Asante
        (Expert B). Both economists have read the same case file.
        <span className={styles.signpostNote}>→ Read §07 before attempting this activity.</span>
      </div>

      <span className={styles.partLabel}>Part A</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        Identify the strongest point in Dr Mehta's argument. What economic evidence supports it?
        (2 sentences)
      </span>
      <textarea
        className={styles.textarea}
        rows={3}
        placeholder="Dr Mehta's strongest point is…"
        value={partA}
        onChange={e => { setPartA(e.target.value); setError('') }}
      />

      <span className={styles.partLabel}>Part B</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        Identify the specific point at which Dr Mehta's argument is most vulnerable. Use a
        specific figure or finding from the case file to explain why. (3 sentences)
      </span>
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="Dr Mehta's argument is most vulnerable at the point where…"
        value={partB}
        onChange={e => { setPartB(e.target.value); setError('') }}
      />

      <span className={styles.partLabel}>Part C</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 14 }}>
        In one sentence, state which expert's position is better supported by the evidence in
        this case file, and why.
      </span>
      <textarea
        className={styles.textarea}
        rows={2}
        placeholder="The evidence better supports…"
        value={partC}
        onChange={e => { setPartC(e.target.value); setError('') }}
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
