import { useState } from 'react'
import styles from '../TacomaNarrows.module.css'

const Q1_OPTIONS = [
  { value: 'yes',     label: 'Yes — the frequencies were close enough to produce resonance.' },
  { value: 'no',      label: 'No — the vortex frequency (1.0 Hz) and torsional frequency (0.2 Hz) differ by a factor of 5.' },
  { value: 'partial', label: 'Partially — the early vertical oscillation (~0.6 Hz) is closer to vortex frequency, but the collapse-phase data contradicts resonance.' },
]

const Q2_OPTIONS = [
  { value: 'wind',      label: 'The wind speed was steady at 42 mph — it did not increase as the oscillation grew.' },
  { value: 'always',   label: 'The bridge had been oscillating since it was built — so any wind would cause collapse eventually.' },
  { value: 'resonance', label: 'The resonance model predicts the bridge should have been stable below its rated wind load.' },
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

export default function Act5({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [q1, setQ1] = useState(initialAnswers?.q1 ?? '')
  const [q2, setQ2] = useState(initialAnswers?.q2 ?? '')
  const [q3, setQ3] = useState(initialAnswers?.q3 ?? '')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!q1 || !q2 || q3.trim().length < 20) {
      setError('Please answer all questions before continuing.')
      return
    }
    setError('')
    onSubmit({ q1, q2, q3: q3.trim() })
  }

  return (
    <>
      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task</span>
        You have read the statements of Dr. Brandt (resonance) and Dr. Osei-Mensah (aeroelastic
        flutter) in §05. Both experts had access to the same case file data. Using the evidence,
        evaluate each argument. Which account is better supported — and where does the weaker
        argument fail?
      </div>

      <span className={styles.qLabel}>
        Q1. Dr. Brandt states the vortex shedding frequency "would have been in a similar range"
        to the natural frequency. Is this supported by the data in §03?
      </span>
      <RadioGroup name="q5-1" options={Q1_OPTIONS} value={q1} onChange={setQ1} />

      <span className={styles.qLabel}>
        Q2. Dr. Osei-Mensah claims the motion at collapse was "self-reinforcing" — the bridge's own
        movement generated the forces that amplified the motion. Which piece of evidence best
        supports this claim?
      </span>
      <RadioGroup name="q5-2" options={Q2_OPTIONS} value={q2} onChange={setQ2} />

      <span className={styles.qLabel}>
        Q3. In your own words: identify the strongest piece of data in this case file that the
        resonance explanation cannot account for.
      </span>
      <textarea
        className={styles.textarea}
        rows={3}
        placeholder="The resonance explanation cannot account for…"
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
