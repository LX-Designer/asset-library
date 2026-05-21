import { useState } from 'react'
import styles from '../TacomaNarrows.module.css'

const Q1_OPTIONS = [
  { value: 'less',     label: 'The solid girder experiences less total force because it has a smaller cross-section.' },
  { value: 'sail',     label: 'The solid girder acts as a sail — presenting a larger effective surface to the wind and creating pressure differences above and below the deck.' },
  { value: 'same',     label: "There is no significant difference in force — the bridge's overall mass determines the wind response." },
]

const Q2_OPTIONS = [
  { value: 'constant', label: 'The aerodynamic forces would remain constant — angle of attack does not affect lift on a flat structure.' },
  { value: 'oppose',   label: 'The changed angle would generate a lift force that opposes the twist, acting as a natural correction.' },
  { value: 'amplify',  label: 'The changed angle would generate a lift force in the same direction as the twist — amplifying it rather than correcting it.' },
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

export default function Act4({ initialAnswers, isCompleted, onSubmit, onClose }) {
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
        The original design called for open-lattice trusses 7.6 m deep. What was built used solid
        plate girders 2.4 m deep. This was not a construction error — it was a deliberate design
        choice. Your task is to explain the physical consequences of that choice.
      </div>

      <span className={styles.qLabel}>
        Q1. Wind hitting an open-lattice truss passes through the gaps. Wind hitting a solid plate
        girder must go around it. What consequence does this have for the force exerted on the bridge deck?
      </span>
      <RadioGroup name="q4-1" options={Q1_OPTIONS} value={q1} onChange={setQ1} />

      <span className={styles.qLabel}>
        Q2. When the solid-girder deck begins to twist slightly, the angle it presents to the wind
        changes. This is similar to what happens with an aerofoil (aircraft wing). What effect would
        this have on the aerodynamic forces acting on the deck?
      </span>
      <RadioGroup name="q4-2" options={Q2_OPTIONS} value={q2} onChange={setQ2} />

      <span className={styles.qLabel}>
        Q3. In your own words: why would an open-lattice truss have been less vulnerable to this effect?
      </span>
      <textarea
        className={styles.textarea}
        rows={3}
        placeholder="An open truss would have been less vulnerable because…"
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
