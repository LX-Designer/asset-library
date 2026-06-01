import { useState, useEffect, useCallback } from 'react'

export function useActivityResponse(initialValue, onSave) {
  const [draft, setDraft]           = useState(initialValue ?? '')
  const [saveStatus, setSaveStatus] = useState(initialValue ? 'saved' : 'not-started')

  // Sync draft when initialValue changes externally (e.g. after clear/remount)
  useEffect(() => {
    setDraft(initialValue ?? '')
    setSaveStatus(initialValue ? 'saved' : 'not-started')
  }, [initialValue])

  const handleChange = useCallback((value) => {
    setDraft(value)
    setSaveStatus('unsaved')
  }, [])

  const handleBlur = useCallback(() => {
    const trimmed = typeof draft === 'string' ? draft.trim() : draft
    const prev    = typeof initialValue === 'string' ? initialValue.trim() : initialValue
    if (trimmed === (prev ?? '')) return
    onSave(trimmed || null)
    setSaveStatus('saved')
  }, [draft, initialValue, onSave])

  const handleSave = useCallback(() => {
    const trimmed = typeof draft === 'string' ? draft.trim() : draft
    onSave(trimmed || null)
    setSaveStatus('saved')
  }, [draft, onSave])

  return { draft, setDraft, saveStatus, setSaveStatus, handleChange, handleBlur, handleSave }
}
