import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

// One settings document per language (settings-en, settings-fr, …), each set up as a
// singleton in sanity.config.ts. Similar to a per-language site root in Sitecore.
export const settingsType = defineType({
  name: 'settings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Default meta description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'homePage',
      title: 'Home page',
      type: 'reference',
      to: [{type: 'page'}],
      description: 'The page shown at the root of this language (e.g. /en)',
      options: {
        // Only offer pages written in this settings document's language.
        filter: ({document}) => ({
          filter: 'language == $language',
          params: {language: document.language ?? null},
        }),
      },
    }),
    defineField({
      name: 'navigation',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
    }),
  ],
  preview: {
    select: {language: 'language'},
    prepare({language}) {
      return {
        title: 'Site settings',
        subtitle: language ? String(language).toUpperCase() : 'No language',
      }
    },
  },
})
