import FloatingPanel from '../../components/FloatingPanel'
import s from './EvidencePanel.module.css'

/**
 * EvidencePanel — shared chrome for evidence documents.
 *
 * Opens centred as a floating modal (modalFirst, floatOnly — no docking).
 * When a lab declares more than one evidence item via evidenceOrder, a sticky
 * tab strip appears at the top of the content area so the learner can see the
 * full evidence collection and jump to any document in one click.
 *
 * Props:
 *   labId            string
 *   activeEvidenceId string | null
 *   evidenceOrder    string[] | undefined  — enables tabs when length > 1
 *   evidenceMeta     { [id]: { title, label? } } | undefined
 *   EvidenceComponent Component           — receives evidenceId prop
 *   onClose          () => void
 *   onNavigate       (id) => void         — content swap, no re-open animation
 *   triggerOpen      number               — increment to open
 *   themeVars        string[]
 */
export default function EvidencePanel({
  labId,
  activeEvidenceId,
  evidenceOrder,
  evidenceMeta,
  EvidenceComponent,
  onClose,
  onNavigate,
  triggerOpen,
  themeVars,
}) {
  const title = (activeEvidenceId && evidenceMeta?.[activeEvidenceId]?.title) ?? 'Evidence'
  const showTabs = evidenceOrder && evidenceOrder.length > 1

  return (
    <FloatingPanel
      id={`${labId}-evidence`}
      title={title}
      side="right"
      width={620}
      defaultHeight={700}
      initialState="closed"
      modalFirst
      floatOnly
      noTab
      triggerOpen={triggerOpen}
      scrollTopKey={activeEvidenceId}
      onClose={onClose}
      themeVars={themeVars}
    >
      {activeEvidenceId && EvidenceComponent && (
        <>
          {showTabs && (
            <div className={s.tabStrip} role="tablist" aria-label="Evidence documents">
              {evidenceOrder.map(id => {
                const label = evidenceMeta?.[id]?.label ?? evidenceMeta?.[id]?.title ?? id
                const isActive = id === activeEvidenceId
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={isActive}
                    className={`${s.tab} ${isActive ? s.tabActive : ''}`}
                    onClick={() => !isActive && onNavigate?.(id)}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
          <EvidenceComponent evidenceId={activeEvidenceId} />
        </>
      )}
    </FloatingPanel>
  )
}
