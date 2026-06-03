import { useState, useRef } from 'react'
import s from './activities.module.css'

/**
 * Shared activity form for the Market Investigation Dossier.
 *
 * Receives the full activity data object and compare guidance, plus the
 * standard shell form props (initialAnswers, isCompleted, onSubmit, onSave).
 */
export default function ActivityForm({ activity, guidance, initialAnswers, isCompleted, onSubmit }) {
  const initial = typeof initialAnswers === 'string' ? initialAnswers : ''
  const [text, setText] = useState(initial)
  const [savedStatus, setSavedStatus] = useState(isCompleted ? 'Response saved' : '')
  const timerRef = useRef(null)

  function handleSave() {
    onSubmit(text)
    if (timerRef.current) clearTimeout(timerRef.current)
    setSavedStatus('Saved ✓')
    timerRef.current = setTimeout(() => setSavedStatus(''), 2000)
  }

  return (
    <div>
      {/* Problem box — the main investigative question */}
      {activity.prompt && (
        <div className={s.problemBox}>
          <span className={s.boxLabel}>Problem</span>
          <p className={s.boxText}>{activity.prompt}</p>
        </div>
      )}

      {/* Your task box — detailed instructions for what to write */}
      {activity.task && (
        <div className={s.taskBox}>
          <span className={s.boxLabel}>Your task</span>
          <p className={s.boxText}>{activity.task}</p>
        </div>
      )}

      {activity.stage && (
        <span className={s.stageNote}>{activity.stage}</span>
      )}

      {activity.responseGuide && (
        <div className={s.guidance}>
          <strong>Response guidance</strong>
          <p>{activity.responseGuide}</p>
        </div>
      )}

      {activity.miniExample && (
        <div className={s.miniExample}>
          <strong>Mini-example</strong>
          <p>{activity.miniExample}</p>
        </div>
      )}

      {activity.answerFrame && !activity.rankingFrame && (
        <div className={s.answerFrame}>
          <strong>Suggested answer structure</strong>
          <ul>
            {activity.answerFrame.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      {activity.rankingFrame && (
        <div className={`${s.answerFrame} ${s.rankingFrame}`}>
          <strong>Ranking scaffold</strong>
          <p>Use this to decide which reasons for market failure are strongest, rather than listing everything.</p>
          <ul>
            {activity.rankingFrame.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      <label style={{ display: 'block', fontWeight: 750, fontSize: '0.92rem', color: 'var(--econ-navy, #10162d)' }}>
        Your response
        <textarea
          className={s.textarea}
          placeholder="Write your response here…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>

      <div className={s.actions}>
        <button className={s.saveBtn} type="button" onClick={handleSave}>
          Save response
        </button>
        {savedStatus && (
          <span className={s.savedStatus} role="status" aria-live="polite">{savedStatus}</span>
        )}
      </div>

      {guidance && (
        <details className={s.compareBox}>
          <summary>Compare your reasoning</summary>
          <p className={s.compareIntro}>{guidance.intro}</p>
          <ul>
            {guidance.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          {guidance.caution && (
            <p className={s.caution}><strong>Common trap:</strong> {guidance.caution}</p>
          )}
        </details>
      )}
    </div>
  )
}
