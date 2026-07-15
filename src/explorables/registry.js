import { lazy } from 'react'
import hitEngineMeta from './hit-engine/meta.js'
import naturalSelectionMeta from './natural-selection/meta.js'

/**
 * Central registry of explorables — self-contained interactive learning assets
 * that open in a modal overlay. Unlike labs, explorables have no response
 * tracking or completion reporting; they are exploratory only.
 *
 * Each entry is a meta object plus a lazily-loaded React component (so an
 * explorable's code is only fetched when the user opens it).
 */
export const explorableRegistry = [
  {
    ...hitEngineMeta,
    Component: lazy(() => import('./hit-engine/HitEngine.jsx')),
  },
  {
    ...naturalSelectionMeta,
    Component: lazy(() => import('./natural-selection/NaturalSelection.jsx')),
  },
]

export function getExplorable(id) {
  return explorableRegistry.find(e => e.id === id) ?? null
}
