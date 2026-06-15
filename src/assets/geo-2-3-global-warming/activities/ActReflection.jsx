import { useState } from 'react'
import s from '../GlobalWarming.module.css'

const PROMPTS = [
  {
    key: 'r1',
    n: 1,
    text: 'What did you think was causing climate change before you started this lab — and how confident were you in that belief?',
  },
  {
    key: 'r2',
    n: 2,
    text: 'Which piece of evidence was most surprising or most difficult to interpret? Why?',
  },
  {
    key: 'r3',
    n: 3,
    text: 'What is the single strongest piece of evidence that humans are the dominant cause of recent warming? Why is it more convincing than natural-factor explanations?',
  },
  {
    key: 'r4',
    n: 4,
    text: 'Where does uncertainty remain — what would you need to know to be more confident in your attribution?',
  },
  {
    key: 'r5',
    n: 5,
    text: 'Which part of your final argument feels most secure, and which feels least secure? What could challenge it?',
  },
  {
    key: 'r6',
    n: 6,
    text: 'What does this investigation show you about how scientists actually reach conclusions about climate change — and why is this different from simply stating the consensus?',
  },
]

function getInitialStep(initialAnswers) {
  for (let i = 0; i < PROMPTS.length; i++) {
    if (!initialAnswers?.[PROMPTS[i].key]?.trim()) return i
  }
  return PROMPTS.length - 1
}

export default function ActReflection({ initialAnswers, onSubmit, onSave }) {
  const [fields, setFields] = useState({
    r1: initialAnswers?.r1 ?? '',
    r2: initialAnswers?.r2 ?? '',
    r3: initialAnswers?.r3 ?? '',
    r4: initialAnswers?.r4 ?? '',
    r5: initialAnswers?.r5 ?? '',
    r6: initialAnswers?.r6 ?? '',
  })
  const [step, setStep] = useState(getInitialStep(initialAnswers))
  const [submitLocked, setSubmitLocked] = useState(!!initialAnswers?._submitted)

  const state = () => fields
  const current = PROMPTS[step]
  const isLast = step === PROMPTS.length - 1
  const allDone = PROMPTS.every(p => fields[p.key]?.trim())

  const handleChange = (key, val) => {
    setFields(prev => ({ ...prev, [key]: val }))
    setSubmitLocked(false)
  }

  const handleBlur = () => onSave(state())

  const handleNext = () => {
    onSave(state())
    if (step < PROMPTS.length - 1) setStep(s => s + 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state())
    setSubmitLocked(true)
  }

  if (allDone && step === PROMPTS.length - 1) {
    return (
      <form onSubmit={handleSubmit}>
        {PROMPTS.map(p => (
          <div key={p.key}>
            <div className={s.actSectionHead}>Prompt {p.n} of 6</div>
            <div className={s.actSectionDesc}>{p.text}</div>
            <textarea
              className={s.actTextarea}
              value={fields[p.key]}
              onChange={e => handleChange(p.key, e.target.value)}
              onBlur={handleBlur}
              rows={3}
              aria-label={`Reflection prompt ${p.n}`}
            />
          </div>
        ))}

        <div className={s.actActions}>
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={submitLocked}>
            {submitLocked ? 'Submitted ✓' : 'Submit reflection'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={s.reflectStep}>
        <div className={s.reflectStepLabel}>Prompt {current.n} of {PROMPTS.length}</div>
        <div className={s.reflectPrompt}>{current.text}</div>
      </div>

      <label className={s.actLabel} htmlFor={`reflect-${current.key}`}>
        Your response to prompt {current.n}
      </label>
      <textarea
        id={`reflect-${current.key}`}
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={fields[current.key]}
        onChange={e => handleChange(current.key, e.target.value)}
        onBlur={handleBlur}
        placeholder="Your response…"
        rows={6}
      />

      <div className={s.reflectNav}>
        <span className={s.reflectProgress}>
          {PROMPTS.filter(p => fields[p.key]?.trim()).length} of {PROMPTS.length} prompts answered
        </span>
        {!isLast ? (
          <button
            type="button"
            className={`${s.btn} ${s.btnPrimary}`}
            onClick={handleNext}
            disabled={!fields[current.key]?.trim()}
          >
            Next prompt →
          </button>
        ) : (
          <button
            type="submit"
            className={`${s.btn} ${s.btnPrimary}`}
            disabled={!fields[current.key]?.trim() || submitLocked}
          >
            {submitLocked ? 'Submitted ✓' : 'Submit reflection'}
          </button>
        )}
      </div>
    </form>
  )
}
