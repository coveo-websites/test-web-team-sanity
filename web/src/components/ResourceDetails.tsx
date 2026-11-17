import Image from 'next/image'
import {stegaClean, type StegaBranded} from 'next-sanity'

import {urlFor} from '@/sanity/image'

import type {RESOURCE_QUERY_RESULT} from '../../sanity.types'

// In Draft Mode strings carry click-to-edit markers; see PageBuilder.tsx.
type Resource = StegaBranded<NonNullable<RESOURCE_QUERY_RESULT>>

function List({items}: {items: string[] | null | undefined}) {
  if (!items || items.length === 0) return null
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  )
}

function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return null
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
    ...(withTime ? {timeStyle: 'short'} : {}),
  }).format(new Date(stegaClean(value)))
}

// Header (title, summary, cover) plus the part that depends on the resource template.
export function ResourceDetails({resource}: {resource: Resource}) {
  const type = stegaClean(resource._type)
  const status = stegaClean(resource._type === 'webinar' ? resource.status : null)

  return (
    <header className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-16 md:grid-cols-2 md:items-start">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{resource.title}</h1>
        {resource.summary && <p className="text-lg text-muted">{resource.summary}</p>}
        {resource.publishDate && (
          <p className="text-sm text-muted">{formatDate(resource.publishDate)}</p>
        )}

        {resource._type === 'ebook' && (
          <>
            <List items={resource.authors} />
            {resource.tableOfContents && (
              <Section title="Inside">
                <List items={resource.tableOfContents} />
              </Section>
            )}
          </>
        )}

        {resource._type === 'report' && resource.keyFindings && (
          <Section title="Key findings">
            <List items={resource.keyFindings} />
          </Section>
        )}

        {resource._type === 'caseStudy' && (
          <>
            <p className="text-sm text-muted">
              {[resource.customer, resource.industry].filter(Boolean).join(' · ')}
            </p>
            {resource.metrics && resource.metrics.length > 0 && (
              <dl className="grid grid-cols-2 gap-4">
                {resource.metrics.map((metric) => (
                  <div key={metric._key}>
                    <dt className="text-3xl font-semibold">{metric.value}</dt>
                    <dd className="text-sm text-muted">{metric.label}</dd>
                  </div>
                ))}
              </dl>
            )}
            {resource.challenge && (
              <Section title="Challenge">
                <p>{resource.challenge}</p>
              </Section>
            )}
            {resource.solution && (
              <Section title="Solution">
                <p>{resource.solution}</p>
              </Section>
            )}
            {resource.results && (
              <Section title="Results">
                <p>{resource.results}</p>
              </Section>
            )}
            {resource.quote?.text && (
              <blockquote className="border-l-4 border-line pl-4">
                <p className="text-lg">&ldquo;{resource.quote.text}&rdquo;</p>
                <footer className="mt-2 text-sm text-muted">
                  {[resource.quote.person, resource.quote.role].filter(Boolean).join(', ')}
                </footer>
              </blockquote>
            )}
          </>
        )}

        {resource._type === 'webinar' && (
          <>
            <p className="text-sm text-muted">
              {status === 'onDemand'
                ? 'On demand'
                : [
                    formatDate(resource.startsAt, true),
                    resource.durationMinutes && `${resource.durationMinutes} min`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
            </p>
            {resource.speakers && resource.speakers.length > 0 && (
              <Section title="Speakers">
                <ul className="space-y-2">
                  {resource.speakers.map((speaker) => (
                    <li key={speaker._key}>
                      <strong>{speaker.name}</strong>
                      <span className="text-muted">
                        {' '}
                        {[speaker.role, speaker.company].filter(Boolean).join(', ')}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {status === 'upcoming' && resource.registrationUrl && !resource.gate && (
              <a href={stegaClean(resource.registrationUrl)} className="btn-primary self-start">
                Register
              </a>
            )}
            {status === 'onDemand' && resource.recordingUrl && !resource.gate && (
              <a href={stegaClean(resource.recordingUrl)} className="btn-primary self-start">
                Watch the recording
              </a>
            )}
          </>
        )}

        {(type === 'ebook' || type === 'report') && resource.downloadUrl && (
          <a href={stegaClean(resource.downloadUrl)} className="btn-primary self-start">
            Download
          </a>
        )}
      </div>

      {resource.coverImage?.asset && (
        <Image
          src={urlFor(resource.coverImage).width(1200).height(900).fit('crop').auto('format').url()}
          alt={resource.coverImage.alt ?? ''}
          width={1200}
          height={900}
          priority
          className="h-auto w-full rounded-2xl"
        />
      )}
    </header>
  )
}
