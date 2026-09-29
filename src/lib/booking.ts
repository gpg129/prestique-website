import { canonicalFor, SITE_ORIGIN } from './canonical'

// Single source for the "Schedule a call" link (nav button + BookCallCTA).
// Swap this one value to change where every booking CTA on the site points.
export const BOOKING_URL = 'https://calendly.com/prestique/30min'

// Calendly keeps UTM params on the booking, so calls can be traced to the page they came from.
export function bookingUrlFor(pagePath: string, placement: 'nav' | 'section'): string {
  const u = new URL(BOOKING_URL)
  u.searchParams.set('utm_source', 'prestique.ai')
  u.searchParams.set('utm_medium', 'website')
  u.searchParams.set('utm_campaign', `book_call_${placement}`)
  u.searchParams.set('utm_content', canonicalFor(pagePath).slice(SITE_ORIGIN.length))
  return u.toString()
}
