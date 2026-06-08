import { useState } from 'react'
import s from '../GlobalWarming.module.css'

export default function Act2({ initialAnswers, isCompleted, onSubmit, onSave }) {
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
        Explore the evidence archive — Proxy Evidence and Instrumental and Physical Observations. Choose at least three types of evidence and for each, record: (1) what the evidence shows, (2) the timescale it covers, and (3) what it does NOT tell you on its own. Pay particular attention to the difference between detecting a warming signal and attributing it to a cause. When you're done, write a short summary: what is the strongest evidence that warming is happening, and what question does the evidence leave unanswered?
      </div>

      <div className={s.actSectionHead}>Use this structure for each evidence type</div>
      <div className={s.actSectionDesc}>
        "This evidence shows… / It covers the timescale… / On its own, it does NOT prove…"
        <br />Choose at least three types; you do not need to cover all of them.
      </div>

      <label className={s.actLabel} htmlFor="act2-response">
        Evidence observations — then your summary
      </label>
      <textarea
        id="act2-response"
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={response}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={"Evidence type 1 (e.g. Ice cores):\nThis evidence shows…\nIt covers the timescale…\nOn its own, it does NOT prove…\n\nEvidence type 2:\n…\n\nSummary: The strongest evidence that warming is happening is…"}
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
