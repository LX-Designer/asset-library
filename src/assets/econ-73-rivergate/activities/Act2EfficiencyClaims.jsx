import { useState } from 'react'
import styles from '../RivergateOverflow.module.css'

const JUDGEMENT_OPTIONS = ['', 'Supported', 'Not supported', 'Cannot tell']

const CLAIMS = [
  {
    num: '01',
    text: 'North Wessex may have controlled its private operating costs.',
  },
  {
    num: '02',
    text: 'North Wessex achieved allocative efficiency for society.',
  },
  {
    num: '03',
    text: 'The delayed upgrade improved dynamic efficiency.',
  },
  {
    num: '04',
    text: 'Lower bills alone prove Pareto optimality.',
  },
]

export default function Act2EfficiencyClaims({ initialAnswers, isCompleted, onSubmit, onClose }) {
  const [matches, setMatches] = useState(() => {
    if (initialAnswers?.matches) return initialAnswers.matches
    return { '01': '', '02': '', '03': '', '04': '' }
  })
  const [explanation, setExplanation] = useState(initialAnswers?.explanation ?? '')
  const [error, setError] = useState('')

  function setMatch(num, val) {
    setMatches(prev => ({ ...prev, [num]: val }))
    setError('')
  }

  function handleSubmit() {
    const allSet = CLAIMS.every(c => matches[c.num] !== '')
    if (!allSet) {
      setError('Complete all four matching judgements before submitting.')
      return
    }
    if (explanation.trim().length < 20) {
      setError('Write a brief justification before submitting.')
      return
    }
    setError('')
    onSubmit({ matches, explanation: explanation.trim() })
  }

  return (
    <>
      {isCompleted && (
        <div className={styles.submittedNote}>Response recorded — you may edit and resubmit.</div>
      )}

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Task prompt</span>
        <p className={styles.formPrompt}>
          The case file contains both company performance data and environmental service data.
          Use the evidence to decide which efficiency claims are actually supported.
        </p>
      </div>

      <div className={styles.formSection}>
        <span className={styles.formLabel}>Part A — Match each claim to the strongest judgement</span>
        <table className={styles.matchingTable}>
          <thead>
            <tr>
              <th style={{ fontFamily: 'var(--rg-mono)', fontSize: 10, color: 'var(--rg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 0', borderBottom: '1px solid var(--rg-line)', width: '62%' }}>Claim</th>
              <th style={{ fontFamily: 'var(--rg-mono)', fontSize: 10, color: 'var(--rg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 0', borderBottom: '1px solid var(--rg-line)', width: '38%' }}>Judgement</th>
            </tr>
          </thead>
          <tbody>
            {CLAIMS.map(({ num, text }) => (
              <tr key={num}>
                <td className={styles.matchingClaimCell}>
                  <span className={styles.matchingClaimNum}>Claim {num}</span>
                  <span className={styles.matchingClaimText}>{text}</span>
                </td>
                <td className={styles.matchingSelectCell}>
                  <select
                    className={`${styles.matchingSelect} ${matches[num] ? styles.matchingSelectDone : ''}`}
                    value={matches[num]}
                    onChange={e => setMatch(num, e.target.value)}
                    aria-label={`Judgement for claim ${num}`}
                  >
                    {JUDGEMENT_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt || '— Select —'}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className={styles.formDivider} />

      <div className={styles.formSection}>
        <label className={styles.formLabel} htmlFor="act2-explanation">
          Part B — Justify one judgement using specific evidence
        </label>
        <p className={styles.formPrompt} style={{ marginBottom: 8 }}>
          Choose one claim above and justify your judgement using one specific piece of evidence
          from the case file.
        </p>
        <textarea
          id="act2-explanation"
          className={styles.textarea}
          rows={4}
          placeholder="Claim 02 is 'Not supported' because…"
          value={explanation}
          onChange={e => { setExplanation(e.target.value); setError('') }}
        />
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.actionsRow}>
        <button className={styles.btn} onClick={onClose} type="button">Cancel</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit} type="button">
          Submit matching →
        </button>
      </div>
    </>
  )
}
