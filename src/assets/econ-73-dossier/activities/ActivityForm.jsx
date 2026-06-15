import { useState, useRef } from 'react'
import s from './activities.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function ActivityForm({ activity, guidance, initialAnswers, isCompleted, onSubmit }) {
  const initial = typeof initialAnswers === 'string' ? initialAnswers : ''
  const [text, setText] = useState(initial)
  const [savedStatus, setSavedStatus] = useState(isCompleted ? 'Response saved' : '')
  const timerRef  = useRef(null)
  const textRef   = useRef(null)

  const appendStarter = (starter) => {
    setText(prev => prev ? `${prev}\n\n${starter}` : starter)
    setTimeout(() => textRef.current?.focus(), 50)
  }

  function handleSave() {
    onSubmit(text)
    if (timerRef.current) clearTimeout(timerRef.current)
    setSavedStatus('Saved ✓')
    timerRef.current = setTimeout(() => setSavedStatus(''), 2000)
  }

  const hasScaffolding = activity.responseGuide || activity.miniExample || activity.answerFrame || activity.rankingFrame

  return (
    <div>
      {hasScaffolding && (
        <details className={s.scaffoldDetails}>
          <summary className={s.scaffoldSummary}>Need help?</summary>
          <div className={s.scaffoldContent}>
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
          </div>
        </details>
      )}

      <StarterChips starters={activity.sentenceStarters ?? []} onInsert={appendStarter} disabled={isCompleted} />

      <label style={{ display: 'block', fontWeight: 750, fontSize: '0.92rem', color: 'var(--econ-navy, #10162d)' }}>
        Your response
        <textarea
          ref={textRef}
          className={s.textarea}
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
