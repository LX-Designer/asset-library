import { useState, useEffect, useCallback } from 'react'
import FloatingPanel from '../../components/FloatingPanel'
import ActivityModal from '../../components/ActivityModal'
import { useAIFeedback } from '../hooks/useAIFeedback.js'
import AIFeedbackUI from '../AIFeedbackUI/AIFeedbackUI.jsx'

export default function ActivityPanel({
  config,
  labId,
  activeActivityId,
  responses,
  completedSet,
  handleSave,
  onNavigate,
  onScrollTo,
  onOpenConcept,
  triggerOpen,
  triggerDock,
  triggerClose,
  onDockedChange,
  onClose,
  accentHeader = false,
  themeVars,
}) {
  const [clearKey, setClearKey] = useState(0)

  const activity = activeActivityId
    ? config.activities.find(a => a.id === activeActivityId)
    : null

  const actIndex    = activity ? config.activities.indexOf(activity) : -1
  const prevActivity = actIndex > 0 ? config.activities[actIndex - 1] : null
  const nextActivity = actIndex < config.activities.length - 1 ? config.activities[actIndex + 1] : null

  // ── AI feedback ──────────────────────────────────────────────────────────────
  // feedbackConfig is the activity-level config object, or null if this activity
  // has no AI feedback. The system prompt is sourced entirely from the lab config.
  const feedbackConfig = activity?.feedback ?? null
  const {
    feedback:    aiFeedback,
    loading:     aiLoading,
    error:       aiError,
    request:     aiRequest,
    setFeedback: setAiFeedback,
  } = useAIFeedback(feedbackConfig?.systemPrompt ?? '')

  // When the active activity changes, restore any previously saved feedback
  // (so the learner sees their feedback again when they re-open a completed activity).
  useEffect(() => {
    if (!activeActivityId) { setAiFeedback(''); return }
    const hasFeedback = !!config.activities.find(a => a.id === activeActivityId)?.feedback
    const saved = hasFeedback ? (responses[activeActivityId]?.feedback ?? '') : ''
    setAiFeedback(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeActivityId])   // only re-run on activity change, not on every response update

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    if (!activity) return
    const keys = activity.clearKeys ?? [activity.id]
    keys.forEach(k => handleSave(k, null))
    setAiFeedback('')
    setClearKey(k => k + 1)
  }, [activity, handleSave, setAiFeedback])

  // onSubmit: saves form data immediately, then fires AI if the activity has a
  // feedback config. onSuccess persists the returned text alongside the form data.
  const handleSubmit = useCallback(async (data) => {
    await handleSave(activeActivityId, data)
    if (feedbackConfig) {
      aiRequest(
        feedbackConfig.buildMessage(data),
        async (feedbackText) => {
          await handleSave(activeActivityId, { ...data, feedback: feedbackText })
        },
      )
    }
  }, [activeActivityId, handleSave, feedbackConfig, aiRequest])

  const ActForm = activeActivityId ? config.activityForms?.[activeActivityId] : null

  const totalActivities = config.activities.length
  const titleEyebrow = activity
    ? (activity.number != null
        ? `Task ${activity.number} of ${totalActivities}`
        : activity.label)
    : undefined
  const panelTitle = activity
    ? (activity.number != null ? `${activity.number}. ${activity.title}` : activity.title)
    : 'Activity'

  return (
    <FloatingPanel
      id={`${labId}-activity`}
      title={panelTitle}
      titleEyebrow={titleEyebrow}
      side="right"
      width={600}
      defaultDockedWidth={config.activityPanel?.defaultDockedWidth ?? 480}
      defaultHeight={700}
      initialState="closed"
      topOffset="var(--lab-nav-height)"
      triggerOpen={triggerOpen}
      triggerDock={triggerDock}
      triggerClose={triggerClose}
      scrollTopKey={activeActivityId}
      onClose={onClose}
      onDockedChange={onDockedChange}
      modalFirst
      noTab
      accentHeader={accentHeader}
      themeVars={themeVars}
    >
      {activity && (
        <ActivityModal
          noHeader
          activityNumber={activity.number ?? null}
          activityLabel={activity.label}
          thinkingMove={activity.thinkingMove ?? ''}
          title={activity.title}
          purpose={activity.purpose ?? ''}
          prompt={activity.prompt ?? ''}
          scaffold={activity.scaffold ?? null}
          evidenceSections={activity.evidenceSections ?? []}
          conceptLinks={activity.conceptLinks ?? []}
          prevItem={prevActivity ? { id: prevActivity.id, label: prevActivity.label } : null}
          nextItem={nextActivity ? { id: nextActivity.id, label: nextActivity.label } : null}
          onNavigate={onNavigate}
          onScrollTo={onScrollTo}
          onOpenConcept={onOpenConcept}
          onClear={handleClear}
        >
          {ActForm && (
            <ActForm
              key={clearKey}
              initialAnswers={responses[activeActivityId] ?? {}}
              isCompleted={completedSet.has(activeActivityId)}
              onSubmit={handleSubmit}
              onSave={data => handleSave(activeActivityId, data)}
              onClose={onClose}
            />
          )}

          {/* Rendered below the form when the activity declares a feedback config.
              Hidden (returns null) until loading starts or feedback/error arrives. */}
          {feedbackConfig && (
            <AIFeedbackUI
              loading={aiLoading}
              feedback={aiFeedback}
              error={aiError}
            />
          )}
        </ActivityModal>
      )}
    </FloatingPanel>
  )
}
