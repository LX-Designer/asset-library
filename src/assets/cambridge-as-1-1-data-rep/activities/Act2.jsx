import { useMultiPartResponse } from './useMultiPartResponse.js'
import ActivityPart from './ActivityPart.jsx'
import s from './Activity.module.css'

const INITIAL = { binary: '', hex: '', bcd: '' }

export default function Act2({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const { _submitted, ...saved } = initialAnswers ?? {}
  const { data, saveStatus, handleChange, handleBlur } =
    useMultiPartResponse({ ...INITIAL, ...saved }, onSave)

  const canSubmit = !isCompleted && data.binary.trim() && data.hex.trim() && data.bcd.trim()

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...data, _submitted: true }) }}>
      {isCompleted && <div className={s.completedBanner}>✓ Submitted</div>}

      <ActivityPart
        label="(a) Binary"
        hint="Divide 173 by 2 repeatedly. Record each quotient and remainder. Read the remainders bottom to top to get the binary result."
      >
        <textarea
          className={s.monoArea}
          rows={10}
          value={data.binary}
          onChange={e => handleChange('binary', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'173 ÷ 2 = 86  r 1\n 86 ÷ 2 = 43  r 0\n 43 ÷ 2 = …\n\nBinary result: 1…'}
        />
      </ActivityPart>

      <ActivityPart
        label="(b) Hexadecimal"
        hint="Group your binary result into nibbles (4-bit groups) from the right. Convert each nibble to a single hex digit using the table in Section 2."
      >
        <textarea
          className={s.monoArea}
          rows={4}
          value={data.hex}
          onChange={e => handleChange('hex', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'Binary: 1010 1101\nNibbles: 1010 | 1101\nHex:      A  |  D  = …'}
        />
      </ActivityPart>

      <ActivityPart
        label="(c) BCD"
        hint="Encode each decimal digit of 173 independently as a 4-bit group — do not convert the whole number."
      >
        <textarea
          className={s.monoArea}
          rows={4}
          value={data.bcd}
          onChange={e => handleChange('bcd', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'1 → 0001\n7 → 0111\n3 → 0011\nBCD: …'}
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
