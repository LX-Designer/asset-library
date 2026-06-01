import { useState, useCallback } from 'react'

export function useAIFeedback(systemPrompt) {
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const request = useCallback(async (userMessage, onSuccess) => {
    setLoading(true)
    setError('')
    setFeedback('')
    try {
      const res = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: systemPrompt, userMessage }),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      const text = data.text ?? 'Feedback unavailable.'
      setFeedback(text)
      onSuccess?.(text)
    } catch {
      setError('Unable to retrieve feedback. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [systemPrompt])

  return { feedback, loading, error, request, setFeedback }
}
