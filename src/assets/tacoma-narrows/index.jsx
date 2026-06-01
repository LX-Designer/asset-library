import { LabShell } from '../../lab-shell/index.js'
import CaseDocument from './CaseDocument.jsx'
import config from './shell.config.js'
import styles from './TacomaNarrows.module.css'

export default function TacomaNarrows({ onResponse, onComplete, savedResponses, isCompleted, onReset, backHref }) {
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
      {({ openActivity, responses }) => (
        <CaseDocument openActivity={openActivity} responses={responses} />
      )}
    </LabShell>
  )
}
