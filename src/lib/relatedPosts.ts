// Related-post selection for blog posts (crawl-priority plan, 2026-10-01).
//
// Every post links to its neighbours within the same vertical: the n/2 posts published just
// before it and the n/2 just after, wrapping around the vertical's timeline. That gives every
// post the same number of inbound links (old posts are not starved, new posts are linked the
// moment they publish), with no generated text. Drafts are never linked.

export interface PostLike {
  id: string
  data: { pubDate: Date; vertical: string; draft?: boolean }
}

export function neighbours<T extends PostLike>(posts: T[], id: string, n = 4): T[] {
  const self = posts.find((p) => p.id === id)
  if (!self) return []
  const same = posts
    .filter((p) => !p.data.draft && p.data.vertical === self.data.vertical)
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf() || a.id.localeCompare(b.id))
  const others = same.filter((p) => p.id !== id)
  if (others.length <= n) return others
  const i = same.findIndex((p) => p.id === id)
  const before = Math.floor(n / 2)
  const out: T[] = []
  for (let k = -before; out.length < n; k++) {
    if (k === 0) continue
    out.push(same[(i + k + same.length) % same.length])
  }
  return out
}

// Blog vertical → landing page path.
export const VERTICAL_PAGE: Record<string, string> = {
  hvac: '/home-services',
  dental: '/dental',
  law: '/law',
  auto_repair: '/auto-repair',
  veterinary: '/veterinary',
  beauty_salon: '/beauty-salons',
}
