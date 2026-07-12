// Accessibility scan for a lab URL using axe-core via Playwright.
// Usage: node scripts/axe-scan.mjs http://localhost:5173/asset/<asset-id>
// Exit codes: 0 = no violations, 1 = violations found, 2 = usage/launch error.
// Requires Playwright's Chromium binary: npx playwright install chromium (one-time).
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const url = process.argv[2]
if (!url) {
  console.error('Usage: node scripts/axe-scan.mjs <url>')
  process.exit(2)
}

let browser
try {
  browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  const results = await new AxeBuilder({ page }).analyze()
  await browser.close()

  const { violations } = results
  if (violations.length === 0) {
    console.log('No accessibility violations found.')
    process.exit(0)
  }
  for (const v of violations) {
    console.log(`[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} element${v.nodes.length === 1 ? '' : 's'})`)
    for (const n of v.nodes.slice(0, 5)) {
      console.log(`    ${n.target.join(' ')}`)
    }
    if (v.nodes.length > 5) console.log(`    ...and ${v.nodes.length - 5} more`)
  }
  console.log(`\n${violations.length} violation type(s) found.`)
  process.exit(1)
} catch (err) {
  if (browser) await browser.close()
  console.error(`Scan failed: ${err.message}`)
  process.exit(2)
}
