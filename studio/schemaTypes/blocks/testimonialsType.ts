import {defineArrayMember, defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

import {imageField} from '../fields'

export const testimonialsType = defineType({
  name: 'testimonials',
  title: 'Testimonials',
  type: 'object',
  icon: CommentIcon,
  description: 'Quotes from customers',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Quotes',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'testimonial',
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Person',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'role', title: 'Job title', type: 'string'}),
            defineField({name: 'company', type: 'string'}),
            imageField({name: 'photo', title: 'Photo'}),
          ],
          preview: {select: {title: 'name', subtitle: 'quote', media: 'photo'}},
        }),
      ],
      validation: (rule) => rule.min(1).max(6),
    }),
  ],
  preview: {
    select: {title: 'title', quote: 'items.0.quote', media: 'items.0.photo'},
    prepare({title, quote, media}) {
      return {
        title: title || quote || 'Untitled',
        subtitle: 'Testimonials',
        media: media ?? CommentIcon,
      }
    },
  },
})
