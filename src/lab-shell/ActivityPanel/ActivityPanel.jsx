import FloatingPanel from '../../components/FloatingPanel'
import ActivityBody from './ActivityBody.jsx'

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
  const activity = activeActivityId
    ? config.activities.find(a => a.id === activeActivityId)
    : null

  const actIndex = activity ? config.activities.indexOf(activity) : -1

  const totalActivities = config.activities.length
  const titleEyebrow    = actIndex >= 0
    ? `Activity ${actIndex + 1} of ${totalActivities}`
    : undefined
  const panelTitle = activity?.title ?? 'Activity'

  return (
    <FloatingPanel
      id={`${labId}-activity`}
      title={panelTitle}
      titleEyebrow={titleEyebrow}
      side="right"
      width={1080}
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
      disableDragging
      noTab
      accentHeader={accentHeader}
      darkHeader={config.activityPanel?.fpDarkHeader ?? false}
      themeVars={themeVars}
    >
      {activity && (
        <ActivityBody
          config={config}
          activity={activity}
          actIndex={actIndex}
          responses={responses}
          isCompleted={completedSet.has(activeActivityId)}
          handleSave={handleSave}
          onNavigate={onNavigate}
          onScrollTo={onScrollTo}
          onOpenConcept={onOpenConcept}
          onClose={onClose}
          noHeader
        />
      )}
    </FloatingPanel>
  )
}
