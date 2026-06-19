import { useMultiPartResponse } from './useMultiPartResponse.js'
import ActivityPart from './ActivityPart.jsx'
import s from './Activity.module.css'

const INITIAL = { decoded: '', ascii: '', unicode: '' }

export default function Act6({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const { _submitted, ...saved } = initialAnswers ?? {}
  const { data, saveStatus, handleChange, handleBlur } =
    useMultiPartResponse({ ...INITIAL, ...saved }, onSave)

  const canSubmit = !isCompleted && data.decoded.trim() && data.ascii.trim() && data.unicode.trim()

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...data, _submitted: true }) }}>
      {isCompleted && <div className={s.completedBanner}>✓ Submitted</div>}

      <ActivityPart
        label="(a) Decode the sequence: 72  101  108  108  111"
        hint="Use the ASCII table in Section 6. Remember: A = 65, a = 97. Count up from the nearest anchor."
      >
        <input
          className={s.shortInput}
          type="text"
          value={data.decoded}
          onChange={e => handleChange('decoded', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          placeholder="Decoded word: …"
        />
      </ActivityPart>

      <ActivityPart
        label="(b) Why is ASCII insufficient for a global application?"
        hint="Consider how many characters ASCII supports and what it cannot represent."
      >
        <textarea
          className={s.proseArea}
          rows={4}
          value={data.ascii}
          onChange={e => handleChange('ascii', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          placeholder="ASCII only supports 128 characters (7 bits), which means…"
        />
      </ActivityPart>

      <ActivityPart
        label="(c) How do Unicode and UTF-8 solve this problem?"
        hint="Explain what Unicode adds (code points, range), and how UTF-8 encodes them efficiently while remaining backward-compatible."
      >
        <textarea
          className={s.proseArea}
          rows={5}
          value={data.unicode}
          onChange={e => handleChange('unicode', e.target.value)}
          onBlur={handleBlur}
          disabled={isCompleted}
          placeholder="Unicode assigns a unique code point (U+XXXX) to every character across all writing systems…"
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
