import React from 'react'
import LabShellInquiry from '../../lab-shell/LabShellInquiry.jsx'
import config from './shell.config.js'
// Reuse the standard lab's theme tokens (accent colour, surfaces) by applying
// its root `.lab` class to the inquiry shell.
import styles from '../global-warming/index.module.css'

export default function GlobalWarmingInquiryLab({
  onResponse,
  onComplete,
  savedResponses,
  isCompleted,
  onReset,
  backHref,
}) {
  return (
    <LabShellInquiry
      config={config}
      onResponse={onResponse}
      onComplete={onComplete}
      savedResponses={savedResponses}
      isCompleted={isCompleted}
      onReset={onReset}
      backHref={backHref}
      className={styles.lab}
    />
  )
}
