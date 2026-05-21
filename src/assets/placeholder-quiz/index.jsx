import { useState } from 'react'
import styles from './PlaceholderQuiz.module.css'

const QUESTIONS = [
  {
    id: 'q1',
    text: 'When you encounter a new concept, your instinct is to:',
    options: [
      { id: 'a', text: 'Read an article or detailed explanation',  style: 'Read/Write' },
      { id: 'b', text: 'Watch a video or look at diagrams',        style: 'Visual'     },
      { id: 'c', text: 'Try it hands-on straight away',            style: 'Kinesthetic'},
      { id: 'd', text: 'Ask someone to talk it through with you',  style: 'Auditory'   },
    ],
  },
  {
    id: 'q2',
    text: 'When remembering something important, you tend to:',
    options: [
      { id: 'a', text: 'Write it down in your own words',            style: 'Read/Write' },
      { id: 'b', text: 'Visualise a mental image or picture',        style: 'Visual'     },
      { id: 'c', text: 'Link it to a physical action or experience', style: 'Kinesthetic'},
      { id: 'd', text: 'Repeat it aloud or explain it to someone',   style: 'Auditory'   },
    ],
  },
  {
    id: 'q3',
    text: 'You learn best from instructions that are:',
    options: [
      { id: 'a', text: 'Written in a clear, step-by-step format', style: 'Read/Write' },
      { id: 'b', text: 'Shown as diagrams, charts, or flowcharts', style: 'Visual'     },
      { id: 'c', text: 'Demonstrated with physical examples',      style: 'Kinesthetic'},
      { id: 'd', text: 'Explained verbally with discussion',       style: 'Auditory'   },
    ],
  },
  {
    id: 'q4',
    text: 'When you are stuck on a problem, you usually:',
    options: [
      { id: 'a', text: 'Search for written guides or documentation', style: 'Read/Write' },
      { id: 'b', text: 'Sketch it out or look for visual patterns',  style: 'Visual'     },
      { id: 'c', text: 'Experiment until something clicks',          style: 'Kinesthetic'},
      { id: 'd', text: 'Talk it through with someone else',          style: 'Auditory'   },
    ],
  },
  {
    id: 'q5',
    text: 'After a learning session, you feel most confident when you have:',
    options: [
      { id: 'a', text: 'Written notes summarising the key points',             style: 'Read/Write' },
      { id: 'b', text: 'A clear mental picture of how everything fits',        style: 'Visual'     },
      { id: 'c', text: 'Actually practised or applied the concept',            style: 'Kinesthetic'},
      { id: 'd', text: 'Discussed it and heard it explained multiple ways',    style: 'Auditory'   },
    ],
  },
]

const STYLE_INFO = {
  'Read/Write': {
    label:   'Read/Write Learner',
    summary: 'You learn best through reading and writing. Detailed text, lists, notes, and written explanations resonate most strongly with you.',
    tips: [
      'Take thorough written notes and rewrite them in your own words afterwards.',
      'Seek out well-written documentation, guides, and long-form articles.',
      "Summarise what you've learned by writing a short explanation as if teaching someone else.",
    ],
  },
  Visual: {
    label:   'Visual Learner',
    summary: 'You think in pictures and patterns. Diagrams, charts, colour-coding, and visual representations help you absorb and recall information fastest.',
    tips: [
      'Create mind maps or flowcharts when learning new topics.',
      'Use colour-coding and visual hierarchy in your notes.',
      'Look for video walkthroughs and illustrated explanations before diving into text.',
    ],
  },
  Kinesthetic: {
    label:   'Kinesthetic Learner',
    summary: 'You learn by doing. Hands-on practice, real-world application, and active experimentation are what make concepts truly click.',
    tips: [
      'Seek interactive exercises and project-based learning over passive reading.',
      'Apply a concept immediately after encountering it — even a quick experiment helps.',
      'Build things to test your understanding rather than just reviewing notes.',
    ],
  },
  Auditory: {
    label:   'Auditory Learner',
    summary: 'You learn through listening and conversation. Verbal explanations, discussion, and hearing ideas from multiple angles help you understand and retain.',
    tips: [
      "Listen to podcasts and recorded lectures on topics you're studying.",
      'Explain concepts aloud to yourself or discuss them with peers.',
      'Record voice notes to capture ideas and play them back later.',
    ],
  },
}

