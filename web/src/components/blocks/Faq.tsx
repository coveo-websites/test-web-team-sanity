import {PortableText} from 'next-sanity'

import type {BlockOf} from '../PageBuilder'

export function Faq({title, items}: BlockOf<'faq'>) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      {title && <h2 className="mb-8 text-3xl font-semibold tracking-tight">{title}</h2>}
      {items && items.length > 0 && (
        <div className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <details key={item._key} className="group py-5 [&[open]_summary]:text-brand">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {item.question}
                <span aria-hidden className="text-2xl leading-none text-brand transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              {item.answer && (
                <div className="mt-3 flex flex-col gap-3 text-muted [&_a]:text-link [&_a]:underline">
                  <PortableText value={item.answer} />
                </div>
              )}
            </details>
          ))}
        </div>
      )}
    </section>
  )
}
