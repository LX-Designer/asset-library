import { useMultiPartResponse } from './useMultiPartResponse.js'
import ActivityPart from './ActivityPart.jsx'
import s from './Activity.module.css'

const INITIAL = { addition: '', subtraction: '', overflow: '' }

export default function Act4({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const { _submitted, ...saved } = initialAnswers ?? {}
  const { data, saveStatus, handleChange, handleBlur } =
    useMultiPartResponse({ ...INITIAL, ...saved }, onSave)

  const canSubmit = !isCompleted && data.addition.trim() && data.subtraction.trim() && data.overflow.trim()

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...data, _submitted: true }) }}>
      {isCompleted && <div className={s.completedBanner}>✓ Submitted</div>}

      <ActivityPart
        label="(a) Binary addition — 01101011 + 00111100"
        hint="Work right to left. Write carry bits above each column before moving on. Verify the denary sum."
      >
        <textarea
          className={s.monoArea}
          rows={7}
          value={data.addition}
          onChange={e => handleChange('addition', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'Carries: _ _ _ _ _ _ _ _\n  0110 1011  (107)\n+ 0011 1100  ( 60)\n──────────\n  …         (…)\n\nVerify: 107 + 60 = …'}
        />
      </ActivityPart>

      <ActivityPart
        label="(b) Subtraction — 01001010 − 00110101 (via two's complement)"
        hint="Step 1: negate 00110101 (flip all bits, then add 1). Step 2: add the result to 01001010. Discard any carry out of the MSB."
      >
        <textarea
          className={s.monoArea}
          rows={10}
          value={data.subtraction}
          onChange={e => handleChange('subtraction', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'Step 1 — negate 00110101:\n  00110101  (53)\n  ………………  flip bits\n+ 00000001  add 1\n  ────────\n  ………………  = −53\n\nStep 2 — add:\n  01001010  (74)\n+ ………………  (−53)\n  ────────\n  ………………  = … (carry discarded)'}
        />
      </ActivityPart>

      <ActivityPart
        label="(c) Overflow — example and explanation"
        hint="Choose two positive 8-bit values whose sum exceeds +127. Show the addition, then explain why the result is wrong."
      >
        <textarea
          className={s.monoArea}
          rows={7}
          value={data.overflow}
          onChange={e => handleChange('overflow', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          spellCheck={false}
          placeholder={'Example:\n  0111 1111  (+127)\n+ 0000 0001  (+1)\n  ─────────\n  …          (appears as … — overflow)\n\nExplanation: overflow occurs when …'}
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
