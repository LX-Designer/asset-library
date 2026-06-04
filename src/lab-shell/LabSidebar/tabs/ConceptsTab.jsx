import s from './ConceptsTab.module.css'

export default function ConceptsTab({ concepts, onOpenConcept, intro }) {
  if (!concepts?.length) return (
    <div className={s.empty}>No concepts configured for this lab.</div>
  )

  return (
    <div className={s.wrap}>
      <p className={s.intro}>
        {intro ?? 'These are analytical tools. Use them as lenses when working through activities.'}
      </p>
      <ul className={s.list} role="list">
        {concepts.map(concept => (
          <li key={concept.id}>
            <button
              className={s.btn}
              onClick={() => onOpenConcept(concept.id)}
            >
              <span className={s.conceptTitle}>{concept.title}</span>
              <span className={s.arrow} aria-hidden="true">›</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
