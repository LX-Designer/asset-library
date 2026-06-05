import s from './LabFigure.module.css'

/**
 * LabFigure — shell-level figure component for inline document images.
 *
 * Image files should live in public/[lab-id]/ and be referenced as
 * src="/[lab-id]/filename.ext" — the standard pattern for all labs.
 *
 * Props:
 *   src:         string  — image path
 *   alt:         string  — alt text
 *   caption:     string  — optional caption text
 *   attribution: string | { credit: string, rights?: string }
 *                — optional source credit. String = credit line only.
 *                  Object adds a collapsible "Source and rights" block.
 *   maxWidth:    string  — CSS max-width for the figure (default '680px')
 *   embedded:    bool    — strip margin/border/radius for use inside a
 *                          parent container (e.g. a source card). Default false.
 */

function parseAttribution(attribution) {
  if (!attribution) return { credit: null, rights: null }
  if (typeof attribution === 'string') return { credit: attribution, rights: null }
  return { credit: attribution.credit ?? null, rights: attribution.rights ?? null }
}

export default function LabFigure({
  src,
  alt,
  caption,
  attribution,
  maxWidth = '680px',
  embedded = false,
}) {
  const { credit, rights } = parseAttribution(attribution)
  const hasFooter = caption || credit

  return (
    <figure
      className={`${s.figure} ${embedded ? s.embedded : ''}`}
      style={embedded ? undefined : { maxWidth }}
    >
      <img src={src} alt={alt} loading="lazy" />

      {hasFooter && (
        <figcaption className={s.footer}>
          {caption && <span className={s.caption}>{caption}</span>}
          {credit  && <span className={s.credit}>{credit}</span>}
          {rights  && (
            <details className={s.rights}>
              <summary>Source and rights</summary>
              <p>{rights}</p>
            </details>
          )}
        </figcaption>
      )}
    </figure>
  )
}
