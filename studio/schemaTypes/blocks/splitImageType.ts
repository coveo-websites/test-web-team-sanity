import {defineArrayMember, defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons/SplitHorizontal'

export const splitImageType = defineType({
  name: 'splitImage',
  title: 'Split image',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: 'orientation',
      type: 'string',
      options: {
        list: [
          {title: 'Image left', value: 'imageLeft'},
          {title: 'Image right', value: 'imageRight'},
        ],
        layout: 'radio',
      },
      initialValue: 'imageLeft',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
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
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Untitled', subtitle: 'Split image', media: media ?? SplitHorizontalIcon}
    },
  },
})
