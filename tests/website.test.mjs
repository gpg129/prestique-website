// Run: npm test   (node:test; Node >= 22.18 strips TypeScript types natively)
import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { encodeSessionPayload, buildAuditSessionUrl, stripLandingUrl } from '../src/lib/api.ts'
import { canonicalFor } from '../src/lib/canonical.ts'
import { canonicalProblems, checkDist } from '../scripts/check-canonicals.mjs'

// Mirrors prestique-audit src/lib/session.ts decodeSessionParam.
function auditDecode(session) {
  const bin = atob(session.replace(/ /g, '+'))
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  let text
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes) } catch { text = bin }
  return JSON.parse(text)
}

const base = { leadId: 'l1', recordId: 'r1', email: 'a@b.co', company: 'Acme', industry: 'dental' }

// ── A-M3 ─────────────────────────────────────────────────────────────────────
test('A-M3 session URL encodes non-Latin-1 names and UTMs without throwing', () => {
  const payload = {
    ...base, firstName: 'Zoë Ødegård 李', company: 'Café “Ω”',
    attribution: { utm_campaign: 'café-李-🚀' },
  }
  const url = buildAuditSessionUrl(payload)
  assert.deepEqual(auditDecode(new URL(url).searchParams.get('session')), payload)
})

test('A-M3 session URL survives base64 "+" characters', () => {
  let hit = false
  for (let i = 0; i < 500; i++) {
    const payload = { ...base, firstName: `n${i}~>?` }
    if (!encodeSessionPayload(payload).includes('+')) continue
    hit = true
    const url = buildAuditSessionUrl(payload)
    // Exact base64 must come back out of the URL — no reliance on the decoder repairing "+".
    assert.equal(new URL(url).searchParams.get('session'), encodeSessionPayload(payload))
    break
  }
  assert.ok(hit, 'fixture must produce a "+"')
})

test('A-M3 ASCII payload encodes byte-identically to the old btoa(JSON)', () => {
  const payload = { ...base, firstName: 'Zoe' }
  assert.equal(encodeSessionPayload(payload), btoa(JSON.stringify(payload)))
})

// ── A-L5 ─────────────────────────────────────────────────────────────────────
test('A-L5 stripLandingUrl keeps path + utm_* only', () => {
  assert.equal(
    stripLandingUrl('https://prestique.ai/dental?gclid=abc&fbclid=d&email=z%40x.co&utm_source=google'),
    'https://prestique.ai/dental?utm_source=google'
  )
  assert.equal(stripLandingUrl('https://prestique.ai/law?fbclid=1'), 'https://prestique.ai/law')
  assert.equal(stripLandingUrl(undefined), undefined)
})

function runAttributionScript(href) {
  const src = readFileSync(new URL('../src/components/Attribution.astro', import.meta.url), 'utf8')
  const body = src.match(/<script is:inline>([\s\S]*?)<\/script>/)[1]
  const store = {}
  const u = new URL(href)
  const ctx = {
    URL, URLSearchParams, JSON, Date,
    location: { search: u.search, pathname: u.pathname, origin: u.origin, href },
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v } },
    document: { referrer: '', addEventListener() {} },
  }
  vm.runInNewContext(body, ctx)
  return JSON.parse(store.pq_attr)
}

test('A-L5 Attribution.astro stores landing_url without click ids or email params', () => {
  const attr = runAttributionScript('https://prestique.ai/dental?gclid=abc&email=z%40x.co&utm_source=google&utm_campaign=caf%C3%A9')
  assert.equal(attr.landing_url, 'https://prestique.ai/dental?utm_source=google&utm_campaign=caf%C3%A9')
  assert.equal(attr.gclid_present, true)
  assert.equal(attr.utm_campaign, 'café')
  assert.equal(runAttributionScript('https://prestique.ai/law?fbclid=1').landing_url, 'https://prestique.ai/law')
})

// ── Canonical lock (A-L2) ────────────────────────────────────────────────────
test('canonicalFor: apex, no trailing slash, root stays /', () => {
  assert.equal(canonicalFor('/'), 'https://prestique.ai/')
  assert.equal(canonicalFor(''), 'https://prestique.ai/')
  assert.equal(canonicalFor('/index.html'), 'https://prestique.ai/')
  assert.equal(canonicalFor('/dental/'), 'https://prestique.ai/dental')
  assert.equal(canonicalFor('/dental'), 'https://prestique.ai/dental')
  assert.equal(canonicalFor('/blog/x/index.html'), 'https://prestique.ai/blog/x')
  assert.equal(canonicalFor('/blog/x.html'), 'https://prestique.ai/blog/x')
  assert.equal(canonicalFor('/blog/'), 'https://prestique.ai/blog')
})

const page = (href) => `<html><head><link rel="canonical" href="${href}"></head></html>`

test('check-canonicals flags trailing slash, www, http, off-origin', () => {
  assert.deepEqual(canonicalProblems(page('https://prestique.ai/')), [])
  assert.deepEqual(canonicalProblems(page('https://prestique.ai/dental')), [])
  assert.match(canonicalProblems(page('https://prestique.ai/dental/')).join(), /trailing-slash/)
  assert.match(canonicalProblems(page('https://www.prestique.ai/dental')).join(), /^www canonical/)
  assert.match(canonicalProblems(page('http://prestique.ai/dental')).join(), /^http:\/\/ canonical/)
  assert.match(canonicalProblems(page('http://www.prestique.ai/dental')).join(), /^http:\/\/ canonical/)
  assert.match(canonicalProblems(page('https://example.com/dental')).join(), /off-origin/)
})

test('check-canonicals walks a dist tree', () => {
  const dir = mkdtempSync(join(tmpdir(), 'canon-'))
  mkdirSync(join(dir, 'blog', 'x'), { recursive: true })
  writeFileSync(join(dir, 'index.html'), page('https://prestique.ai/'))
  writeFileSync(join(dir, 'blog', 'x', 'index.html'), page('https://prestique.ai/blog/x/'))
  const r = checkDist(dir)
  assert.equal(r.files, 2)
  assert.equal(r.failures.length, 1)
  assert.match(r.failures[0], /blog\/x\/index\.html: trailing-slash/)
})
