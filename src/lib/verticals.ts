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
  dental: {
    slug: 'dental',
    label: 'Dental Practices',
    industry: 'Dental',
    headline: 'Dental practices miss up to 38% of incoming calls.',
    subhead: "Your front desk can't answer every call — and 67% of voicemail-bound patients never call back. Prestique builds the AI that books them instead.",
    statBadge: '38% of calls missed',
    metaTitle: 'AI for Dental Practices | Prestique',
    metaDescription: 'See exactly what Prestique builds for dental practices — 24/7 booking, no-show recovery, insurance verification, recall automation. Free 5-minute audit.',
  },
  law: {
    slug: 'law',
    label: 'Law Firms',
    industry: 'Law',
    headline: 'Law firms miss over a third of inbound calls.',
    subhead: 'Every missed call is a $5,000–$50,000 case walking to the next firm on Google. Prestique builds the AI that intakes them, qualifies them, and books the consult.',
    statBadge: '35%+ of calls missed',
    metaTitle: 'AI for Law Firms | Prestique',
    metaDescription: 'See exactly what Prestique builds for law firms — 24/7 intake, conflict check triggers, consultation booking, proactive client updates. Free 5-minute audit.',
  },
  'auto-repair': {
    slug: 'auto-repair',
    label: 'Auto Repair Shops',
    industry: 'Auto Repair',
    headline: 'Auto repair shops miss nearly half their calls during busy hours.',
    subhead: "Your techs are under cars, not on phones. Every missed call is $300–$1,500 driving to the shop down the street. Prestique builds the AI that answers them.",
    statBadge: '~50% of calls missed',
    metaTitle: 'AI for Auto Repair Shops | Prestique',
    metaDescription: "See exactly what Prestique builds for auto repair shops — vehicle intake, estimate approval, service status updates, post-service follow-up. Free 5-minute audit.",
  },
  veterinary: {
    slug: 'veterinary',
    label: 'Veterinary Clinics',
    industry: 'Veterinary',
    headline: 'Vet clinics miss up to 40% of incoming calls.',
    subhead: "Pet owners panic-call — if no one answers, they drive to the next clinic that picks up. Prestique builds the AI that triages, books, and escalates true emergencies.",
    statBadge: '40% of calls missed',
    metaTitle: 'AI for Veterinary Clinics | Prestique',
    metaDescription: 'See exactly what Prestique builds for vet clinics — 24/7 triage, wellness booking, vaccine reminders, emergency escalation. Free 5-minute audit.',
  },
}

export function getVerticalBySlug(slug: string): VerticalConfig | undefined {
  return VERTICALS[slug]
}
