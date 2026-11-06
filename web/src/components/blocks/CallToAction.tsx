import type {BlockOf} from '../PageBuilder'
import {SanityLink} from '../SanityLink'

export function CallToAction({title, text, links}: BlockOf<'callToAction'>) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-zinc-100 px-6 py-14 text-center dark:bg-zinc-900">
        {title && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
        {text && <p className="max-w-xl text-zinc-600 dark:text-zinc-400">{text}</p>}
        {links && links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {links.map((link) => (
              <SanityLink
                key={link._key}
                label={link.label}
                href={link.href}
                className="rounded-full bg-foreground px-5 py-2.5 font-medium text-background"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
