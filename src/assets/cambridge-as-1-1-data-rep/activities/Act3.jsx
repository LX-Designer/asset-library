import { useMultiPartResponse } from './useMultiPartResponse.js'
import ActivityPart from './ActivityPart.jsx'
import s from './Activity.module.css'

const INITIAL = { ones: '', twos: '', range: '' }

export default function Act3({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const { _submitted, ...saved } = initialAnswers ?? {}
  const { data, saveStatus, handleChange, handleBlur } =
    useMultiPartResponse({ ...INITIAL, ...saved }, onSave)

  const canSubmit = !isCompleted && data.ones.trim() && data.twos.trim() && data.range.trim()

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...data, _submitted: true }) }}>
      {isCompleted && <div className={s.completedBanner}>✓ Submitted</div>}

      <ActivityPart
        label="(a) One's complement of −46"
        hint="Write +46 as an 8-bit binary number, then flip every bit (0→1, 1→0)."
      >
        <textarea
          className={s.monoArea}
          rows={4}
          value={data.ones}
          onChange={e => handleChange('ones', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'+46  = 0010 1110\nFlip = …\n\n−46 in one\'s complement: …'}
        />
      </ActivityPart>

      <ActivityPart
        label="(b) Two's complement of −46"
        hint="Three steps: (1) write +46 in binary, (2) flip all bits, (3) add 1 to the result."
      >
        <textarea
          className={s.monoArea}
          rows={7}
          value={data.twos}
          onChange={e => handleChange('twos', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'+46        = 0010 1110\nFlip bits  = …\nAdd 1    + = 0000 0001\n           ─────────\n−46 (TC)   = …\n\nVerify: 0010 1110 + … = 1 0000 0000 ✓'}
        />
      </ActivityPart>

      <ActivityPart
        label="(c) Range of 8-bit two's complement"
        hint="Use the formula: minimum = −2^(n−1), maximum = +2^(n−1) − 1, where n = 8."
      >
        <input
          className={s.shortInput}
          type="text"
          value={data.range}
          onChange={e => handleChange('range', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          placeholder="… to …"
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
