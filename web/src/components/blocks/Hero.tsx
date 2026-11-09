import Image from 'next/image'

import {urlFor} from '@/sanity/image'

import type {BlockOf} from '../PageBuilder'
import {SanityLink} from '../SanityLink'

type Props = BlockOf<'hero'> & {headingLevel?: 'h1' | 'h2'}

export function Hero({title, text, image, links, headingLevel = 'h2'}: Props) {
  const Heading = headingLevel

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
      <div className="flex flex-col gap-6">
        {title && (
          <Heading className="text-4xl font-semibold tracking-tight md:text-5xl">{title}</Heading>
        )}
        {text && <p className="text-lg text-muted">{text}</p>}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {links.map((link, i) => (
              <SanityLink
                key={link._key}
                label={link.label}
                href={link.href}
                className={
                  i === 0
                    ? 'btn-primary'
                    : 'btn-secondary'
                }
              />
            ))}
          </div>
        )}
      </div>
      {image?.asset && (
        <Image
          src={urlFor(image).width(1200).height(900).fit('crop').auto('format').url()}
          alt={image.alt ?? ''}
          width={1200}
          height={900}
          priority
          className="h-auto w-full rounded-2xl"
        />
      )}
    </section>
  )
}
