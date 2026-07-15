import { useEffect, useRef, Suspense } from 'react'
import { createPortal } from 'react-dom'
import styles from './ExplorableModal.module.css'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ExplorableModal({ explorable, onClose }) {
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    // Remember what had focus before the modal opened (the card's "Open
    // explorable" button) so it can be restored on close, and move focus
    // into the dialog so keyboard/screen-reader users land inside it.
    triggerRef.current = document.activeElement
    closeBtnRef.current?.focus()

    function onKey(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      // Requery on every Tab press rather than once on mount, since the
      // explorable's content loads lazily and its focusable elements
      // aren't in the DOM yet when this effect first runs.
      const focusable = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      triggerRef.current?.focus?.()
    }
  }, [onClose])

  if (!explorable) return null

  const { Component } = explorable

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={explorable.title}
        onClick={e => e.stopPropagation()}
      >
        <button ref={closeBtnRef} className={styles.close} onClick={onClose} aria-label="Close explorable">
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
