import { useState, useRef } from 'react'
import styles from '../TacomaNarrows.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

function wordCount(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

function wordCountLabel(n) {
  if (n === 0) return ''
  if (n < 50)  return `${n} words`
  return `${n} words ✓`
}

export default function Act4({ initialAnswers, isCompleted, onSubmit, onClose, sentenceStarters = [] }) {
  const [response, setResponse] = useState(initialAnswers?.response ?? '')
  const [error, setError]       = useState('')
  const textRef = useRef(null)

  const wc = wordCount(response)

  const appendStarter = (starter) => {
    setResponse(prev => prev ? `${prev}\n\n${starter}` : starter)
    setError('')
    setTimeout(() => textRef.current?.focus(), 50)
  }

  function handleSubmit() {
    if (response.trim().length < 20) {
      setError('Please write a response before submitting.')
      return
    }
    setError('')
    onSubmit({ response: response.trim() })
  }

  return (
    <>
      <StarterChips starters={sentenceStarters} onInsert={appendStarter} disabled={isCompleted} />
      <textarea
        ref={textRef}
        className={`${styles.textarea} ${styles.textareaLg}`}
        rows={8}
        value={response}
        onChange={e => { setResponse(e.target.value); setError('') }}
      />
      <div className={styles.wordCount}>{wordCountLabel(wc)}</div>

      {error && <p style={{ color: 'var(--tn-accent)', fontSize: 13, marginTop: 6 }}>{error}</p>}

      <div className={styles.actions}>
        <button className={styles.btn} onClick={onClose} type="button">Save &amp; close</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSubmit} type="button">
          Submit →
        </button>
      </div>
    </>
  )
}
