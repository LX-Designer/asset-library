import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Rnd } from 'react-rnd'
import s from './FloatingPanel.module.css'

function load(id) {
  try { return JSON.parse(localStorage.getItem(`fp_${id}`) ?? 'null') ?? {} }
  catch { return {} }
}
function save(id, patch) {
  try { localStorage.setItem(`fp_${id}`, JSON.stringify({ ...load(id), ...patch })) }
  catch {}
}

function clampPos(pos, w, h) {
  const maxX = Math.max(0, window.innerWidth - w)
  const maxY = Math.max(0, window.innerHeight - 44)
  return { x: Math.max(0, Math.min(pos.x, maxX)), y: Math.max(0, Math.min(pos.y, maxY)) }
}

const IconPopOut = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 2H2v9h9V7.5M7.5 2H11v3.5M11 2L6 7"/>
  </svg>
)
const IconDock = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="4" height="11" rx="1"/>
    <path d="M8 6.5h4M10.5 4.5l2 2-2 2"/>
  </svg>
)
const IconMinimise = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M2.5 6.5h8"/>
  </svg>
)
const IconExpand = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2h3.5M2 2v3.5M11 2H7.5M11 2v3.5M2 11h3.5M2 11V7.5M11 11H7.5M11 11V7.5"/>
  </svg>
)

function PanelHeader({ title, titleEyebrow, state, onTransition, onModalFirstPopOut, sidebarOnly, modalFirst, floatOnly, accentHeader }) {
  const isDocked    = state === 'docked'
  const isFloating  = state === 'floating'
  const isMinimised = state === 'minimised'
  // Standard nav buttons only for the full-featured (non-restricted) mode
  const showNav = !sidebarOnly && !modalFirst
  const headerClass = [
    s.header,
    sidebarOnly ? s.headerStatic : '',
    accentHeader ? s.headerAccent : '',
  ].filter(Boolean).join(' ')
  return (
    <div className={headerClass}>
      <div className={s.headerTitleWrap}>
        {titleEyebrow && <span className={s.headerEyebrow}>{titleEyebrow}</span>}
        <span className={titleEyebrow ? s.headerTitleLarge : s.headerTitle}>{title}</span>
      </div>
      <div className={s.headerBtns}>
        {showNav && isDocked && (
          <button className={s.hBtn} onClick={() => onTransition('floating')} title="Pop out" aria-label="Pop out panel">
            <IconPopOut />
          </button>
        )}
        {showNav && isFloating && (
          <button className={s.hBtn} onClick={() => onTransition('minimised')} title="Minimise" aria-label="Minimise panel">
            <IconMinimise />
          </button>
        )}
        {showNav && isMinimised && (
          <button className={s.hBtn} onClick={() => onTransition('floating')} title="Expand" aria-label="Expand panel">
            <IconExpand />
          </button>
        )}
        {showNav && (isFloating || isMinimised) && (
          <button className={s.hBtn} onClick={() => onTransition('docked')} title="Dock to sidebar" aria-label="Dock panel">
            <IconDock />
          </button>
        )}
        {/* modalFirst panels: dock when floating (suppressed when floatOnly) */}
        {modalFirst && isFloating && !floatOnly && (
          <button className={s.hBtn} onClick={() => onTransition('docked')} title="Dock to sidebar" aria-label="Dock panel">
            <IconDock />
          </button>
        )}
        {modalFirst && isDocked && (
          <button className={s.hBtn} onClick={onModalFirstPopOut} title="Pop out" aria-label="Pop out panel">
            <IconPopOut />
          </button>
        )}
        <button className={`${s.hBtn} ${s.hBtnClose}`} onClick={() => onTransition('closed')} title="Close" aria-label="Close panel">
          ×
        </button>
      </div>
    </div>
  )
}

/**
 * FloatingPanel — shared chrome for dockable / floatable side panels.
 *
 * Props:
 *   id                string              localStorage key prefix
 *   title             string              panel heading
 *   side              'left' | 'right'   which viewport edge for the tab
 *   width             number              default float width (px)
 *   defaultHeight     number              default float height (px)
 *   defaultDockedWidth number             default docked width (falls back to width)
 *   maxDockedWidth     number             maximum docked width from drag-resize (default 600)
 *   topOffset          string             CSS value for top offset when docked (e.g. 'var(--fr-nav-height)'); default '0px'
 *   tabLabel          string              text on the viewport edge tab
 *   initialState      'docked' | 'floating' | 'closed'
 *   onDockedChange    (isDocked, width) => void  fires when docked state or panel width changes
 *   onClose           () => void          fires when panel transitions to closed
 *   triggerOpen       number              increment to programmatically open from closed
 *   triggerDock       number              increment to programmatically dock panel
 *   triggerClose      number              increment to programmatically close panel
 *   noTab             bool                when closed, show nothing (no edge tab)
 *   sidebarOnly       bool                docked/closed only — no pop-out, no minimise
 *   tabAlign          'center' | 'top'    edge tab vertical position (default 'center')
 *   modalFirst        bool                opens centred with dim overlay; drag header → free float
 *   themeVars         string[]            extra CSS custom-property names to read from the
 *                                         anchor (inside the asset shell) and forward to the
 *                                         portal wrapper — use when the panel's children
 *                                         reference asset-specific vars (e.g. '--fr-accent')
 *   children          ReactNode
 */
