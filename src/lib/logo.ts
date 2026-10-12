// Master Prestique logo — the single source of truth for the mark.
// Mirrors: prestique-audit/src/components/BrandLogo.tsx and
// aios-starter-kit/scripts/brand/render_logo.py (regenerates every static asset).
// Change a value here → update both mirrors → run render_logo.py.
//
// Every facet is a SOLID colour. The old logo drew the blue facet at 90–95%
// opacity, so the background bled through and it never matched the "ique" text.
// The grey faces below are the old white/navy tints pre-blended onto their
// background, so the mark looks the same but every blue is exactly BLUE.

export const BLUE = '#3b82f6'

export const FACETS = {
  outline: '20,2 36,12 36,28 20,38 4,28 4,12',
  top: '20,10 30,16 20,22 10,16',
  left: '10,16 20,22 20,30 10,24',
  right: '30,16 30,24 20,30 20,22',
} as const

export const LOGO_COLORS = {
  // On the site background #0a0f1a: white@35% → #606368, white@15% → #2f333c
  dark: { outline: '#ffffff', top: BLUE, left: '#606368', right: '#2f333c', prest: '#ffffff', ique: BLUE },
  // On white: navy #1a2e4a @35% → #afb6c0, @15% → #dde0e4
  light: { outline: '#1a2e4a', top: BLUE, left: '#afb6c0', right: '#dde0e4', prest: '#1a2e4a', ique: BLUE },
} as const

export type LogoVariant = keyof typeof LOGO_COLORS
