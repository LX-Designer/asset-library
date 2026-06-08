import { useState } from 'react'
import s from '../GlobalWarming.module.css'

export default function Act1({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [response, setResponse] = useState(initialAnswers?.response ?? '')
  const [saveStatus, setSaveStatus] = useState(
    initialAnswers?.response?.trim() ? 'saved' : 'not-started'
  )

  const state = () => ({ response })

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
      <div className={s.actInstruction}>
        <div className={s.actInstructionLabel}>Your task</div>
        Look at the temperature anomaly record in The Anomaly section. In your own words: what pattern do you see? When does something unusual appear to happen? Write 3–6 sentences describing what you observe — without yet explaining it. Then ask yourself: is this within the range of normal climate variability, or does it suggest something else is happening? How would you even begin to investigate that question?
      </div>

      <label className={s.actLabel} htmlFor="act1-response">
        Describe what you observe — and the question it raises for you
      </label>
      <textarea
        id="act1-response"
        className={s.actTextarea}
        value={response}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="The temperature record shows… Something unusual happens around… This raises the question of whether…"
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
