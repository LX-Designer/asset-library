import { LabShell } from '../../lab-shell/index.js'
import CaseDocument from './components/CaseDocument.jsx'
import config from './shell.config.js'
import styles from './RivergateOverflow.module.css'

export default function RivergateOverflow({
  onResponse,
  onComplete,
  savedResponses,
  isCompleted,
  onReset,
  backHref,
}) {
  return (
    <LabShell
      config={config}
      onResponse={onResponse}
      onComplete={onComplete}
      savedResponses={savedResponses}
      isCompleted={isCompleted}
      onReset={onReset}
      backHref={backHref}
      className={styles.shell}
    >
      {({ openEvidence }) => (
        <CaseDocument onOpenEvidence={openEvidence} />
      )}
    </LabShell>
  )
}
