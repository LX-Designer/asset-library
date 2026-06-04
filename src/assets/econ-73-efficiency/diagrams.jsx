import { useState, useEffect, useRef } from 'react'
import styles from './index.module.css'

// ─────────────────────────────────────────────────────────────
// 1. PRODUCTIVE EFFICIENCY — U-shaped AC curve (SVG)
// ─────────────────────────────────────────────────────────────

export function ProductiveEfficiencyDiagram() {
  // SVG coordinate system
  // viewBox 0 0 680 340
  // Axis origin: (70, 305)
  // Y axis: (70, 305) → (70, 22)  [up]
  // X axis: (70, 305) → (655, 305) [right]
  //
  // U-curve: M 90,285  C 130,92 238,158 318,163  S 512,194 632,246
  // Minimum approx at (318, 163)
  // Veridian dot at (408, 173)  — slightly right of minimum

  return (
    <div className={styles.diagramWrapper}>
      <svg
        viewBox="0 0 680 340"
        width="100%"
        aria-label="Productive efficiency diagram: U-shaped average cost curve"
        role="img"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Upward arrowhead for Y axis */}
          <marker id="arrowUp" markerWidth="7" markerHeight="7"
            refX="3.5" refY="6" orient="auto">
            <polygon points="3.5,0 0,7 7,7" fill="#888" />
          </marker>
          {/* Rightward arrowhead for X axis */}
          <marker id="arrowRight" markerWidth="7" markerHeight="7"
            refX="1" refY="3.5" orient="auto">
            <polygon points="0,0 7,3.5 0,7" fill="#888" />
          </marker>
        </defs>

        {/* ── Axes ── */}
        <line x1="70" y1="305" x2="70" y2="28"
          stroke="#888" strokeWidth="0.75" markerEnd="url(#arrowUp)" />
        <line x1="70" y1="305" x2="649" y2="305"
          stroke="#888" strokeWidth="0.75" markerEnd="url(#arrowRight)" />

        {/* ── Axis labels ── */}
        <text
          transform="rotate(-90)"
          x="-168" y="22"
          textAnchor="middle"
          fill="#4a5568"
          fontSize="12"
          fontFamily="Inter, system-ui, sans-serif"
        >
          Average cost per unit
        </text>
        <text
          x="360" y="334"
          textAnchor="middle"
          fill="#4a5568"
          fontSize="12"
          fontFamily="Inter, system-ui, sans-serif"
        >
          Quantity of output
        </text>

        {/* ── U-shaped AC curve ── */}
        <path
          d="M 90,285 C 130,92 238,158 318,163 S 512,194 632,246"
          fill="none"
          stroke="#1a2744"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ── "AC curve" label at right end ── */}
        <text
          x="636" y="244"
          fill="#1a2744"
          fontSize="12"
          fontFamily="Inter, system-ui, sans-serif"
          fontStyle="italic"
        >
          AC curve
        </text>

        {/* ── Minimum dashed vertical ── */}
        <line
          x1="318" y1="163" x2="318" y2="305"
          stroke="#8a9ab0"
          strokeWidth="1"
          strokeDasharray="5,4"
        />
        <text
          x="318" y="322"
          textAnchor="middle"
          fill="#8a9ab0"
          fontSize="11"
          fontFamily="Inter, system-ui, sans-serif"
        >
          Minimum AC
        </text>

        {/* ── Dashed leader line from dot to label card ── */}
        <line
          x1="408" y1="173" x2="515" y2="104"
          stroke="#8a9ab0"
          strokeWidth="1"
          strokeDasharray="4,3"
        />

        {/* ── Label card ── */}
        <rect
          x="515" y="74" width="150" height="56"
          fill="white"
          stroke="#ddd8cc"
          strokeWidth="1"
          rx="2"
        />
        <text
          x="590" y="97"
          textAnchor="middle"
          fill="#1a2744"
          fontSize="13"
          fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif"
        >
          Veridian
        </text>
        <text
          x="590" y="114"
          textAnchor="middle"
          fill="#8a9ab0"
          fontSize="11"
          fontFamily="Inter, system-ui, sans-serif"
        >
          AC ≈ $12,400/unit
        </text>

        {/* ── Veridian dot (navy, slightly right of minimum) ── */}
        <circle cx="408" cy="173" r="5.5" fill="#1a2744" />

      </svg>

      <p className={styles.diagramCaption}>
        Productive efficiency concerns position on this curve — not the price charged above it.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 2. ALLOCATIVE EFFICIENCY — interactive canvas with slider
