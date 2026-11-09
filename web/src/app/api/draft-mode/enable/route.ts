import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {client} from '@/sanity/client'
import {token} from '@/sanity/token'

// Called by the Studio's Presentation tool: it checks a one-time secret with Sanity,
// then turns on Draft Mode and redirects to the page being edited.
const handler = token
  ? defineEnableDraftMode({client: client.withConfig({token})}).GET
  : null

export async function GET(request: Request) {
  if (!handler) {
    return new Response(
      'Draft Mode needs SANITY_API_READ_TOKEN in web/.env.local (a Viewer token from sanity.io/manage). Restart the dev server after adding it.',
      {status: 500},
    )
  }
  return handler(request)
}
