import type {BlockOf} from '../PageBuilder'
import {SanityLink} from '../SanityLink'

export function CallToAction({title, text, links}: BlockOf<'callToAction'>) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-brand-strong px-6 py-14 text-center text-on-brand">
        {title && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
        {text && <p className="max-w-xl text-on-brand/80">{text}</p>}
        {links && links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {links.map((link) => (
              <SanityLink
                key={link._key}
                label={link.label}
                href={link.href}
                className="btn-primary"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
