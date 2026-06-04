import tacomaNarrowsMeta      from './assets/tacoma-narrows/meta.js'
import econ73Meta             from './assets/econ-73-efficiency/meta.js'
import econDossierMeta        from './assets/econ-73-dossier/meta.js'
import franceRepublic1792Meta from './assets/france-republic-1792/meta.js'

/**
 * Central registry of all learning assets.
 * Add a new meta.js import here to surface an asset on the homepage.
 */
export const assetRegistry = [
  tacomaNarrowsMeta,
  econ73Meta,
  econDossierMeta,
  franceRepublic1792Meta,
]

export function getAssetMeta(id) {
  return assetRegistry.find(a => a.id === id) ?? null
}
