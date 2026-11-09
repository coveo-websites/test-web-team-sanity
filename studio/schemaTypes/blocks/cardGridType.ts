import {defineArrayMember, defineField, defineType} from 'sanity'
import {DashboardIcon} from '@sanity/icons/Dashboard'

import {imageField} from '../fields'

export const cardGridType = defineType({
  name: 'cardGrid',
  title: 'Cards',
  type: 'object',
  icon: DashboardIcon,
  description: 'A grid of cards, each with an image, text and an optional link',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cards',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'card',
          type: 'object',
          fields: [
            imageField(),
            defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'text', type: 'text', rows: 3}),
            defineField({name: 'link', type: 'link'}),
          ],
          preview: {select: {title: 'title', subtitle: 'text', media: 'image'}},
        }),
      ],
      validation: (rule) => rule.min(1).max(9),
    }),
  ],
  preview: {
    select: {title: 'title', cards: 'cards', media: 'cards.0.image'},
    prepare({title, cards, media}) {
      const count = Array.isArray(cards) ? cards.length : 0
      return {title: title || 'Untitled', subtitle: `Cards (${count})`, media: media ?? DashboardIcon}
    },
  },
})
