import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import styles from './Dashboard.module.css'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateJoinCode() {
  return Array.from(
    { length: 6 },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join('')
}

function CopyCodeButton({ code }) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e) {
    e.preventDefault()
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      className={styles.joinCode}
      onClick={handleCopy}
      title="Click to copy join code"
      aria-label={`Join code ${code}. Click to copy.`}
    >
      {code}
      {copied ? (
        <span className={styles.copiedText}>Copied!</span>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M2 8H1.5A.5.5 0 0 1 1 7.5V1.5A.5.5 0 0 1 1.5 1H7.5A.5.5 0 0 1 8 1.5V2" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      )}
    </button>
  )
}

export default function Dashboard() {
  const { user }              = useAuth()
  const [classes, setClasses] = useState([])
  const [counts, setCounts]   = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [newName, setNewName]     = useState('')
  const [creating, setCreating]   = useState(false)
  const [createError, setCreateError] = useState(null)

  useEffect(() => {
    if (user) loadClasses()
  }, [user])

  async function loadClasses() {
    setLoading(true)

    const { data: rows } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false })

    if (rows) {
      setClasses(rows)

      if (rows.length > 0) {
        const { data: memberships } = await supabase
          .from('class_memberships')
          .select('class_id')
          .in('class_id', rows.map(c => c.id))

        if (memberships) {
          const tally = {}
          for (const m of memberships) {
            tally[m.class_id] = (tally[m.class_id] ?? 0) + 1
          }
          setCounts(tally)
        }
      }
    }

    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return

    setCreating(true)
    setCreateError(null)

    for (let attempt = 0; attempt < 5; attempt++) {
      const join_code = generateJoinCode()
      const { error } = await supabase
        .from('classes')
        .insert({ teacher_id: user.id, name: newName.trim(), join_code })

      if (!error) {
        setNewName('')
        setShowForm(false)
        await loadClasses()
        setCreating(false)
        return
      }

      // 23505 = unique_violation (join_code collision — extremely rare but retry)
      if (error.code !== '23505') {
        setCreateError(error.message)
        break
      }
    }

    setCreating(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your classes</h1>
        {!showForm && (
          <button className={styles.createBtn} onClick={() => setShowForm(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            New class
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.createForm}>
          <p className={styles.createFormTitle}>New class</p>
          <form onSubmit={handleCreate}>
            <div className={styles.createRow}>
              <input
                className={styles.createInput}
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Class name (e.g. Period 3 Biology)"
                required
                autoFocus
              />
              <button
                type="submit"
                className={styles.createSubmit}
                disabled={creating || !newName.trim()}
              >
                {creating ? 'Creating…' : 'Create'}
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => { setShowForm(false); setCreateError(null) }}
              >
                Cancel
              </button>
            </div>
            {createError && <p className={styles.createError}>{createError}</p>}
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} aria-label="Loading classes" role="status" />
        </div>
      ) : classes.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No classes yet</p>
          <p className={styles.emptyText}>
            Create your first class and share the join code with your students.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {classes.map(cls => (
            <Link
              key={cls.id}
              to={`/dashboard/classes/${cls.id}`}
              className={styles.classCard}
            >
              <p className={styles.className}>{cls.name}</p>

              <div className={styles.classMeta}>
                <span className={styles.studentCount}>
                  {counts[cls.id] ?? 0}{' '}
                  {(counts[cls.id] ?? 0) === 1 ? 'student' : 'students'}
                </span>

                <div className={styles.joinCodeWrap}>
                  <span className={styles.joinCodeLabel}>Code</span>
                  <CopyCodeButton code={cls.join_code} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
