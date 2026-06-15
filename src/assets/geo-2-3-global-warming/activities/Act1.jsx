import { useState, useRef } from 'react'
import s from '../GlobalWarming.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function Act1({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
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
      <label className={s.actLabel} htmlFor="act1-response">
        Describe what you observe — and the question it raises for you
      </label>

      <StarterChips starters={sentenceStarters} onInsert={appendStarter} disabled={isCompleted} />

      <textarea
        id="act1-response"
        ref={textRef}
        className={s.actTextarea}
        value={response}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isCompleted}
        rows={6}
      />

      <div className={s.actActions}>
        <span className={`${s.saveStatus} ${saveStatus === 'saved' ? s.saveStatusSaved : saveStatus === 'unsaved' ? s.saveStatusUnsaved : ''}`}>
          {saveStatus === 'saved' ? 'Saved' : saveStatus === 'unsaved' ? 'Unsaved changes' : ''}
        </span>
        <button type="button" className={s.btn} onClick={handleSave} disabled={isCompleted || !response.trim()}>
          Save
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isCompleted || response.trim().length < 20}>
          {response.trim().length < 20 ? 'Write more first' : 'Record observation →'}
        </button>
      </div>
    </form>
  )
}
