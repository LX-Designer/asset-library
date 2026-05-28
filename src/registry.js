import placeholderQuizMeta  from './assets/placeholder-quiz/meta.js'
import tacomaNarrowsMeta   from './assets/tacoma-narrows/meta.js'
import econ73Meta          from './assets/econ-73-efficiency/meta.js'
import koreanWarMeta       from './assets/korean-war/meta.js'
import fastFashionMeta     from './assets/fast-fashion/meta.js'
import rivergateOverflowMeta from './assets/econ-73-rivergate/meta.js'
import econDossierMeta     from './assets/econ-73-dossier/meta.js'

/**
 * Central registry of all learning assets.
 * Add a new meta.js import here to surface an asset on the homepage.
 */
export const assetRegistry = [
  placeholderQuizMeta,
  tacomaNarrowsMeta,
  econ73Meta,
  koreanWarMeta,
  fastFashionMeta,
  rivergateOverflowMeta,
  econDossierMeta,
]

export function getAssetMeta(id) {
  return assetRegistry.find(a => a.id === id) ?? null
}
