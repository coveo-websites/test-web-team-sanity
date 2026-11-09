import type {BlockOf} from '../PageBuilder'

export function Features({title, intro, items}: BlockOf<'features'>) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      {title && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
      {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
      {items && items.length > 0 && (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item._key}
              className="rounded-2xl border border-line bg-surface-subtle p-6"
            >
              {item.title && <h3 className="text-lg font-medium text-brand">{item.title}</h3>}
              {item.text && <p className="mt-2 text-muted">{item.text}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
