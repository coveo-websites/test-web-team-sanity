import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'

export const callToActionType = defineType({
  name: 'callToAction',
  title: 'Call to action',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'links',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({type: 'link'})],
      validation: (rule) => rule.min(1).max(2),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Untitled', subtitle: 'Call to action', media: BulbOutlineIcon}
    },
  },
})
