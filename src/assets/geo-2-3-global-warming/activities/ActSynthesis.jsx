import { useState, useRef, useContext } from 'react'
import { GWCtx } from '../GWContext.js'
import s from '../GlobalWarming.module.css'
import StarterChips from '../../../lab-shell/StarterChips/StarterChips.jsx'

const PREV_RESPONSES = [
  { actId: 'act-1', key: 'response',  label: 'Activity 1 — Anomaly observation' },
  { actId: 'act-2', key: 'response',  label: 'Activity 2 — Evidence review' },
  { actId: 'act-3', key: 'overall',   label: 'Activity 3 — Natural factors verdict' },
  { actId: 'act-4', key: 'partB',     label: 'Activity 4 — Causal chain' },
  { actId: 'act-5', key: 'verdict',   label: 'Activity 5 — Attribution verdict' },
]

const SUCCESS_CRITERIA = [
  'Uses accurate content knowledge (evidence types, GHG properties, natural factor mechanisms)',
  'Cites specific evidence from the inquiry — not vague reference to "data" or "studies"',
  'Shows clear causal reasoning — mechanisms named, not just correlations noted',
  'Weighs competing factors — explicit relative significance judgement, post-1950 divergence addressed',
  'Reaches a justified conclusion — degree of confidence matches what the evidence supports',
  'Reflects appropriate uncertainty — acknowledges complexity without overstating doubt',
]

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export default function ActSynthesis({ initialAnswers, isCompleted, onSubmit, onSave, sentenceStarters = [] }) {
  const { responses } = useContext(GWCtx)
  const [response, setResponse] = useState(initialAnswers?.response ?? '')
  const [saveStatus, setSaveStatus] = useState(
    initialAnswers?.response?.trim() ? 'saved' : 'not-started'
  )
  const [showCriteria, setShowCriteria] = useState(false)
  const [copied, setCopied] = useState(false)
  const textRef = useRef(null)

  const state = () => ({ response })
  const wc = wordCount(response)

  const appendStarter = (starter) => {
    const next = response ? `${response}\n\n${starter}` : starter
    setResponse(next)
    setSaveStatus('unsaved')
    onSave({ response: next })
    setTimeout(() => textRef.current?.focus(), 50)
  }

  const handleBlur = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  const handleChange = (e) => {
    setResponse(e.target.value)
    setSaveStatus('unsaved')
  }

  const handleSave = () => {
    onSave(state())
    setSaveStatus('saved')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(state())
    setSaveStatus('saved')
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { /* clipboard unavailable */ }
  }

  return (
    <form onSubmit={handleSubmit}>

      {/* ── Previous responses ── */}
      <div className={s.synthPrev}>
        <div className={s.synthPrevTitle}>Your previous responses</div>
        {PREV_RESPONSES.map(pr => {
          const val = responses?.[pr.actId]?.[pr.key]
          return (
            <div key={pr.actId} className={s.prevResponseGroup}>
              <div className={s.prevResponseLabel}>{pr.label}</div>
              <div className={s.prevResponseText}>
                {val
                  ? (typeof val === 'string' ? val : JSON.stringify(val))
                  : <span className={s.prevResponseEmpty}>Not yet completed</span>
                }
              </div>
            </div>
          )
        })}
      </div>

      <StarterChips starters={sentenceStarters} onInsert={appendStarter} disabled={isCompleted} />

      {/* ── Main writing area ── */}
      <label className={s.actLabel} htmlFor="act-synthesis-response">
        Your attribution argument (~150–250 words)
      </label>
      <textarea
        id="act-synthesis-response"
        ref={textRef}
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={response}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder=""
        disabled={isCompleted}
        rows={10}
      />
      <div className={`${s.wordCount} ${wc >= 150 ? s.wordCountOk : ''}`}>
        {wc} {wc === 1 ? 'word' : 'words'} {wc < 150 ? `— aim for 150–250` : wc > 250 ? '— above the 250-word guide; consider tightening' : '— good length'}
      </div>

      {/* ── Success criteria (appears after 50 words) ── */}
      {wc >= 50 && (
        <div className={s.successCriteria}>
          <button
            type="button"
            className={s.starterTitle}
            onClick={() => setShowCriteria(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            {showCriteria ? '▾' : '▸'} Self-check — success criteria
          </button>
          {showCriteria && (
            <ul className={s.criteriaList}>
              {SUCCESS_CRITERIA.map(c => <li key={c}>{c}</li>)}
            </ul>
          )}
        </div>
      )}

      <div className={s.actActions}>
        <span className={`${s.saveStatus} ${saveStatus === 'saved' ? s.saveStatusSaved : saveStatus === 'unsaved' ? s.saveStatusUnsaved : ''}`}>
          {saveStatus === 'saved' ? 'Saved' : saveStatus === 'unsaved' ? 'Unsaved changes' : ''}
        </span>
        <button type="button" className={s.btn} onClick={handleCopy} disabled={!response.trim()}>
          Copy {copied && <span className={s.copySuccess}>✓ Copied</span>}
        </button>
        <button type="button" className={s.btn} onClick={handleSave} disabled={isCompleted || !response.trim()}>
          Save
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isCompleted || wc < 50}>
          {wc < 50 ? 'Write more first' : 'Save argument →'}
        </button>
      </div>
    </form>
  )
}
