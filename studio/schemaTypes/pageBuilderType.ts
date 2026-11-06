import {defineArrayMember, defineType} from 'sanity'

export const pageBuilderType = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'features'}),
    defineArrayMember({type: 'splitImage'}),
    defineArrayMember({type: 'callToAction'}),
  ],
})
