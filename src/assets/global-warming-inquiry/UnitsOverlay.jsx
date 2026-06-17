import { useEffect, useRef } from 'react'
import { UNITS_REFERENCE } from '../global-warming/data.js'
import s from './UnitsOverlay.module.css'

export default function UnitsOverlay({ isOpen, onClose }) {
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
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Units of notation">
      <div className={s.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={s.viewer}>
        <div className={s.header}>
          <div>
            <span className={s.eyebrow}>Reference</span>
            <h2 className={s.title}>Units of notation</h2>
          </div>
          <button ref={closeRef} className={s.closeBtn} onClick={onClose} aria-label="Close units">✕</button>
        </div>

        <div className={s.body}>
          <table className={s.table}>
            <thead>
              <tr>
                <th className={s.th}>Symbol</th>
                <th className={s.th}>Full name</th>
                <th className={s.th}>Explanation</th>
              </tr>
            </thead>
            <tbody>
              {UNITS_REFERENCE.map(u => (
                <tr key={u.symbol} className={s.row}>
                  <td className={`${s.td} ${s.symbol}`}>{u.symbol}</td>
                  <td className={`${s.td} ${s.fullName}`}>{u.full}</td>
                  <td className={`${s.td} ${s.explanation}`}>{u.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
