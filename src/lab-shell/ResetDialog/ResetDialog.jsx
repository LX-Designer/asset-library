import s from './ResetDialog.module.css'

export default function ResetDialog({
  onReset,
  onCancel,
  message = 'Clear all responses and start again?',
}) {
  return (
    <div className={s.dialog} role="alertdialog" aria-live="polite">
      <p className={s.message}>{message}</p>
      <div className={s.actions}>
        <button className={s.cancel} onClick={onCancel}>Cancel</button>
        <button className={s.confirm} onClick={onReset}>Yes, clear everything</button>
      </div>
    </div>
  )
}
