import { useState } from 'react'
import s from '../FranceRepublic.module.css'
import { REFORMS } from '../data.js'

const SaveStatus = ({ status }) => (
  <span className={`${s.saveStatus} ${status === 'saved' ? s.saved : status === 'unsaved' ? s.unsaved : ''}`}>
    {status === 'saved' ? 'Saved' : status === 'unsaved' ? 'Unsaved changes' : 'Not started'}
  </span>
)

const CAT_LABELS = { S: 'Stabilised', D: 'Destabilised', B: 'Both' }

export default function Act5({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [categories, setCategories] = useState(initialAnswers?.categories ?? {})
  const [response,   setResponse]   = useState(initialAnswers?.response   ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.response?.trim()) ? 'saved' : 'not-started'
  )

  const state = () => ({ categories, response })

  const setCategory = (reformId, cat) => {
    const next = { ...categories, [reformId]: cat }
    setCategories(next)
    onSave({ response, categories: next })
    setSaveStatus('unsaved')
  }

  const handleBlur = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state())
    setSaveStatus('saved')
  }

  const categorisedCount = Object.keys(categories).length

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
                  disabled={isCompleted}
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
        <textarea
          className={s.responseTextarea}
          value={response}
          onChange={e => { setResponse(e.target.value); setSaveStatus('unsaved') }}
          onBlur={handleBlur}
          placeholder="Explain your categorisations. How did the reforms you chose affect the survival of constitutional monarchy?"
          disabled={isCompleted}
        />
      </div>
      <div className={s.saveRow}>
        <SaveStatus status={saveStatus} />
        <button type="submit" className={s.saveBtn} disabled={isCompleted || categorisedCount < 3}>
          {categorisedCount < 3 ? `Categorise ${3 - categorisedCount} more` : 'Save response'}
        </button>
      </div>
    </form>
  )
}
