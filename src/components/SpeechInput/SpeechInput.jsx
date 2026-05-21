import { useState, useEffect, useRef } from 'react'
import styles from './SpeechInput.module.css'

const getSR = () =>
  typeof window !== 'undefined'
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
    : null

// Append text to a React-controlled textarea via native input event dispatch.
// React listens for native 'input' events and calls the component's onChange.
function appendToTextarea(el, text) {
  const prev = el.value
  const gap = prev.length > 0 && !/\s$/.test(prev) ? ' ' : ''
  const next = prev + gap + text.trim()
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
  setter.call(el, next)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.scrollTop = el.scrollHeight
}

function getButtonPos(el) {
  const r = el.getBoundingClientRect()
  return { top: r.bottom - 40, left: r.right - 40 }
}

export default function SpeechInput() {
  const SR = getSR()
  const [pos, setPos] = useState(null)
  const [visible, setVisible] = useState(false)
  const [listening, setListening] = useState(false)

  const targetRef    = useRef(null)  // textarea element receiving dictation
  const targetElSt   = useRef(null)  // duplicate for effect deps (avoids stale closure)
  const recognRef    = useRef(null)  // SpeechRecognition instance
  const listeningRef = useRef(false) // ref mirror of listening state (used in callbacks)
  const hideTimer    = useRef(null)

  if (!SR) return null

  // ── speech control ────────────────────────────────────────────

  function stopListening() {
    listeningRef.current = false
    setListening(false)
    recognRef.current?.stop()
    recognRef.current = null
  }

  function startListening() {
    if (recognRef.current) {
      listeningRef.current = false
      recognRef.current.stop()
      recognRef.current = null
    }

    const rec = new SR()
    rec.continuous = true
    rec.interimResults = false
    rec.lang = 'en-US'

    rec.onresult = e => {
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
      }
      if (final && targetRef.current) appendToTextarea(targetRef.current, final)
    }

    rec.onerror = e => {
      if (e.error === 'no-speech') return // non-fatal — browser restarts automatically
      stopListening()
    }

    // Restart when the browser auto-ends recognition (e.g. after long silence)
    rec.onend = () => {
      if (listeningRef.current) {
        try { rec.start() } catch { stopListening() }
      }
    }

    recognRef.current = rec
    listeningRef.current = true
    setListening(true)
    rec.start()
  }

  function toggle() {
    listeningRef.current ? stopListening() : startListening()
  }

  // ── focus tracking ─────────────────────────────────────────────

  useEffect(() => {
    function onFocusIn(e) {
      if (e.target.tagName !== 'TEXTAREA') return
      clearTimeout(hideTimer.current)
      targetRef.current = e.target
      targetElSt.current = e.target
      setPos(getButtonPos(e.target))
      setVisible(true)
    }

    function onFocusOut(e) {
      if (e.target.tagName !== 'TEXTAREA') return
      if (listeningRef.current) return // keep visible while listening
      clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => {
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          setVisible(false)
        }
      }, 180)
    }

    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  // ── reposition on scroll / resize ──────────────────────────────

  useEffect(() => {
    if (!visible) return

    function reposition() {
      if (targetRef.current) setPos(getButtonPos(targetRef.current))
    }

    const ro = new ResizeObserver(reposition)
    if (targetRef.current) ro.observe(targetRef.current)

    window.addEventListener('scroll', reposition, { passive: true, capture: true })
    window.addEventListener('resize', reposition)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', reposition, { capture: true })
      window.removeEventListener('resize', reposition)
    }
  }, [visible])

  // ── cleanup ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopListening()
      clearTimeout(hideTimer.current)
    }
  }, [])

  // ── render ─────────────────────────────────────────────────────

  if (!visible && !listening) return null
  if (!pos) return null

  return (
    <div
      className={`${styles.btn} ${listening ? styles.active : ''}`}
      style={{ top: pos.top, left: pos.left }}
      role="button"
      aria-label={listening ? 'Stop dictation' : 'Start dictation'}
      aria-pressed={listening}
      tabIndex={-1}
      onPointerDown={e => e.preventDefault()} // keep textarea focused when clicking mic
      onClick={toggle}
    >
      {listening ? <StopIcon /> : <MicIcon />}
    </div>
  )
}

function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="1" width="5" height="7.5" rx="2.5" />
      <path d="M2 7.5a5 5 0 0 0 10 0" />
      <line x1="7" y1="12.5" x2="7" y2="14" />
      <line x1="5" y1="14" x2="9" y2="14" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" rx="1.5" />
    </svg>
  )
}
