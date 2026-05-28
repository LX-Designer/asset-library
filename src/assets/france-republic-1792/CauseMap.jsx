import { useState, Fragment } from 'react'

const CAUSE_GROUPS = [
  {
    id: 'structural',
    label: 'Structural pressures',
    colour: '#374151',
    colourSubtle: '#F1F5F9',
    description: 'Long-term conditions that made constitutional monarchy fragile.',
    nodes: [
      { id: 'cn-reforms', label: 'Reforms & religious schism', note: 'Civil Constitution split clergy and local society; assignats tied fiscal rescue to revolutionary property.' },
      { id: 'cn-factions', label: 'Factional conflict', note: 'No stable centre: Feuillants, Girondins, and Jacobins pulled in different directions.' },
      { id: 'cn-counter-rev', label: 'Counter-revolution', note: 'Émigré pressure, refractory clergy, and foreign hostility intensified revolutionary suspicion.' },
    ],
  },
  {
    id: 'accelerating',
    label: 'Accelerating factors',
    colour: '#92400E',
    colourSubtle: '#FFFBEB',
    description: 'Developments that turned fragility into crisis.',
    nodes: [
      { id: 'cn-varennes', label: 'Flight to Varennes', note: 'Destroyed trust in Louis XVI as a constitutional partner.' },
      { id: 'cn-war', label: 'War with Austria', note: 'Connected treason fears, military failure, and political emergency into a single crisis.' },
      { id: 'cn-brunswick', label: 'Brunswick Manifesto', note: 'Foreign threat backfired: intensified belief that monarchy was aligned with enemies.' },
    ],
  },
  {
    id: 'triggering',
    label: 'Triggering events',
    colour: '#6B4226',
    colourSubtle: '#FBF4EF',
    description: 'Events that translated crisis into institutional breakdown.',
    nodes: [
      { id: 'cn-popular', label: 'Popular mobilisation', note: 'Parisian sections and provincial fédérés created an insurrectionary force outside parliamentary control.' },
      { id: 'cn-10-august', label: '10 August 1792', note: 'Practical end of the monarchy. The Convention and republic followed as institutional consequences.' },
    ],
  },
  {
    id: 'outcome',
    label: 'Outcome',
    colour: '#2D6A4F',
    colourSubtle: '#F0FAF4',
    description: 'The institutional expression of the collapse.',
    nodes: [
      { id: 'cn-republic', label: 'Republic — 21 Sep 1792', note: 'The National Convention abolished monarchy and declared the republic. The republic was the result, not the original aim, of the Revolution.' },
    ],
  },
]

