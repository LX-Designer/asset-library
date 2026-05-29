import { useState, useEffect, useCallback } from 'react'
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

function PanelHeader({ title, state, onTransition }) {
  const isDocked    = state === 'docked'
  const isFloating  = state === 'floating'
  const isMinimised = state === 'minimised'
  return (
    <div className={s.header}>
      <span className={s.headerTitle}>{title}</span>
      <div className={s.headerBtns}>
        {isDocked && (
          <button className={s.hBtn} onClick={() => onTransition('floating')} title="Pop out" aria-label="Pop out panel">
            <IconPopOut />
          </button>
        )}
        {isFloating && (
          <button className={s.hBtn} onClick={() => onTransition('minimised')} title="Minimise" aria-label="Minimise panel">
            <IconMinimise />
          </button>
        )}
        {isMinimised && (
          <button className={s.hBtn} onClick={() => onTransition('floating')} title="Expand" aria-label="Expand panel">
            <IconExpand />
          </button>
        )}
        {(isFloating || isMinimised) && (
          <button className={s.hBtn} onClick={() => onTransition('docked')} title="Dock to sidebar" aria-label="Dock panel">
            <IconDock />
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
 *   id              string              localStorage key prefix
 *   title           string              panel heading
 *   side            'left' | 'right'   which viewport edge for the tab
 *   width           number              docked width + default float width (px)
 *   defaultHeight   number              default float height (px)
 *   tabLabel        string              text on the viewport edge tab
 *   initialState    'docked' | 'floating' | 'closed'
 *   onDockedChange  (isDocked) => void  optional; fires when docked state changes
 *   children        ReactNode
 *
 * Theming: set --fp-* custom properties on an ancestor element.
 * See FloatingPanel.module.css for the full variable list.
 */
export default function FloatingPanel({
  id,
  title,
  side = 'left',
  width = 280,
  defaultHeight = 540,
  tabLabel,
  initialState = 'docked',
  onDockedChange,
  children,
}) {
  const stored = load(id)

  const defaultPos = useCallback(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
    return side === 'left'
      ? { x: 20, y: 60 }
      : { x: Math.max(0, vw - width - 20), y: 60 }
  }, [side, width])

  const [panelState, setPanelState_] = useState(stored.state ?? initialState)
  const [pos, setPos] = useState(() => {
    const p = stored.pos ?? defaultPos()
    return typeof window !== 'undefined' ? clampPos(p, width, defaultHeight) : p
  })
  const [size, setSize] = useState(stored.size ?? { width, height: defaultHeight })

  const isDocked    = panelState === 'docked'
  const isFloating  = panelState === 'floating'
  const isMinimised = panelState === 'minimised'
  const isClosed    = panelState === 'closed'

  const transition = useCallback((newState) => {
    setPanelState_(newState)
    save(id, { state: newState })
  }, [id])

  useEffect(() => {
    onDockedChange?.(isDocked)
  }, [isDocked, onDockedChange])

  // Clamp position after window resize
  useEffect(() => {
    const handler = () => {
      setPos(prev => clampPos(prev, size.width, size.height))
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [size])

  const tab = (
    <button
      className={`${s.tab} ${s[side]}`}
      onClick={() => transition('docked')}
      aria-label={`Open ${title}`}
    >
      <span className={s.tabInner}>{tabLabel ?? title}</span>
    </button>
  )

  // ── Docked ──────────────────────────────────────────────────────────────────
  if (isDocked) {
    const panel = (
      <div className={`${s.dockedPanel} ${s[side]}`} style={{ width }}>
        <PanelHeader title={title} state={panelState} onTransition={transition} />
        <div className={s.panelBody}>{children}</div>
      </div>
    )
    // Left side: in document flow (CSS grid slot)
    if (side === 'left') return panel
    // Right side: fixed portal so it doesn't affect grid
    return createPortal(panel, document.body)
  }

  // ── Floating / minimised ─────────────────────────────────────────────────
  if (isFloating || isMinimised) {
    const rndSize = isMinimised ? { width: size.width, height: 44 } : size
    return (
      <>
        {side === 'left' && <div style={{ width: 0, flexShrink: 0, overflow: 'hidden' }} />}
        {createPortal(
          <Rnd
            className={`${s.floatingPanel} ${isMinimised ? s.minimised : ''}`}
            position={pos}
            size={rndSize}
            minWidth={220}
            minHeight={isMinimised ? 44 : 180}
            dragHandleClassName={s.header}
            enableResizing={!isMinimised}
            bounds="window"
            onDragStop={(_, d) => {
              const p = { x: d.x, y: d.y }
              setPos(p)
              save(id, { pos: p })
            }}
            onResizeStop={(_, __, ref, ___, newPos) => {
              const sz = { width: ref.offsetWidth, height: ref.offsetHeight }
              setSize(sz)
              setPos(newPos)
              save(id, { size: sz, pos: newPos })
            }}
          >
            <PanelHeader title={title} state={panelState} onTransition={transition} />
            {!isMinimised && <div className={s.panelBody}>{children}</div>}
          </Rnd>,
          document.body
        )}
      </>
    )
  }

  // ── Closed ──────────────────────────────────────────────────────────────────
  return (
    <>
      {side === 'left' && <div style={{ width: 0, flexShrink: 0, overflow: 'hidden' }} />}
      {createPortal(tab, document.body)}
    </>
  )
}
