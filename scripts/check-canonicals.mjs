#!/usr/bin/env node
// Post-build canonical lock. Run after `astro build`: npm run check:canonicals
// Fails if any built page's <link rel="canonical"> is not on the apex https origin,
// or ends with "/" (only the root https://prestique.ai/ may). Rule source: src/lib/canonical.ts.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ORIGIN = 'https://prestique.ai'
const ROOT = ORIGIN + '/'

export function canonicalProblems(html) {
  const hrefs = []
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/\brel\s*=\s*["']?canonical["']?/i.test(tag)) continue
    const m = tag.match(/\bhref\s*=\s*["']([^"']*)["']/i)
    hrefs.push(m ? m[1] : '')
  }
  const problems = []
  if (hrefs.length > 1) problems.push(`${hrefs.length} canonical tags`)
  for (const href of hrefs) {
    if (href.startsWith('http://')) problems.push(`http:// canonical ${href}`)
    else if (/^https?:\/\/www\./i.test(href)) problems.push(`www canonical ${href}`)
    else if (href !== ROOT && !href.startsWith(ROOT)) problems.push(`off-origin canonical ${href || '(empty)'}`)
    else if (href !== ROOT && href.endsWith('/')) problems.push(`trailing-slash canonical ${href}`)
  }
  return problems
}

function htmlFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p))
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

export function checkDist(dist) {
  const files = htmlFiles(dist)
  const failures = []
  let withCanonical = 0
  for (const f of files) {
    const html = readFileSync(f, 'utf8')
    if (/rel\s*=\s*["']?canonical/i.test(html)) withCanonical++
    for (const p of canonicalProblems(html)) failures.push(`${relative(dist, f)}: ${p}`)
  }
  return { files: files.length, withCanonical, failures }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dist = process.argv[2] ?? 'dist'
  let result
  try {
    result = checkDist(dist)
  } catch (e) {
    console.error(`check-canonicals: cannot read ${dist} (run astro build first): ${e.message}`)
    process.exit(2)
  }
  if (result.files === 0) {
    console.error(`check-canonicals: no .html files under ${dist}`)
    process.exit(2)
  }
  if (result.failures.length) {
    console.error(`check-canonicals: ${result.failures.length} problem(s):`)
    for (const f of result.failures) console.error('  ' + f)
    process.exit(1)
  }
  console.log(`check-canonicals: OK — ${result.withCanonical}/${result.files} pages carry a canonical, all apex + no trailing slash`)
}
