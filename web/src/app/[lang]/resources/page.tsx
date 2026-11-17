import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import {ResourceCard} from '@/components/ResourceCard'
import {hasLanguage} from '@/i18n'
import {RESOURCE_KINDS, RESOURCE_TYPES, resourcePath} from '@/resources'
import {cachedSanity, PUBLISHED} from '@/sanity/live'
import {RESOURCE_LIST_QUERY} from '@/sanity/queries'
import Link from 'next/link'

export const metadata: Metadata = {title: 'Resources'}

export default function ResourcesPage(props: PageProps<'/[lang]/resources'>) {
  return (
    <Suspense fallback={null}>
      <ResourcesContent params={props.params} />
    </Suspense>
  )
}

async function ResourcesContent({params}: {params: PageProps<'/[lang]/resources'>['params']}) {
  const {lang} = await params
  if (!hasLanguage(lang)) notFound()

  const {data: resources} = await cachedSanity({
    query: RESOURCE_LIST_QUERY,
    params: {types: RESOURCE_TYPES, language: lang},
    ...PUBLISHED,
  })

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Resources</h1>
      <ul className="flex flex-wrap gap-4 text-sm">
        {RESOURCE_KINDS.map((kind) => (
          <li key={kind.type}>
            <Link href={resourcePath(lang, kind)} className="underline">
              {kind.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid gap-10 md:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource._id} resource={resource} language={lang} />
        ))}
      </div>
    </section>
  )
}
