import Image from 'next/image'

import {urlFor} from '@/sanity/image'

import type {BlockOf} from '../PageBuilder'

export function Testimonials({title, items}: BlockOf<'testimonials'>) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      {title && <h2 className="mb-10 text-3xl font-semibold tracking-tight">{title}</h2>}
      {items && items.length > 0 && (
        <ul className={`grid gap-6 ${items.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {items.map((item) => {
            const byline = [item.role, item.company].filter(Boolean).join(', ')
            return (
              <li key={item._key}>
                <figure className="flex h-full flex-col gap-6 rounded-2xl bg-surface p-8">
                  <blockquote className="border-l-4 border-accent pl-4 text-lg leading-relaxed">“{item.quote}”</blockquote>
                  <figcaption className="mt-auto flex items-center gap-4">
                    {item.photo?.asset && (
                      <Image
                        src={urlFor(item.photo).width(96).height(96).fit('crop').auto('format').url()}
                        alt={item.photo.alt ?? ''}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {byline && (
                        <div className="text-sm text-muted">{byline}</div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
