// Cross-domain client wrapper for the audit tool's leads endpoint.
// Cross-origin handoff is documented in plans/2026-04-25-prestique-website-phase-1-home-services.md.
// CORS allowlist for `https://prestique.ai` lives in prestique-audit/src/app/api/leads/route.ts.

const AUDIT_API_BASE = 'https://audit.prestique.ai'

export interface LeadInput {
  firstName: string
  email: string
  company: string
  companyUrl?: string
  industry: string
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

export function buildAuditSessionUrl(payload: LeadResponse & LeadInput): string {
  const json = JSON.stringify(payload)
  const encoded = btoa(json)
  return `${AUDIT_API_BASE}/audit?session=${encoded}`
}
