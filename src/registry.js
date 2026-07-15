import cambridgeAS11Meta       from './assets/cambridge-as-1-1-data-rep/meta.js'
import architectureLabMeta    from './assets/architecture-lab/meta.js'
import tacomaNarrowsMeta      from './assets/tacoma-narrows/meta.js'
import econ73Meta             from './assets/econ-73-efficiency/meta.js'
import econDossierMeta        from './assets/econ-73-dossier/meta.js'
import franceRepublic1792Meta from './assets/france-republic-1792/meta.js'
import globalWarmingMeta      from './assets/geo-2-3-global-warming/meta.js'
import globalWarmingGuidedMeta from './assets/global-warming/meta.js'
import globalWarmingInquiryMeta from './assets/global-warming-inquiry/meta.js'
import metacognitionSDLMeta   from './assets/metacognition-sdl/meta.js'

/**
 * Central registry of all learning assets.
 * Add a new meta.js import here to surface an asset on the homepage.
 */
export const assetRegistry = [
  cambridgeAS11Meta,
  architectureLabMeta,
  tacomaNarrowsMeta,
  econ73Meta,
  econDossierMeta,
  franceRepublic1792Meta,
  globalWarmingMeta,
  globalWarmingGuidedMeta,
  globalWarmingInquiryMeta,
  metacognitionSDLMeta,
]

export function getAssetMeta(id) {
  return assetRegistry.find(a => a.id === id) ?? null
}
