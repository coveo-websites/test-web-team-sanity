import {NextResponse, type NextRequest} from 'next/server'

import {DEFAULT_LANGUAGE, hasLanguage, LANGUAGE_IDS} from './i18n'

// Pick the first supported language from Accept-Language, e.g. "fr-CA,fr;q=0.9,en;q=0.8" → "fr".
function preferredLanguage(request: NextRequest) {
  const header = request.headers.get('accept-language') ?? ''
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return {base: tag.split('-')[0].toLowerCase(), q: q ? Number(q) : 1}
    })
    .sort((a, b) => b.q - a.q)

  return ranked.find((entry) => hasLanguage(entry.base))?.base ?? DEFAULT_LANGUAGE
}

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl
  const hasPrefix = LANGUAGE_IDS.some(
    (language) => pathname === `/${language}` || pathname.startsWith(`/${language}/`),
  )
  if (hasPrefix) return

  request.nextUrl.pathname = `/${preferredLanguage(request)}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  // Skip API routes (draft mode), Next internals and files with an extension (favicon.ico, …)
  matcher: ['/((?!api/|_next|.*\\..*).*)'],
}
