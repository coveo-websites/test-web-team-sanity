import {defineArrayMember, defineField} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

import {imageField} from '../../fields'
import {createResourceType} from './createResourceType'

export const caseStudyType = createResourceType({
  name: 'caseStudy',
  title: 'Case study',
  icon: CaseIcon,
  description: 'A customer success story',
  specificFields: [
    defineField({
      name: 'customer',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    imageField({name: 'customerLogo'}),
    defineField({name: 'industry', type: 'string'}),
    defineField({name: 'challenge', type: 'text', rows: 4}),
    defineField({name: 'solution', type: 'text', rows: 4}),
    defineField({name: 'results', type: 'text', rows: 4}),
    defineField({
      name: 'metrics',
      description: 'Headline numbers, e.g. "45%" / "fewer support tickets"',
      type: 'array',
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          name: 'metric',
          type: 'object',
          fields: [
            defineField({name: 'value', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'quote',
      type: 'object',
      fields: [
        defineField({name: 'text', type: 'text', rows: 3}),
        defineField({name: 'person', type: 'string'}),
        defineField({name: 'role', type: 'string'}),
      ],
    }),
  ],
})
