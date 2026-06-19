import { useMultiPartResponse } from './useMultiPartResponse.js'
import ActivityPart from './ActivityPart.jsx'
import s from './Activity.module.css'

const INITIAL = { calculation: '', explanation: '' }

export default function Act1({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const { _submitted, ...saved } = initialAnswers ?? {}
  const { data, saveStatus, handleChange, handleBlur } =
    useMultiPartResponse({ ...INITIAL, ...saved }, onSave)

  const canSubmit = !isCompleted && data.calculation.trim() && data.explanation.trim()

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...data, _submitted: true }) }}>
      {isCompleted && <div className={s.completedBanner}>✓ Submitted</div>}

      <ActivityPart
        label="(a) Calculation"
        hint="Start from 1 TB = 10¹² bytes. Convert to GiB by dividing by 2³⁰ = 1,073,741,824. Show the division."
      >
        <textarea
          className={s.monoArea}
          rows={5}
          value={data.calculation}
          onChange={e => handleChange('calculation', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'1 TB = 10¹² bytes\n÷ 2³⁰ bytes per GiB\n= …'}
        />
      </ActivityPart>

      <ActivityPart
        label="(b) Explanation"
        hint="Why do manufacturers and operating systems report different numbers for the same device?"
      >
        <textarea
          className={s.proseArea}
          rows={5}
          value={data.explanation}
          onChange={e => handleChange('explanation', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          placeholder="Manufacturers use SI decimal prefixes (powers of 10) because…"
        />
      </ActivityPart>

      <div className={s.footer}>
        <span className={`${s.saveStatus} ${saveStatus === 'saving' ? s.saving : saveStatus === 'saved' ? s.saved : ''}`}>
          {saveStatus === 'unsaved' ? 'Unsaved' : saveStatus === 'saving' ? 'Saving…' : saveStatus === 'not-started' ? '' : '✓ Saved'}
        </span>
        <button className={s.submitBtn} type="submit" disabled={!canSubmit}>
          Submit
        </button>
      </div>
    </form>
  )
}
