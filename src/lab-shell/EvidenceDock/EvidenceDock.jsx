import FloatingPanel from '../../components/FloatingPanel'
import s from './EvidenceDock.module.css'

/**
 * EvidenceDock — right-hand dockable evidence panel for the activity-primary
 * (inquiry) layout.
 *
 * Unlike EvidencePanel (a centred modalFirst document viewer), this opens docked
 * to the right edge so reference charts sit beside the activity the student is
 * working on. It can be popped out to float or closed via the standard
 * FloatingPanel chrome. A tab strip lets the student flip between documents.
 *
 * Props:
 *   labId             string
 *   documents         { id, label, title }[]   — tab strip + titles
 *   EvidenceComponent Component                — receives evidenceId prop
 *   activeId          string | null
 *   onNavigate        (id) => void             — content swap (no re-open)
 *   onClose           () => void
 *   triggerDock       number                   — increment to open/return docked
 *   triggerClose      number
 *   onDockedChange    (isDocked, width) => void
 *   defaultDockedWidth number
 *   themeVars         string[]
 */
export default function EvidenceDock({
  labId,
  documents = [],
  EvidenceComponent,
  activeId,
  onNavigate,
  onClose,
  triggerDock,
  triggerClose,
  onDockedChange,
  defaultDockedWidth = 560,
  themeVars,
}) {
  const activeDoc = documents.find(d => d.id === activeId)
  const title = activeDoc?.title ?? 'Evidence'
  const showTabs = documents.length > 1

  return (
    <FloatingPanel
      id={`${labId}-evidence-dock`}
      title={title}
      side="right"
      width={760}
      defaultHeight={700}
      defaultDockedWidth={defaultDockedWidth}
      maxDockedWidth={820}
      initialState="closed"
      noTab
      topOffset="var(--lab-nav-height)"
      triggerDock={triggerDock}
      triggerClose={triggerClose}
      scrollTopKey={activeId}
      onDockedChange={onDockedChange}
      onClose={onClose}
      themeVars={themeVars}
    >
      {activeId && EvidenceComponent && (
        <>
          {showTabs && (
            <div className={s.tabStrip} role="tablist" aria-label="Evidence documents">
              {documents.map(d => {
                const isActive = d.id === activeId
                return (
                  <button
                    key={d.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`${s.tab} ${isActive ? s.tabActive : ''}`}
                    onClick={() => !isActive && onNavigate?.(d.id)}
                  >
                    {d.label ?? d.title}
                  </button>
                )
              })}
            </div>
          )}
          <div className={s.docBody}>
            <EvidenceComponent evidenceId={activeId} />
          </div>
        </>
      )}
    </FloatingPanel>
  )
}
