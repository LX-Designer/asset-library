import { useState } from 'react'
import styles from '../FastFashion.module.css'

const OPTIONS = [
  { value: 'strongly-agree',    label: 'Strongly agree'    },
  { value: 'agree',             label: 'Agree'             },
  { value: 'unsure',            label: 'Unsure'            },
  { value: 'disagree',          label: 'Disagree'          },
  { value: 'strongly-disagree', label: 'Strongly disagree' },
]

export default function Act1({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [choice,    setChoice]    = useState(initialAnswers?.choice    ?? '')
  const [reasoning, setReasoning] = useState(initialAnswers?.reasoning ?? '')
  const [error,     setError]     = useState('')

  function handleSubmit() {
    if (!choice) {
      setError('Please select an option before continuing.')
      return
    }
    if (reasoning.trim().length < 15) {
      setError('Please write a brief explanation before continuing.')
      return
    }
    setError('')
    onSubmit({ choice, reasoning: reasoning.trim() })
  }

  return (
    <>
      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task — Before you read</span>
        Read the following claim and record your initial position. Attempt this before reading the
        case file.
        <br /><br />
        <em>
          "Shein is one of the most productive firms in the history of the fashion industry. It
          produces more garments, more quickly, and at lower cost than any competitor. On these
          grounds, the fast fashion market is working well and requires no intervention."
        </em>
        <span className={styles.signpostNote}>→ Complete both parts before submitting.</span>
      </div>

      <span className={styles.partLabel}>Part A — Do you agree with this claim?</span>
      <div className={styles.radioGroup}>
        {OPTIONS.map(opt => (
          <label
            key={opt.value}
            className={`${styles.radioOption} ${choice === opt.value ? styles.radioOptionSelected : ''}`}
            onClick={() => { setChoice(opt.value); setError('') }}
          >
            <input
              type="radio"
              name="act1-choice"
              value={opt.value}
              checked={choice === opt.value}
              onChange={() => { setChoice(opt.value); setError('') }}
            />
            {opt.label}
          </label>
        ))}
      </div>

      <span className={styles.partLabel}>Part B — Explain your reasoning (2–3 sentences)</span>
      <span className={styles.qLabel} style={{ textTransform: 'none', fontSize: 13 }}>
        What concept or principle are you drawing on?
      </span>
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="My reasoning is that…"
        value={reasoning}
        onChange={e => { setReasoning(e.target.value); setError('') }}
      />

      {error && <p style={{ color: 'var(--ff-accent-warm)', fontSize: 13, marginTop: 8 }}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.btn} onClick={onClose}>Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit}>
          Record position →
        </button>
      </div>
    </>
  )
}
