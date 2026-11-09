import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  description: 'Questions that open to show their answer',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'faqItem',
          type: 'object',
          fields: [
            defineField({name: 'question', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'answer',
              type: 'array',
              of: [defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}]})],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'question'}},
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare({title, items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {title: title || 'Untitled', subtitle: `FAQ (${count})`, media: HelpCircleIcon}
    },
  },
})