export default function FloatingPanel({
  id,
  title,
  side = 'left',
  width = 280,
  defaultHeight = 540,
  defaultDockedWidth,
  maxDockedWidth = 600,
  topOffset = '0px',
  tabLabel,
  initialState = 'docked',
  onDockedChange,
  onClose,
  onFloat,
  triggerOpen,
  triggerDock,
  triggerClose,
  noTab = false,
  noHeader = false,
  sidebarOnly = false,
  floatOnly = false,
  tabAlign = 'center',
  modalFirst = false,
  accentHeader = false,
  titleEyebrow,
  themeVars = [],
  scrollTopKey,
  children,
}) {
  const stored = load(id)

  const defaultPos = useCallback(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
    return side === 'left'
      ? { x: 20, y: 60 }
      : { x: Math.max(0, vw - width - 20), y: 60 }
  }, [side, width])

  const [panelState, setPanelState_] = useState(() => {
    const raw = stored.state ?? initialState
    // modalFirst panels always start closed — only triggerOpen can open them
    if (modalFirst) return 'closed'
    // sidebarOnly panels can only be docked or closed
    if (sidebarOnly && (raw === 'floating' || raw === 'minimised')) return 'docked'
    return raw
  })
  const [pos, setPos] = useState(() => {
    const p = stored.pos ?? defaultPos()
    return typeof window !== 'undefined' ? clampPos(p, width, defaultHeight) : p
  })
  const [size, setSize] = useState(stored.size ?? { width, height: defaultHeight })
  // Default width used both as the initial value and to reset on close.
  // We intentionally do NOT restore dockedWidth from localStorage: panels always
  // reopen at their default width regardless of how the user last resized them.
  const defaultDockedWidthValue = defaultDockedWidth ?? width
  const [dockedWidth, setDockedWidth] = useState(defaultDockedWidthValue)
  // Dim overlay — true while modalFirst panel is in its initial centred position
  const [showOverlay, setShowOverlay] = useState(false)

  // Anchor div in document flow reads inherited CSS vars for portal use
  const anchorRef = useRef(null)
  // Ref shared by both docked and floating panelBody renders (only one active at a time)
  const panelBodyRef = useRef(null)
  // Stable ref to the default docked width so transition/effect closures can
  // reset dockedWidth without taking props as dependencies.
  const defaultDockedWidthRef = useRef(defaultDockedWidthValue)

  // Scroll panel body to top whenever scrollTopKey changes (e.g. activity navigation)
  useEffect(() => {
    if (scrollTopKey == null) return
    panelBodyRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [scrollTopKey])
  const [portalStyle, setPortalStyle] = useState(null)

  useEffect(() => {
    if (!anchorRef.current) return
    const cs = getComputedStyle(anchorRef.current)
    const varNames = [
      '--fp-bg', '--fp-border', '--fp-ink', '--fp-ink-mid', '--fp-ink-light',
      '--fp-accent', '--fp-subtle', '--fp-shadow', '--fp-tab-bg', '--fp-tab-border',
      '--fp-tab-ink', '--fp-radius', '--fp-transition',
      // Asset-specific vars forwarded via the themeVars prop.
      // Chrome resolves var() chains at getPropertyValue time, so these
      // arrive as literal values (hex, font stack, etc.) — safe as inline styles.
      ...themeVars,
    ]
    const vars = {}
    varNames.forEach(v => { const val = cs.getPropertyValue(v).trim(); if (val) vars[v] = val })
    if (Object.keys(vars).length > 0) setPortalStyle(vars)
  }, [themeVars])

  const isDocked    = panelState === 'docked'
  const isFloating  = panelState === 'floating'
  const isMinimised = panelState === 'minimised'

  const transition = useCallback((newState) => {
    setShowOverlay(false)  // always clear overlay on any state transition
    if (newState === 'closed') {
      setDockedWidth(defaultDockedWidthRef.current)  // reset width so panel reopens at default size
      save(id, { state: newState, prevState: panelState })
      onClose?.()
    } else {
      if (newState === 'docked') {
        setDockedWidth(defaultDockedWidthRef.current)  // reset to default whenever panel docks
      }
      if (newState === 'floating') onFloat?.()
      save(id, { state: newState })
    }
    setPanelState_(newState)
  }, [id, panelState, onClose, onFloat])

  // For modalFirst panels: pop-out button re-centres with overlay, identical to triggerOpen.
  const handleModalFirstPopOut = useCallback(() => {
    // Always reset to default size so pop-out is consistent regardless of previous resizing.
    const w = Math.min(width,         window.innerWidth  - 48)
    const h = Math.min(defaultHeight, window.innerHeight - 48)
    setSize({ width: w, height: h })
    const centrePos = {
      x: Math.max(0, Math.round((window.innerWidth  - w) / 2)),
      y: Math.max(0, Math.round((window.innerHeight - h) / 2)),
    }
    setPos(centrePos)
    setPanelState_('floating')
    save(id, { state: 'floating', pos: centrePos })
    onFloat?.()
  }, [width, defaultHeight, id, onFloat])

  // Programmatic open: when triggerOpen increments, open the panel
  useEffect(() => {
    if (!triggerOpen) return

    if (modalFirst) {
      // Always reset to default size so every open is consistent regardless of previous resizing.
      const w = Math.min(width,         window.innerWidth  - 48)
      const h = Math.min(defaultHeight, window.innerHeight - 48)
      setSize({ width: w, height: h })
      const centrePos = {
        x: Math.max(0, Math.round((window.innerWidth  - w) / 2)),
        y: Math.max(0, Math.round((window.innerHeight - h) / 2)),
      }
      setPos(centrePos)
      setShowOverlay(true)
      setPanelState_('floating')
      save(id, { state: 'floating', pos: centrePos })
      return
    }

    // Standard open: restore previous state (or sensible default)
    const st = load(id)
    if (st.state === 'closed' || panelState === 'closed') {
      const reopen = sidebarOnly
        ? 'docked'
        : ((st.prevState === 'floating' || st.prevState === 'minimised' || st.prevState === 'docked')
            ? st.prevState : 'floating')
      setPanelState_(reopen)
      save(id, { state: reopen })
      if (reopen === 'floating') onFloat?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOpen])

  // Programmatic dock: when triggerDock increments, transition panel to docked state
  useEffect(() => {
    if (!triggerDock) return
    setShowOverlay(false)
    setDockedWidth(defaultDockedWidthRef.current)  // consistent with transition('docked')
    setPanelState_('docked')
    save(id, { state: 'docked' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerDock])

  // Programmatic close: when triggerClose increments, transition panel to closed state
  useEffect(() => {
    if (!triggerClose) return
    const st = load(id)
    if (st.state === 'closed') return  // already closed — guard against stale state
    setShowOverlay(false)
    setDockedWidth(defaultDockedWidthRef.current)  // reset width so panel reopens at default size
    save(id, { state: 'closed', prevState: st.state })
    onClose?.()
    setPanelState_('closed')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerClose])

  useEffect(() => {
    onDockedChange?.(isDocked, isDocked ? dockedWidth : 0)
  }, [isDocked, dockedWidth, onDockedChange])

  // Clamp (or re-centre) position after window resize
  useEffect(() => {
    const handler = () => {
      if (showOverlay) {
        // Modal is still in its initial centred position — keep it centred
        const w = Math.min(size.width,  window.innerWidth  - 48)
        const h = Math.min(size.height, window.innerHeight - 48)
        setPos({
          x: Math.max(0, Math.round((window.innerWidth  - w) / 2)),
          y: Math.max(0, Math.round((window.innerHeight - h) / 2)),
        })
      } else {
        setPos(prev => clampPos(prev, size.width, size.height))
      }
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [size, showOverlay])

  // Docked-width drag resize
  const handleDockedResize = useCallback((e) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = dockedWidth
    const onMove = (ev) => {
      const delta = side === 'left' ? ev.clientX - startX : startX - ev.clientX
      setDockedWidth(Math.max(180, Math.min(maxDockedWidth, startW + delta)))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [dockedWidth, side, maxDockedWidth])

  // Hidden anchor always rendered in document flow so CSS vars can be read
  const anchorDiv = <div ref={anchorRef} style={{ display: 'none' }} aria-hidden="true" />

  const tabClassName = [s.tab, s[side], tabAlign === 'top' ? s.alignTop : ''].filter(Boolean).join(' ')

  const tab = noTab ? null : (
    <button
      className={tabClassName}
      onClick={() => {
        const st = load(id)
        const reopen = sidebarOnly
          ? 'docked'
          : ((st.prevState === 'floating' || st.prevState === 'minimised')
              ? st.prevState : 'docked')
        transition(reopen)
      }}
      aria-label={`Open ${title}`}
    >
      <span className={s.tabInner}>{tabLabel ?? title}</span>
    </button>
  )

  // ── Docked ──────────────────────────────────────────────────────────────────
  if (isDocked) {
    // topOffset shifts the panel down so it starts below the asset's nav/header.
    // The CSS default is top:0 / height:100vh; the inline style overrides both.
    // marginTop is applied to left (sticky) panels only — it pushes the in-flow
    // start position down so the panel's background doesn't bleed behind the nav.
    // It is intentionally omitted for right (fixed) panels where margin stacks on
    // top of the explicit `top` value and would double the offset.
    const dockedStyle = topOffset && topOffset !== '0px'
      ? {
          width: dockedWidth,
          top: topOffset,
          height: `calc(100vh - ${topOffset})`,
          ...(side === 'left' ? { marginTop: topOffset } : {}),
        }
      : { width: dockedWidth }
    const panel = (
      <div className={`${s.dockedPanel} ${s[side]}`} style={dockedStyle}>
        {!noHeader && <PanelHeader title={title} titleEyebrow={titleEyebrow} state={panelState} onTransition={transition} onModalFirstPopOut={handleModalFirstPopOut} sidebarOnly={sidebarOnly} modalFirst={modalFirst} floatOnly={floatOnly} accentHeader={accentHeader} />}
        <div className={s.panelBody} ref={panelBodyRef}>{children}</div>
        <div className={`${s.resizeHandle} ${s[side]}`} onMouseDown={handleDockedResize} />
      </div>
    )
    if (side === 'left') return <>{anchorDiv}{panel}</>
    return (
      <>
        {anchorDiv}
        {createPortal(<div style={portalStyle || {}}>{panel}</div>, document.body)}
      </>
    )
  }

  // ── Floating / minimised ─────────────────────────────────────────────────
  if (isFloating || isMinimised) {
    const rndSize = isMinimised ? { width: size.width, height: 44 } : size
    // A viewport-filling fixed wrapper gives react-rnd a stable coordinate
    // system (0,0 = viewport top-left) without fighting its position:absolute.
    const viewportWrapper = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',  // wrapper is transparent to clicks
      zIndex: 95,
      overflow: 'hidden',
      ...(portalStyle || {}),
    }
    return (
      <>
        {anchorDiv}
        {side === 'left' && <div style={{ width: 0, flexShrink: 0, overflow: 'hidden' }} />}
        {createPortal(
          <div style={viewportWrapper}>
            {/* Dim overlay — shown while panel is in its initial centred (modal-first) state.
                pointerEvents:auto blocks background interaction while overlay is visible. */}
            {showOverlay && (
              <div
                className={s.overlay}
                style={{ pointerEvents: 'auto' }}
                onClick={() => transition('closed')}
              />
            )}
            <Rnd
              className={`${s.floatingPanel} ${isMinimised ? s.minimised : ''}`}
              style={{ pointerEvents: 'auto', zIndex: 1 }}
              position={pos}
              size={rndSize}
              minWidth={220}
              minHeight={isMinimised ? 44 : 180}
              dragHandleClassName={noHeader ? undefined : s.header}
              enableResizing={!isMinimised}
              bounds="parent"
              onDragStart={showOverlay ? () => setShowOverlay(false) : undefined}
              onDragStop={(_, d) => {
                const p = { x: d.x, y: d.y }
                setPos(p)
                if (!modalFirst) save(id, { pos: p })
              }}
              onResizeStop={(_, __, ref, ___, newPos) => {
                const sz = { width: ref.offsetWidth, height: ref.offsetHeight }
                setSize(sz)
                setPos(newPos)
                if (!modalFirst) save(id, { size: sz, pos: newPos })
              }}
            >
              {!noHeader && <PanelHeader title={title} titleEyebrow={titleEyebrow} state={panelState} onTransition={transition} onModalFirstPopOut={handleModalFirstPopOut} sidebarOnly={sidebarOnly} modalFirst={modalFirst} floatOnly={floatOnly} accentHeader={accentHeader} />}
              {!isMinimised && <div className={s.panelBody} ref={panelBodyRef}>{children}</div>}
            </Rnd>
          </div>,
          document.body
        )}
      </>
    )
  }

  // ── Closed ──────────────────────────────────────────────────────────────────
  return (
    <>
      {anchorDiv}
      {side === 'left' && <div style={{ width: 0, flexShrink: 0, overflow: 'hidden' }} />}
      {tab && createPortal(<div style={portalStyle || {}}>{tab}</div>, document.body)}
    </>
  )
}
