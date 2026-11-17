import type {Language} from '@/i18n'
import {cachedSanity, PUBLISHED, type DynamicFetchOptions} from '@/sanity/live'
import {RESOURCE_QUERY} from '@/sanity/queries'

export async function getResource(
  language: Language,
  type: string,
  slug: string,
  options: DynamicFetchOptions = PUBLISHED,
) {
  const {data} = await cachedSanity({
    query: RESOURCE_QUERY,
    params: {language, type, slug},
    ...options,
  })
  return data
}
