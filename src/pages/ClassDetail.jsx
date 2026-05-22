import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { getAssetMeta } from '../registry.js'
import styles from './ClassDetail.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function extractResponseText(response) {
  if (response === null || response === undefined) return '—'
  if (typeof response === 'string') return response
  if (typeof response === 'number' || typeof response === 'boolean') return String(response)
  if (typeof response === 'object') {
    // Look for common text field names
    const text = response.text ?? response.answer ?? response.value ?? response.content
    if (typeof text === 'string') return text
    return JSON.stringify(response, null, 2)
  }
  return String(response)
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
        <span className={styles.copied}>Copied!</span>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M2 8H1.5A.5.5 0 0 1 1 7.5V1.5A.5.5 0 0 1 1.5 1H7.5A.5.5 0 0 1 8 1.5V2" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      )}
    </button>
  )
}

export default function ClassDetail() {
  const { classId } = useParams()

  const [classInfo,   setClassInfo]   = useState(null)
  const [memberships, setMemberships] = useState([])
  const [completions, setCompletions] = useState([])
  const [attempts,    setAttempts]    = useState([]) // { session_id, asset_id }
  const [loading,     setLoading]     = useState(true)
  const [notFound,    setNotFound]    = useState(false)

  // Response detail panel
  const [selected,          setSelected]          = useState(null) // { sessionId, assetId }
  const [responses,         setResponses]         = useState([])
  const [responsesLoading,  setResponsesLoading]  = useState(false)

  useEffect(() => {
    loadData()
  }, [classId])

  async function loadData() {
    setLoading(true)

    const { data: cls, error: clsError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single()

    if (clsError || !cls) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setClassInfo(cls)

    const { data: members } = await supabase
      .from('class_memberships')
      .select('session_id, joined_at')
      .eq('class_id', classId)
      .order('joined_at', { ascending: true })

    const memberList = members ?? []
    setMemberships(memberList)

    if (memberList.length > 0) {
      const sessionIds = memberList.map(m => m.session_id)

      const [{ data: comps }, { data: respRows }] = await Promise.all([
        supabase
          .from('asset_completions')
          .select('session_id, asset_id, score, completed_at')
          .in('session_id', sessionIds),
        supabase
          .from('asset_responses')
          .select('session_id, asset_id')
          .in('session_id', sessionIds),
      ])

      setCompletions(comps ?? [])

      // Deduplicate session+asset pairs from responses
      if (respRows) {
        const seen = new Set()
        const unique = []
        for (const r of respRows) {
          const key = `${r.session_id}:${r.asset_id}`
          if (!seen.has(key)) {
            seen.add(key)
            unique.push({ session_id: r.session_id, asset_id: r.asset_id })
          }
        }
        setAttempts(unique)
      }
    }

    setLoading(false)
  }

  // Derive sorted list of asset IDs that appear in this class
  const assetIds = useMemo(() => {
    const seen = new Set()
    for (const c of completions) seen.add(c.asset_id)
    for (const a of attempts)    seen.add(a.asset_id)
    return [...seen]
  }, [completions, attempts])

  function getCellStatus(sessionId, assetId) {
    const comp = completions.find(
      c => c.session_id === sessionId && c.asset_id === assetId
    )
    if (comp) return { type: 'completed', score: comp.score }

    const inProg = attempts.some(
      a => a.session_id === sessionId && a.asset_id === assetId
    )
    if (inProg) return { type: 'inProgress' }

    return { type: 'notStarted' }
  }

  async function handleSelectCell(sessionId, assetId) {
    const cell = getCellStatus(sessionId, assetId)
    if (cell.type === 'notStarted') return

    setSelected({ sessionId, assetId })
    setResponsesLoading(true)

    const { data } = await supabase
      .from('asset_responses')
      .select('question_id, response')
      .eq('session_id', sessionId)
      .eq('asset_id', assetId)
      .order('question_id')

    setResponses(data ?? [])
    setResponsesLoading(false)
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} aria-label="Loading class" role="status" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className={styles.notFound}>
        <p>Class not found.</p>
        <Link to="/dashboard" className={styles.backLink}>← Back to dashboard</Link>
      </div>
    )
  }

  const selectedMeta = selected
    ? getAssetMeta(selected.assetId)
    : null
  const selectedSessionIdx = selected
    ? memberships.findIndex(m => m.session_id === selected.sessionId) + 1
    : null

  return (
    <div className={styles.page}>
      <Link to="/dashboard" className={styles.backLink}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M11.5 7H2.5M6.5 3L2.5 7L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Dashboard
      </Link>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{classInfo.name}</h1>
        <div className={styles.codeWrap}>
          <span className={styles.codeLabel}>Join code</span>
          <CopyCodeButton code={classInfo.join_code} />
        </div>
      </div>

      {memberships.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No students yet</p>
          <p className={styles.emptyText}>
            Share code <strong>{classInfo.join_code}</strong> with your students.
            They'll see a prompt when they open any lab.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableSection}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  {assetIds.map(id => {
                    const meta = getAssetMeta(id)
                    return <th key={id}>{meta?.title ?? id}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {memberships.map((member, idx) => (
                  <tr key={member.session_id}>
                    <td className={styles.sessionCell}>
                      <div className={styles.sessionNum}>Student {idx + 1}</div>
                      <div className={styles.sessionDate}>Joined {formatDate(member.joined_at)}</div>
                    </td>
                    {assetIds.map(assetId => {
                      const cell = getCellStatus(member.session_id, assetId)
                      const isSelected =
                        selected?.sessionId === member.session_id &&
                        selected?.assetId === assetId

                      return (
                        <td
                          key={assetId}
                          className={cell.type !== 'notStarted' ? styles.statusCell : undefined}
                          onClick={() => handleSelectCell(member.session_id, assetId)}
                        >
                          {cell.type === 'notStarted' ? (
                            <span className={`${styles.cellInner} ${styles.notStarted}`}>—</span>
                          ) : cell.type === 'completed' ? (
                            <span className={`${styles.cellInner} ${styles.completed}`}>
                              ✓{cell.score != null ? ` ${cell.score}%` : ''}
                              {isSelected && <span className={styles.selectedIndicator} />}
                            </span>
                          ) : (
                            <span className={`${styles.cellInner} ${styles.inProgress}`}>
                              In progress
                              {isSelected && <span className={styles.selectedIndicator} />}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div className={styles.responsePanel}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>
                    Student {selectedSessionIdx} — {selectedMeta?.title ?? selected.assetId}
                  </div>
                  <div className={styles.panelSubtitle}>
                    Responses
                  </div>
                </div>
                <button
                  className={styles.panelClose}
                  onClick={() => setSelected(null)}
                  aria-label="Close response panel"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className={styles.panelBody}>
                {responsesLoading ? (
                  <div className={styles.loading} style={{ padding: 'var(--space-10)' }}>
                    <div className={styles.spinner} aria-label="Loading responses" role="status" />
                  </div>
                ) : responses.length === 0 ? (
                  <p className={styles.panelEmpty}>No responses recorded.</p>
                ) : (
                  responses.map(row => (
                    <div key={row.question_id} className={styles.responseItem}>
                      <span className={styles.questionId}>{row.question_id}</span>
                      <div className={styles.responseText}>
                        {extractResponseText(row.response)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
