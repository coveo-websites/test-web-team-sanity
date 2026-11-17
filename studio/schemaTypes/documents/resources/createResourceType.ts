import {defineArrayMember, defineField, defineType, type SlugValidationContext} from 'sanity'
import type {ComponentType} from 'react'

import {imageField} from '../../fields'

type ResourceTypeOptions = {
  name: string
  title: string
  icon: ComponentType
  description: string
  // Fields that only this kind of resource has (e.g. speakers for a webinar)
  specificFields: ReturnType<typeof defineField>[]
}

// Slugs only need to be unique within a language and resource kind.
function uniqueSlugPerLanguage(typeName: string) {
  return async (slug: string, context: SlugValidationContext) => {
    const {document, getClient} = context
    if (!document) return true

    const client = getClient({apiVersion: '2026-11-06'})
    const publishedId = document._id.replace(/^drafts\./, '')

    return client.fetch<boolean>(
      `!defined(*[
        _type == $typeName &&
        slug.current == $slug &&
        language == $language &&
        !(_id in [$draftId, $publishedId]) &&
        !(_id in path("versions.**"))
      ][0]._id)`,
      {
        typeName,
        slug,
        language: (document.language as string | undefined) ?? null,
        draftId: `drafts.${publishedId}`,
        publishedId,
      },
    )
  }
}

// Every resource template (ebook, case study, report, webinar) shares the same
// listing fields, gating and page-builder body; only the "Details" group differs.
export function createResourceType({
  name,
  title,
  icon,
  description,
  specificFields,
}: ResourceTypeOptions) {
  return defineType({
    name,
    title,
    type: 'document',
    icon,
    description,
    groups: [
      {name: 'content', title: 'Content', default: true},
      {name: 'details', title: 'Details'},
      {name: 'gate', title: 'Gate'},
      {name: 'seo', title: 'SEO'},
    ],
    fields: [
      // Written by @sanity/document-internationalization
      defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
      defineField({
        name: 'title',
        type: 'string',
        group: 'content',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'slug',
        type: 'slug',
        group: 'content',
        options: {source: 'title', isUnique: uniqueSlugPerLanguage(name)},
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'summary',
        type: 'text',
        rows: 3,
        group: 'content',
        description: 'Short teaser shown on resource listings and cards',
        validation: (rule) => rule.required().max(280),
      }),
      {
        ...imageField({
          name: 'coverImage',
          description: 'Shown on cards and at the top of the page',
        }),
        group: 'content',
      },
      defineField({
        name: 'topics',
        type: 'array',
        group: 'content',
        of: [defineArrayMember({type: 'string'})],
        options: {layout: 'tags'},
      }),
      defineField({
        name: 'publishDate',
        type: 'date',
        group: 'content',
        initialValue: () => new Date().toISOString().slice(0, 10),
      }),
      // Template-specific fields land in the "Details" group unless they set their own
      ...specificFields.map((field) => (field.group ? field : {...field, group: 'details'})),
      defineField({
        name: 'gate',
        type: 'form',
        group: 'gate',
        description: 'Leave empty to make this resource freely available (no form).',
      }),
      defineField({name: 'content', type: 'pageBuilder', group: 'content'}),
      defineField({name: 'seo', type: 'seo', group: 'seo'}),
    ],
    preview: {
      select: {title: 'title', language: 'language', media: 'coverImage'},
      prepare({title: docTitle, language, media}) {
        return {
          title: docTitle || 'Untitled',
          subtitle: `${title} · ${language ? String(language).toUpperCase() : 'No language'}`,
          media,
        }
      },
    },
  })
}
