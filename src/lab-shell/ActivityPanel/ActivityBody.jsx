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
  onClose,
  noHeader = false,
}) {
  const [clearKey, setClearKey] = useState(0)

  const totalActivities = config.activities.length
  const prevActivity    = actIndex > 0 ? config.activities[actIndex - 1] : null
  const nextActivity    = actIndex < totalActivities - 1 ? config.activities[actIndex + 1] : null

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

  const handleSubmit = useCallback(async (data) => {
    await handleSave(activity.id, data)
    if (feedbackConfig) {
      aiRequest(
        feedbackConfig.buildMessage(data),
        async (feedbackText) => {
          await handleSave(activity.id, { ...data, feedback: feedbackText })
        },
      )
    }
  }, [activity.id, handleSave, feedbackConfig, aiRequest])

  const ActForm = config.activityForms?.[activity.id] ?? null

  return (
    <ActivityModal
      noHeader={noHeader}
      activityNumber={actIndex + 1}
      activityLabel={`Activity ${actIndex + 1}`}
      thinkingMove={activity.thinkingMove ?? ''}
      title={activity.title}
      purpose={activity.purpose ?? ''}
      prompt={activity.prompt ?? ''}
      scaffold={activity.scaffold ?? null}
      evidenceSections={activity.evidenceSections ?? []}
      conceptLinks={activity.conceptLinks ?? []}
      conceptsLabel={config.conceptsLabel ?? 'Concepts'}
      prevItem={prevActivity ? { id: prevActivity.id, label: `Activity ${actIndex}` } : null}
      nextItem={nextActivity ? { id: nextActivity.id, label: `Activity ${actIndex + 2}` } : null}
      onNavigate={onNavigate}
      onScrollTo={onScrollTo}
      onOpenConcept={onOpenConcept}
      onClear={handleClear}
      onClose={onClose}
    >
      {ActForm && (
        <ActForm
          key={clearKey}
          initialAnswers={responses[activity.id] ?? {}}
          isCompleted={isCompleted}
          onSubmit={handleSubmit}
          onSave={data => handleSave(activity.id, data)}
          onClose={onClose}
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
