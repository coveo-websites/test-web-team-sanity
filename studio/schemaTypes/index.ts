import {callToActionType} from './blocks/callToActionType'
import {featuresType} from './blocks/featuresType'
import {heroType} from './blocks/heroType'
import {splitImageType} from './blocks/splitImageType'
import {pageType} from './documents/pageType'
import {settingsType} from './documents/settingsType'
import {linkType} from './objects/linkType'
import {seoType} from './objects/seoType'
import {pageBuilderType} from './pageBuilderType'

export const schemaTypes = [
  // Documents
  pageType,
  settingsType,
  // Page builder
  pageBuilderType,
  heroType,
  featuresType,
  splitImageType,
  callToActionType,
  // Objects
  linkType,
  seoType,
]