// ─────────────────────────────────────────────────────────────

const D_START_P = 50000   // highest WTP (leftmost patient)
const D_END_P   = 180     // MC / lowest WTP threshold
const Q_MAX     = 8400    // total patient population

function drawAllocative(ctx, cssW, cssH, price) {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches

  const ml = 64, mr = 28, mt = 22, mb = 50
  const cW = cssW - ml - mr
  const cH = cssH - mt - mb

  // Colour scheme
  const navy   = dark ? '#7fa4d4' : '#1a2744'
  const axisC  = dark ? '#777'    : '#999'
  const mcC    = '#2d6a4f'
  const priceC = '#c1121f'
  const textC  = dark ? '#bbb'    : '#4a5568'

  // Coordinate helpers (CSS pixel space)
  function qx(q) { return ml + (q / Q_MAX) * cW }
  function py(p) {
    const clamped = Math.max(0, Math.min(p, D_START_P + 2000))
    return mt + cH - (clamped / (D_START_P + 2000)) * cH
  }

  ctx.clearRect(0, 0, cssW, cssH)

  // ── Axes ──
  ctx.strokeStyle = axisC
  ctx.lineWidth = 0.75
  ctx.beginPath()
  ctx.moveTo(ml, mt)
  ctx.lineTo(ml, mt + cH)
  ctx.lineTo(ml + cW, mt + cH)
  ctx.stroke()

  // ── Axis labels ──
  ctx.fillStyle = textC
  ctx.font = '11px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Patients who need Nexavir', ml + cW / 2, cssH - 10)

  ctx.save()
  ctx.translate(14, mt + cH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('Price per dose', 0, 0)
  ctx.restore()

  // ── Excluded triangle calculation ──
  // Demand: WTP(q) = D_START_P - q*(D_START_P-D_END_P)/Q_MAX
  // At price P, the quantity that can afford it:
  const q_at_price = Math.max(0, Math.min(
    (D_START_P - price) * Q_MAX / (D_START_P - D_END_P),
    Q_MAX
  ))
  const excluded = Math.round(Q_MAX * (price - D_END_P) / (D_START_P - D_END_P))

  // Triangle vertices (canvas coords)
  const tAx = qx(q_at_price),  tAy = py(price)     // demand curve at price P
  const tBx = qx(Q_MAX),       tBy = py(D_END_P)    // demand curve at MC (right end)
  const tCx = qx(q_at_price),  tCy = py(D_END_P)    // MC line, below A

  // ── Excluded triangle ──
  if (price > D_END_P + 50 && q_at_price < Q_MAX) {
    ctx.fillStyle = 'rgba(193,18,31,0.09)'
    ctx.beginPath()
    ctx.moveTo(tAx, tAy)
    ctx.lineTo(tBx, tBy)
    ctx.lineTo(tCx, tCy)
    ctx.closePath()
    ctx.fill()
  }

  // ── MC dashed line ──
  ctx.strokeStyle = mcC
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(ml, py(D_END_P))
  ctx.lineTo(ml + cW, py(D_END_P))
  ctx.stroke()
  ctx.setLineDash([])

  // MC label
  ctx.fillStyle = mcC
  ctx.font = '11px Inter, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('MC = $180', ml + 6, py(D_END_P) - 5)

  // ── Price line ──
  const pricePy = py(price)
  ctx.strokeStyle = priceC
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(ml, pricePy)
  ctx.lineTo(ml + cW, pricePy)
  ctx.stroke()

  // Price label (right-aligned)
  ctx.fillStyle = priceC
  ctx.font = '11px Inter, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('P = $' + price.toLocaleString(), ml + cW - 4, pricePy - 5)

  // ── Demand line ──
  ctx.strokeStyle = navy
  ctx.lineWidth = 1.75
  ctx.beginPath()
  ctx.moveTo(qx(0), py(D_START_P))
  ctx.lineTo(qx(Q_MAX), py(D_END_P))
  ctx.stroke()

  // ── Dashed vertical from price/demand intersection ──
  if (price > D_END_P + 50 && q_at_price > 10 && q_at_price < Q_MAX - 10) {
    ctx.strokeStyle = axisC
    ctx.lineWidth = 0.75
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(tAx, tAy)
    ctx.lineTo(tAx, mt + cH)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // ── "Excluded" label inside triangle ──
  if (excluded > 1500 && price < D_START_P) {
    const labelX = (tAx + tBx) / 2
    const labelY = (tAy + tCy) / 2 + 6
    ctx.fillStyle = dark ? 'rgba(210,90,90,0.8)' : 'rgba(193,18,31,0.65)'
    ctx.font = 'italic 11px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('Excluded', labelX, labelY)
  }
}

export function AllocativeEfficiencyDiagram() {
  const CSS_H = 260
  const [price, setPrice] = useState(50000)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function sizeAndDraw() {
      const container = canvas.parentElement
      if (!container) return
      const cssW = container.clientWidth
      const dpr  = window.devicePixelRatio || 1
      canvas.width        = Math.round(cssW * dpr)
      canvas.height       = Math.round(CSS_H * dpr)
      canvas.style.width  = cssW + 'px'
      canvas.style.height = CSS_H + 'px'
      const ctx = canvas.getContext('2d')
      // Absolute scale to avoid cumulative transforms on re-runs
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawAllocative(ctx, cssW, CSS_H, price)
    }

    sizeAndDraw()
    window.addEventListener('resize', sizeAndDraw)
    return () => window.removeEventListener('resize', sizeAndDraw)
  }, [price])

  const excluded = Math.round(Q_MAX * (price - D_END_P) / (D_START_P - D_END_P))

  function em(text) {
    return <span style={{ fontStyle: 'normal', fontWeight: 500 }}>{text}</span>
  }

  let readout
  if (price <= D_END_P) {
    readout = <>
      At {em('$180')}, the price equals marginal cost — allocatively efficient.
      Every patient who needs Nexavir can access it. But at this price,
      Veridian cannot recover its $2.1 billion in R&D costs.
    </>
  } else if (price >= D_START_P) {
    readout = <>
      At {em('$50,000')}, an estimated {em('8,400 patients')} who need this drug
      cannot afford it. The market sells every dose it produces — but only to
      those who can pay.
    </>
  } else {
    readout = <>
      At {em('$' + price.toLocaleString())}, an estimated{' '}
      {em(excluded.toLocaleString() + ' patients')} who need this drug cannot
      afford it. They would pay more than the $180 it costs to treat them —
      but the market price excludes them entirely.
    </>
  }

  return (
    <div className={styles.diagramWrapper}>
      <span className={styles.taskLabel}>Explore the market</span>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%' }}
        aria-label="Interactive allocative efficiency diagram"
        role="img"
      />
      <div className={styles.sliderRow}>
        <span className={styles.sliderLabel}>Price per dose</span>
        <input
          type="range"
          className={styles.slider}
          min={D_END_P}
          max={D_START_P}
          step={100}
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          aria-label="Price per dose slider"
        />
        <span className={styles.sliderValue}>${price.toLocaleString()}</span>
      </div>
      <p className={styles.diagramReadout}>{readout}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 3. DYNAMIC EFFICIENCY — trade-off diagram (SVG)
// ─────────────────────────────────────────────────────────────

export function DynamicEfficiencyDiagram() {
  // viewBox 0 0 680 260
  // Left box  (navy tint): x=20,  y=15, w=210, h=110
  // Right box (amber tint): x=450, y=15, w=210, h=110
  // Center gap: x=230 to x=450
  // Below-box text: y=135 to y=185
  // Policy box (dashed): x=205, y=200, w=270, h=50

  return (
    <div className={styles.diagramWrapper}>
      <svg
        viewBox="0 0 680 260"
        width="100%"
        aria-label="Dynamic efficiency trade-off diagram"
        role="img"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <marker id="arrR" markerWidth="7" markerHeight="7"
            refX="1" refY="3.5" orient="auto">
            <polygon points="0,0 7,3.5 0,7" fill="#8a9ab0" />
          </marker>
          <marker id="arrL" markerWidth="7" markerHeight="7"
            refX="6" refY="3.5" orient="auto">
            <polygon points="7,0 0,3.5 7,7" fill="#8a9ab0" />
          </marker>
        </defs>

        {/* ── Left box — Allocative efficiency (navy tint) ── */}
        <rect
          x="20" y="15" width="210" height="110"
          fill="rgba(26,39,68,0.06)"
          stroke="rgba(26,39,68,0.25)"
          strokeWidth="1"
          rx="2"
        />
        <text x="125" y="45" textAnchor="middle"
          fill="#1a2744" fontSize="14" fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif">
          Allocative efficiency
        </text>
        <text x="125" y="63" textAnchor="middle"
          fill="#4a5568" fontSize="12"
          fontFamily="Inter, system-ui, sans-serif">
          P = MC = $180
        </text>

        {/* ── Right box — Dynamic efficiency (amber tint) ── */}
        <rect
          x="450" y="15" width="210" height="110"
          fill="rgba(180,130,20,0.07)"
          stroke="rgba(160,110,10,0.30)"
          strokeWidth="1"
          rx="2"
        />
        <text x="555" y="45" textAnchor="middle"
          fill="#1a2744" fontSize="14" fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif">
          Dynamic efficiency
        </text>
        <text x="555" y="63" textAnchor="middle"
          fill="#4a5568" fontSize="12"
          fontFamily="Inter, system-ui, sans-serif">
          P ≫ MC — funds R&amp;D
        </text>

        {/* ── Bidirectional arrows ── */}
        {/* → left to right */}
        <line x1="234" y1="62" x2="446" y2="62"
          stroke="#8a9ab0" strokeWidth="1.2"
          markerEnd="url(#arrR)" />
        {/* ← right to left */}
        <line x1="446" y1="76" x2="234" y2="76"
          stroke="#8a9ab0" strokeWidth="1.2"
          markerEnd="url(#arrL)" />

        {/* ── Centre muted text ── */}
        <text x="340" y="100" textAnchor="middle"
          fill="#8a9ab0" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          Moving toward one
        </text>
        <text x="340" y="113" textAnchor="middle"
          fill="#8a9ab0" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          means moving away
        </text>
        <text x="340" y="126" textAnchor="middle"
          fill="#8a9ab0" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          from the other
        </text>

        {/* ── Below left box — muted ── */}
        <text x="125" y="142" textAnchor="middle"
          fill="#4a5568" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          Every patient can access
        </text>
        <text x="125" y="156" textAnchor="middle"
          fill="#4a5568" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          treatment today.
        </text>

        {/* ── Below left box — red ── */}
        <text x="125" y="174" textAnchor="middle"
          fill="#c1121f" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          No revenue to fund the
        </text>
        <text x="125" y="188" textAnchor="middle"
          fill="#c1121f" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          next drug's development.
        </text>

        {/* ── Below right box — muted ── */}
        <text x="555" y="142" textAnchor="middle"
          fill="#4a5568" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          R&amp;D investment is viable.
        </text>
        <text x="555" y="156" textAnchor="middle"
          fill="#4a5568" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          Future drugs get developed.
        </text>

        {/* ── Below right box — red ── */}
        <text x="555" y="174" textAnchor="middle"
          fill="#c1121f" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          Most patients excluded
        </text>
        <text x="555" y="188" textAnchor="middle"
          fill="#c1121f" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          from the market today.
        </text>

        {/* ── Policy box (dashed, no fill) ── */}
        <rect
          x="205" y="202" width="270" height="48"
          fill="none"
          stroke="#8a9ab0"
          strokeWidth="1"
          strokeDasharray="5,4"
          rx="2"
        />
        <text x="340" y="222" textAnchor="middle"
          fill="#1a2744" fontSize="12" fontWeight="500"
          fontFamily="Inter, system-ui, sans-serif">
          Patent system:
        </text>
        <text x="340" y="238" textAnchor="middle"
          fill="#4a5568" fontSize="11"
          fontFamily="Inter, system-ui, sans-serif">
          a deliberate choice
        </text>

      </svg>
    </div>
  )
}
