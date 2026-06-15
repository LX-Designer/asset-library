import { useState, useRef } from 'react'
import s from '../FranceRepublic.module.css'
import { REFORMS } from '../data.js'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const CAT_LABELS = { S: 'Stabilised', D: 'Destabilised', B: 'Both' }

export default function Act5({ initialAnswers, onSubmit, onSave, sentenceStarters = [] }) {
  const [categories, setCategories] = useState(initialAnswers?.categories ?? {})
  const [response,   setResponse]   = useState(initialAnswers?.response   ?? '')
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const state = () => ({ categories, response })
  const categorisedCount = Object.keys(categories).length
  const ready = categorisedCount >= 3 && response.trim().length > 0

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSubmitLocked(false)
    onSave({ ...state(), response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const setCategory = (reformId, cat) => {
    const next = { ...categories, [reformId]: cat }
    setCategories(next)
    setSubmitLocked(false)
    onSave({ response, categories: next })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ready) return
    onSubmit(state())
    setSubmitLocked(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className={s.selectionHint}>Categorise each reform: did it stabilise France, destabilise it, or both? Categorise at least three.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {REFORMS.map(r => (
          <div key={r.id} className={s.reformSource}>
            <div style={{ marginBottom: 4 }}>
              <span className={s.reformType}>{r.type}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fr-ink)', marginLeft: 6, fontFamily: 'var(--fr-serif)' }}>{r.name}</span>
              <span style={{ fontSize: 11, color: 'var(--fr-ink-light)', marginLeft: 6 }}>{r.date}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--fr-ink-mid)', fontFamily: 'var(--fr-serif)', marginBottom: 7, lineHeight: 1.5 }}>{r.summary}</div>
            <div className={s.reformSortBtns}>
              {['S', 'D', 'B'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`${s.reformSortBtn} ${s[cat.toLowerCase()]} ${categories[r.id] === cat ? s.active : ''}`}
                  onClick={() => setCategory(r.id, cat)}
                  aria-pressed={categories[r.id] === cat}
                >
                  {CAT_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={s.responseField}>
        <label className={s.responseFieldLabel}>My reform judgement</label>
        <StarterChips starters={sentenceStarters} onInsert={appendStarter} />
        <textarea
          ref={textRef}
          className={s.responseTextarea}
          value={response}
          onChange={e => { setResponse(e.target.value); setSubmitLocked(false) }}
          onBlur={() => onSave(state())}
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
