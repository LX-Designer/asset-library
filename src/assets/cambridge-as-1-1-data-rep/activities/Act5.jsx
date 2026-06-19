import { useMultiPartResponse } from './useMultiPartResponse.js'
import ActivityPart from './ActivityPart.jsx'
import s from './Activity.module.css'

const INITIAL = { bcd: '', hex: '' }

export default function Act5({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const { _submitted, ...saved } = initialAnswers ?? {}
  const { data, saveStatus, handleChange, handleBlur } =
    useMultiPartResponse({ ...INITIAL, ...saved }, onSave)

  const canSubmit = !isCompleted && data.bcd.trim() && data.hex.trim()

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...data, _submitted: true }) }}>
      {isCompleted && <div className={s.completedBanner}>✓ Submitted</div>}

      <ActivityPart
        label="(a) BCD — one practical application"
        hint="Name a specific context (e.g. a type of hardware or system). Explain why BCD is preferred over pure binary there."
      >
        <textarea
          className={s.proseArea}
          rows={5}
          value={data.bcd}
          onChange={e => handleChange('bcd', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          placeholder="Application: …&#10;&#10;Why BCD is preferred: …"
        />
      </ActivityPart>

      <ActivityPart
        label="(b) Hexadecimal — one practical application"
        hint="Name a specific context. Explain why hex is preferred over binary or denary in that context."
      >
        <textarea
          className={s.proseArea}
          rows={5}
          value={data.hex}
          onChange={e => handleChange('hex', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          placeholder="Application: …&#10;&#10;Why hex is preferred: …"
        />
      </ActivityPart>

      <div className={s.footer}>
        <span className={`${s.saveStatus} ${saveStatus === 'saved' ? s.saved : ''}`}>
          {saveStatus === 'unsaved' ? 'Unsaved' : saveStatus === 'saving' ? 'Saving…' : saveStatus === 'not-started' ? '' : '✓ Saved'}
        </span>
        <button className={s.submitBtn} type="submit" disabled={!canSubmit}>
          Submit
        </button>
      </div>
    </form>
  )
}
