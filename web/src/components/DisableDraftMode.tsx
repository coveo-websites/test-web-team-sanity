'use client'

import {usePathname} from 'next/navigation'
import {useVisualEditingEnvironment} from 'next-sanity/hooks'

// Shown when someone opens the site in Draft Mode outside the Studio, so they can
// leave the preview and see what visitors see.
export function DisableDraftMode() {
  const environment = useVisualEditingEnvironment()
  const pathname = usePathname()
  if (environment !== 'standalone') return null

  return (
    <a
      href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname)}`}
      className="btn-secondary fixed right-4 bottom-4 z-50 text-sm shadow-lg"
    >
      Exit preview
    </a>
  )
}
