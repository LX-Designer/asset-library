import React from 'react'

export default function EnergyBudgetDiagram() {
  return (
    <figure style={{ margin: '2rem 0' }}>
      <svg
        viewBox="0 0 800 520"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', maxWidth: '800px', display: 'block', margin: '0 auto' }}
        aria-label="Global energy budget diagram"
      >
        <defs>
          <marker id="arrowYellow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#E6B800" />
          </marker>
          <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#CC3300" />
          </marker>
          <marker id="arrowOrange" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#E67E22" />
          </marker>
          <marker id="arrowRedThin" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" fill="#CC3300" opacity="0.5" />
          </marker>
        </defs>

        {/* ── SPACE layer ── */}
        <rect x="0" y="0" width="800" height="80" fill="#0A1628" />
        <text x="12" y="22" fill="white" fontSize="14" fontWeight="600">SPACE</text>

        {/* Sun */}
        <circle cx="60" cy="48" r="28" fill="#FFD700" />
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const x1 = 60 + 30 * Math.cos(rad)
          const y1 = 48 + 30 * Math.sin(rad)
          const x2 = 60 + 42 * Math.cos(rad)
          const y2 = 48 + 42 * Math.sin(rad)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD700" strokeWidth="2" />
        })}

        {/* ── ATMOSPHERE layer ── */}
        <rect x="0" y="80" width="800" height="260" fill="#CCE5FF" fillOpacity="0.4" />
        <text x="400" y="100" textAnchor="middle" fill="#1a5276" fontSize="12" fontStyle="italic">ATMOSPHERE</text>

        {/* Cloud zone */}
        <ellipse cx="220" cy="92" rx="55" ry="14" fill="white" opacity="0.9" />
        <ellipse cx="270" cy="86" rx="40" ry="12" fill="white" opacity="0.9" />

        {/* GHG molecule icons */}
        {[
          { x: 350, y: 155, label: 'CO₂', colour: '#8B0000' },
          { x: 430, y: 200, label: 'CO₂', colour: '#8B0000' },
          { x: 510, y: 160, label: 'CO₂', colour: '#8B0000' },
          { x: 390, y: 240, label: 'CH₄', colour: '#C55A11' },
          { x: 470, y: 130, label: 'CH₄', colour: '#C55A11' },
          { x: 560, y: 210, label: 'H₂O', colour: '#1F4E79' },
          { x: 310, y: 210, label: 'H₂O', colour: '#1F4E79' },
          { x: 540, y: 260, label: 'N₂O', colour: '#1a7a1a' },
        ].map((m, i) => (
          <g key={i}>
            <ellipse cx={m.x} cy={m.y} rx="20" ry="11" fill={m.colour} fillOpacity="0.15" stroke={m.colour} strokeWidth="0.8" />
            <text x={m.x} y={m.y + 4} textAnchor="middle" fill={m.colour} fontSize="9" fontWeight="600">{m.label}</text>
          </g>
        ))}
        <text x="600" y="290" fill="#555" fontSize="9" fontStyle="italic">Greenhouse gas layer</text>

        {/* ── EARTH SURFACE layer ── */}
        <defs>
          <linearGradient id="surfaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3A7D3A" />
            <stop offset="50%"  stopColor="#5D8A3C" />
            <stop offset="100%" stopColor="#6B4226" />
          </linearGradient>
        </defs>
        <path d="M0,340 Q200,328 400,340 Q600,352 800,340 L800,440 L0,440 Z" fill="url(#surfaceGrad)" />
        <text x="12" y="395" fill="white" fontSize="12" fontWeight="600">EARTH SURFACE</text>

        {/* ── ARROWS ── */}

        {/* A1: Incoming solar radiation */}
        <line x1="100" y1="80" x2="395" y2="335" stroke="#E6B800" strokeWidth="5" markerEnd="url(#arrowYellow)" />

        {/* A2: Reflected by clouds */}
        <line x1="248" y1="90" x2="180" y2="28" stroke="#E6B800" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arrowYellow)" />

        {/* B1: IR from surface upward */}
        <line x1="410" y1="335" x2="410" y2="195" stroke="#CC3300" strokeWidth="3" markerEnd="url(#arrowRed)" />

        {/* B4: Re-emitted back to surface */}
        <line x1="376" y1="195" x2="376" y2="332" stroke="#E67E22" strokeWidth="2.5" strokeDasharray="5 3" markerEnd="url(#arrowOrange)" />

        {/* B3: Re-emitted to space */}
        <line x1="440" y1="190" x2="455" y2="38" stroke="#E67E22" strokeWidth="2.5" strokeDasharray="5 3" markerEnd="url(#arrowOrange)" />

        {/* Bc: Small fraction escapes directly */}
        <line x1="510" y1="335" x2="530" y2="38" stroke="#CC3300" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#arrowRedThin)" />
        <text x="535" y="200" fill="#CC3300" fontSize="9" fontStyle="italic">(small fraction escapes</text>
        <text x="535" y="212" fill="#CC3300" fontSize="9" fontStyle="italic"> directly to space)</text>

        {/* Absorption glow */}
        <circle cx="410" cy="190" r="16" fill="#CC3300" fillOpacity="0.2" stroke="#CC3300" strokeWidth="1.5" />
        <text x="410" y="195" textAnchor="middle" fill="#CC3300" fontSize="14" fontWeight="bold">+</text>

        {/* ── LABEL BOXES [1]–[6] ── */}
        {[
          { n: '[1]', x: 200, y: 185, w: 130, label: 'Incoming solar radiation'              },
          { n: '[2]', x: 120, y: 98,  w: 150, label: 'Reflected by clouds & atmosphere'      },
          { n: '[3]', x: 416, y: 270, w: 145, label: 'Infrared radiation from surface'        },
          { n: '[4]', x: 425, y: 183, w: 155, label: 'Absorbed by greenhouse gases'           },
          { n: '[5]', x: 455, y: 100, w: 140, label: 'Re-emitted to space'                   },
          { n: '[6]', x: 240, y: 255, w: 145, label: 'Re-emitted back to surface'             },
        ].map(box => (
          <g key={box.n}>
            <rect x={box.x} y={box.y} width={box.w} height={40} rx="3"
              fill="white" stroke="#aaa" strokeWidth="1" strokeDasharray="4 2" fillOpacity="0.92" />
            <text x={box.x + 6} y={box.y + 13} fill="#c0392b" fontSize="11" fontWeight="700">{box.n}</text>
            <text x={box.x + 8} y={box.y + 28} fill="#333" fontSize="9.5">{box.label}</text>
          </g>
        ))}

        {/* Connecting lines from boxes to arrows */}
        <line x1="200" y1="205" x2="240" y2="215" stroke="#aaa" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="270" y1="118" x2="248" y2="108" stroke="#aaa" strokeWidth="0.8" strokeDasharray="2 2" />

      </svg>
      <figcaption style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem', textAlign: 'center', maxWidth: '720px', margin: '0.5rem auto 0' }}>
        Figure 5.1  Schematic of the global energy budget showing pathways of solar radiation (yellow) and infrared radiation (red/orange) through Earth's atmosphere. Numbered boxes [1]–[6] mark six key processes. Use the Activity 5 form to name and describe each process.
      </figcaption>
    </figure>
  )
}
