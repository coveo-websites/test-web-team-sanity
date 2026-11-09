import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import {LanguageSwitcher} from '@/components/LanguageSwitcher'
import {PageBuilder} from '@/components/PageBuilder'
import {hasLanguage, type Language} from '@/i18n'
import {
  cachedSanity,
  getDynamicFetchOptions,
  PUBLISHED,
  type DynamicFetchOptions,
} from '@/sanity/live'
import {HOME_PAGE_QUERY} from '@/sanity/queries'

import {PageContentSkeleton} from './[slug]/page-content'

async function getHomePage(language: Language, options: DynamicFetchOptions = PUBLISHED) {
  const {data} = await cachedSanity({
    query: HOME_PAGE_QUERY,
    params: {language},
    ...options,
  })
  return data
}

export async function generateMetadata(props: PageProps<'/[lang]'>): Promise<Metadata> {
  const {lang} = await props.params
  if (!hasLanguage(lang)) return {}

  const page = await getHomePage(lang)
  if (!page?.seo) return {}

  return {
    title: page.seo.title ? {absolute: page.seo.title} : undefined,
    description: page.seo.description,
  }
}

export default function HomePage(props: PageProps<'/[lang]'>) {
  return (
    <Suspense fallback={<PageContentSkeleton />}>
      <HomeContent params={props.params} />
    </Suspense>
  )
}

async function HomeContent({params}: {params: PageProps<'/[lang]'>['params']}) {
  const {lang} = await params
  if (!hasLanguage(lang)) notFound()

  const page = await getHomePage(lang, await getDynamicFetchOptions())

  if (!page) {
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight">No home page yet</h1>
        <p className="text-muted">
          In the Studio, create a page in this language, then pick it as the{' '}
          <strong>Home page</strong> in <strong>Site settings ({lang.toUpperCase()})</strong> and
          publish both.
        </p>
      </section>
    )
  }

  return (
    <>
      <LanguageSwitcher current={lang} translations={page.translations} />
      <PageBuilder content={page.content} />
    </>
  )
}
