import {cookies, draftMode} from 'next/headers'
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from 'next-sanity/live'

import {client} from './client'
import {token} from './token'

// The token is only sent to the browser while Draft Mode is on (inside the Studio's
// Presentation tool), so editors see their drafts update live. Visitors never get it.
export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

// The app's one shared 'use cache' boundary. `sanityFetch` tags the cache
// entry so <SanityLive /> can invalidate it when content changes.
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch(options)
}

export interface DynamicFetchOptions {
  perspective: LivePerspective
  variant?: string
  stega: boolean
}

export const PUBLISHED: DynamicFetchOptions = {perspective: 'published', stega: false}

// Draft Mode is read here, outside 'use cache' boundaries, then passed into cached fetches.
// In Draft Mode, pages show drafts (or the release picked in the Studio) and carry
// invisible click-to-edit markers (stega).
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) return PUBLISHED

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  const variant = await resolveVariantFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', variant, stega: true}
}
