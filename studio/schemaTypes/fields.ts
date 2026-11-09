import {defineField} from 'sanity'

type ImageFieldOptions = {
  name?: string
  title?: string
  description?: string
  required?: boolean
}

// Image field with hotspot and alt text, shared by every block that shows an image.
export function imageField({
  name = 'image',
  title,
  description,
  required = false,
}: ImageFieldOptions = {}) {
  return defineField({
    name,
    title,
    description,
    type: 'image',
    options: {hotspot: true},
    validation: required ? (rule) => rule.required() : undefined,
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        description: 'Describe the image for people who cannot see it',
        validation: (rule) =>
          rule.custom((alt, context) => {
            const parent = context.parent as {asset?: unknown} | undefined
            return parent?.asset && !alt ? 'Alt text is required when an image is set' : true
          }),
      }),
    ],
  })
}
