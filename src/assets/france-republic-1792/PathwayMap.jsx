import { useState } from 'react'
import { PATHWAY_NODES } from './data.js'

const css = `
.pathway-wrap { position: relative; }

.pathway-text-equiv { margin-top: 12px; }
.pathway-text-equiv summary {
  font-size: 11px;
  color: #78716C;
  cursor: pointer;
  user-select: none;
  list-style: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.pathway-text-equiv summary::before { content: '+ '; }
.pathway-text-equiv[open] summary::before { content: '− '; }
.pathway-text-equiv ol {
  margin-top: 10px;
  padding-left: 20px;
  font-size: 13px;
  color: #44403C;
  line-height: 1.7;
  font-family: 'Libre Baskerville', Georgia, serif;
}
.pathway-text-equiv ol li { margin-bottom: 6px; }

.pathway-flow {
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  padding: 24px 4px 32px;
  scrollbar-width: thin;
}

.pathway-node-wrap {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.pathway-node {
  position: relative;
  background: #FDFAF5;
  border: 1.5px solid #D6D0C4;
  border-radius: 6px;
  padding: 14px 16px;
  width: 140px;
  cursor: pointer;
  transition: all 160ms ease;
  text-align: center;
}

.pathway-node:hover,
.pathway-node:focus-visible,
.pathway-node.active {
  border-color: #374151;
  background: #F1F5F9;
  box-shadow: 0 2px 10px rgba(55,65,81,0.12);
}

.pathway-node:focus-visible {
  outline: 2px solid #374151;
  outline-offset: 2px;
}

.pathway-node-date {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #78716C;
  margin-bottom: 5px;
}

.pathway-node-label {
  font-family: 'Libre Baskerville', Georgia, serif;
  font-size: 13px;
  font-weight: 700;
  color: #1C1917;
  line-height: 1.3;
}

.pathway-node.final-node {
  border-color: #6B4226;
  border-width: 2px;
  background: #FBF4EF;
}

.pathway-node.final-node .pathway-node-label { color: #6B4226; }

.pathway-arrow {
  flex-shrink: 0;
  color: #D6D0C4;
  font-size: 22px;
  padding: 0 4px;
  line-height: 1;
  user-select: none;
  margin-top: -8px;
}

.pathway-tooltip {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 240px;
  background: #1C1917;
  color: #F5F0E8;
  border-radius: 6px;
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(28,25,23,0.25);
  pointer-events: none;
}

.pathway-tooltip::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: #1C1917;
}

.pathway-tooltip-desc {
  font-family: 'Libre Baskerville', Georgia, serif;
  font-size: 12.5px;
  line-height: 1.6;
  color: #EDE8DC;
  margin-bottom: 8px;
}

.pathway-tooltip-note {
  border-top: 1px solid rgba(255,255,255,0.12);
  padding-top: 7px;
  font-size: 11px;
  color: #A8A29E;
  font-style: italic;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .pathway-flow {
    flex-direction: column;
    align-items: flex-start;
    overflow-x: hidden;
    padding: 12px 0;
  }
  .pathway-node { width: 100%; text-align: left; }
  .pathway-arrow {
    transform: rotate(90deg);
    margin: 4px 0 4px 58px;
  }
  .pathway-tooltip {
    left: 0; right: 0;
    transform: none;
    width: auto;
    top: auto;
    bottom: calc(100% + 10px);
  }
  .pathway-tooltip::before {
    display: none;
  }
}
`

export default function PathwayMap() {
  const [activeId, setActiveId] = useState(null)

  const toggle = (id) => setActiveId(prev => prev === id ? null : id)

  return (
    <div className="pathway-wrap">
      <style>{css}</style>
      <div className="pathway-flow" role="list" aria-label="Political pathway from constitutional monarchy to republic">
        {PATHWAY_NODES.map((node, i) => (
          <div key={node.id} className="pathway-node-wrap" role="listitem">
            <div
              className={`pathway-node${node.id === 'pn-republic' ? ' final-node' : ''}${activeId === node.id ? ' active' : ''}`}
              role="button"
              tabIndex={0}
              aria-expanded={activeId === node.id}
              aria-label={`${node.label}, ${node.date}. Click for details.`}
              onClick={() => toggle(node.id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(node.id))}
            >
              <div className="pathway-node-date">{node.date}</div>
              <div className="pathway-node-label">{node.label}</div>

              {activeId === node.id && (
                <div className="pathway-tooltip" role="tooltip" aria-live="polite">
                  <div className="pathway-tooltip-desc">{node.description}</div>
                  <div className="pathway-tooltip-note">{node.evidenceNote}</div>
                </div>
              )}
            </div>
            {i < PATHWAY_NODES.length - 1 && (
              <div className="pathway-arrow" aria-hidden="true">›</div>
            )}
          </div>
        ))}
      </div>

      <details className="pathway-text-equiv">
        <summary>Text equivalent of pathway diagram</summary>
        <ol>
          {PATHWAY_NODES.map(node => (
            <li key={node.id}>
              <strong>{node.label}</strong> ({node.date}) — {node.description}
            </li>
          ))}
        </ol>
      </details>
    </div>
  )
}
