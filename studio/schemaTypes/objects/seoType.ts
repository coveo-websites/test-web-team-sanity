import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Overrides the page title in search results and browser tabs',
      validation: (rule) => rule.max(60).warning('Keep titles under 60 characters'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Keep descriptions under 160 characters'),
    }),
    defineField({
      name: 'image',
      title: 'Social sharing image',
      type: 'image',
    }),
  ],
})
