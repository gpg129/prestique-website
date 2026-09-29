// Single source of truth for canonical URLs.
// Rule: apex host (https://prestique.ai), no trailing slash — root stays "/".
// www.prestique.ai 308-redirects to the apex at the Vercel domain level, and
// vercel.json (cleanUrls + trailingSlash:false) 308s "/x/" to "/x".
export const SITE_ORIGIN = 'https://prestique.ai'

export function canonicalFor(pathname: string): string {
  const clean = pathname
    .replace(/\/index(\.html)?$/, '')
    .replace(/\.html$/, '')
    .replace(/\/+$/, '')
  return SITE_ORIGIN + (clean === '' ? '/' : clean)
}
