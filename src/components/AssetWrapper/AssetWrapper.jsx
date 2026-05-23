import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase.js'
import { getSessionId } from '../../lib/session.js'
import { getAssetMeta } from '../../registry.js'
import ClassJoinPrompt from '../ClassJoinPrompt/ClassJoinPrompt.jsx'
import styles from './AssetWrapper.module.css'

// Vite statically analyses this glob at build time to bundle all asset modules.
const assetModules = import.meta.glob('../../assets/*/index.jsx')

export default function AssetWrapper({ assetId }) {
  const [AssetComponent, setAssetComponent] = useState(null)
  const [loadError, setLoadError]           = useState(null)
  const [savedResponses, setSavedResponses] = useState({})
  const [completion, setCompletion]         = useState(null)
  const [dataLoading, setDataLoading]       = useState(true)
  const [resetKey, setResetKey]             = useState(0)
  const [resetting, setResetting]           = useState(false)
  const [showConfirm, setShowConfirm]       = useState(false)

  const sessionId    = getSessionId()
  const meta         = getAssetMeta(assetId)
  const isFullLayout = meta?.layout === 'full'

  // Dynamically load the asset's React component
  useEffect(() => {
    setAssetComponent(null)
    setLoadError(null)

    const key    = `../../assets/${assetId}/index.jsx`
    const loader = assetModules[key]

    if (!loader) {
      setLoadError(`No asset module found for "${assetId}".`)
      return
    }

    loader()
      .then(mod => setAssetComponent(() => mod.default))
      .catch(() => setLoadError(`Failed to load asset "${assetId}".`))
  }, [assetId])

  // Load any previously saved responses and completion record
  useEffect(() => {
    setDataLoading(true)

    async function load() {
      const [{ data: rows }, { data: record }] = await Promise.all([
        supabase
          .from('asset_responses')
          .select('question_id, response')
          .eq('session_id', sessionId)
          .eq('asset_id', assetId),
        supabase
          .from('asset_completions')
          .select('*')
          .eq('session_id', sessionId)
          .eq('asset_id', assetId)
          .maybeSingle(),
      ])

      if (rows) {
        const map = {}
        for (const row of rows) map[row.question_id] = row.response
        setSavedResponses(map)
      }

      if (record) setCompletion(record)
      setDataLoading(false)
    }

    load()
  }, [assetId, sessionId])

  // Called by the asset component each time the learner answers a question
  const onResponse = useCallback(async (questionId, response) => {
    const { data, error } = await supabase
      .from('asset_responses')
      .upsert(
        {
          session_id:  sessionId,
          asset_id:    assetId,
          question_id: questionId,
          response,
          updated_at:  new Date().toISOString(),
        },
        { onConflict: 'session_id,asset_id,question_id' }
      )
      .select()
      .single()

    if (!error) setSavedResponses(prev => ({ ...prev, [questionId]: response }))
    return { data, error }
  }, [assetId, sessionId])

  // Called by the asset component when the learner finishes
  const onComplete = useCallback(async (score, metadata = {}) => {
    const { data, error } = await supabase
      .from('asset_completions')
      .upsert(
        {
          session_id:   sessionId,
          asset_id:     assetId,
          score,
          metadata,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'session_id,asset_id' }
      )
      .select()
      .single()

    if (!error) setCompletion(data)
    return { data, error }
  }, [assetId, sessionId])

  // Deletes all saved progress for this session + asset and re-mounts the component
  async function handleReset() {
    setResetting(true)
    await Promise.all([
      supabase.from('asset_responses').delete()
        .eq('session_id', sessionId).eq('asset_id', assetId),
      supabase.from('asset_completions').delete()
        .eq('session_id', sessionId).eq('asset_id', assetId),
    ])
    setSavedResponses({})
    setCompletion(null)
    setResetKey(k => k + 1)
    setShowConfirm(false)
    setResetting(false)
  }

  if (loadError) {
    return <div className={styles.error}>{loadError}</div>
  }

  if (!AssetComponent || dataLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} aria-label="Loading asset" role="status" />
      </div>
    )
  }

  // Full-layout assets manage their own complete UI (nav, sidebar, etc.)
  // Skip the wrapper sidebar and pass onReset so the asset can wire it up itself.
  if (isFullLayout) {
    return (
      <AssetComponent
        key={resetKey}
        onResponse={onResponse}
        onComplete={onComplete}
        savedResponses={savedResponses}
        isCompleted={!!completion}
        completion={completion}
        onReset={handleReset}
      />
    )
  }

  // Non-full-layout assets: render inside the wrapper sidebar layout
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <button
          className={styles.resetBtn}
          onClick={() => setShowConfirm(true)}
          disabled={resetting}
          title="Start again"
          aria-label="Start again"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 8a5.5 5.5 0 1 1 1.1 3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M2.5 5v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.resetBtnLabel}>Start again</span>
        </button>
      </aside>

      <div className={styles.assetArea}>
        <ClassJoinPrompt sessionId={sessionId} />

        {completion && (
          <div className={styles.completionBanner} role="status">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Completed
            {completion.score != null && <span className={styles.score}>{completion.score}%</span>}
          </div>
        )}

        <AssetComponent
          key={resetKey}
          onResponse={onResponse}
          onComplete={onComplete}
          savedResponses={savedResponses}
          isCompleted={!!completion}
          completion={completion}
        />
      </div>

      {showConfirm && (
        <div
          className={styles.confirmOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-confirm-title"
          onClick={e => { if (e.target === e.currentTarget) setShowConfirm(false) }}
        >
          <div className={styles.confirmDialog}>
            <p id="reset-confirm-title" className={styles.confirmTitle}>Start again?</p>
            <p className={styles.confirmText}>
              All your progress on this activity will be permanently deleted.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancel}
                onClick={() => setShowConfirm(false)}
                disabled={resetting}
              >
                Cancel
              </button>
              <button
                className={styles.confirmYes}
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? 'Resetting…' : 'Yes, start again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