function dominantStyle(responses) {
  const counts = { 'Read/Write': 0, Visual: 0, Kinesthetic: 0, Auditory: 0 }
  for (const ans of Object.values(responses)) {
    if (ans?.style && ans.style in counts) counts[ans.style]++
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

// ─── Quiz view ────────────────────────────────────────────────────────────────

function QuizView({ responses, onSelect, saving }) {
  const [index, setIndex] = useState(() => {
    const first = QUESTIONS.findIndex(q => !responses[q.id])
    return first === -1 ? 0 : first
  })

  const q             = QUESTIONS[index]
  const answered      = responses[q.id]
  const answeredCount = Object.keys(responses).length
  const progress      = (answeredCount / QUESTIONS.length) * 100

  function goTo(i) { setIndex(i) }

  async function handleSelect(option) {
    if (saving || answered) return
    const isLast = await onSelect(index, q.id, option)
    if (!isLast) setIndex(i => i + 1)
  }

  return (
    <div className={styles.quiz}>
      {/* Progress */}
      <div className={styles.progressTrack} role="progressbar" aria-valuenow={answeredCount} aria-valuemax={QUESTIONS.length} aria-label="Quiz progress">
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.progressLabel}>{answeredCount} of {QUESTIONS.length} answered</div>

      {/* Question */}
      <div className={styles.questionBlock}>
        <span className={styles.questionIndex}>Question {index + 1} of {QUESTIONS.length}</span>
        <h2 className={styles.questionText}>{q.text}</h2>
      </div>

      {/* Options */}
      <div className={styles.options} role="group" aria-label="Answer options">
        {q.options.map(opt => {
          const selected = answered?.id === opt.id
          const dimmed   = !!answered && !selected
          return (
            <button
              key={opt.id}
              className={[
                styles.option,
                selected ? styles.optionSelected : '',
                dimmed   ? styles.optionDimmed   : '',
              ].join(' ')}
              onClick={() => handleSelect(opt)}
              disabled={!!answered || saving}
              aria-pressed={selected}
            >
              <span className={styles.optionKey}>{opt.id.toUpperCase()}</span>
              <span className={styles.optionText}>{opt.text}</span>
            </button>
          )
        })}
      </div>

      {/* Next button (after answering a non-last question) */}
      {answered && index < QUESTIONS.length - 1 && (
        <div className={styles.nextRow}>
          <button className={styles.nextBtn} onClick={() => goTo(index + 1)}>
            Next question
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Navigation dots */}
      <div className={styles.dots} aria-label="Jump to question">
        {QUESTIONS.map((question, i) => (
          <button
            key={question.id}
            className={[
              styles.dot,
              i === index           ? styles.dotActive   : '',
              responses[question.id] ? styles.dotAnswered : '',
            ].join(' ')}
            onClick={() => goTo(i)}
            aria-label={`Question ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Results view ─────────────────────────────────────────────────────────────

function ResultsView({ responses }) {
  const style = dominantStyle(responses)
  const info  = STYLE_INFO[style] ?? STYLE_INFO['Visual']

  return (
    <div className={styles.results}>
      <div className={styles.resultHero}>
        <span className={styles.resultBadge}>Assessment complete</span>
        <h2 className={styles.resultTitle}>You're a {info.label}</h2>
        <p className={styles.resultSummary}>{info.summary}</p>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Tips for your style</h3>
        <ul className={styles.tips}>
          {info.tips.map((tip, i) => (
            <li key={i} className={styles.tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Your answers</h3>
        <div className={styles.answerList}>
          {QUESTIONS.map((q, i) => {
            const ans = responses[q.id]
            return (
              <div key={q.id} className={styles.answerRow}>
                <span className={styles.answerNum}>Q{i + 1}</span>
                <div>
                  <p className={styles.answerQuestion}>{q.text}</p>
                  {ans && (
                    <p className={styles.answerText}>
                      {ans.text}
                      <span className={styles.answerStyle}>{ans.style}</span>
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function PlaceholderQuiz({ onResponse, onComplete, savedResponses, isCompleted }) {
  const [responses, setResponses] = useState(savedResponses ?? {})
  const [showResults, setShowResults] = useState(isCompleted)
  const [saving, setSaving] = useState(false)

  async function handleSelect(index, questionId, option) {
    setSaving(true)
    const updated = { ...responses, [questionId]: option }
    setResponses(updated)

    await onResponse(questionId, option)

    const isLast = Object.keys(updated).length === QUESTIONS.length
    if (isLast) {
      const score = Math.round((Object.keys(updated).length / QUESTIONS.length) * 100)
      await onComplete(score, { style: dominantStyle(updated) })
      setShowResults(true)
    }

    setSaving(false)
    return isLast
  }

  if (showResults || isCompleted) {
    return <ResultsView responses={responses} />
  }

  return <QuizView responses={responses} onSelect={handleSelect} saving={saving} />
}
