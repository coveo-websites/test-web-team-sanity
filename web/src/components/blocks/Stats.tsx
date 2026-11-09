import type {BlockOf} from '../PageBuilder'

export function Stats({title, items}: BlockOf<'stats'>) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      {title && <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">{title}</h2>}
      {items && items.length > 0 && (
        <dl className="grid gap-8 text-center sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
          {items.map((item) => (
            <div key={item._key} className="flex flex-col-reverse gap-2">
              <dt className="text-muted">{item.label}</dt>
              <dd className="text-5xl font-semibold tracking-tight text-brand">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
