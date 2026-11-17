import {notFound} from 'next/navigation'

import {Form} from '@/components/blocks/Form'
import {LanguageSwitcher} from '@/components/LanguageSwitcher'
import {PageBuilder} from '@/components/PageBuilder'
import {ResourceDetails} from '@/components/ResourceDetails'
import {hasLanguage} from '@/i18n'
import {kindByPath} from '@/resources'
import {getDynamicFetchOptions} from '@/sanity/live'

import {getResource} from './get-resource'

type Params = PageProps<'/[lang]/resources/[kind]/[slug]'>['params']

export async function ResourceContent({params}: {params: Params}) {
  const {lang, kind: kindPath, slug} = await params
  const kind = kindByPath(kindPath)
  if (!hasLanguage(lang) || !kind) notFound()

  const resource = await getResource(lang, kind.type, slug, await getDynamicFetchOptions())
  if (!resource) notFound()

  return (
    <>
      <LanguageSwitcher
        current={lang}
        translations={resource.translations}
        section={`resources/${kind.path}`}
      />
      <ResourceDetails resource={resource} />
      {resource.gate && resource.gate.fields && <Form {...resource.gate} />}
      <PageBuilder content={resource.content} />
    </>
  )
}
