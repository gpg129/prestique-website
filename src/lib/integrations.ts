import { getCollection } from 'astro:content'
import { VERTICALS, type VerticalConfig } from './verticals'

export async function liveIntegrations() {
  return (await getCollection('integrations', (e) => e.data.status === 'live')).sort((a, b) =>
    a.data.platform.localeCompare(b.data.platform),
  )
}

export function verticalFor(blogVertical: string): VerticalConfig | undefined {
  return Object.values(VERTICALS).find((v) => v.blogVertical === blogVertical)
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
