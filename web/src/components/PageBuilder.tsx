import type {PAGE_QUERY_RESULT} from '../../sanity.types'

import {CallToAction} from './blocks/CallToAction'
import {Features} from './blocks/Features'
import {Hero} from './blocks/Hero'
import {SplitImage} from './blocks/SplitImage'

export type PageBlock = NonNullable<NonNullable<PAGE_QUERY_RESULT>['content']>[number]
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
          case 'features':
            return <Features key={block._key} {...block} />
          case 'splitImage':
            return <SplitImage key={block._key} {...block} />
          case 'callToAction':
            return <CallToAction key={block._key} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
