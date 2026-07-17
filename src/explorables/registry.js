import { lazy } from 'react'
import hitEngineMeta from './hit-engine/meta.js'
import naturalSelectionMeta from './natural-selection/meta.js'
import profitVsCashMeta from './where-did-the-profit-go/meta.js'
import milltownMeta from './milltown/meta.js'

/**
 * Central registry of explorables — self-contained interactive learning assets
 * that render at /explorable/:id. Unlike labs, explorables have no response
 * tracking or completion reporting; they are exploratory only.
 *
 * Each entry is a meta object plus a lazily-loaded React component (so an
 * explorable's code is only fetched when its page is visited).
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
  {
    ...profitVsCashMeta,
    Component: lazy(() => import('./where-did-the-profit-go/ProfitVsCash.jsx')),
  },
  {
    ...milltownMeta,
    Component: lazy(() => import('./milltown/Milltown.jsx')),
  },
]

export function getExplorable(id) {
  return explorableRegistry.find(e => e.id === id) ?? null
}
