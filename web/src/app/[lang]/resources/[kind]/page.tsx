import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import {ResourceCard} from '@/components/ResourceCard'
import {hasLanguage} from '@/i18n'
import {kindByPath, RESOURCE_KINDS} from '@/resources'
import {cachedSanity, PUBLISHED} from '@/sanity/live'
import {RESOURCE_LIST_QUERY} from '@/sanity/queries'

export async function generateStaticParams() {
  return RESOURCE_KINDS.map((kind) => ({kind: kind.path}))
}

export async function generateMetadata(
  props: PageProps<'/[lang]/resources/[kind]'>,
): Promise<Metadata> {
  const {kind: kindPath} = await props.params
  const kind = kindByPath(kindPath)
  return kind ? {title: kind.title} : {}
}

export default function ResourceKindPage(props: PageProps<'/[lang]/resources/[kind]'>) {
  return (
    <Suspense fallback={null}>
      <KindContent params={props.params} />
    </Suspense>
  )
}

async function KindContent({params}: {params: PageProps<'/[lang]/resources/[kind]'>['params']}) {
  const {lang, kind: kindPath} = await params
  const kind = kindByPath(kindPath)
  if (!hasLanguage(lang) || !kind) notFound()

  const {data: resources} = await cachedSanity({
    query: RESOURCE_LIST_QUERY,
    params: {types: [kind.type], language: lang},
    ...PUBLISHED,
  })

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{kind.title}</h1>
      {resources.length === 0 ? (
        <p className="text-muted">Nothing published yet.</p>
      ) : (
        <div className="grid gap-10 md:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} language={lang} />
          ))}
        </div>
      )}
    </section>
  )
}
