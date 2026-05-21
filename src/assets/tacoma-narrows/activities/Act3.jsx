import { useState } from 'react'
import styles from '../TacomaNarrows.module.css'

const Q1_OPTIONS = [
  { value: 'torsional', label: 'Torsional (twisting) oscillation, growing in amplitude, at 0.2 Hz.' },
  { value: 'vertical',  label: 'Vertical (up-and-down) oscillation, relatively stable, at ~0.6 Hz.' },
  { value: 'none',      label: 'No oscillation — the bridge was stable until collapse.' },
]

const Q2_OPTIONS = [
  { value: 'wind',      label: 'The wind speed increased suddenly above 42 mph.' },
  { value: 'cable',     label: 'A midspan stay cable slipped, introducing an asymmetric loading condition.' },
  { value: 'frequency', label: 'The vortex shedding frequency matched the torsional natural frequency.' },
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

export default function Act3({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [q1, setQ1] = useState(initialAnswers?.q1 ?? '')
  const [q2, setQ2] = useState(initialAnswers?.q2 ?? '')
  const [q3, setQ3] = useState(initialAnswers?.q3 ?? '')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!q1 || !q2 || q3.trim().length < 20) {
      setError('Please answer all three questions before continuing.')
      return
    }
    setError('')
    onSubmit({ q1, q2, q3: q3.trim() })
  }

  return (
    <>
      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task</span>
        The incident data in §03 reveals two distinct phases of bridge behaviour on the day of
        collapse. Read the timeline carefully and answer the questions below. You may need to
        scroll back to §03 before completing this activity.
      </div>

      <span className={styles.qLabel}>
        Q1. Which of the following best describes Phase 1 (approximately 07:00–10:00)?
      </span>
      <RadioGroup name="q3-1" options={Q1_OPTIONS} value={q1} onChange={setQ1} />

      <span className={styles.qLabel}>
        Q2. What event appears to have triggered the transition from Phase 1 to Phase 2?
      </span>
      <RadioGroup name="q3-2" options={Q2_OPTIONS} value={q2} onChange={setQ2} />

      <span className={styles.qLabel}>
        Q3. In your own words: why might Phase 1 and Phase 2 require different physical explanations?
      </span>
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="Phase 1 might be explained by… whereas Phase 2…"
        value={q3}
        onChange={e => { setQ3(e.target.value); setError('') }}
      />

      {error && <p style={{ color: 'var(--tn-accent)', fontSize: 13, marginTop: 6 }}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.btn} onClick={onClose}>Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit}>
          Submit →
        </button>
      </div>
    </>
  )
}
