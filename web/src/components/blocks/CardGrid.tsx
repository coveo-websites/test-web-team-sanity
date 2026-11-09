import Image from 'next/image'

import {urlFor} from '@/sanity/image'

import type {BlockOf} from '../PageBuilder'
import {SanityLink} from '../SanityLink'

export function CardGrid({title, intro, cards}: BlockOf<'cardGrid'>) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      {title && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
      {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
      {cards && cards.length > 0 && (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li
              key={card._key}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-background transition hover:border-brand hover:shadow-lg hover:shadow-brand/10"
            >
              {card.image?.asset && (
                <Image
                  src={urlFor(card.image).width(800).height(500).fit('crop').auto('format').url()}
                  alt={card.image.alt ?? ''}
                  width={800}
                  height={500}
                  className="h-auto w-full"
                />
              )}
              <div className="flex flex-1 flex-col gap-2 p-6">
                {card.title && <h3 className="text-lg font-medium">{card.title}</h3>}
                {card.text && <p className="text-muted">{card.text}</p>}
                {card.link && (
                  <SanityLink
                    label={card.link.label}
                    href={card.link.href}
                    className="mt-auto pt-2 font-medium text-link underline-offset-4 hover:underline"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
