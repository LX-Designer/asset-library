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
    question: 'Is the effect large enough? Natural: ~+0.05 W/m² vs. anthropogenic: ~+2.7 W/m² since 1750.',
    naturalHint: 'IPCC estimates solar forcing at ~+0.05 W/m² since 1750',
    anthropoHint: 'IPCC estimates total anthropogenic forcing at ~+2.7 W/m² — approximately 54× natural',
  },
]

export default function Act5({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [comparison, setComparison] = useState(initialAnswers?.comparison ?? '')
  const [verdict, setVerdict]       = useState(initialAnswers?.verdict    ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.comparison?.trim() || initialAnswers?.verdict?.trim()) ? 'saved' : 'not-started'
  )

  const state = () => ({ comparison, verdict })

  const handleBlur = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  const handleSave = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state())
    setSaveStatus('saved')
  }

  const hasAll = comparison.trim() && verdict.trim()

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
        onChange={e => { setComparison(e.target.value); setSaveStatus('unsaved') }}
        onBlur={handleBlur}
        placeholder={"Mechanism: Natural factors produce… whereas anthropogenic GHG forcing produces…\n\nTiming: The post-1950 divergence shows… Solar irradiance since ~1980 has… while temperatures…\n\nMagnitude: Natural forcing (~+0.05 W/m²) compares to anthropogenic forcing (~+2.7 W/m²) in this way…"}
        disabled={isCompleted}
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
        onChange={e => { setVerdict(e.target.value); setSaveStatus('unsaved') }}
        onBlur={handleBlur}
        placeholder="Natural factors can account for… but cannot explain… because… The anthropogenic explanation fits better because… The post-1950 divergence specifically shows… My overall attribution verdict is…"
        disabled={isCompleted}
        rows={7}
      />

      <div className={s.actActions}>
        <span className={`${s.saveStatus} ${saveStatus === 'saved' ? s.saveStatusSaved : saveStatus === 'unsaved' ? s.saveStatusUnsaved : ''}`}>
          {saveStatus === 'saved' ? 'Saved' : saveStatus === 'unsaved' ? 'Unsaved changes' : ''}
        </span>
        <button type="button" className={s.btn} onClick={handleSave} disabled={isCompleted}>
          Save
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isCompleted || !hasAll}>
          {hasAll ? 'Record attribution comparison →' : 'Complete both parts first'}
        </button>
      </div>
    </form>
  )
}
