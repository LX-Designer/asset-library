import React, { useState } from 'react'
import s from './GlossaryTab.module.css'
import { GLOSSARY_TERMS } from './data.js'

export default function GlossaryTab() {
  const [query,    setQuery]    = useState('')
  const [openTerm, setOpenTerm] = useState(null)

  const q = query.trim().toLowerCase()
  const filtered = q === ''
    ? GLOSSARY_TERMS
    : GLOSSARY_TERMS.filter(g =>
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q)
      )

  return (
    <div className={s.tab}>
      <div className={s.search}>
        <input
          type="search"
          placeholder="Search terms…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={s.searchInput}
        />
      </div>
      <ul className={s.list}>
        {filtered.map(g => (
          <li key={g.term} className={s.item}>
            <button
              className={s.termButton}
              onClick={() => setOpenTerm(openTerm === g.term ? null : g.term)}
              aria-expanded={openTerm === g.term}
            >
              <span className={s.termName}>{g.term}</span>
              <span className={`${s.chevron}${openTerm === g.term ? ` ${s.chevronOpen}` : ''}`}>▼</span>
            </button>
            {openTerm === g.term && (
              <p className={s.definition}>{g.definition}</p>
            )}
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className={s.empty}>No terms match "{query}"</p>
      )}
    </div>
  )
}
