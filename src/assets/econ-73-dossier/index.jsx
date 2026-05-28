import { useEffect, useRef } from 'react'

const ACTIVITY_IDS = ['1', '2', '3', '4', '5', '6', '7']
const ASSET_ID = 'econ-73-dossier'

export default function EconDossier({ onResponse, onComplete, savedResponses, onReset }) {
  const iframeRef = useRef(null)
  // Keep a ref so the message handler always sees the latest savedResponses
  const savedResponsesRef = useRef(savedResponses)
  savedResponsesRef.current = savedResponses

  // When the iframe finishes loading, seed it with any Supabase-saved data.
  // This covers the case where a student returns on a different device.
  function handleLoad() {
    const iframe = iframeRef.current
    if (!iframe) return
    const sr = savedResponsesRef.current ?? {}

    const responses = {}
    for (const id of ACTIVITY_IDS) {
      if (sr[`act-${id}`] !== undefined) responses[id] = sr[`act-${id}`]
    }
    const evidenceTags = sr['evidence-tags'] ?? {}

    iframe.contentWindow.postMessage(
      { type: 'il-init', responses, evidenceTags },
      window.location.origin,
    )
  }

  useEffect(() => {
    async function handleMessage(evt) {
      if (!evt.data || typeof evt.data !== 'object') return

      if (evt.data.type === 'il-response') {
        const { questionId, response } = evt.data
        await onResponse(questionId, response)

        // Check if all 7 activities now have responses
        const allKeys = new Set([
          ...Object.keys(savedResponsesRef.current ?? {}),
          questionId,
        ])
        const allDone = ACTIVITY_IDS.every(id => allKeys.has(`act-${id}`))
        if (allDone) onComplete(100, { asset: ASSET_ID })
      }

      if (evt.data.type === 'il-evidence') {
        await onResponse('evidence-tags', evt.data.tags)
      }

      // HTML's own reset button confirmed — clear Supabase and remount
      if (evt.data.type === 'il-reset-request') {
        await onReset()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onResponse, onComplete, onReset])

  return (
    <iframe
      ref={iframeRef}
      src="/labs/econ-73-dossier.html"
      title="Market Investigation Dossier — A Level Economics 7.3"
      onLoad={handleLoad}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
      }}
    />
  )
}
