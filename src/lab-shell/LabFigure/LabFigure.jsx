import s from './LabFigure.module.css'

/**
 * LabFigure — shell-level figure component for inline document images.
 *
 * Uses --lab-figure-* custom properties (with sensible light-background
 * defaults) so any lab can override them in its own .shell token block.
 *
 * Image files should live in public/[lab-id]/ and be referenced as
 * src="/[lab-id]/filename.ext" — the standard pattern for all labs.
 */
export default function LabFigure({ src, alt, caption }) {
  return (
    <figure className={s.figure}>
      <img src={src} alt={alt} loading="lazy" />
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  )
}
