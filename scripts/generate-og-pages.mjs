// Generates a static HTML file per explorable at dist/explorable/<id>.html, so
// social-media crawlers (LinkedIn, etc.) — which don't execute JavaScript — see
// explorable-specific <title>/og:*/twitter:* tags instead of the generic site ones.
//
// The base HTML is dist/index.html itself, untouched except for injected <head> tags,
// so the real script/CSS references (Vite's content-hashed filenames) stay correct
// automatically on every build. Real visitors get the exact same SPA bundle, which
// then client-side-routes to ExplorablePage as normal.
//
// Output is a flat <id>.html file, not <id>/index.html: Vercel's "Clean URLs" only
// resolves an extensionless request like /explorable/hit-engine to a sibling
// explorable/hit-engine.html file ahead of the SPA catch-all rewrite — a nested
// explorable/hit-engine/index.html only resolves for the trailing-slash form
// (/explorable/hit-engine/), which is never the URL people actually share. Confirmed
// locally against `vite preview`, which has the same extensionless-to-.html behavior.
//
// Run automatically as part of `npm run build`.
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { explorableRegistry } from '../src/explorables/registry.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')
const siteUrl = (process.env.SITE_URL || 'https://asset-library-tan.vercel.app').replace(/\/$/, '')

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function main() {
  const template = await readFile(path.join(distDir, 'index.html'), 'utf-8')

  for (const explorable of explorableRegistry) {
    const url = `${siteUrl}/explorable/${explorable.id}`
    const title = `${explorable.title} — InquiryLabs`
    const description = explorable.description ?? ''

    const imageTags = explorable.ogImage
      ? `\n    <meta property="og:image" content="${siteUrl}${explorable.ogImage}" />\n    <meta name="twitter:card" content="summary_large_image" />`
      : `\n    <meta name="twitter:card" content="summary" />`

    const headTags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="InquiryLabs" />${imageTags}
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
  `

    const html = template
      .replace(/<title>[^<]*<\/title>/, '')
      .replace('</head>', `${headTags}\n  </head>`)

    const outDir = path.join(distDir, 'explorable')
    await mkdir(outDir, { recursive: true })
    await writeFile(path.join(outDir, `${explorable.id}.html`), html, 'utf-8')
    console.log(`[generate-og-pages] ${explorable.id} → ${url}`)
  }
}

main().catch((err) => {
  console.error('[generate-og-pages] failed:', err)
  process.exit(1)
})
