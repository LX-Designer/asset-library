import s from './LabRail.module.css'

export default function LabRail({ sections, onSelect }) {
  return (
    <nav className={s.rail} aria-label="Reference sections">
      {sections.map(sec => (
        <button
          key={sec.id}
          className={`${s.btn} ${sec.isOpen ? s.btnActive : ''}`}
          onClick={() => onSelect(sec.id)}
          aria-pressed={sec.isOpen}
          title={sec.label}
        >
          <span className={s.label}>{sec.label}</span>
          {sec.visitedCount > 0 && !sec.isOpen && (
            <span className={s.dot} aria-hidden="true" />
          )}
        </button>
      ))}
    </nav>
  )
}
