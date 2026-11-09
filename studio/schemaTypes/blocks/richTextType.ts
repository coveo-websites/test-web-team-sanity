import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons/BlockContent'

export const richTextType = defineType({
  name: 'richText',
  title: 'Text',
  type: 'object',
  icon: BlockContentIcon,
  description: 'A section of formatted text with headings, lists and links',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading', value: 'h3'},
            {title: 'Subheading', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', body: 'body'},
    prepare({title, body}) {
      const firstBlock = Array.isArray(body) ? body.find((b) => b._type === 'block') : undefined
      const firstText = firstBlock?.children?.map((c: {text?: string}) => c.text).join('')
      return {title: title || firstText || 'Untitled', subtitle: 'Text', media: BlockContentIcon}
    },
  },
})
