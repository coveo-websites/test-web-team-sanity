import {defineArrayMember, defineField, defineType} from 'sanity'
import {BarChartIcon} from '@sanity/icons/BarChart'

export const statsType = defineType({
  name: 'stats',
  title: 'Key figures',
  type: 'object',
  icon: BarChartIcon,
  description: 'A few large numbers with a label, e.g. "98% satisfaction"',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Figures',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'stat',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              type: 'string',
              description: 'Short, e.g. 98%, 3x, 1,200+',
              validation: (rule) => rule.required().max(10),
            }),
            defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
      validation: (rule) => rule.min(2).max(4),
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare({title, items}) {
      const values = Array.isArray(items)
        ? items.map((item: {value?: string}) => item.value).join(' · ')
        : ''
      return {title: title || values || 'Untitled', subtitle: 'Key figures', media: BarChartIcon}
    },
  },
})
