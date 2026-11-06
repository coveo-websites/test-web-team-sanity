import type {BlockOf} from '../PageBuilder'

export function Features({title, intro, items}: BlockOf<'features'>) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      {title && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
      {intro && <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">{intro}</p>}
      {items && items.length > 0 && (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item._key}
              className="rounded-2xl border border-black/10 p-6 dark:border-white/15"
            >
              {item.title && <h3 className="text-lg font-medium">{item.title}</h3>}
              {item.text && <p className="mt-2 text-zinc-600 dark:text-zinc-400">{item.text}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
