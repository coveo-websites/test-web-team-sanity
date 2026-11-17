import type {Metadata} from 'next'
import {lang as rootLang} from 'next/root-params'
import {Suspense} from 'react'

import {PageContentSkeleton} from '@/app/[lang]/[slug]/page-content'
import {hasLanguage} from '@/i18n'
import {kindByPath, kindByType, RESOURCE_TYPES, resourcePath} from '@/resources'
import {cachedSanity} from '@/sanity/live'
import {RESOURCE_SLUGS_QUERY} from '@/sanity/queries'

import {getResource} from './get-resource'
import {ResourceContent} from './page-content'

// With Cache Components, generateStaticParams must return at least one entry.
const PLACEHOLDER = {kind: 'ebooks', slug: '__placeholder__'}

export async function generateStaticParams() {
  const language = await rootLang()
  const {data} = await cachedSanity({
    query: RESOURCE_SLUGS_QUERY,
    params: {types: RESOURCE_TYPES, language},
    perspective: 'published',
    stega: false,
  })
  const params = data.flatMap((resource) => {
    const kind = kindByType(resource._type)
    return kind && resource.slug ? [{kind: kind.path, slug: resource.slug}] : []
  })
  return params.length > 0 ? params : [PLACEHOLDER]
}

export async function generateMetadata(
  props: PageProps<'/[lang]/resources/[kind]/[slug]'>,
): Promise<Metadata> {
  const {lang, kind: kindPath, slug} = await props.params
  const kind = kindByPath(kindPath)
  if (!hasLanguage(lang) || !kind) return {}

  const resource = await getResource(lang, kind.type, slug)
  if (!resource) return {}

  // hreflang alternates for SEO, built from the linked translations
  const languages = Object.fromEntries(
    (resource.translations ?? []).flatMap((t) =>
      t.language && t.slug ? [[t.language, resourcePath(t.language, kind, t.slug)]] : [],
    ),
  )

  return {
    title: resource.seo?.title ?? resource.title,
    description: resource.seo?.description ?? resource.summary,
    alternates: {languages},
  }
}

export default function ResourcePage(props: PageProps<'/[lang]/resources/[kind]/[slug]'>) {
  return (
    <Suspense fallback={<PageContentSkeleton />}>
      <ResourceContent params={props.params} />
    </Suspense>
  )
}
