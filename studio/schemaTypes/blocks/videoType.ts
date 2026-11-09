import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

// Keep in sync with getEmbedUrl in web/src/components/blocks/Video.tsx.
const VIDEO_URL = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/\d)/

export const videoType = defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  description: 'A YouTube or Vimeo video',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Video link',
      type: 'url',
      description: 'Paste the YouTube or Vimeo link from your browser',
      validation: (rule) =>
        rule
          .required()
          .custom((url) =>
            !url || VIDEO_URL.test(url) ? true : 'Use a youtube.com, youtu.be or vimeo.com link',
          ),
    }),
    defineField({
      name: 'caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title', url: 'url'},
    prepare({title, url}) {
      return {title: title || url || 'Untitled', subtitle: 'Video', media: PlayIcon}
    },
  },
})
