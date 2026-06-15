import { useState, useRef } from 'react'
import s from '../GlobalWarming.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function Act2({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [response, setResponse]         = useState(initialAnswers?.response ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const ready = response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit({ response: response.trim() })
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={s.actSectionHead}>Use this structure for each evidence type</div>
      <div className={s.actSectionDesc}>
        "This evidence shows… / It covers the timescale… / On its own, it does NOT prove…"
        <br />Choose at least three types; you do not need to cover all of them.
      </div>

      <label className={s.actLabel} htmlFor="act2-response">
        Evidence observations — then your summary
      </label>

      <StarterChips starters={sentenceStarters} onInsert={appendStarter} />

      <textarea
        id="act2-response"
        ref={textRef}
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={response}
        onChange={e => { setResponse(e.target.value); setSubmitLocked(false) }}
        onBlur={() => onSave({ response: response.trim() })}
        rows={10}
      />

      <div className={s.actActions}>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={!ready || submitLocked}>
          {submitLocked ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
