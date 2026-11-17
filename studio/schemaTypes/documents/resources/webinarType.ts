import {defineArrayMember, defineField} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

import {imageField} from '../../fields'
import {createResourceType} from './createResourceType'

export const webinarType = createResourceType({
  name: 'webinar',
  title: 'Webinar',
  icon: PlayIcon,
  description: 'A live event that becomes an on-demand recording',
  specificFields: [
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'upcoming',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'On demand', value: 'onDemand'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startsAt',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.document as {status?: string} | undefined)?.status === 'upcoming' && !value
            ? 'A start date is required for upcoming webinars'
            : true,
        ),
    }),
    defineField({
      name: 'durationMinutes',
      type: 'number',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'registrationUrl',
      type: 'url',
      description: 'Registration page (e.g. Zoom or ON24). Leave empty to use the gate form.',
      hidden: ({document}) => document?.status === 'onDemand',
    }),
    defineField({
      name: 'recordingUrl',
      type: 'url',
      description: 'YouTube, Vimeo or Wistia link',
      hidden: ({document}) => document?.status !== 'onDemand',
    }),
    defineField({
      name: 'speakers',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'speaker',
          type: 'object',
          fields: [
            defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'role', type: 'string'}),
            defineField({name: 'company', type: 'string'}),
            imageField({name: 'photo'}),
          ],
          preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
        }),
      ],
    }),
  ],
})
