import { useState, useRef, useContext } from 'react'
import s from '../FranceRepublic.module.css'
import { FranceCtx } from '../FranceContext.js'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

export default function ActReflection({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const { responses } = useContext(FranceCtx)

  const [text,       setText]       = useState(initialAnswers?.text ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.text?.trim()) ? 'saved' : 'not-started'
  )
  const textRef = useRef(null)

  const initText  = responses?.init?.text
  const finalText = responses?.final?.response

  const appendStarter = (starter) => {
    const next = text ? `${text}\n\n${starter}` : starter
    setText(next)
    setSaveStatus('unsaved')
    onSave({ text: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

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
        <StarterChips starters={sentenceStarters} onInsert={appendStarter} disabled={isCompleted} />
        <textarea
          ref={textRef}
          className={s.responseTextarea}
          value={text}
          onChange={e => { setText(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
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
