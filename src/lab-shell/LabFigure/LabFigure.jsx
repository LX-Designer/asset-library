import s from './LabFigure.module.css'

/**
 * LabFigure — shell-level figure component for inline document images.
 *
 * Uses --lab-figure-* custom properties (with sensible light-background
 * defaults) so any lab can override them in its own .shell token block.
 *
 * Image files should live in public/[lab-id]/ and be referenced as
 * src="/[lab-id]/filename.ext" — the standard pattern for all labs.
 *
 * Props:
 *   src:      string  — image path
 *   alt:      string  — alt text
 *   caption:  string  — optional caption
 *   maxWidth: string  — CSS max-width for the figure (default '680px')
 */
export default function LabFigure({ src, alt, caption, maxWidth = '680px' }) {
  return (
    <figure className={s.figure} style={{ maxWidth }}>
      <img src={src} alt={alt} loading="lazy" />
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  )
}
