import { useState } from 'react'
import styles from '../TacomaNarrows.module.css'

const Q1_OPTIONS = [
  { value: 'a', label: 'They would need to be equal or very close to each other.' },
  { value: 'b', label: 'The vortex frequency would need to be higher than the torsional frequency.' },
  { value: 'c', label: "The frequencies don't need to match for resonance to occur." },
]

const Q2_OPTIONS = [
  { value: 'yes',     label: 'Yes — the data is consistent with resonance.' },
  { value: 'no',      label: "No — the frequencies don't match, so resonance cannot explain the torsional collapse." },
  { value: 'partial', label: 'Partially — resonance may explain the early vertical oscillation but not the torsional collapse.' },
]

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className={styles.radioGroup}>
      {options.map(opt => (
        <label
          key={opt.value}
          className={`${styles.radioOption} ${value === opt.value ? styles.radioOptionSelected : ''}`}
          onClick={() => onChange(opt.value)}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

export default function Act2({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [q1, setQ1] = useState(initialAnswers?.q1 ?? '')
  const [q2, setQ2] = useState(initialAnswers?.q2 ?? '')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!q1 || !q2) {
      setError('Please answer both questions before continuing.')
      return
    }
    setError('')
    onSubmit({ q1, q2 })
  }

  return (
    <>
      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task</span>
        The resonance explanation requires that the wind's forcing frequency matches the bridge's
        natural frequency. Use the data in §03 of the case file to evaluate whether this condition
        was met. Answer the questions below.
      </div>

      <div className={styles.calcGrid}>
        <div className={styles.calcBox}>
          <span className={styles.calcLabel}>Vortex shedding frequency (42 mph wind)</span>
          <div>
            <span className={styles.calcValue}>~1.0</span>
            <span className={styles.calcUnit}>Hz</span>
          </div>
        </div>
        <div className={styles.calcBox}>
          <span className={styles.calcLabel}>Torsional oscillation frequency at collapse</span>
          <div>
            <span className={styles.calcValue}>0.2</span>
            <span className={styles.calcUnit}>Hz</span>
          </div>
        </div>
        <div className={styles.calcBox}>
          <span className={styles.calcLabel}>Natural vertical frequency of bridge</span>
          <div>
            <span className={styles.calcValue}>~0.6</span>
            <span className={styles.calcUnit}>Hz</span>
          </div>
        </div>
        <div className={styles.calcBox}>
          <span className={styles.calcLabel}>Ratio: vortex ÷ torsional</span>
          <div>
            <span className={styles.calcValue}>5×</span>
            <span className={styles.calcUnit}>difference</span>
          </div>
        </div>
      </div>

      <span className={styles.qLabel}>
        Q1. For resonance to explain the torsional collapse, what would need to be true about the two frequencies?
      </span>
      <RadioGroup name="q2-1" options={Q1_OPTIONS} value={q1} onChange={setQ1} />

      <span className={styles.qLabel}>
        Q2. Based on the data, does resonance explain the torsional collapse?
      </span>
      <RadioGroup name="q2-2" options={Q2_OPTIONS} value={q2} onChange={setQ2} />

      {error && <p style={{ color: 'var(--tn-accent)', fontSize: 13, marginTop: 10 }}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.btn} onClick={onClose}>Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit}>
          Submit answers →
        </button>
      </div>
    </>
  )
}
