import { useEffect, useRef } from 'react'
import { EVIDENCE_CHRONOLOGY } from '../global-warming/index.jsx'
import s from './ChronologyOverlay.module.css'

export default function ChronologyOverlay({ isOpen, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Historical timeline">
      <div className={s.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={s.viewer}>
        <div className={s.header}>
          <div>
            <span className={s.eyebrow}>Historical timeline</span>
            <h2 className={s.title}>Key developments in climate science</h2>
          </div>
          <button ref={closeRef} className={s.closeBtn} onClick={onClose} aria-label="Close timeline">
            ✕
          </button>
        </div>

        <div className={s.body}>
          <ol className={s.timeline}>
            {EVIDENCE_CHRONOLOGY.map(e => (
              <li key={e.year} className={s.entry}>
                <span className={s.year}>{e.year}</span>
                <p className={s.event}>{e.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
