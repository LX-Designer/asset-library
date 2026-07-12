import { useEffect, Suspense } from 'react'
import { createPortal } from 'react-dom'
import styles from './ExplorableModal.module.css'

export default function ExplorableModal({ explorable, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  if (!explorable) return null

  const { Component } = explorable

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={explorable.title}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose} aria-label="Close explorable">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>
        <div className={styles.scroll}>
          <Suspense fallback={<div className={styles.loading}>Loading explorable…</div>}>
            <Component />
          </Suspense>
        </div>
      </div>
    </div>,
    document.body
  )
}
