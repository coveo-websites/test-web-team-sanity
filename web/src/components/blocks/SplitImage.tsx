import Image from 'next/image'
import {PortableText} from 'next-sanity'

import {urlFor} from '@/sanity/image'

import type {BlockOf} from '../PageBuilder'

export function SplitImage({orientation, title, body, image}: BlockOf<'splitImage'>) {
  const imageRight = orientation === 'imageRight'

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
      {image?.asset && (
        <Image
          src={urlFor(image).width(1000).height(750).fit('crop').auto('format').url()}
          alt={image.alt ?? ''}
          width={1000}
          height={750}
          className={`h-auto w-full rounded-2xl ${imageRight ? 'md:order-last' : ''}`}
        />
      )}
      <div className="flex flex-col gap-4">
        {title && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
        {body && (
          <div className="flex flex-col gap-4 text-zinc-700 dark:text-zinc-300">
            <PortableText value={body} />
          </div>
        )}
      </div>
    </section>
  )
}
