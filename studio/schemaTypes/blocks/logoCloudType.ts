import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'

import {imageField} from '../fields'

export const logoCloudType = defineType({
  name: 'logoCloud',
  title: 'Logo cloud',
  type: 'object',
  icon: ImagesIcon,
  description: 'A row of customer or partner logos',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      placeholder: 'Trusted by leading companies',
    }),
    defineField({
      name: 'logos',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'logo',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Company name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            imageField({required: true}),
            defineField({
              name: 'href',
              title: 'Link (optional)',
              type: 'url',
              validation: (rule) => rule.uri({allowRelative: true, scheme: ['http', 'https']}),
            }),
          ],
          preview: {select: {title: 'name', media: 'image'}},
        }),
      ],
      validation: (rule) => rule.min(2).max(12),
    }),
  ],
  preview: {
    select: {title: 'title', logos: 'logos', media: 'logos.0.image'},
    prepare({title, logos, media}) {
      const count = Array.isArray(logos) ? logos.length : 0
      return {title: title || 'Untitled', subtitle: `Logo cloud (${count})`, media: media ?? ImagesIcon}
    },
  },
})
