import { useEffect, useRef, useState } from 'react'
import { GLOSSARY_TERMS } from '../global-warming/data.js'
import s from './GlossaryOverlay.module.css'

export default function GlossaryOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const closeRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else { document.body.style.overflow = ''; setQuery('') }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus()
      // Delay to let the overlay animate in before focusing search
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const q = query.trim().toLowerCase()
  const filtered = q === ''
    ? GLOSSARY_TERMS
    : GLOSSARY_TERMS.filter(t =>
        t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      )

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Glossary">
      <div className={s.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={s.viewer}>
        <div className={s.header}>
          <div>
            <span className={s.eyebrow}>Reference</span>
            <h2 className={s.title}>Glossary</h2>
          </div>
          <button ref={closeRef} className={s.closeBtn} onClick={onClose} aria-label="Close glossary">✕</button>
        </div>

        <div className={s.searchBar}>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search terms or definitions…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={s.searchInput}
            aria-label="Search glossary"
          />
        </div>

        <div className={s.body}>
          {filtered.length === 0 && (
            <p className={s.empty}>No terms match "{query}"</p>
          )}
          <dl className={s.list}>
            {filtered.map(t => (
              <div key={t.term} className={s.entry}>
                <dt className={s.term}>{t.term}</dt>
                <dd className={s.definition}>{t.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
