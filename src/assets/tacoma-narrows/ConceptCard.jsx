import styles from './ConceptCard.module.css'

import oscillationSvg from './toolkit/oscillation.svg'
import resonanceSvg from './toolkit/resonance-curve.svg'
import vortexSvg from './toolkit/vortex-shedding.svg'
import dampingSvg from './toolkit/damping.svg'
import torsionSvg from './toolkit/torsion.svg'
import flutterSvg from './toolkit/flutter-aerofoil.svg'

const DIAGRAM_MAP = {
  './toolkit/oscillation.svg':      oscillationSvg,
  './toolkit/resonance-curve.svg':  resonanceSvg,
  './toolkit/vortex-shedding.svg':  vortexSvg,
  './toolkit/damping.svg':          dampingSvg,
  './toolkit/torsion.svg':          torsionSvg,
  './toolkit/flutter-aerofoil.svg': flutterSvg,
}

export default function ConceptCard({ concept }) {
  const diagramSrc = concept.diagram ? DIAGRAM_MAP[concept.diagram] : null

  return (
    <div className={styles.card}>
      <p className={styles.tagline}>{concept.tagline}</p>
      <p className={styles.intro}>{concept.intro}</p>

      {diagramSrc && (
        <img
          src={diagramSrc}
          alt={concept.diagramAlt}
          className={styles.diagram}
        />
      )}

      {concept.sections.map(section => (
        <div key={section.heading} className={styles.section}>
          <h3 className={styles.sectionHeading}>{section.heading}</h3>
          <p className={styles.sectionBody}>{section.body}</p>
        </div>
      ))}

      <div className={styles.keyTerms}>
        {concept.keyTerms.map(({ term, definition }) => (
          <div key={term} className={styles.keyTerm}>
            <span className={styles.term}>{term}</span>
            <span className={styles.definition}>{definition}</span>
          </div>
        ))}
      </div>

      <div className={styles.applyTo}>
        <span className={styles.applyLabel}>When to use this concept</span>
        <p>{concept.applyTo}</p>
      </div>
    </div>
  )
}
