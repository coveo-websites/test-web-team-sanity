import {defineArrayMember, defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

// Editors describe the form here; the site renders it and sends answers to HubSpot.
export const formType = defineType({
  name: 'form',
  title: 'Form',
  type: 'object',
  icon: EnvelopeIcon,
  description: 'A contact or sign-up form sent to HubSpot',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'hubspot', title: 'HubSpot'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', group: 'content'}),
    defineField({name: 'intro', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'fields',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'formField',
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'name',
              title: 'HubSpot property',
              type: 'string',
              description: 'Internal name of the HubSpot property, e.g. email, firstname, company',
              validation: (rule) =>
                rule.required().regex(/^[a-z0-9_]+$/, {name: 'lowercase letters, numbers and _'}),
            }),
            defineField({
              name: 'type',
              type: 'string',
              initialValue: 'text',
              options: {
                list: [
                  {title: 'Short text', value: 'text'},
                  {title: 'Email', value: 'email'},
                  {title: 'Phone', value: 'tel'},
                  {title: 'Long text', value: 'textarea'},
                  {title: 'Dropdown', value: 'select'},
                  {title: 'Checkbox', value: 'checkbox'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'choices',
              title: 'Dropdown choices',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              hidden: ({parent}) => parent?.type !== 'select',
            }),
            defineField({name: 'required', type: 'boolean', initialValue: false}),
            defineField({
              name: 'placeholder',
              type: 'string',
              hidden: ({parent}) => parent?.type === 'checkbox' || parent?.type === 'select',
            }),
          ],
          preview: {
            select: {title: 'label', type: 'type', required: 'required'},
            prepare({title, type, required}) {
              return {title: `${title ?? 'Untitled'}${required ? ' *' : ''}`, subtitle: type}
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Button label',
      type: 'string',
      group: 'content',
      initialValue: 'Send',
    }),
    defineField({
      name: 'successMessage',
      type: 'text',
      rows: 2,
      group: 'content',
      initialValue: 'Thank you! We will get back to you soon.',
    }),
    defineField({
      name: 'hubspotPortalId',
      title: 'Portal ID',
      type: 'string',
      group: 'hubspot',
    }),
    defineField({
      name: 'hubspotFormId',
      title: 'Form ID',
      type: 'string',
      group: 'hubspot',
      description: 'Leave both HubSpot fields empty to test the form without sending anything',
    }),
  ],
  preview: {
    select: {title: 'title', fields: 'fields'},
    prepare({title, fields}) {
      const count = Array.isArray(fields) ? fields.length : 0
      return {title: title || 'Untitled', subtitle: `Form (${count} fields)`, media: EnvelopeIcon}
    },
  },
})
