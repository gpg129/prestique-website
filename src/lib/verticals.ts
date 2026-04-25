// Mirrors prestique-audit/src/lib/verticals.ts. Audit tool is the canonical source —
// any addition or copy change must be applied to both files (the audit tool drives the
// chat-page hero/sample-opportunities; this copy drives prestique.ai vertical pages).
//
// Phase 1 only ships the home-services entry. Other 4 verticals are stubbed out as TODO
// for Phase 2 — they exist in the audit tool's verticals.ts already.

export interface VerticalConfig {
  slug: string
  label: string
  industry: string
  headline: string
  subhead: string
  statBadge: string
  metaTitle: string
  metaDescription: string
}

export const VERTICALS: Record<string, VerticalConfig> = {
  'home-services': {
    slug: 'home-services',
    label: 'Home Service Businesses',
    industry: 'Home Services',
    headline: 'Home service businesses miss up to 62% of their calls.',
    subhead: 'HVAC, plumbing, electrical, roofing — every missed call is a job that walks to whoever picks up first. Prestique builds the AI that catches them.',
    statBadge: '62% of calls missed',
    metaTitle: 'AI for Home Service Businesses | Prestique',
    metaDescription: 'See exactly what Prestique builds for HVAC, plumbing, electrical, and roofing companies — voice agents, missed-call SMS, CRM automation. Free 5-minute audit.',
  },
  // TODO Phase 2: dental, law, auto-repair, veterinary
}

export function getVerticalBySlug(slug: string): VerticalConfig | undefined {
  return VERTICALS[slug]
}
