import { createContext } from 'react'

/**
 * FranceContext — provides the full responses object to France-specific form
 * components that need cross-activity data (ActFinal, ActReflection).
 *
 * Provided by LabContent in index.jsx via the LabShell render-prop responses.
 * Consumed by ActFinal and ActReflection only.
 */
export const FranceCtx = createContext({})
