import { useState, useContext } from 'react'
import s from '../FranceRepublic.module.css'
import { FranceCtx } from '../FranceContext.js'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

export default function ActReflection({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const { responses } = useContext(FranceCtx)

  const [text,       setText]       = useState(initialAnswers?.text ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.text?.trim()) ? 'saved' : 'not-started'
  )

  const initText  = responses?.init?.text
  const finalText = responses?.final?.response

  const handleBlur = () => {
    onSave({ text })
    setSaveStatus('saved')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ text })
    setSaveStatus('saved')
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
        <textarea
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
          placeholder="Compare your starting judgement with your final answer. What changed, what stayed the same, and which evidence most affected your thinking?"
          disabled={isCompleted}
        />
      </div>

      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button type="submit" className={s.saveBtn} disabled={isCompleted}>
          Save reflection
        </button>
      </div>

    </form>
  )
}
