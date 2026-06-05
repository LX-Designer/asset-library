import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import s from './LabGallery.module.css'

/**
 * LabGallery — shell-level gallery component for inline document images.
 *
 * - Single image: renders like LabFigure (no navigation shown).
 * - Multiple images: prev/next arrows overlaid on the image, dot indicators.
 * - Container uses a fixed aspect ratio (aspectRatio prop) so height is stable
 *   regardless of each image's natural dimensions.
 * - Click any image to open a lightbox. In the lightbox, click to cycle
 *   through three zoom levels (1× → 1.5× → 2× → back) with smooth animation.
 * - Keyboard: ArrowLeft / ArrowRight to navigate, Escape to close.
 *
 * Props:
 *   images:      Array<{
 *                  src:          string
 *                  alt:          string
 *                  caption?:     string
 *                  attribution?: string | { credit: string, rights?: string }
 *                }>
 *   maxWidth:    string  — CSS max-width for the in-document figure (default '680px')
 *   aspectRatio: string  — CSS aspect-ratio for the image container (default '5 / 4')
 *   embedded:    bool    — strip margin/border/radius for use inside a parent
 *                          container (e.g. a source card). Default false.
 */

const ZOOM_SCALES = [1, 1.5, 2]

function parseAttribution(attribution) {
  if (!attribution) return { credit: null, rights: null }
  if (typeof attribution === 'string') return { credit: attribution, rights: null }
  return { credit: attribution.credit ?? null, rights: attribution.rights ?? null }
}

export default function LabGallery({
  images,
  maxWidth    = '680px',
  aspectRatio = '5 / 4',
  embedded    = false,
}) {
  const [activeIdx,     setActiveIdx]     = useState(0)
  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  const [zoomLevel,     setZoomLevel]     = useState(0)

  const current = images[activeIdx]
  const multi   = images.length > 1
  const hasPrev = activeIdx > 0
  const hasNext = activeIdx < images.length - 1

  const { credit, rights } = parseAttribution(current.attribution)
  const hasFooter = current.caption || credit

  const prev = useCallback(() => {
    if (hasPrev) { setActiveIdx(i => i - 1); setZoomLevel(0) }
  }, [hasPrev])

  const next = useCallback(() => {
    if (hasNext) { setActiveIdx(i => i + 1); setZoomLevel(0) }
  }, [hasNext])

  const openLightbox  = () => { setLightboxOpen(true);  setZoomLevel(0) }
  const closeLightbox = () => { setLightboxOpen(false); setZoomLevel(0) }

  // Cycle: 1× → 1.5× → 2× → 1×
  const cycleZoom = (e) => {
    e.stopPropagation()
    setZoomLevel(z => (z + 1) % ZOOM_SCALES.length)
  }

  // Keyboard navigation while lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape')      closeLightbox()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen, prev, next])

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  const scale      = ZOOM_SCALES[zoomLevel]
  const atMaxZoom  = zoomLevel === ZOOM_SCALES.length - 1
  const zoomCursor = atMaxZoom ? 'zoom-out' : 'zoom-in'
  const zoomTitle  = atMaxZoom ? 'Click to zoom out' : 'Click to zoom in'
  const zoomLabel  = scale === 1 ? null : `${scale}×`

  return (
    <>
      {/* ── In-document gallery ───────────────────────────────────────────── */}
      <figure
        className={`${s.figure} ${embedded ? s.embedded : ''}`}
        style={embedded ? undefined : { maxWidth }}
      >
        <div className={s.imageWrap} style={{ aspectRatio }}>
          <img
            src={current.src}
            alt={current.alt}
            loading="lazy"
            className={s.image}
            onClick={openLightbox}
            title="Click to enlarge"
          />

          {multi && hasPrev && (
            <button className={`${s.arrow} ${s.arrowPrev}`} onClick={prev} aria-label="Previous image">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true">
                <path d="M8 1L1 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {multi && hasNext && (
            <button className={`${s.arrow} ${s.arrowNext}`} onClick={next} aria-label="Next image">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true">
                <path d="M1 1L8 8L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {multi && (
            <div className={s.dots} role="tablist" aria-label="Image navigation">
              {images.map((img, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIdx}
                  aria-label={`Image ${i + 1}: ${img.alt}`}
                  className={`${s.dot} ${i === activeIdx ? s.dotActive : ''}`}
                  onClick={() => { setActiveIdx(i); setZoomLevel(0) }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer: caption + attribution */}
        {hasFooter && (
          <figcaption className={s.footer}>
            {current.caption && <span className={s.caption}>{current.caption}</span>}
            {credit           && <span className={s.credit}>{credit}</span>}
            {rights           && (
              <details className={s.rights}>
                <summary>Source and rights</summary>
                <p>{rights}</p>
              </details>
            )}
          </figcaption>
        )}
      </figure>

      {/* ── Lightbox portal ───────────────────────────────────────────────── */}
      {lightboxOpen && createPortal(
        <div
          className={s.overlay}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close */}
          <button className={s.close} onClick={closeLightbox} aria-label="Close image viewer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Zoom level badge */}
          {zoomLabel && (
            <span className={s.zoomBadge} aria-live="polite">{zoomLabel}</span>
          )}

          {/* Lightbox prev / next */}
          {multi && hasPrev && (
            <button
              className={`${s.lbArrow} ${s.lbArrowPrev}`}
              onClick={e => { e.stopPropagation(); prev() }}
              aria-label="Previous image"
            >
              <svg width="11" height="20" viewBox="0 0 11 20" fill="none" aria-hidden="true">
                <path d="M10 1L1 10L10 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {multi && hasNext && (
            <button
              className={`${s.lbArrow} ${s.lbArrowNext}`}
              onClick={e => { e.stopPropagation(); next() }}
              aria-label="Next image"
            >
              <svg width="11" height="20" viewBox="0 0 11 20" fill="none" aria-hidden="true">
                <path d="M1 1L10 10L1 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Image — click to cycle zoom */}
          <div className={s.lbImageWrap} onClick={e => e.stopPropagation()}>
            <img
              src={current.src}
              alt={current.alt}
              className={s.lbImage}
              onClick={cycleZoom}
              style={{ transform: `scale(${scale})`, cursor: zoomCursor }}
              title={zoomTitle}
            />
          </div>

          {/* Footer: caption + credit + counter */}
          {(current.caption || credit || multi) && (
            <div className={s.lbFooter} onClick={e => e.stopPropagation()}>
              <div className={s.lbMeta}>
                {current.caption && <p className={s.lbCaption}>{current.caption}</p>}
                {credit          && <p className={s.lbCredit}>{credit}</p>}
              </div>
              {multi && <span className={s.lbCounter}>{activeIdx + 1} / {images.length}</span>}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  )
}
