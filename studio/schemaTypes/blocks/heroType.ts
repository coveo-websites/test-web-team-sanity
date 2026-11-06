import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockElementIcon} from '@sanity/icons/BlockElement'

export const heroType = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: unknown} | undefined
              return parent?.asset && !alt ? 'Alt text is required when an image is set' : true
            }),
        }),
      ],
    }),
    defineField({
      name: 'links',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Untitled', subtitle: 'Hero', media: media ?? BlockElementIcon}
    },
  },
})
