import type {Language} from '@/i18n'
import {cachedSanity} from '@/sanity/live'
import {PAGE_QUERY} from '@/sanity/queries'

export async function getPage(language: Language, slug: string) {
  const {data} = await cachedSanity({
    query: PAGE_QUERY,
    params: {language, slug},
    perspective: 'published',
    stega: false,
  })
  return data
}
