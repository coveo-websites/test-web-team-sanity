import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      description: 'A relative path (e.g. /about) or a full URL',
      validation: (rule) =>
        rule.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
