import s from './ActivityTextarea.module.css'

function wordCount(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0
}

export default function ActivityTextarea({
  value,
  onChange,
  onBlur,
  placeholder = 'Write your response here…',
  rows = 5,
  showWordCount = false,
  minWords,
  saveStatus,
  ariaLabel,
  id,
}) {
  const count = showWordCount ? wordCount(value ?? '') : 0
  const belowMin = showWordCount && minWords && count < minWords

  return (
    <div className={s.wrap}>
      <textarea
        id={id}
        className={s.textarea}
        rows={rows}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      {(showWordCount || saveStatus) && (
        <div className={s.meta}>
          {showWordCount && (
            <span className={`${s.wordCount} ${belowMin ? s.wordCountLow : ''}`}>
              {count} word{count !== 1 ? 's' : ''}
              {minWords ? ` — aim for ~${minWords}` : ''}
            </span>
          )}
          {saveStatus && (
            <span className={`${s.status} ${s[saveStatus] ?? ''}`}>
              {saveStatus === 'saved' ? 'Saved' : saveStatus === 'unsaved' ? 'Unsaved' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
