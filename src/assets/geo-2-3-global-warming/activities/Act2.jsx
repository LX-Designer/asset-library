import { useState, useRef } from 'react'
import s from '../GlobalWarming.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function Act2({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const [response, setResponse] = useState(initialAnswers?.response ?? '')
  const [saveStatus, setSaveStatus] = useState(
    initialAnswers?.response?.trim() ? 'saved' : 'not-started'
  )
  const textRef = useRef(null)

  const state = () => ({ response })

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSaveStatus('unsaved')
    onSave({ response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const handleBlur = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  const handleChange = (e) => {
    setResponse(e.target.value)
    setSaveStatus('unsaved')
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

      <StarterChips starters={sentenceStarters} onInsert={appendStarter} disabled={isCompleted} />

      <textarea
        id="act2-response"
        ref={textRef}
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={response}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isCompleted}
        rows={10}
      />

      <div className={s.actActions}>
        <span className={`${s.saveStatus} ${saveStatus === 'saved' ? s.saveStatusSaved : saveStatus === 'unsaved' ? s.saveStatusUnsaved : ''}`}>
          {saveStatus === 'saved' ? 'Saved' : saveStatus === 'unsaved' ? 'Unsaved changes' : ''}
        </span>
        <button type="button" className={s.btn} onClick={handleSave} disabled={isCompleted || !response.trim()}>
          Save
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isCompleted || response.trim().length < 40}>
          {response.trim().length < 40 ? 'Write more first' : 'Record evidence review →'}
        </button>
      </div>
    </form>
  )
}
