import { useState } from 'react'
import s from '../GlobalWarming.module.css'

const CRITERIA = [
  {
    key: 'mechanism',
    label: 'Mechanism',
    question: 'Does the factor produce sustained warming? What is the physical mechanism?',
    naturalHint: 'Solar irradiance, volcanic aerosols, ENSO heat redistribution',
    anthropoHint: 'Enhanced greenhouse effect, energy imbalance, albedo modification',
  },
  {
    key: 'timing',
    label: 'Timing',
    question: 'Does the factor\'s behaviour match the post-1950 warming acceleration?',
    naturalHint: 'What has happened to solar irradiance since ~1980? What does a volcanic event look like in the record?',
    anthropoHint: 'How does the pattern of GHG concentration increase map onto the warming trend?',
  },
  {
    key: 'magnitude',
    label: 'Magnitude',
    question: 'How large is the estimated forcing for this set of factors, and how does it compare to the other explanation? Use EC-10 to find the values.',
    naturalHint: 'What does EC-10 say about the estimated forcing from natural factors since 1750?',
    anthropoHint: 'What does EC-10 say about total estimated anthropogenic forcing since 1750?',
  },
]

export default function Act5({ initialAnswers, onSubmit, onSave }) {
  const [comparison, setComparison] = useState(initialAnswers?.comparison ?? '')
  const [verdict, setVerdict]       = useState(initialAnswers?.verdict    ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)

  const state = () => ({ comparison, verdict })
  const ready = comparison.trim() && verdict.trim()

  const handleBlur = () => onSave(state())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* ── Part A: Comparison ── */}
      <div className={s.actInstruction}>
        <div className={s.actInstructionLabel}>Part A — Attribution comparison</div>
        Using the Comparison Framework section and your previous activity responses, assess both natural and anthropogenic factors against the three criteria below. For each criterion, note how each set of factors performs. Pay particular attention to the post-1950 divergence: solar irradiance has been flat or slightly declining since ~1980, while temperatures have continued to rise sharply.
      </div>

      {CRITERIA.map(c => (
        <div key={c.key} className={s.factorGroup}>
          <div className={s.factorGroupHeader}>
            <span className={s.factorGroupTitle}>{c.label}</span>
            <span className={s.factorGroupHint}>{c.question}</span>
          </div>
          <div className={s.factorGroupBody}>
            <div className={s.actSectionDesc}>
              <strong>Natural factors to consider:</strong> {c.naturalHint}<br />
              <strong>Anthropogenic factors to consider:</strong> {c.anthropoHint}
            </div>
          </div>
        </div>
      ))}

      <label className={s.actLabel} htmlFor="act5-comparison">
        Your comparison — work through all three criteria (mechanism, timing, magnitude)
      </label>
      <textarea
        id="act5-comparison"
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={comparison}
        onChange={e => { setComparison(e.target.value); setSubmitLocked(false) }}
        onBlur={handleBlur}
        placeholder="Compare natural and anthropogenic factors across each criterion. For each criterion, assess how well each set of factors fits the evidence. Aim for 2–3 sentences per criterion."
        rows={9}
      />

      <hr className={s.actSectionDivider} />

      {/* ── Part B: Attribution verdict ── */}
      <div className={s.actInstruction}>
        <div className={s.actInstructionLabel}>Part B — Attribution verdict</div>
        Write a paragraph-length attribution verdict: which explanation fits the evidence better, and why? You do not need to dismiss natural factors entirely — but you do need to explain what they can and cannot account for. Include the post-1950 divergence specifically.
      </div>

      <label className={s.actLabel} htmlFor="act5-verdict">
        Attribution verdict — which explanation fits the evidence better?
      </label>
      <textarea
        id="act5-verdict"
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={verdict}
        onChange={e => { setVerdict(e.target.value); setSubmitLocked(false) }}
        onBlur={handleBlur}
        placeholder="State your overall verdict: which explanation fits the evidence better, and why? Draw on your comparison above."
        rows={7}
      />

      <div className={s.actActions}>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={!ready || submitLocked}>
          {submitLocked ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
