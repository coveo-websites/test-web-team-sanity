import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation'

// URL segment of each resource template: /en/resources/<path>/<slug>. Keep in sync with
// web/src/resources.ts.
const RESOURCE_PATHS = {
  ebook: 'ebooks',
  caseStudy: 'case-studies',
  report: 'reports',
  webinar: 'webinars',
} as const

const resourceLocations = Object.fromEntries(
  Object.entries(RESOURCE_PATHS).map(([type, path]) => [
    type,
    defineLocations({
      select: {title: 'title', slug: 'slug.current', language: 'language'},
      resolve: (doc) =>
        doc?.slug && doc.language
          ? {
              locations: [
                {
                  title: doc.title || 'Untitled',
                  href: `/${doc.language}/resources/${path}/${doc.slug}`,
                },
              ],
            }
          : {message: 'Add a slug to preview this resource', tone: 'caution'},
    }),
  ]),
)

// Tells the Presentation tool which page of the site shows a document, and which
// document to open when the editor browses to a URL in the preview.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    ...resourceLocations,
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
    ...Object.entries(RESOURCE_PATHS).map(([type, path]) => ({
      route: `/:lang/resources/${path}/:slug`,
      filter: `_type == "${type}" && language == $lang && slug.current == $slug`,
      params: ({params}: {params: Record<string, string>}) => ({
        lang: params.lang,
        slug: params.slug,
      }),
    })),
    {
      route: '/:lang/:slug',
      filter: `_type == "page" && language == $lang && slug.current == $slug`,
      params: ({params}) => ({lang: params.lang, slug: params.slug}),
    },
  ]),
}
