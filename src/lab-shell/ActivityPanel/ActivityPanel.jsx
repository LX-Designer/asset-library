import { useState, useCallback } from 'react'
import FloatingPanel from '../../components/FloatingPanel'
import ActivityModal from '../../components/ActivityModal'

export default function ActivityPanel({
  config,
  labId,
  activeActivityId,
  responses,
  completedSet,
  handleSave,
  onNavigate,
  onScrollTo,
  triggerOpen,
  triggerDock,
  triggerClose,
  onDockedChange,
  onClose,
  themeVars,
}) {
  const [clearKey, setClearKey] = useState(0)

  const activity = activeActivityId
    ? config.activities.find(a => a.id === activeActivityId)
    : null

  const actIndex = activity
    ? config.activities.indexOf(activity)
    : -1

  const prevActivity = actIndex > 0 ? config.activities[actIndex - 1] : null
  const nextActivity = actIndex < config.activities.length - 1 ? config.activities[actIndex + 1] : null

  const handleClear = useCallback(() => {
    if (!activity) return
    const keys = activity.clearKeys ?? [activity.id]
    keys.forEach(k => handleSave(k, null))
    setClearKey(k => k + 1)
  }, [activity, handleSave])

  const ActForm = activeActivityId ? config.activityForms?.[activeActivityId] : null

  return (
    <FloatingPanel
      id={`${labId}-activity`}
      title={activity?.label ?? 'Activity'}
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
      themeVars={themeVars}
    >
      {activity && (
        <ActivityModal
          activityNumber={activity.number ?? null}
          activityLabel={activity.label}
          thinkingMove={activity.thinkingMove ?? ''}
          title={activity.title}
          purpose={activity.purpose ?? ''}
          prompt={activity.prompt ?? ''}
          scaffold={activity.scaffold ?? null}
          evidenceSections={activity.evidenceSections ?? []}
          prevItem={prevActivity ? { id: prevActivity.id, label: prevActivity.label } : null}
          nextItem={nextActivity ? { id: nextActivity.id, label: nextActivity.label } : null}
          onNavigate={onNavigate}
          onScrollTo={onScrollTo}
          onClear={handleClear}
          noHeader
        >
          {ActForm && (
            <ActForm
              key={clearKey}
              initialAnswers={responses[activeActivityId] ?? {}}
              isCompleted={completedSet.has(activeActivityId)}
              onSubmit={data => handleSave(activeActivityId, data)}
              onSave={data => handleSave(activeActivityId, data)}
              onClose={onClose}
            />
          )}
        </ActivityModal>
      )}
    </FloatingPanel>
  )
}
