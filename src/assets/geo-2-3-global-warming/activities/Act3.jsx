import { useState } from 'react'
import s from '../GlobalWarming.module.css'

const FACTORS = [
  {
    key: 'solar',
    title: 'Solar output changes',
    hint: 'Mechanism: how would increased solar irradiance warm the Earth? Timing: has solar irradiance been increasing over the post-1950 period? Magnitude: is the solar forcing (IPCC: ~+0.05 W/m² since 1750) sufficient to explain observed warming?',
  },
  {
    key: 'volcanic',
    title: 'Volcanic eruptions',
    hint: 'Mechanism: what do sulphate aerosols do to incoming solar radiation? Timing: do volcanic events produce sustained warming or short-term effects? The Pinatubo example (1991) is key here.',
  },
  {
    key: 'enso',
    title: 'ENSO (El Niño–Southern Oscillation)',
    hint: 'Mechanism: how does El Niño temporarily raise global temperatures? Timing and trend: does ENSO produce a sustained warming trend, or does it oscillate? What happens when ENSO effects are statistically removed from the temperature record?',
  },
]

export default function Act3({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [fields, setFields] = useState({
    solar:    initialAnswers?.solar    ?? '',
    volcanic: initialAnswers?.volcanic ?? '',
    enso:     initialAnswers?.enso     ?? '',
    overall:  initialAnswers?.overall  ?? '',
  })
  const [saveStatus, setSaveStatus] = useState(
    Object.values(initialAnswers ?? {}).some(v => typeof v === 'string' && v.trim()) ? 'saved' : 'not-started'
  )

  const state = () => fields

  const handleChange = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }))
    setSaveStatus('unsaved')
  }

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

  const hasAll = FACTORS.every(f => fields[f.key]?.trim()) && fields.overall?.trim()

  return (
    <form onSubmit={handleSubmit}>
      <div className={s.actInstruction}>
        <div className={s.actInstructionLabel}>Your task</div>
        Examine each of the three natural factors in the Natural Factors section. For each one: describe the mechanism (how it would affect temperature), assess whether its timing and magnitude match the post-1950 warming acceleration, and reach a verdict — can this factor account for what we observe? Then write an overall conclusion: can natural factors, taken together, fully explain the warming since approximately 1950?
      </div>

      {FACTORS.map(factor => (
        <div key={factor.key} className={s.factorGroup}>
          <div className={s.factorGroupHeader}>
            <span className={s.factorGroupTitle}>{factor.title}</span>
          </div>
          <div className={s.factorGroupBody}>
            <div className={s.actSectionDesc}>{factor.hint}</div>
            <textarea
              className={s.actTextarea}
              value={fields[factor.key]}
              onChange={e => handleChange(factor.key, e.target.value)}
              onBlur={handleBlur}
              placeholder={`Mechanism / timing / verdict for ${factor.title.toLowerCase()}…`}
              disabled={isCompleted}
              rows={4}
              aria-label={factor.title}
            />
          </div>
        </div>
      ))}

      <hr className={s.actSectionDivider} />

      <div className={s.actSectionHead}>Overall verdict</div>
      <div className={s.actSectionDesc}>
        Can natural factors — taken together — fully explain the post-1950 warming acceleration? What gap remains?
      </div>
      <textarea
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={fields.overall}
        onChange={e => handleChange('overall', e.target.value)}
        onBlur={handleBlur}
        placeholder="Taken together, natural factors can account for… but cannot explain… because…"
        disabled={isCompleted}
        rows={5}
        aria-label="Overall verdict on natural factors"
      />

      <div className={s.actActions}>
        <span className={`${s.saveStatus} ${saveStatus === 'saved' ? s.saveStatusSaved : saveStatus === 'unsaved' ? s.saveStatusUnsaved : ''}`}>
          {saveStatus === 'saved' ? 'Saved' : saveStatus === 'unsaved' ? 'Unsaved changes' : ''}
        </span>
        <button type="button" className={s.btn} onClick={handleSave} disabled={isCompleted}>
          Save
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isCompleted || !hasAll}>
          {hasAll ? 'Record natural factors evaluation →' : 'Complete all fields first'}
        </button>
      </div>
    </form>
  )
}
