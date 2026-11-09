import 'server-only'

// Viewer token from sanity.io/manage → API → Tokens. Needed for Draft Mode and the
// Studio's Presentation tool; the published site works without it.
export const token = process.env.SANITY_API_READ_TOKEN || undefined
