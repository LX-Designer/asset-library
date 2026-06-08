import { useState } from 'react'
import { GHG_TABLE } from '../data.js'
import s from '../GlobalWarming.module.css'

export default function Act4({ initialAnswers, isCompleted, onSubmit, onSave }) {
  const [partA, setPartA] = useState(initialAnswers?.partA ?? '')
  const [partB, setPartB] = useState(initialAnswers?.partB ?? '')
  const [saveStatus, setSaveStatus] = useState(
    (initialAnswers?.partA?.trim() || initialAnswers?.partB?.trim()) ? 'saved' : 'not-started'
  )

  const state = () => ({ partA, partB })

  const handleBlur = () => {
    onSave(state())
    setSaveStatus('saved')
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

  const hasAll = partA.trim() && partB.trim()

  return (
    <form onSubmit={handleSubmit}>

      {/* ── Part A: GHG analysis ── */}
      <div className={s.actInstruction}>
        <div className={s.actInstructionLabel}>Part A — GHG comparison</div>
        Review the GHG comparison table from Evidence Card 9 below. Then answer: if methane (CH₄) has a much higher GWP than CO₂ per molecule (28–30×), why does CO₂ still dominate total radiative forcing? Think about concentration, atmospheric lifetime, and quantity of emissions together.
      </div>

      <div className={s.ghgRef}>
        <div className={s.ghgRefTitle}>Reference — GHG comparison (IPCC AR6 values)</div>
        <table className={s.ghgTable}>
          <thead>
            <tr>
              <th>Gas</th>
              <th>Pre-industrial</th>
              <th>Current</th>
              <th>Lifetime</th>
              <th>GWP₁₀₀</th>
            </tr>
          </thead>
          <tbody>
            {GHG_TABLE.map(row => (
              <tr key={row.gas}>
                <td className={s.ghgGas}>{row.gas}</td>
                <td>{row.preIndustrial}</td>
                <td><strong>{row.current}</strong></td>
                <td>{row.lifetime}</td>
                <td className={s.ghgGwp}>{row.gwp100}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <label className={s.actLabel} htmlFor="act4-parta">
        Why does CO₂ dominate total forcing despite methane's higher GWP?
      </label>
      <textarea
        id="act4-parta"
        className={s.actTextarea}
        value={partA}
        onChange={e => { setPartA(e.target.value); setSaveStatus('unsaved') }}
        onBlur={handleBlur}
        placeholder="CO₂ dominates because… Consider: its atmospheric lifetime means that… and the scale of emissions means…"
        disabled={isCompleted}
        rows={5}
      />

      <hr className={s.actSectionDivider} />

      {/* ── Part B: Causal chain ── */}
      <div className={s.actInstruction}>
        <div className={s.actInstructionLabel}>Part B — Causal chain</div>
        Starting from a specific human activity (e.g. burning fossil fuels), trace the mechanism step by step through to observed surface warming. Include the enhanced greenhouse effect and explain how the GHG fingerprint (tropospheric warming + stratospheric cooling) distinguishes this from solar forcing.
      </div>

      <div className={s.actSectionDesc}>
        Suggested structure: Human activity → atmospheric change (concentration rises) → physical effect (enhanced greenhouse effect) → energy imbalance → surface warming → fingerprint evidence.
      </div>

      <label className={s.actLabel} htmlFor="act4-partb">
        Causal chain — from human activity to warming
      </label>
      <textarea
        id="act4-partb"
        className={`${s.actTextarea} ${s.actTextareaLarge}`}
        value={partB}
        onChange={e => { setPartB(e.target.value); setSaveStatus('unsaved') }}
        onBlur={handleBlur}
        placeholder="Starting from [specific human activity]… this leads to [atmospheric change]… which causes [physical effect]… The GHG fingerprint (tropospheric warming + stratospheric cooling) is significant because…"
        disabled={isCompleted}
        rows={7}
      />

      <div className={s.actActions}>
        <span className={`${s.saveStatus} ${saveStatus === 'saved' ? s.saveStatusSaved : saveStatus === 'unsaved' ? s.saveStatusUnsaved : ''}`}>
          {saveStatus === 'saved' ? 'Saved' : saveStatus === 'unsaved' ? 'Unsaved changes' : ''}
        </span>
        <button type="button" className={s.btn} onClick={handleSave} disabled={isCompleted}>
          Save
        </button>
        <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={isCompleted || !hasAll}>
          {hasAll ? 'Record anthropogenic analysis →' : 'Complete both parts first'}
        </button>
      </div>
    </form>
  )
}
