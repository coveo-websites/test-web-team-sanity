import type {StegaBranded} from 'next-sanity'

import type {PAGE_QUERY_RESULT} from '../../sanity.types'

import {CallToAction} from './blocks/CallToAction'
import {CardGrid} from './blocks/CardGrid'
import {Faq} from './blocks/Faq'
import {Features} from './blocks/Features'
import {Form} from './blocks/Form'
import {Hero} from './blocks/Hero'
import {LogoCloud} from './blocks/LogoCloud'
import {RichText} from './blocks/RichText'
import {SplitImage} from './blocks/SplitImage'
import {Stats} from './blocks/Stats'
import {Testimonials} from './blocks/Testimonials'
import {Video} from './blocks/Video'

// In Draft Mode, strings carry invisible click-to-edit markers (stega). Render them as is,
// but pass them through stegaClean() before comparing them or using them as URLs, ids or names.
type PageData = StegaBranded<NonNullable<PAGE_QUERY_RESULT>>
export type PageBlock = NonNullable<PageData['content']>[number]
export type BlockOf<T extends PageBlock['_type']> = Extract<PageBlock, {_type: T}>

export function PageBuilder({content}: {content: PageBlock[] | null}) {
  if (!Array.isArray(content) || content.length === 0) return null

  return (
    <>
      {content.map((block, index) => {
        switch (block._type) {
          case 'hero':
            // Only the first hero on the page gets the page's <h1>.
            return <Hero key={block._key} {...block} headingLevel={index === 0 ? 'h1' : 'h2'} />
          case 'richText':
            return <RichText key={block._key} {...block} />
          case 'features':
            return <Features key={block._key} {...block} />
          case 'splitImage':
            return <SplitImage key={block._key} {...block} />
          case 'cardGrid':
            return <CardGrid key={block._key} {...block} />
          case 'video':
            return <Video key={block._key} {...block} />
          case 'faq':
            return <Faq key={block._key} {...block} />
          case 'stats':
            return <Stats key={block._key} {...block} />
          case 'logoCloud':
            return <LogoCloud key={block._key} {...block} />
          case 'testimonials':
            return <Testimonials key={block._key} {...block} />
          case 'callToAction':
            return <CallToAction key={block._key} {...block} />
          case 'form':
            return <Form key={block._key} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
