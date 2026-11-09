import {stegaClean} from 'next-sanity'

import type {BlockOf} from '../PageBuilder'

// Keep in sync with the URL validation in studio/schemaTypes/blocks/videoType.ts.
function getEmbedUrl(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./, '')
  if (host === 'youtube.com') {
    const id = parsed.searchParams.get('v')
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'youtu.be') {
    const id = parsed.pathname.slice(1)
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  if (host === 'vimeo.com') {
    const id = parsed.pathname.split('/').find((segment) => /^\d+$/.test(segment))
    return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null
  }
  return null
}

export function Video({title, url, caption}: BlockOf<'video'>) {
  const cleanUrl = stegaClean(url)
  const embedUrl = cleanUrl ? getEmbedUrl(cleanUrl) : null
  if (!embedUrl) return null

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      {title && <h2 className="mb-6 text-3xl font-semibold tracking-tight">{title}</h2>}
      <figure>
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe
            src={embedUrl}
            title={title ?? caption ?? 'Video'}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
        )}
      </figure>
    </section>
  )
}
