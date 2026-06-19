import { useState, useEffect, useCallback } from 'react'
import ActivityModal from '../../components/ActivityModal'
import { useAIFeedback } from '../hooks/useAIFeedback.js'
import AIFeedbackUI from '../AIFeedbackUI/AIFeedbackUI.jsx'

/**
 * ActivityBody — shared activity content layer used by both desktop and mobile.
 *
 * Owns all activity-level logic: AI feedback state, form clear/remount, and
 * submit handling. Renders ActivityModal with the correct props, the activity
 * form component, and the AI feedback UI.
 *
 * Desktop: hosted inside FloatingPanel (ActivityPanel.jsx), noHeader=true so
 *          the FloatingPanel accent header takes over title/eyebrow display.
 * Mobile:  hosted inside a fixed overlay div (LabShell.jsx), noHeader=false so
 *          ActivityModal renders its own subtitle + title header.
 */
export default function ActivityBody({
  config,
  activity,
  actIndex,
  responses,
  isCompleted,
  handleSave,
  onNavigate,
  onScrollTo,
  onOpenConcept,
  onOpenEvidence = null,
  onClose,
  noHeader = false,
  darkHeader = false,
  stacked = false,
  hideNav = false,
}) {
  const [clearKey, setClearKey] = useState(0)

  const totalActivities = config.activities.length
  const prevActivity    = actIndex > 0 ? config.activities[actIndex - 1] : null
  const nextActivity    = actIndex < totalActivities - 1 ? config.activities[actIndex + 1] : null

  const allActivitiesComplete = config.activities
    .filter(a => a.required !== false)
    .every(a => config.getActivityStatus(a.id, responses) === 'complete')

  // ── AI feedback ──────────────────────────────────────────────────────────────
  const feedbackConfig = activity.feedback ?? null
  const {
    feedback:    aiFeedback,
    loading:     aiLoading,
    error:       aiError,
    request:     aiRequest,
    setFeedback: setAiFeedback,
  } = useAIFeedback(feedbackConfig?.systemPrompt ?? '')

  // Restore any previously saved feedback when the active activity changes.
  useEffect(() => {
    const saved = feedbackConfig ? (responses[activity.id]?.feedback ?? '') : ''
    setAiFeedback(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id])

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    const keys = activity.clearKeys ?? [activity.id]
    keys.forEach(k => handleSave(k, null))
    setAiFeedback('')
    setClearKey(k => k + 1)
  }, [activity, handleSave, setAiFeedback])

  // Autosave wrapper: persists draft content as the student works, while
  // preserving the submitted / feedback markers already on the saved response.
  // This keeps an activity marked Complete in the sidebar while the student
  // edits a submitted response, until they Submit again (or Clear).
  const handleAutoSave = useCallback((data) => {
    const existing = responses[activity.id]
    if (data && typeof data === 'object' && !Array.isArray(data) &&
        existing && typeof existing === 'object' && !Array.isArray(existing)) {
      const preserved = { ...data }
      if (existing._submitted) preserved._submitted = true
      if (existing.feedback != null && preserved.feedback == null) preserved.feedback = existing.feedback
      handleSave(activity.id, preserved)
    } else {
      handleSave(activity.id, data)
    }
  }, [responses, activity.id, handleSave])

  const handleSubmit = useCallback(async (data) => {
    // Stamp the response as submitted so the sidebar shows it as Complete.
    const payload = (data && typeof data === 'object' && !Array.isArray(data))
      ? { ...data, _submitted: true }
      : data
    await handleSave(activity.id, payload)
    if (feedbackConfig) {
      aiRequest(
        feedbackConfig.buildMessage(data),
        async (feedbackText) => {
          await handleSave(activity.id, { ...payload, feedback: feedbackText })
        },
      )
    }
  }, [activity.id, handleSave, feedbackConfig, aiRequest])

  const ActForm = config.activityForms?.[activity.id] ?? null

  return (
    <ActivityModal
      noHeader={noHeader}
      darkHeader={darkHeader}
      stacked={stacked}
      hideNav={hideNav}
      activityNumber={actIndex + 1}
      activityLabel={`Activity ${actIndex + 1}`}
      thinkingMove={activity.thinkingMove ?? ''}
      title={activity.title}
      purpose={activity.purpose ?? ''}
      prompt={activity.prompt ?? ''}
      task={activity.task ?? ''}
      scaffold={activity.scaffold ?? null}
      evidenceSections={activity.evidenceSections ?? []}
      conceptLinks={activity.conceptLinks ?? []}
      conceptsLabel={config.conceptsLabel ?? 'Concepts'}
      evidenceSectionsLabel={config.evidenceSectionsLabel ?? 'Go to evidence'}
      prevItem={prevActivity ? { id: prevActivity.id, label: `Activity ${actIndex}` } : null}
      nextItem={nextActivity ? { id: nextActivity.id, label: `Activity ${actIndex + 2}` } : null}
      onNavigate={onNavigate}
      onScrollTo={onScrollTo}
      onOpenConcept={onOpenConcept}
      onOpenEvidence={onOpenEvidence}
      onFinish={allActivitiesComplete ? onClose : undefined}
      finishEnabled={allActivitiesComplete}
      onClear={handleClear}
      onClose={onClose}
    >
      {ActForm && (
        <ActForm
          key={clearKey}
          initialAnswers={responses[activity.id] ?? {}}
          isCompleted={isCompleted}
          onSubmit={handleSubmit}
          onSave={handleAutoSave}
          onClose={onClose}
          sentenceStarters={activity.sentenceStarters ?? []}
        />
      )}

      {feedbackConfig && (
        <AIFeedbackUI
          loading={aiLoading}
          feedback={aiFeedback}
          error={aiError}
        />
      )}
    </ActivityModal>
  )
}
