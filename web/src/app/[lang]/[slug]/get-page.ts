import type {Language} from '@/i18n'
import {cachedSanity, PUBLISHED, type DynamicFetchOptions} from '@/sanity/live'
import {PAGE_QUERY} from '@/sanity/queries'

export async function getPage(
  language: Language,
  slug: string,
  options: DynamicFetchOptions = PUBLISHED,
) {
  const {data} = await cachedSanity({
    query: PAGE_QUERY,
    params: {language, slug},
    ...options,
  })
  return data
}
