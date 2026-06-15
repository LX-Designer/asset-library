import { useState, useRef } from 'react'
import styles from '../TacomaNarrows.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function Act5({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [response, setResponse]         = useState(initialAnswers?.response ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const ready = response.trim().length > 0

  const appendStarter = (starter) => {
    setResponse(prev => prev ? `${prev}\n\n${starter}` : starter)
    setSubmitLocked(false)
    setTimeout(() => textRef.current?.focus(), 50)
  }

  function handleSubmit() {
    if (!ready) return
    onSubmit({ response: response.trim() })
    setSubmitLocked(true)
  }

  return (
    <>
      <StarterChips starters={sentenceStarters} onInsert={appendStarter} />
      <textarea
        ref={textRef}
        className={`${styles.textarea} ${styles.textareaLg}`}
        rows={8}
        value={response}
        onChange={e => { setResponse(e.target.value); setSubmitLocked(false) }}
        onBlur={() => onSave?.({ response: response.trim() })}
      />

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmit}
          type="button"
          disabled={!ready || submitLocked}
        >
          {submitLocked ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>
    </>
  )
}
