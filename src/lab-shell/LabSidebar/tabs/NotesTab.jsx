import { useState, useEffect, useCallback } from 'react'
import s from './NotesTab.module.css'

export default function NotesTab({ value, onSave }) {
  const [draft, setDraft] = useState(value ?? '')

  useEffect(() => { setDraft(value ?? '') }, [value])

  const handleBlur = useCallback(() => {
    const trimmed = draft.trim()
    const prev    = (value ?? '').trim()
    if (trimmed === prev) return
    onSave(trimmed || null)
  }, [draft, value, onSave])

  return (
    <div className={s.wrap}>
      <p className={s.intro}>
        Use this space for your own notes. They are saved automatically.
      </p>
      <textarea
        className={s.textarea}
        value={draft}
        placeholder="Your notes…"
        onChange={e => setDraft(e.target.value)}
        onBlur={handleBlur}
        rows={12}
        aria-label="Personal notes"
      />
    </div>
  )
}
