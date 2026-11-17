import {defineArrayMember, defineField} from 'sanity'
import {BarChartIcon} from '@sanity/icons/BarChart'

import {createResourceType} from './createResourceType'

export const reportType = createResourceType({
  name: 'report',
  title: 'Report',
  icon: BarChartIcon,
  description: 'A research or industry report',
  specificFields: [
    defineField({
      name: 'edition',
      type: 'string',
      description: 'e.g. "2026" or "Q3 2026"',
    }),
    defineField({
      name: 'file',
      title: 'PDF file',
      type: 'file',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'keyFindings',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description: 'Bullet points shown above the gate',
    }),
    defineField({name: 'pageCount', type: 'number', validation: (rule) => rule.integer().min(1)}),
  ],
})
