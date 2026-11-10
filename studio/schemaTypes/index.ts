import {callToActionType} from './blocks/callToActionType'
import {cardGridType} from './blocks/cardGridType'
import {faqType} from './blocks/faqType'
import {featuresType} from './blocks/featuresType'
import {formType} from './blocks/formType'
import {heroType} from './blocks/heroType'
import {logoCloudType} from './blocks/logoCloudType'
import {richTextType} from './blocks/richTextType'
import {splitImageType} from './blocks/splitImageType'
import {statsType} from './blocks/statsType'
import {testimonialsType} from './blocks/testimonialsType'
import {videoType} from './blocks/videoType'
import {pageType} from './documents/pageType'
import {resourceType} from './documents/resourceType'
import {settingsType} from './documents/settingsType'
import {linkType} from './objects/linkType'
import {seoType} from './objects/seoType'
import {pageBuilderType} from './pageBuilderType'

export const schemaTypes = [
  // Documents
  pageType,
  resourceType,
  settingsType,
  // Page builder
  pageBuilderType,
  heroType,
  richTextType,
  featuresType,
  splitImageType,
  cardGridType,
  videoType,
  faqType,
  statsType,
  logoCloudType,
  testimonialsType,
  callToActionType,
  formType,
  // Objects
  linkType,
  seoType,
]
