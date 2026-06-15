import FloatingPanel from '../../components/FloatingPanel'
import s from './LabSidebar.module.css'

export const TAB_LABELS = {
  activities: 'Activities',
  concepts:   'Toolkit',
  notes:      'Notes',
  evidence:   'Evidence',
}

export default function LabSidebar({
  config,
  labId,
  triggerDock,
  triggerClose,
  triggerOpen,
  activeTab,
  onTabChange,
  onDockedChange,
  onFloat,
  onClose,
  themeVars,
  children,
  // mobile drawer props
  isMobile,
  guideOpen,
  onMobileClose,
}) {
  const tabs = config.sidebar.tabs ?? ['activities']

  if (isMobile) {
    return (
      <nav
        className={`${s.mobileDrawer} ${guideOpen ? s.mobileDrawerOpen : ''}`}
        aria-label="Activity guide"
        aria-hidden={!guideOpen}
      >
        {tabs.length > 1 && (
          <div className={s.tabStrip} role="tablist">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`${s.tab} ${activeTab === tab ? s.tabActive : ''}`}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => onTabChange(tab)}
              >
                {TAB_LABELS[tab] ?? tab}
              </button>
            ))}
          </div>
        )}
        {children}
      </nav>
    )
  }

  return (
    <FloatingPanel
      id={`${labId}-guide`}
      title={config.sidebar?.header?.fpTitle ?? 'Activity Guide'}
      side={config.sidebar.side ?? 'left'}
      width={600}
      defaultDockedWidth={config.sidebar.defaultDockedWidth ?? 260}
      maxDockedWidth={config.sidebar.maxDockedWidth ?? 360}
      defaultHeight={700}
      initialState="closed"
      sidebarOnly
      noTab
      accentHeader={config.sidebar?.fpAccentHeader ?? false}
      darkHeader={config.sidebar?.fpDarkHeader ?? false}
      topOffset="var(--lab-nav-height)"
      triggerDock={triggerDock}
      triggerClose={triggerClose}
      scrollTopKey={activeTab}
      onDockedChange={onDockedChange}
      onFloat={onFloat}
      onClose={onClose}
      themeVars={themeVars}
    >
      {tabs.length > 1 && (
        <div className={s.tabStrip} role="tablist">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`${s.tab} ${activeTab === tab ? s.tabActive : ''}`}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => onTabChange(tab)}
            >
              {TAB_LABELS[tab] ?? tab}
            </button>
          ))}
        </div>
      )}
      {children}
    </FloatingPanel>
  )
}
