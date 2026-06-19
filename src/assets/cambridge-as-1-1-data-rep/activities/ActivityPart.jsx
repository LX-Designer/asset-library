import s from './Activity.module.css'

export default function ActivityPart({ label, hint, children }) {
  return (
    <div className={s.part}>
      {label && <div className={s.partLabel}>{label}</div>}
      {hint  && <div className={s.partHint}>{hint}</div>}
      {children}
    </div>
  )
}
