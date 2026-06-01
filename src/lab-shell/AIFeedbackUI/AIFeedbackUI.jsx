import s from './AIFeedbackUI.module.css'

export default function AIFeedbackUI({
  loading,
  feedback,
  error,
  label = 'Tutor feedback',
  subLabel = 'AI-generated formative feedback',
}) {
  if (!loading && !feedback && !error) return null

  return (
    <div className={s.box}>
      <div className={s.header}>
        <span className={s.label}>{label}</span>
        <span className={s.subLabel}>{subLabel}</span>
      </div>
      <div className={s.body}>
        {loading && (
          <div className={s.loading} aria-live="polite" aria-label="Loading feedback">
            <span className={s.dot} />
            <span className={s.dot} />
            <span className={s.dot} />
          </div>
        )}
        {feedback && !loading && (
          <p className={s.text}>{feedback}</p>
        )}
        {error && !loading && (
          <p className={s.error}>{error}</p>
        )}
      </div>
    </div>
  )
}
