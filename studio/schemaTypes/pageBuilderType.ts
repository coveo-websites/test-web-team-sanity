import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'richText'}),
    defineArrayMember({type: 'features'}),
    defineArrayMember({type: 'splitImage'}),
    defineArrayMember({type: 'cardGrid'}),
    defineArrayMember({type: 'video'}),
    defineArrayMember({type: 'faq'}),
    defineArrayMember({type: 'stats'}),
    defineArrayMember({type: 'logoCloud'}),
    defineArrayMember({type: 'testimonials'}),
    defineArrayMember({type: 'callToAction'}),
    defineArrayMember({type: 'form'}),
  ],
  options: {
    // Group blocks by purpose so non-technical editors find the right one quickly.
    insertMenu: {
      filter: true,
      groups: [
        {name: 'intro', title: 'Intro', of: ['hero']},
        {
          name: 'content',
          title: 'Content',
          of: ['richText', 'features', 'splitImage', 'cardGrid', 'video', 'faq'],
        },
        {name: 'proof', title: 'Social proof', of: ['stats', 'logoCloud', 'testimonials']},
        {name: 'conversion', title: 'Conversion', of: ['callToAction', 'form']},
      ],
    },
  },
})
