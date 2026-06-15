import { useState, useRef } from 'react'
import s from './activities.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

export default function ActivityForm({ activity, guidance, initialAnswers, onSubmit, onSave }) {
  // Responses are stored as { response, _submitted } objects; older rows are
  // plain strings, so accept both shapes when restoring the saved draft.
  const initial = typeof initialAnswers === 'string' ? initialAnswers : (initialAnswers?.response ?? '')
  const [text, setText]                 = useState(initial)
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)
  const textRef = useRef(null)

  const appendStarter = (starter) => {
    setText(prev => prev ? `${prev}\n\n${starter}` : starter)
    setSubmitLocked(false)
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const ready = text.trim().length > 0

  function handleSubmit() {
    if (!ready) return
    onSubmit({ response: text.trim() })
    setSubmitLocked(true)
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

      <StarterChips starters={activity.sentenceStarters ?? []} onInsert={appendStarter} />

      <label style={{ display: 'block', fontWeight: 750, fontSize: '0.92rem', color: 'var(--econ-navy, #10162d)' }}>
        Your response
        <textarea
          ref={textRef}
          className={s.textarea}
          value={text}
          onChange={e => { setText(e.target.value); setSubmitLocked(false) }}
          onBlur={() => onSave?.({ response: text.trim() })}
        />
      </label>

      <div className={s.actions}>
        <button className={s.saveBtn} type="button" onClick={handleSubmit} disabled={!ready || submitLocked}>
          {submitLocked ? 'Submitted ✓' : 'Submit'}
        </button>
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
