import {defineArrayMember, defineField} from 'sanity'
import {BookIcon} from '@sanity/icons/Book'

import {createResourceType} from './createResourceType'

export const ebookType = createResourceType({
  name: 'ebook',
  title: 'Ebook',
  icon: BookIcon,
  description: 'A downloadable guide, usually gated behind a form',
  specificFields: [
    defineField({
      name: 'authors',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({name: 'pageCount', type: 'number', validation: (rule) => rule.integer().min(1)}),
    defineField({
      name: 'file',
      title: 'PDF file',
      type: 'file',
      options: {accept: 'application/pdf'},
      description: 'Delivered after the gate form is submitted',
    }),
    defineField({
      name: 'tableOfContents',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
})
