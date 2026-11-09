import {PortableText} from 'next-sanity'

import type {BlockOf} from '../PageBuilder'

export function RichText({title, body}: BlockOf<'richText'>) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      {title && <h2 className="mb-6 text-3xl font-semibold tracking-tight">{title}</h2>}
      {body && (
        <div className="flex flex-col gap-4 text-lg leading-relaxed text-foreground/85 [&_a]:text-link [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_h3]:mt-4 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h4]:text-xl [&_h4]:font-medium [&_h4]:text-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
          <PortableText value={body} />
        </div>
      )}
    </section>
  )
}
