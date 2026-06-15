import s from './StarterChips.module.css'

export default function StarterChips({ starters = [], onInsert, disabled = false }) {
  if (!starters.length) return null
  return (
    <div className={s.section}>
      <div className={s.label}>Sentence starters — click to insert</div>
      <div className={s.chips}>
        {starters.map(starter => (
          <button
            key={starter}
            type="button"
            className={s.chip}
            onClick={() => onInsert(starter)}
            disabled={disabled}
          >
            {starter}
          </button>
        ))}
      </div>
    </div>
  )
}
