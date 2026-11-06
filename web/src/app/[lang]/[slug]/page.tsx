import type {Metadata} from 'next'
import {lang as rootLang} from 'next/root-params'
import {Suspense} from 'react'

import {hasLanguage} from '@/i18n'
import {cachedSanity} from '@/sanity/live'
import {PAGE_SLUGS_QUERY} from '@/sanity/queries'

import {getPage} from './get-page'
import {PageContent, PageContentSkeleton} from './page-content'

// With Cache Components, generateStaticParams must return at least one entry.
// The placeholder keeps builds working on an empty dataset; it resolves to a 404.
const PLACEHOLDER_SLUG = '__placeholder__'

export async function generateStaticParams() {
  const language = await rootLang()
  const {data} = await cachedSanity({
    query: PAGE_SLUGS_QUERY,
    params: {language},
    perspective: 'published',
    stega: false,
  })
  const slugs = data.flatMap((page) => (page.slug ? [{slug: page.slug}] : []))
  return slugs.length > 0 ? slugs : [{slug: PLACEHOLDER_SLUG}]
}

export async function generateMetadata(props: PageProps<'/[lang]/[slug]'>): Promise<Metadata> {
  const {lang, slug} = await props.params
  if (!hasLanguage(lang)) return {}

  const page = await getPage(lang, slug)
  if (!page) return {}

  // hreflang alternates for SEO, built from the linked translations
  const languages = Object.fromEntries(
    (page.translations ?? []).flatMap((t) =>
      t.language && t.slug ? [[t.language, t.isHome ? `/${t.language}` : `/${t.language}/${t.slug}`]] : [],
    ),
  )

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
    alternates: {languages},
  }
}

export default function Page(props: PageProps<'/[lang]/[slug]'>) {
  return (
    <Suspense fallback={<PageContentSkeleton />}>
      <PageContent params={props.params} />
    </Suspense>
  )
}
