import Image from 'next/image'
import Link from 'next/link'
import {stegaClean, type StegaBranded} from 'next-sanity'

import type {Language} from '@/i18n'
import {kindByType, resourcePath} from '@/resources'
import {urlFor} from '@/sanity/image'

import type {RESOURCE_LIST_QUERY_RESULT} from '../../sanity.types'

type Props = {
  resource: StegaBranded<RESOURCE_LIST_QUERY_RESULT[number]>
  language: Language
}

export function ResourceCard({resource, language}: Props) {
  const kind = kindByType(stegaClean(resource._type))
  if (!kind || !resource.slug) return null

  return (
    <article className="flex flex-col gap-3">
      {resource.coverImage?.asset && (
        <Image
          src={urlFor(resource.coverImage).width(800).height(500).fit('crop').auto('format').url()}
          alt={resource.coverImage.alt ?? ''}
          width={800}
          height={500}
          className="h-auto w-full rounded-xl"
        />
      )}
      <p className="text-sm font-medium text-muted">{kind.label}</p>
      <h3 className="text-xl font-semibold tracking-tight">
        <Link href={resourcePath(language, kind, stegaClean(resource.slug))} className="underline">
          {resource.title}
        </Link>
      </h3>
      {resource.summary && <p className="text-muted">{resource.summary}</p>}
    </article>
  )
}
