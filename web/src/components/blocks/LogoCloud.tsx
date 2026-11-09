import Image from 'next/image'
import {stegaClean} from 'next-sanity'

import {urlFor} from '@/sanity/image'

import type {BlockOf} from '../PageBuilder'

export function LogoCloud({title, logos}: BlockOf<'logoCloud'>) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12">
      {title && (
        <h2 className="mb-8 text-center text-sm font-medium tracking-wide text-muted uppercase">
          {title}
        </h2>
      )}
      {logos && logos.length > 0 && (
        <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo) => {
            if (!logo.image?.asset) return null
            const image = (
              <Image
                src={urlFor(logo.image).height(80).fit('max').auto('format').url()}
                alt={logo.image.alt || logo.name || ''}
                width={200}
                height={40}
                className="h-10 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            )
            return (
              <li key={logo._key}>
                {stegaClean(logo.href) ? (
                  <a href={stegaClean(logo.href) ?? undefined} aria-label={stegaClean(logo.name) ?? undefined}>
                    {image}
                  </a>
                ) : (
                  image
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
