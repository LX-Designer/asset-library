import { useState, useRef, useEffect, useCallback, useId } from 'react'
import { createPortal } from 'react-dom'
import { GLOSSARY_TERMS, UNITS_REFERENCE } from '../global-warming/data.js'
import s from './Term.module.css'

function lookup(term) {
  const key = term.toLowerCase()
  const g = GLOSSARY_TERMS.find(t => t.term.toLowerCase() === key)
  if (g) return { label: g.term, body: g.definition }
  const u = UNITS_REFERENCE.find(t =>
    t.symbol.toLowerCase() === key || t.full.toLowerCase() === key
  )
  if (u) return { label: `${u.symbol} — ${u.full}`, body: u.explanation }
  return null
}

export default function Term({ term, children }) {
  const [open, setOpen] = useState(false)
  const [popStyle, setPopStyle] = useState({})
  const btnRef = useRef(null)
  const uid = useId()
  const entry = lookup(term)

  const close = useCallback(() => setOpen(false), [])

  // Close when another Term opens
  useEffect(() => {
    function onOtherOpen(e) {
      if (e.detail?.uid !== uid) close()
    }
    document.addEventListener('_lab-term-open', onOtherOpen)
    return () => document.removeEventListener('_lab-term-open', onOtherOpen)
  }, [uid, close])

  // Click outside to close
  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (!btnRef.current?.contains(e.target)) close()
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [open, close])

  // ESC to close
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  function handleClick(e) {
    e.stopPropagation()
    if (open) { close(); return }

    const rect = btnRef.current.getBoundingClientRect()
    const POPOVER_W = 276
    const vw = window.innerWidth
    const vh = window.innerHeight
    const left = Math.max(8, Math.min(rect.left, vw - POPOVER_W - 12))
    const spaceBelow = vh - rect.bottom

    setPopStyle(spaceBelow < 160
      ? { bottom: vh - rect.top + 6, left, top: 'auto' }
      : { top: rect.bottom + 6, left }
    )
    document.dispatchEvent(new CustomEvent('_lab-term-open', { detail: { uid } }))
    setOpen(true)
  }

  // If term not found in data, render children passively
  if (!entry) return <>{children ?? term}</>

  return (
    <>
      <button
        ref={btnRef}
        className={s.trigger}
        onClick={handleClick}
        aria-expanded={open}
        aria-label={`Definition: ${term}`}
        type="button"
      >
        {children ?? term}
      </button>
      {open && createPortal(
        <div className={s.popover} style={{ position: 'fixed', ...popStyle }}>
          <div className={s.label}>{entry.label}</div>
          <p className={s.body}>{entry.body}</p>
        </div>,
        document.body
      )}
    </>
  )
}
