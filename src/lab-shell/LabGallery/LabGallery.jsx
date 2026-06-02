import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import s from './LabGallery.module.css'

/**
 * LabGallery — shell-level gallery component for inline document images.
 *
 * - Single image: renders like LabFigure (no navigation shown).
 * - Multiple images: prev/next arrows overlaid on the image, dot indicators.
 * - Click any image to open a lightbox; click again (or press Escape) to close.
 * - In the lightbox, click the image to toggle between contained and full-width zoom.
 *
 * Images should live in public/[lab-id]/ and be referenced as
 * src="/[lab-id]/filename.ext".
 *
 * Props:
 *   images: Array<{ src: string, alt: string, caption?: string }>
 */
export default function LabGallery({ images }) {
  const [activeIdx, setActiveIdx]     = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomed, setZoomed]           = useState(false)

  const current  = images[activeIdx]
  const multi    = images.length > 1
  const hasPrev  = activeIdx > 0
  const hasNext  = activeIdx < images.length - 1

  const prev = useCallback(() => {
    if (hasPrev) { setActiveIdx(i => i - 1); setZoomed(false) }
  }, [hasPrev])

  const next = useCallback(() => {
    if (hasNext) { setActiveIdx(i => i + 1); setZoomed(false) }
  }, [hasNext])

  const openLightbox  = ()  => { setLightboxOpen(true); setZoomed(false) }
  const closeLightbox = ()  => { setLightboxOpen(false); setZoomed(false) }
  const toggleZoom    = (e) => { e.stopPropagation(); setZoomed(z => !z) }

  // Keyboard navigation when lightbox is open
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

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  return (
    <>
      {/* ── In-document gallery ── */}
      <figure className={s.figure}>
        <div className={s.imageWrap}>
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
                  onClick={() => { setActiveIdx(i); setZoomed(false) }}
                />
              ))}
            </div>
          )}
        </div>

        {current.caption && (
          <figcaption className={s.caption}>{current.caption}</figcaption>
        )}
      </figure>

      {/* ── Lightbox portal ── */}
      {lightboxOpen && createPortal(
        <div className={s.overlay} onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Image viewer">
          {/* Close */}
          <button className={s.close} onClick={closeLightbox} aria-label="Close image viewer">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Lightbox prev/next */}
          {multi && hasPrev && (
            <button className={`${s.lbArrow} ${s.lbArrowPrev}`} onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous image">
              <svg width="11" height="20" viewBox="0 0 11 20" fill="none" aria-hidden="true">
                <path d="M10 1L1 10L10 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {multi && hasNext && (
            <button className={`${s.lbArrow} ${s.lbArrowNext}`} onClick={e => { e.stopPropagation(); next() }} aria-label="Next image">
              <svg width="11" height="20" viewBox="0 0 11 20" fill="none" aria-hidden="true">
                <path d="M1 1L10 10L1 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Image (scrollable when zoomed) */}
          <div className={`${s.lbImageWrap} ${zoomed ? s.lbImageWrapZoomed : ''}`} onClick={e => e.stopPropagation()}>
            <img
              src={current.src}
              alt={current.alt}
              className={`${s.lbImage} ${zoomed ? s.lbImageZoomed : ''}`}
              onClick={toggleZoom}
              style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
              title={zoomed ? 'Click to shrink' : 'Click to zoom'}
            />
          </div>

          {/* Caption + counter */}
          <div className={s.lbFooter} onClick={e => e.stopPropagation()}>
            {current.caption && <p className={s.lbCaption}>{current.caption}</p>}
            {multi && <span className={s.lbCounter}>{activeIdx + 1} / {images.length}</span>}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
