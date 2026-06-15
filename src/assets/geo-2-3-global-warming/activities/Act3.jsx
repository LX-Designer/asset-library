import { useState, useRef } from 'react'
import s from '../GlobalWarming.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

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

export default function Act3({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const [fields, setFields] = useState({
    solar:    initialAnswers?.solar    ?? '',
    volcanic: initialAnswers?.volcanic ?? '',
    enso:     initialAnswers?.enso     ?? '',
    overall:  initialAnswers?.overall  ?? '',
  })
  const [saveStatus, setSaveStatus] = useState(
    Object.values(initialAnswers ?? {}).some(v => typeof v === 'string' && v.trim()) ? 'saved' : 'not-started'
  )
  const lastFocusedKey = useRef('overall')

  const state = () => fields

  const appendStarter = (starter) => {
    const key = lastFocusedKey.current
    setFields(prev => {
      const next = prev[key] ? `${prev[key]}\n\n${starter}` : starter
      const updated = { ...prev, [key]: next }
      onSave(updated)
      return updated
    })
    setSaveStatus('unsaved')
  }

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
      <StarterChips starters={sentenceStarters} onInsert={appendStarter} disabled={isCompleted} />

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
              onFocus={() => { lastFocusedKey.current = factor.key }}
              onBlur={handleBlur}
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
        onFocus={() => { lastFocusedKey.current = 'overall' }}
        onBlur={handleBlur}
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
