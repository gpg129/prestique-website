// Website demo agents: the "Try it live" form posts here and gets back the shared demo number.
// Backend: aios-starter-kit services/prestique-pm-demo (/demo/request). Docs: docs/website-demo-agents.md
export const DEMO_API = 'https://prestique-pm-demo-production.up.railway.app'

export const DEMO_INDUSTRIES: { slug: string; label: string }[] = [
  { slug: 'home-services', label: 'Home services (HVAC, plumbing, electrical)' },
  { slug: 'dental', label: 'Dental practice' },
  { slug: 'law', label: 'Law firm' },
  { slug: 'auto-repair', label: 'Auto repair shop' },
  { slug: 'veterinary', label: 'Veterinary clinic' },
  { slug: 'beauty-salons', label: 'Hair or beauty salon' },
]

export interface DemoResponse {
  number: string
  display: string
  call_from: string
  business: string
}
