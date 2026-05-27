import placeholderQuizMeta  from './assets/placeholder-quiz/meta.js'
import tacomaNarrowsMeta   from './assets/tacoma-narrows/meta.js'
import econ73Meta          from './assets/econ-73-efficiency/meta.js'
import koreanWarMeta       from './assets/korean-war/meta.js'
import fastFashionMeta     from './assets/fast-fashion/meta.js'

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
]

export function getAssetMeta(id) {
  return assetRegistry.find(a => a.id === id) ?? null
}
