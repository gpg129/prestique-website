// Cross-domain client wrapper for the audit tool's leads endpoint.
// Cross-origin handoff is documented in plans/2026-04-25-prestique-website-phase-1-home-services.md.
// CORS allowlist for `https://prestique.ai` lives in prestique-audit/src/app/api/leads/route.ts.

const AUDIT_API_BASE = 'https://audit.prestique.ai'

// First-touch attribution captured by components/Attribution.astro (localStorage `pq_attr`).
export interface Attribution {
  landing_path?: string
  landing_url?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid_present?: boolean
  first_seen_at?: string
  entry_point?: string
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

// landing_url → origin + path + utm_* only (drops gclid/fbclid/email params). Components/Attribution.astro
// already stores it this way; this also cleans pq_attr values stored before that change (90-day window).
export function stripLandingUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const u = new URL(raw)
    const kept = new URLSearchParams()
    for (const k of UTM_KEYS) {
      const v = u.searchParams.get(k)
      if (v) kept.set(k, v)
    }
    const qs = kept.toString()
    return u.origin + u.pathname + (qs ? `?${qs}` : '')
  } catch {
    return undefined
  }
}

export interface LeadInput {
  firstName: string
  email: string
  company: string
  companyUrl?: string
  industry: string
  attribution?: Attribution
}

export interface LeadResponse {
  leadId: string
  recordId: string
}

export async function submitLead(data: LeadInput): Promise<LeadResponse> {
  const res = await fetch(`${AUDIT_API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error(`Lead submission failed: ${res.status}`)
  }

  return res.json() as Promise<LeadResponse>
}

// UTF-8-safe base64. btoa() only accepts Latin-1, so a name like "Zoë Ødegård" / "李" or a
// UTM like utm_campaign=café made it throw and broke the form (for 90 days, since the UTM
// lives in pq_attr). Decoder: prestique-audit src/lib/session.ts (reads old Latin-1 links too).
export function encodeSessionPayload(payload: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload))
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

export function buildAuditSessionUrl(payload: LeadResponse & LeadInput): string {
  // encodeURIComponent: base64 contains "+" and "/", and "+" reads back as a space.
  return `${AUDIT_API_BASE}/audit?session=${encodeURIComponent(encodeSessionPayload(payload))}`
}
