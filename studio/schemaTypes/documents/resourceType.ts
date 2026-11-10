import {defineField, defineType, type SlugValidationContext} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

// Slugs only need to be unique within a language, so /en/about and /fr/about can coexist.
async function isUniqueSlugPerLanguage(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context
  if (!document) return true

  const client = getClient({apiVersion: '2026-11-06'})
  const publishedId = document._id.replace(/^drafts\./, '')

  return client.fetch<boolean>(
    `!defined(*[
      _type == "resource" &&
      slug.current == $slug &&
      language == $language &&
      !(_id in [$draftId, $publishedId]) &&
      !(_id in path("versions.**"))
    ][0]._id)`,
    {
      slug,
      language: (document.language as string | undefined) ?? null,
      draftId: `drafts.${publishedId}`,
      publishedId,
    },
  )
}

export const resourceType = defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // Written by @sanity/document-internationalization; editors pick the language
    // when creating the document or a translation of it.
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
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
      options: {source: 'title', isUnique: isUniqueSlugPerLanguage},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'pageBuilder',
      group: 'content',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', language: 'language'},
    prepare({title, slug, language}) {
      const lang = language ? `${String(language).toUpperCase()} · ` : 'No language · '
      return {title: title || 'Untitled', subtitle: `${lang}${slug ? `/${slug}` : 'No slug'}`}
    },
  },
})