const css = `
.causemap-wrap { position: relative; }

.causemap-note {
  font-size: 13px;
  color: #78716C;
  font-style: italic;
  font-family: 'Libre Baskerville', Georgia, serif;
  margin-bottom: 20px;
}

.causemap-flow {
  display: flex;
  gap: 0;
  align-items: stretch;
  overflow-x: auto;
  padding-bottom: 8px;
}

.causemap-group {
  flex: 1;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.causemap-group-header {
  padding: 10px 14px;
  border-radius: 4px 4px 0 0;
  margin-bottom: 2px;
}

.causemap-group-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.causemap-group-desc {
  font-size: 11px;
  color: #44403C;
  line-height: 1.4;
  font-style: italic;
}

.causemap-nodes {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 0 8px 0;
  flex: 1;
}

.causemap-node {
  background: #FDFAF5;
  border: 1.5px solid #D6D0C4;
  border-radius: 4px;
  padding: 9px 12px;
  cursor: pointer;
  transition: all 160ms ease;
  position: relative;
}

.causemap-node:hover,
.causemap-node:focus-visible,
.causemap-node.active {
  box-shadow: 0 2px 8px rgba(55,65,81,0.1);
  z-index: 1;
}

.causemap-node:focus-visible {
  outline: 2px solid #374151;
  outline-offset: 2px;
}

.causemap-node-label {
  font-family: 'Libre Baskerville', Georgia, serif;
  font-size: 12.5px;
  font-weight: 700;
  color: #1C1917;
  line-height: 1.3;
}

.causemap-tooltip {
  position: absolute;
  top: 0;
  left: calc(100% + 8px);
  z-index: 20;
  width: 200px;
  background: #1C1917;
  color: #F5F0E8;
  border-radius: 5px;
  padding: 10px 12px;
  box-shadow: 0 6px 20px rgba(28,25,23,0.25);
  pointer-events: none;
  font-family: 'Libre Baskerville', Georgia, serif;
  font-size: 12px;
  line-height: 1.6;
  color: #EDE8DC;
}

.causemap-tooltip::before {
  content: '';
  position: absolute;
  top: 10px;
  right: 100%;
  border: 5px solid transparent;
  border-right-color: #1C1917;
}

.causemap-arrow-col {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  padding-top: 44px;
  flex-shrink: 0;
  color: #D6D0C4;
  font-size: 24px;
}

.causemap-text-equiv {
  margin-top: 14px;
}

.causemap-text-equiv summary {
  font-size: 11px;
  color: #78716C;
  cursor: pointer;
  list-style: none;
  user-select: none;
}
.causemap-text-equiv summary::before { content: '+ '; }
.causemap-text-equiv[open] summary::before { content: '− '; }

.causemap-text-equiv dl {
  margin-top: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  font-size: 13px;
  font-family: 'Libre Baskerville', Georgia, serif;
}

.causemap-text-equiv dt {
  font-weight: 700;
  color: #1C1917;
  white-space: nowrap;
}

.causemap-text-equiv dd {
  color: #44403C;
  line-height: 1.55;
  margin: 0;
}

@media (max-width: 760px) {
  .causemap-flow {
    flex-direction: column;
    gap: 8px;
    overflow-x: hidden;
  }
  .causemap-group { min-width: 0; }
  .causemap-arrow-col {
    transform: rotate(90deg);
    padding: 0;
    height: 28px;
  }
  .causemap-tooltip {
    left: 0; right: 0;
    top: calc(100% + 6px);
    width: auto;
  }
  .causemap-tooltip::before { display: none; }
}
`

export default function CauseMap() {
  const [activeId, setActiveId] = useState(null)

  const toggle = (id) => setActiveId(prev => prev === id ? null : id)

  return (
    <div className="causemap-wrap">
      <style>{css}</style>
      <p className="causemap-note">
        Click any node to see a brief explanation. The categories — structural, accelerating, triggering — describe causal roles, not strict chronological order.
      </p>

      <div className="causemap-flow" role="list" aria-label="Cause map: structural pressures, accelerating factors, triggering events, and outcome">
        {CAUSE_GROUPS.map((group, gi) => (
          <Fragment key={group.id}>
            <div className="causemap-group" role="listitem">
              <div
                className="causemap-group-header"
                style={{ background: group.colourSubtle }}
              >
                <div className="causemap-group-label" style={{ color: group.colour }}>
                  {group.label}
                </div>
                <div className="causemap-group-desc">{group.description}</div>
              </div>

              <div className="causemap-nodes">
                {group.nodes.map(node => (
                  <div
                    key={node.id}
                    className={`causemap-node${activeId === node.id ? ' active' : ''}`}
                    style={activeId === node.id ? { borderColor: group.colour } : {}}
                    role="button"
                    tabIndex={0}
                    aria-expanded={activeId === node.id}
                    aria-label={`${node.label}. Click for details.`}
                    onClick={() => toggle(node.id)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(node.id))}
                  >
                    <div className="causemap-node-label">{node.label}</div>
                    {activeId === node.id && (
                      <div className="causemap-tooltip" role="tooltip">
                        {node.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {gi < CAUSE_GROUPS.length - 1 && (
              <div className="causemap-arrow-col" aria-hidden="true">›</div>
            )}
          </Fragment>
        ))}
      </div>

      <details className="causemap-text-equiv">
        <summary>Text equivalent of cause map</summary>
        <dl>
          {CAUSE_GROUPS.flatMap(group =>
            group.nodes.map(node => (
              <Fragment key={node.id}>
                <dt>{node.label}</dt>
                <dd>{node.note}</dd>
              </Fragment>
            ))
          )}
        </dl>
      </details>
    </div>
  )
}
