import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * State and save logic for multi-part activity forms.
 * Mirrors the save-on-blur pattern of useActivityResponse.
 *
 * handleChange(key, value) — call from onChange on each field
 * handleBlur()             — call from onBlur on each field; triggers onSave
 */
export function useMultiPartResponse(initialData, onSave) {
  const hasContent = Object.values(initialData).some(v => typeof v === 'string' && v.trim())

  const [data, setData]           = useState(initialData)
  const [saveStatus, setSaveStatus] = useState(hasContent ? 'saved' : 'not-started')

  const dataRef = useRef(initialData)

  useEffect(() => {
    setData(initialData)
    dataRef.current = initialData
    setSaveStatus(Object.values(initialData).some(v => typeof v === 'string' && v.trim()) ? 'saved' : 'not-started')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only sync on remount (same semantics as useActivityResponse)

  const handleChange = useCallback((key, value) => {
    const next = { ...dataRef.current, [key]: value }
    dataRef.current = next
    setData(next)
    setSaveStatus('unsaved')
  }, [])

  const handleBlur = useCallback(() => {
    onSave(dataRef.current)
    setSaveStatus('saved')
  }, [onSave])

  return { data, saveStatus, handleChange, handleBlur }
}
