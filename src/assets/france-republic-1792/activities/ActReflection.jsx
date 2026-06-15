import { useState, useRef, useContext } from 'react'
import s from '../FranceRepublic.module.css'
import { FranceCtx } from '../FranceContext.js'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function ActReflection({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const { responses } = useContext(FranceCtx)

  const [text,       setText]       = useState(initialAnswers?.text ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const initText  = responses?.init?.text
  const finalText = responses?.final?.response
  const ready = text.trim().length > 0

  const appendStarter = (starter) => {
    const next = text ? `${text}\n\n${starter}` : starter
    setText(next)
    setSubmitLocked(false)
    onSave({ text: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit({ text })
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>

      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Your starting judgement</div>
        <div className={s.prevResponseBox}>
          {initText ?? <span className={s.prevResponseEmpty}>Not recorded</span>}
        </div>
      </div>

      <div className={s.synthSection}>
        <div className={s.synthSectionTitle}>Your final historical briefing</div>
        <div className={s.prevResponseBox}>
          {finalText ?? <span className={s.prevResponseEmpty}>Not yet completed</span>}
        </div>
      </div>

      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My reflection</label>
        <StarterChips starters={sentenceStarters} onInsert={appendStarter} />
        <textarea
          ref={textRef}
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSubmitLocked(false) }}
          onBlur={() => onSave({ text })}
        />
      </div>

      <div className={s.saveRow}>
        <button type="submit" className={s.saveBtn} disabled={!ready || submitLocked}>
          {submitLocked ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>

    </form>
  )
}
