import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation'

// Tells the Presentation tool which page of the site shows a document, and which
// document to open when the editor browses to a URL in the preview.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current', language: 'language'},
      resolve: (doc) =>
        doc?.slug && doc.language
          ? {
              locations: [
                {title: doc.title || 'Untitled', href: `/${doc.language}/${doc.slug}`},
              ],
            }
          : {message: 'Add a slug to preview this page', tone: 'caution'},
    }),
    settings: defineLocations({
      select: {language: 'language', homeTitle: 'homePage.title'},
      resolve: (doc) =>
        doc?.language
          ? {
              locations: [
                {title: doc.homeTitle || 'Home page', href: `/${doc.language}`},
              ],
            }
          : null,
    }),
  },
  mainDocuments: defineDocuments([
    {
      // Home page of a language: the page picked in that language's site settings
      route: '/:lang',
      filter: `_id == *[_id == "settings-" + $lang][0].homePage._ref`,
      params: ({params}) => ({lang: params.lang}),
    },
    {
      route: '/:lang/:slug',
      filter: `_type == "page" && language == $lang && slug.current == $slug`,
      params: ({params}) => ({lang: params.lang, slug: params.slug}),
    },
  ]),
}
