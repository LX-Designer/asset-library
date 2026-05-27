import { useState, useCallback } from 'react'
import styles from '../FastFashion.module.css'

const SYSTEM_PROMPT = `You are an economics tutor providing formative feedback on a student's briefing note for a Cambridge A Level Economics task about market failure in the fast fashion industry.

The task asked the student to write a professional briefing note (~200 words) that:
1. States whether the fast fashion market achieves allocative efficiency, and why
2. Identifies the specific type of market failure present and explains the mechanism
3. Uses at least two specific pieces of data from the case file
4. Explains where an earlier market assessment went wrong

The key concept at stake is the distinction between productive efficiency and allocative efficiency. The market assessment being reviewed was correct that fast fashion achieves productive efficiency (low cost, high output). Its error was treating this as equivalent to allocative efficiency. Allocative efficiency requires P = SMC (price equals social marginal cost). Fast fashion prices reflect private marginal costs only — carbon emissions (~$1.26bn annually for Shein), water pollution, textile waste disposal costs, and a wage structure where the minimum wage ($113/month in Bangladesh) is roughly one-quarter of the living wage ($450/month) are all unpriced externalities. Because P < SMC, the market is allocatively inefficient. This is a textbook case of negative production externalities causing market failure.

A strong response will:
- Correctly and precisely identify the allocative efficiency failure using P ≠ SMC
- Name negative externalities as the mechanism (not just "externalities" in the abstract)
- Use at least two specific figures from the case file as evidence
- Explain that the original assessment correctly identified productive efficiency but failed to apply the right standard — conflating productive with allocative efficiency
- Be written in professional register appropriate to a briefing note

A weak response will:
- Agree with the original assessment, or treat falling consumer prices as sufficient evidence that the market is working well
- Conflate productive and allocative efficiency throughout
- Describe environmental or labour problems in general terms without connecting them to the P = SMC condition
- Fail to use specific data from the case file

Provide feedback in approximately 150–180 words of prose (no bullet points). Structure your feedback as follows: first, acknowledge what the student has done well — be specific, not generic; then identify the most important gap or error in their reasoning, explain why it matters economically, and offer one specific suggestion for how to address it. Do not give a grade. Do not validate a wrong answer as partially correct. Be warm but precise. The student is writing in a professional register; your feedback should match that register.`

function wordCount(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

function wordCountLabel(n) {
  if (n === 0)   return '0 words'
  if (n < 150)   return `${n} words — aim for ~200`
  if (n > 280)   return `${n} words — consider trimming`
  return `${n} words ✓`
}

const CHOICE_LABELS = {
  'strongly-agree':    'Strongly agreed',
  'agree':             'Agreed',
  'unsure':            'Unsure',
  'disagree':          'Disagreed',
  'strongly-disagree': 'Strongly disagreed',
}

export default function Act6({ initialAnswers, act1Answers, isCompleted, onComplete, onClose }) {
  const [briefing,  setBriefing]  = useState(initialAnswers?.briefing  ?? '')
  const [feedback,  setFeedback]  = useState(initialAnswers?.feedback  ?? '')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(!!initialAnswers?.feedback)

  const wc = wordCount(briefing)

  const handleSubmitFeedback = useCallback(async () => {
    if (wc < 50) {
      setError('Please write at least 50 words before submitting for feedback.')
      return
    }
    setError('')
    setLoading(true)
    setFeedback('')

    const userMessage = `Here is the student's briefing note:\n\n"${briefing.trim()}"`

    try {
      const res = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: SYSTEM_PROMPT, userMessage }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      const fb = data.text ?? 'Unable to retrieve feedback. Please try again.'
      setFeedback(fb)
      setHasSubmitted(true)
      onComplete({ briefing: briefing.trim(), feedback: fb })
    } catch {
      setError('Unable to retrieve feedback at this time. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [briefing, wc, onComplete])

  return (
    <>
      {act1Answers && (
        <div className={styles.initialBlock}>
          <span className={styles.initialBlockLabel}>Your initial position (Activity 1)</span>
          {act1Answers.choice && (
            <div className={styles.initialBlockChoice}>
              {CHOICE_LABELS[act1Answers.choice] ?? act1Answers.choice}
            </div>
          )}
          {act1Answers.reasoning && (
            <div className={styles.initialBlockText}>{act1Answers.reasoning}</div>
          )}
        </div>
      )}

      <div className={styles.instruction}>
        <span className={styles.instructionLabel}>Your task — Corrected briefing note</span>
        You are the junior analyst at the think tank. The senior economist has asked you to prepare
        a corrected briefing note in response to the internal market assessment.
        <br /><br />
        Write a briefing note of approximately 200 words addressed to the senior economist. Your
        note should:
        <ol style={{ marginTop: 10, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>State clearly whether the fast fashion market achieves allocative efficiency, and why</li>
          <li>Identify the specific type of market failure present, and explain the mechanism by which it operates</li>
          <li>Use at least <strong>two specific pieces of data</strong> from the case file to support your argument</li>
          <li>Briefly explain where the original assessment went wrong — what it measured correctly, and what it failed to measure</li>
        </ol>
        <span className={styles.signpostNote}>→ Write in the register of a professional economic briefing note.</span>
      </div>

      <label className={styles.qLabel} htmlFor="act6-briefing">
        Corrected Briefing Note — CTF-2024-0047-INT
      </label>
      <textarea
        id="act6-briefing"
        className={`${styles.textarea} ${styles.textareaLg}`}
        rows={12}
        placeholder={"To: Dr K. Asante, Director of Research\nFrom: Junior Analyst, Consumer Markets Division\nRe: CTF-2024-0047-INT — Corrected Market Assessment\n\n"}
        value={briefing}
        onChange={e => { setBriefing(e.target.value); setError('') }}
      />
      <div className={styles.wordCount}>{wordCountLabel(wc)}</div>

      {error && <p className={styles.feedbackError}>{error}</p>}

      <div className={styles.actions} style={{ marginTop: 10 }}>
        <button className={styles.btn} onClick={onClose}>
          Save &amp; close
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleSubmitFeedback}
          disabled={loading}
        >
          {loading ? 'Analysing…' : hasSubmitted ? 'Resubmit for feedback →' : 'Submit for feedback →'}
        </button>
      </div>

      {(loading || feedback) && (
        <div className={styles.feedbackPanel}>
          <div className={styles.feedbackHeader}>
            <span>Tutor Feedback</span>
            <span className={styles.feedbackHeaderNote}>AI-generated formative feedback</span>
          </div>
          <div className={styles.feedbackBody}>
            {loading ? (
              <div className={styles.feedbackLoading}>
                <div className={styles.feedbackDot} />
                <div className={styles.feedbackDot} />
                <div className={styles.feedbackDot} />
                <span style={{ marginLeft: 6 }}>Reviewing your briefing note…</span>
              </div>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, margin: 0 }}>{feedback}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
