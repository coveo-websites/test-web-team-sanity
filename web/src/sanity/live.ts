import {defineLive, type StrictDefinedFetchType} from 'next-sanity/live'

import {client} from './client'

// Published content only. To add Draft Mode / Visual Editing later, pass a
// server-only SANITY_API_READ_TOKEN here (see the sanity-best-practices skill).
export const {sanityFetch, SanityLive} = defineLive({
  client,
  strict: true,
})

// The app's one shared 'use cache' boundary. `sanityFetch` tags the cache
// entry so <SanityLive /> can invalidate it when content changes.
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch(options)
}
