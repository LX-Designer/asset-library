import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import styles from './ClassJoinPrompt.module.css'

const JOINED_KEY    = 'lp_class_joined'
const DISMISSED_KEY = 'lp_class_dismissed'

export default function ClassJoinPrompt({ sessionId }) {
  const [show,     setShow]     = useState(false)
  const [code,     setCode]     = useState('')
  const [status,   setStatus]   = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (localStorage.getItem(JOINED_KEY) || localStorage.getItem(DISMISSED_KEY)) return

    supabase
      .from('class_memberships')
      .select('id')
      .eq('session_id', sessionId)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          localStorage.setItem(JOINED_KEY, 'true')
        } else {
          setShow(true)
        }
      })
  }, [sessionId])

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setShow(false)
  }

  async function handleJoin(e) {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setStatus('loading')
    setErrorMsg('')

    const { data: cls } = await supabase
      .from('classes')
      .select('id, name')
      .eq('join_code', trimmed)
      .maybeSingle()

    if (!cls) {
      setStatus('error')
      setErrorMsg('Code not found. Check with your teacher.')
      return
    }

    const { error: memError } = await supabase
      .from('class_memberships')
      .upsert(
        { class_id: cls.id, session_id: sessionId },
        { onConflict: 'class_id,session_id' }
      )

    if (memError) {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
      return
    }

    localStorage.setItem(JOINED_KEY, cls.id)
    setStatus('success')
    setTimeout(() => setShow(false), 2500)
  }

  if (!show) return null

  return (
    <div className={styles.prompt} role="region" aria-label="Join a class">
      {status === 'success' ? (
        <p className={styles.success}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Joined! Your teacher can now see your work.
        </p>
      ) : (
        <form onSubmit={handleJoin} className={styles.form}>
          <span className={styles.label}>Have a class code?</span>
          <div className={styles.row}>
            <input
              className={styles.input}
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="ABC123"
              maxLength={8}
              aria-label="Class join code"
              spellCheck={false}
            />
            <button
              type="submit"
              className={styles.joinBtn}
              disabled={status === 'loading' || !code.trim()}
            >
              {status === 'loading' ? '…' : 'Join'}
            </button>
            <button type="button" className={styles.dismissBtn} onClick={handleDismiss}>
              No thanks
            </button>
            {status === 'error' && (
              <span className={styles.errorMsg}>{errorMsg}</span>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
