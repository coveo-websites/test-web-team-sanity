import {notFound} from 'next/navigation'

import {LanguageSwitcher} from '@/components/LanguageSwitcher'
import {PageBuilder} from '@/components/PageBuilder'
import {hasLanguage} from '@/i18n'
import {getDynamicFetchOptions} from '@/sanity/live'

import {getPage} from './get-page'

export async function PageContent({params}: {params: PageProps<'/[lang]/[slug]'>['params']}) {
  const {lang, slug} = await params
  if (!hasLanguage(lang)) notFound()

  const page = await getPage(lang, slug, await getDynamicFetchOptions())

  if (!page) notFound()

  return (
    <>
      <LanguageSwitcher current={lang} translations={page.translations} />
      <PageBuilder content={page.content} />
    </>
  )
}

export function PageContentSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="mx-auto flex w-full max-w-5xl justify-end px-6 pt-4">
        <div className="h-5 w-32 rounded bg-surface" />
      </div>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-20">
        <div className="h-12 w-2/3 rounded bg-surface md:h-14" />
        <div className="h-6 w-1/2 rounded bg-surface" />
      </section>
    </div>
  )
}
